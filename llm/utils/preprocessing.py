import re
import html

def normalize_text(text):
   if not text:
       return ""
   
   text = text.lower().strip()
   text = html.unescape(text)
   text = re.sub(r'<[^>]+>', '', text)
   text = re.sub(r'\s+', ' ', text)
   return text

def preprocess_candidates(candidates):
   processed = []
   seen_resumes = set()
   
   for candidate in candidates:
       if not candidate.get("resume"):
           continue
       
       normalized_resume = normalize_text(candidate["resume"])
       
       if normalized_resume in seen_resumes:
           continue
           
       seen_resumes.add(normalized_resume)
       
       processed.append({
           "id": candidate["id"],
           "name": candidate["name"],
           "resume": normalized_resume
       })
       
   return processed


