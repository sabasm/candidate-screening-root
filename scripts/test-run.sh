#!/bin/bash
set -e

# Activate virtual environment
source .venv/bin/activate

# Run Python tests
pytest llm/tests/

# Run a sample job description through the scorer
echo "Running sample job scoring with Python..."
python -m llm.services.candidate_scorer "Full stack developer with React and TypeScript experience"

# Run Next.js tests
cd app && npm test

echo "Test run complete!"


