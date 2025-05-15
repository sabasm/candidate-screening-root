# LLM-Powered Candidate Screening & Scoring System

This application enables recruiters to submit a job description and receive a ranked list of top 30 candidates (scored 0-100) by leveraging a Large Language Model (LLM) API. The system analyzes candidate resumes against job descriptions to identify the best matches.

## Features

- Submit job descriptions through a simple interface
- Analyze candidate profiles against job requirements using LLM
- Rank candidates based on relevance score (0-100)
- Display candidate highlights and key matching points
- Cache results to minimize API calls and improve performance

## Tech Stack

- **Frontend**: Next.js 15.3 with App Router, React 19, TypeScript, TailwindCSS 4
- **Backend API**: FastAPI (Python) + Next.js API Routes
- **LLM Integration**: OpenAI API (GPT-4)
- **Data Processing**: Python utilities for text normalization and preprocessing
- **Caching**: In-memory cache with configurable TTL

## Setup

### Prerequisites

- Node.js (v18+)
- Python 3.10+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sabasm/candidate-screening-root.git
   cd candidate-screening-root
   ```

2. Run the setup script to install all dependencies and create the environment file:

   ```bash
   npm run setup
   ```

   This installs both Python and JavaScript dependencies and creates a default `.env` file.

3. Set up environment variables:

   The setup script creates a `.env` file from `.env.example`. Edit this file with your values:

   ```bash
   # Required: OpenAI API Key
   LLM_API_KEY=your_openai_api_key_here

   # Optional: Configure LLM model (default: gpt-4)
   LLM_MODEL=gpt-4

   # Optional: Cache time-to-live in seconds (default: 600)
   CACHE_TTL=600

   # Optional: LLM API URL for frontend to use
   NEXT_PUBLIC_LLM_API_URL=http://localhost:8000
   ```

## Running the Application

Start the development environment with Docker Compose:

```bash
npm run dev
```

This starts both the Python FastAPI server (for LLM integration) and the Next.js frontend application.

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:8000>

## Running Tests

Run the test suite with:

```bash
npm test
```

This will run both the JavaScript and Python tests to verify the system's functionality.

## Usage

1. Navigate to <http://localhost:3000> in your browser
2. Enter a job description (max 200 characters) in the text area
3. Click "Generate Ranking"
4. View the ranked list of candidates with their scores and highlights

### Example Job Descriptions for Testing

For best results, try these job descriptions:

```text
Senior React.js developer needed with 3+ years experience, proficiency in Redux, TypeScript, and component testing. Experience with Ruby on Rails backend is essential.
```

```text
Full-stack developer with strong React.js skills, experience with AWS serverless architecture, and GraphQL API development.
```

```text
Frontend developer for FinTech startup. Requires experience with financial data visualization, real-time updates, and React.js expertise.
```

## API Endpoints

### `POST /api/score`

Scores candidates against a job description.

**Request Body:**

```json
{
  "jobDescription": "Your job description (max 200 characters)"
}
```

**Response:**

```json
[
  {
    "id": 123,
    "name": "Candidate Name",
    "score": 85,
    "highlights": ["Relevant experience 1", "Relevant experience 2"]
  },
  ...
]
```

## Caching Strategy

The application implements an efficient in-memory caching system to minimize LLM API calls:

- **Cache Key**: Job description text (normalized)
- **Cache Value**: Tuple of (timestamp, results)
- **TTL (Time-To-Live)**: 10 minutes by default (configurable via CACHE_TTL environment variable)
- **Implementation**: Python dictionary in the API server with timestamp-based expiration

When a job description is submitted:

1. The system checks if the description exists in the cache
2. If found and not expired, returns cached results immediately
3. If not found or expired, processes the request with the LLM API and stores the new results

This approach significantly reduces:

- API costs (fewer OpenAI API calls)
- Response times for repeated queries
- Server load during peak usage

## Project Structure

```text
candidate-screening-root/
├── llm/                      # Python backend for LLM integration
│   ├── prompt_engineering/   # LLM prompt templates and examples
│   ├── services/             # Core services (scoring, parsing)
│   ├── utils/                # Helper utilities
│   └── config.py             # Configuration settings
├── app/                      # Next.js frontend application
│   └── src/                  # Application source code
├── data/                     # Candidate data files
├── config/                   # Configuration files
├── scripts/                  # Utility scripts
├── infra/                    # Docker configuration
└── docker-compose.yml        # Container orchestration
```

## Deliverables

The project repository includes:

1. **Complete Source Code** for both frontend and backend components
2. **Docker Configuration** for easy deployment and development
3. **Documentation** including this README with setup instructions
4. **Technical Report** (see below)

## Technical Report

### Architecture Diagram & Component Overview

```text
Next.js Frontend (TypeScript) <--> FastAPI Backend (Python) <--> OpenAI API (GPT-4)
      |                               |                             |
      v                               v                             v
