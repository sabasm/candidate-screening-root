import re
import html
import csv
import os

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

def load_candidates_from_csv(filepath):
   candidates = []
   
   try:
       with open(filepath, 'r', encoding='utf-8') as f:
           reader = csv.DictReader(f)
           for i, row in enumerate(reader):
               resume = f"""
               {row.get('Headline', '')}
               {row.get('Summary', '')}
               {row.get('Skills', '')}
               {row.get('Experiences', '')}
               {row.get('Educations', '')}
               {row.get('Keywords', '')}
               """
               
               candidates.append({
                   "id": i + 1,
                   "name": row.get('Name', f"Candidate {i+1}"),
                   "resume": resume.strip()
               })
               
       return candidates
   except Exception as e:
       print(f"Error loading CSV: {str(e)}")
       return []


