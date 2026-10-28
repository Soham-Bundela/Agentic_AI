# Construction Intelligence Monitor

An agentic AI and computer vision monitor for construction site safety and structural defect detection.

## Architecture

- **Backend**: FastAPI (`main.py`)
  - Endpoints for multimodal site analysis (`/api/analyze-site`)
  - Strict Pydantic contracts for PPE compliance and defect bounding boxes
  - Interactive Swagger docs at `http://localhost:8000/docs`
- **Frontend**: React (`app.jsx`)
  - Real-time image upload, site inspection dashboard, and structured findings viewer

## Getting Started

### 1. Set Up Virtual Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Activate (Linux / macOS)
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Backend API

```bash
uvicorn main:app --reload
```
The server will start at `http://127.0.0.1:8000`.
