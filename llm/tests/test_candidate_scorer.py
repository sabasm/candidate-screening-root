import pytest
import json
from unittest.mock import AsyncMock, patch
from ..services.candidate_scorer import score_batch
from ..utils.error_handling import ParseError

@pytest.mark.asyncio
async def test_score_batch_success():
   # Mock data
   job_description = "Looking for a Python developer"
   candidates = [
       {"id": 1, "name": "John Doe", "resume": "Python expert with 5 years experience"}
   ]
   
   # Mock LLM response
   mock_llm_response = """
   [
       {
           "id": 1,
           "name": "John Doe",
           "score": 85,
           "highlights": ["Python experience", "5 years experience"]
       }
   ]
   """
   
   # Mock the LLM API call
   with patch('llm.services.candidate_scorer.call_llm_api', new_callable=AsyncMock) as mock_call_llm_api:
       mock_call_llm_api.return_value = mock_llm_response
       
       # Call the function
       result = await score_batch(job_description, candidates)
       
       # Verify the results
       assert len(result) == 1
       assert result[0]["id"] == 1
       assert result[0]["name"] == "John Doe"
       assert result[0]["score"] == 85
       assert len(result[0]["highlights"]) == 2
       assert "Python experience" in result[0]["highlights"]

@pytest.mark.asyncio
async def test_score_batch_parse_error_fallback():
   # Mock data
   job_description = "Looking for a Python developer"
   candidates = [
       {"id": 1, "name": "John Doe", "resume": "Python expert with 5 years experience"}
   ]
   
   # Mock responses - first invalid, then valid
   invalid_response = "Not a valid JSON"
   valid_response = """
   [
       {
           "id": 1,
           "name": "John Doe",
           "score": 85,
           "highlights": ["Python experience"]
       }
   ]
   """
   
   # Mock the LLM API call to first return invalid response then valid response
   with patch('llm.services.candidate_scorer.call_llm_api', new_callable=AsyncMock) as mock_call_llm_api:
       mock_call_llm_api.side_effect = [invalid_response, valid_response]
       
       # Call the function - it should fallback to few-shot prompting
       result = await score_batch(job_description, candidates)
       
       # Verify the results are from the second valid call
       assert len(result) == 1
       assert result[0]["id"] == 1
       assert result[0]["score"] == 85
       
       # Verify both prompts were called (standard and few-shot)
       assert mock_call_llm_api.call_count == 2

@pytest.mark.asyncio
async def test_score_batch_persistent_error():
   # Mock data
   job_description = "Looking for a Python developer"
   candidates = [
       {"id": 1, "name": "John Doe", "resume": "Python expert with 5 years experience"}
   ]
   
   # Mock failing response for both attempts
   invalid_response = "Not a valid JSON"
   
   # Mock the LLM API call to always return invalid responses
   with patch('llm.services.candidate_scorer.call_llm_api', new_callable=AsyncMock) as mock_call_llm_api:
       mock_call_llm_api.return_value = invalid_response
       
       # Call the function - it should try few-shot prompting but still fail
       with pytest.raises(ParseError):
           await score_batch(job_description, candidates, use_few_shot=True)


