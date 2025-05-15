#!/bin/bash
set -e

# Create Python virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
  echo "Created Python virtual environment"
fi

# Activate virtual environment
source .venv/bin/activate

# Install Python dependencies
pip install -r llm/requirements.txt

# Install Node.js dependencies
cd app && npm install
cd ..

# Create necessary environment variables if .env doesn't exist
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Created .env file from example template"
fi

# Install root package dependencies
npm install

echo "Setup complete!"


