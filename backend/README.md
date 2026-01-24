# Switch Backend

## Setup

1. **Prerequisites**
    - Python 3.11+
    - PostgreSQL running locally (default: `localhost:5432`, user: `postgres`, password: `password`)

2. **Environment**
    - Create a virtual environment:
      ```powershell
      python -m venv venv
      ```
    - Activate it:
      ```powershell
      .\venv\Scripts\activate
      ```
    - Install dependencies:
      ```powershell
      pip install -r requirements.txt
      ```

3. **Database**
    - Ensure your PostgreSQL server is running.
    - Create a database named `switch_core` (matches `.env` default).
    - Run migrations:
      ```powershell
      alembic revision --autogenerate -m "Initial setup"
      alembic upgrade head
      ```

4. **Running**
    - Start the server:
      ```powershell
      uvicorn app.main:app --reload
      ```
    - Open swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

5. **AI Configuration**
    - Add your `OPENAI_API_KEY` to `.env` to enable AI features.
