import json
import asyncio 
import openai
from ..config import LLM_API_KEY, LLM_MODEL, BATCH_SIZE
from ..prompt_engineering.prompt_builder import build_prompt, build_few_shot_prompt
from ..utils.preprocessing import preprocess_candidates
from ..utils.error_handling import retry_with_exponential_backoff, RateLimitError, ParseError
from .response_parser import parse_llm_response

# Initialize OpenAI client
client = openai.AsyncOpenAI(api_key=LLM_API_KEY)

@retry_with_exponential_backoff(max_retries=3)
async def call_llm_api(prompt):
   try:
       response = await client.chat.completions.create(
           model=LLM_MODEL,
           messages=[
               {"role": "system", "content": prompt["system"]},
               {"role": "user", "content": prompt["user"]}
           ],
           temperature=0.2,
           response_format={"type": "json_object"}
       )
       return response.choices[0].message.content
   except openai.RateLimitError:
       raise RateLimitError("Rate limit exceeded")
   except Exception as e:
       raise Exception(f"LLM API error: {str(e)}")

async def score_batch(job_description, candidates, use_few_shot=False):
   try:
       prompt_builder = build_few_shot_prompt if use_few_shot else build_prompt
       prompt = prompt_builder(job_description, candidates)
       
       response_text = await call_llm_api(prompt)
       return parse_llm_response(response_text)
   except ParseError as e:
       if not use_few_shot:
           # Retry with few-shot prompt if parsing fails
           return await score_batch(job_description, candidates, use_few_shot=True)
       raise

async def score_candidates(job_description, candidates):
   # Preprocess candidates
   processed_candidates = preprocess_candidates(candidates)
   
   # Split into batches
   batches = [processed_candidates[i:i+BATCH_SIZE] for i in range(0, len(processed_candidates), BATCH_SIZE)]
   
   # Score each batch
   results = []
   for batch in batches:
       batch_results = await score_batch(job_description, batch)
       results.extend(batch_results)
   
   # Sort by score (descending)
   results.sort(key=lambda x: x["score"], reverse=True)
   
   return results

def score_candidates_sync(job_description, candidates):
   return asyncio.run(score_candidates(job_description, candidates))

if __name__ == "__main__":
   import sys
   import json
   
   # For command-line usage
   if len(sys.argv) > 1:
       job_description = sys.argv[1]
       
       # Load candidates from data file
       with open("data/candidates.json", "r") as f:
           candidates = json.load(f)
       
       # Score candidates
       results = score_candidates_sync(job_description, candidates)
       
       # Output top 30 (or all if less than 30)
       top_results = results[:30]
       print(json.dumps(top_results))


