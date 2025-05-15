FROM python:3.10-slim

WORKDIR /app

COPY llm/requirements.txt /app/llm/
RUN pip install --no-cache-dir -r /app/llm/requirements.txt

COPY llm /app/llm
COPY data /app/data

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "llm.services.api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