User Interface                Candidate Processing          LLM Response Processing
- Job input                   - Data preprocessing          - Score calculation
- Results view                - Batch management            - Highlight extraction
                                     |
                                     v
                               In-Memory Cache
                               - 10 min TTL
```

The system follows a three-tier architecture:

1. **Presentation Layer**: Next.js frontend for user interaction
2. **Logic Layer**: FastAPI backend for candidate processing and LLM integration
3. **Data Layer**: Candidate database and in-memory cache

### Example Prompts & Design Rationale

**System Prompt**:

```text
You are an expert recruiter assistant that helps match candidates to job descriptions.
Your task is to evaluate candidate resumes against a job description and provide a score from 0 to 100.
0 means no match at all, while 100 means a perfect match for the job description.
You should also identify 2-3 key highlights from the candidate's resume that match the job requirements.
Provide your response in valid JSON format with the following fields for each candidate:
- id: The candidate's ID number
- name: The candidate's name
- score: A numeric score between 0-100
- highlights: An array of strings containing key matching points from the resume
```

**Few-Shot Example**:

```text
Job Description:
Looking for a full-stack developer with React experience and good communication skills.

Candidates:
Candidate 1:
ID: 99
Name: Example Candidate A
Resume: Front-end developer with 3 years React experience. Good team player with excellent communication.

Candidate 2:
ID: 100
Name: Example Candidate B
Resume: Java backend developer with Spring Boot expertise. No frontend experience.

Expected output:
[
 {
   "id": 99,
   "name": "Example Candidate A",
   "score": 85,
   "highlights": ["3 years React experience", "Excellent communication"]
 },
 {
   "id": 100,
   "name": "Example Candidate B",
   "score": 30,
   "highlights": ["Backend developer experience"]
 }
]
```

**Design Rationale**:

1. **System Prompt**: Clearly defines the task, scoring criteria, and expected output format
2. **Few-Shot Learning**: Provides concrete examples to guide the model's output format and scoring
3. **Structured Output**: JSON format enables easy parsing and validation
4. **Batching Strategy**: Processing 10 candidates per API call optimizes token usage and response time

### Challenges & Solutions

1. **Challenge**: Handling rate limits from OpenAI API
   **Solution**: Implemented exponential backoff retry logic with configurable max retries

2. **Challenge**: Inconsistent JSON formatting in LLM responses
   **Solution**: Added robust JSON parsing with fallback to few-shot examples when parsing fails

3. **Challenge**: Large number of candidates requiring multiple API calls
   **Solution**: Implemented batch processing with configurable batch size and parallel processing capabilities

4. **Challenge**: Repetitive API calls for the same job description
   **Solution**: Added in-memory caching with TTL to reduce redundant API calls and improve response time

5. **Challenge**: Text preprocessing for optimal token usage
   **Solution**: Created utilities for text normalization, HTML cleanup, and candidate deduplication

