import json
from ..utils.error_handling import ParseError

def parse_llm_response(response_text):
   try:
       # Extract JSON if wrapped in markdown or other text
       json_start = response_text.find('[')
       json_end = response_text.rfind(']') + 1
       
       if json_start >= 0 and json_end > json_start:
           json_str = response_text[json_start:json_end]
           scored_candidates = json.loads(json_str)
       else:
           scored_candidates = json.loads(response_text)
       
       # Validate structure
       for candidate in scored_candidates:
           if not all(k in candidate for k in ["id", "name", "score", "highlights"]):
               raise ParseError("Missing required fields in candidate data")
           
           if not isinstance(candidate["score"], (int, float)) or not (0 <= candidate["score"] <= 100):
               candidate["score"] = max(0, min(float(candidate["score"]), 100))
               
           if not isinstance(candidate["highlights"], list):
               candidate["highlights"] = []
       
       return scored_candidates
   
   except json.JSONDecodeError:
       raise ParseError("Failed to parse JSON from LLM response")
   except Exception as e:
       raise ParseError(f"Error parsing response: {str(e)}")


