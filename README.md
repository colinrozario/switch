# Switch - AI Career Strategist

**Switch** is an intelligent career transition platform designed to help professionals navigate career changes with confidence. Unlike generic career advisors, Switch uses advanced AI agents to build personalized, risk-assessed roadmaps backed by real financial simulation and market data.

## 🚀 Features

-   **AI-Powered Career Graph**: Analyzes your current skills and interests to suggest realistic, high-value career pivots.
-   **Financial Bridge Simulation**: Calculates your exact "runway" based on savings, expenses, and transition timeline.
-   **Risk Analysis Engine**: Flags critical gaps between your financial buffer and the estimated time to hire.
-   **Dynamic Roadmap Generation**: Creates a week-by-week action plan (learning, networking, applying) tailored to your target role.
-   **Interactive Dashboard**: Visualize your transition timeline and financial health.

## 🛠️ Tech Stack

### Backend
-   **Framework**: FastAPI (Python)
-   **Database**: PostgreSQL
-   **ORM**: SQLAlchemy & Alembic (Migrations)
-   **Environment**: Python 3.11+

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: CSS Modules / Modern CSS

## 📂 Project Structure

```
switch/
├── backend/            # FastAPI Application
│   ├── app/
│   │   ├── ai/         # AI Orchestrator & Prompts
│   │   ├── api/        # REST Endpoints
│   │   ├── core/       # Config & Settings
│   │   ├── db/         # Database Models & Sessions
│   │   └── engines/    # Core Logic (Career, Finance, Risk, Timeline)
│   └── tests/          # Automated Tests
└── my-vite-app/        # React Frontend
    ├── src/
    │   ├── components/ # Reusable UI Components
    │   └── views/      # Page Views
```

## 🏁 Getting Started

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Set up environment variables:
Create a `.env` file in `backend/` with the following:
```ini
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=switch_core
GEMINI_API_KEY=your_google_ai_key_here
# or OPENAI_API_KEY=your_openai_key_here
```

Run the server:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`. Documentation at `http://localhost:8000/docs`.

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd my-vite-app
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
The app will be running at `http://localhost:5173`.

## 🧪 Testing

To run the backend verification:
```bash
cd backend
python -m pytest
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

## 📄 License

[MIT](LICENSE)
