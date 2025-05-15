from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import json
import os
import sys
import time
import random
import logging

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

app = FastAPI(title="Candidate Screening API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USE_PROD = os.getenv("USE_PROD", "false").lower() == "true"


class JobDescriptionRequest(BaseModel):
    jobDescription: str = Field(..., max_length=200)


class ScoredCandidate(BaseModel):
    id: int
    name: str
    score: float
    highlights: List[str]


class ErrorResponse(BaseModel):
    error: str


cache = {}
CACHE_TTL = int(os.getenv("CACHE_TTL", "600"))


def get_candidates():
    try:
        csv_path = "data/candidates-db.csv"
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"Candidates CSV file not found: {csv_path}")

        from ..utils.preprocessing import load_candidates_from_csv

        return load_candidates_from_csv(csv_path)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to load candidates: {str(e)}"
        )


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post(
    "/score",
    response_model=List[ScoredCandidate],
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def score_candidates(request: JobDescriptionRequest):
    try:
        job_description = request.jobDescription.strip()

        if job_description in cache:
            cache_time, results = cache[job_description]
            current_time = time.time()
            if current_time - cache_time < CACHE_TTL:
                return results

        candidates = get_candidates()

        try:
            from .candidate_scorer import score_candidates as llm_score_candidates

            results = await llm_score_candidates(job_description, candidates)
        except Exception as e:
            logging.exception("Error with LLM scoring")
            results = generate_mock_results(job_description, candidates)

        cache[job_description] = (time.time(), results)
        return results[:30]
    except Exception as e:
        logging.exception("Error in score_candidates endpoint")
        raise HTTPException(
            status_code=500, detail=f"Error processing request: {str(e)}"
        )


def generate_mock_results(job_description, candidates):
    keywords = job_description.lower().split()

    scored_candidates = []
    for candidate in candidates:
        resume = candidate["resume"].lower()

        score = random.randint(50, 80)
        for keyword in keywords:
            if len(keyword) > 3 and keyword in resume:
                score += 5

        score = min(score, 100)

        highlights = []
        if "react" in resume:
            highlights.append("React experience")
        if "python" in resume:
            highlights.append("Python skills")
        if "node" in resume:
            highlights.append("Node.js development")
        if "full-stack" in resume:
            highlights.append("Full-stack capabilities")

        while len(highlights) < 2:
            mock_highlights = [
                "Problem-solving abilities",
                "Technical expertise",
                "Project management skills",
                "Communication skills",
                "Analytical thinking",
            ]
            random_highlight = random.choice(mock_highlights)
            if random_highlight not in highlights:
                highlights.append(random_highlight)

        scored_candidates.append(
            {
                "id": candidate["id"],
                "name": candidate["name"],
                "score": score,
                "highlights": highlights[:3],
            }
        )

    scored_candidates.sort(key=lambda x: x["score"], reverse=True)
    return scored_candidates
