from .system_prompts import RECRUITER_SYSTEM_PROMPT
from .examples import EXAMPLE_JOB, EXAMPLE_CANDIDATES, EXAMPLE_OUTPUT

def build_prompt(job_description, candidates):
   prompt = {
       "system": RECRUITER_SYSTEM_PROMPT,
       "user": f"""Job Description:
{job_description}

Here are the candidates to evaluate:

{format_candidates(candidates)}

Return your evaluation as a valid JSON array.
"""
   }
   
   return prompt

def build_few_shot_prompt(job_description, candidates):
   prompt = {
       "system": RECRUITER_SYSTEM_PROMPT,
       "user": f"""Here's an example of how to evaluate candidates:

Job Description:
{EXAMPLE_JOB}

Candidates:
{format_candidates(EXAMPLE_CANDIDATES)}

Expected output:
{EXAMPLE_OUTPUT}

Now, evaluate these candidates for the following job description:

Job Description:
{job_description}

Candidates:
{format_candidates(candidates)}

Return your evaluation as a valid JSON array.
"""
   }
   
   return prompt

def format_candidates(candidates):
   formatted = ""
   for i, candidate in enumerate(candidates):
       formatted += f"Candidate {i+1}:\n"
       formatted += f"ID: {candidate['id']}\n"
       formatted += f"Name: {candidate['name']}\n"
       formatted += f"Resume: {candidate['resume']}\n\n"
   return formatted


