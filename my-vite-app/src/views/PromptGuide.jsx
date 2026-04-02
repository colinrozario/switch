import { useState } from "react";

const PROMPTS = [
    {
        id: "master",
        step: "01",
        label: "Master Context",
        instruction: "Paste this FIRST in every new ChatGPT session. Never skip this.",
        badge: "START HERE",
        badgeColor: "#00e5a0",
        text: `You are a senior backend and AI engineer helping me build "Switch" — a conservative, AI-backed career transition strategist for professionals with 3–12 years of experience.

== TECH STACK ==
- Backend: FastAPI (Python 3.11+)
- Database: PostgreSQL 15
- Cache + Message Broker: Redis 7
- Async Task Queue: Celery
- LLM: Google Gemini 2.5 Flash via google-generativeai SDK
- Schema Validation: Pydantic v2
- Auth: JWT via python-jose + passlib
- Migrations: Alembic
- Structured LLM output: enforce via Pydantic parsing on all Gemini responses

== PROJECT FOLDER STRUCTURE ==
switch/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── intake.py
│   │   ├── analysis.py
│   │   └── progress.py
│   ├── services/
│   │   ├── intake_service.py
│   │   ├── career_service.py
│   │   ├── bridge_service.py
│   │   ├── roadmap_service.py
│   │   └── replan_service.py
│   ├── agents/
│   │   ├── intake_agent.py
│   │   ├── career_agent.py
│   │   ├── roadmap_agent.py
│   │   └── replan_agent.py
│   ├── models/
│   │   ├── db_models.py
│   │   └── schemas.py
│   ├── core/
│   │   ├── auth.py
│   │   ├── guardrails.py
│   │   └── pipeline_guards.py
│   └── worker/
│       └── tasks.py
├── alembic/
├── .env
├── docker-compose.yml
├── Dockerfile
└── requirements.txt

== THE MASTER LAW — never violate this ==
AI (Gemini) MAY ONLY: parse unstructured text into structured data, reason about career feasibility, generate roadmap narrative and phase descriptions, explain deterministic outputs in plain English.

AI MAY NEVER: perform financial calculations, generate or modify risk scores, predict specific salaries, produce any number the user makes a financial decision on.

All financial figures, risk scores, runway calculations = pure deterministic Python math functions. Zero LLM involvement.

== CODE RULES ==
- Always use async/await
- Always use Pydantic v2 syntax (model_validator, field_validator — NOT @validator)
- Always include try/except with typed HTTPException responses
- Generate complete, runnable files — no placeholders, no "add your logic here"
- Add this comment above every Gemini call: # AI BOUNDARY — reasoning/narrative only, no math
- One file at a time. Wait for my confirmation before the next file.
- Never summarize code — write the full file every time`
    },
    {
        id: "setup",
        step: "02",
        label: "Project Setup",
        instruction: "Paste after the master context. Gets you a running skeleton before any logic.",
        badge: "FOUNDATION",
        badgeColor: "#ff6b35",
        text: `Build the project setup files for Switch. Generate each file completely.

== FILE 1: requirements.txt ==
Include exact versions for:
fastapi, uvicorn[standard], sqlalchemy[asyncio], asyncpg, alembic, pydantic[email], pydantic-settings, python-jose[cryptography], passlib[bcrypt], redis, celery, google-generativeai, python-multipart, httpx, tenacity, structlog

== FILE 2: .env.example ==
Variables needed:
DATABASE_URL=postgresql+asyncpg://switch_user:password@localhost:5432/switch_db
REDIS_URL=redis://localhost:6379/0
GEMINI_API_KEY=your_key_here
GEMINI_MODEL_PRIMARY=gemini-2.5-flash
GEMINI_MODEL_FAST=gemini-2.0-flash-lite
JWT_SECRET_KEY=your_secret_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
ENVIRONMENT=development

== FILE 3: app/config.py ==
Use pydantic-settings BaseSettings. Load all env vars. App must raise a clear startup error if any required variable is missing. Include a get_settings() function with lru_cache.

== FILE 4: app/database.py ==
Async SQLAlchemy engine using asyncpg. Connection pool: pool_size=10, max_overflow=20, pool_pre_ping=True. Provide: async_engine, AsyncSessionLocal, Base (declarative), get_db() dependency for FastAPI.

== FILE 5: app/main.py ==
FastAPI app with:
- Lifespan handler (startup: log DB connection success, shutdown: dispose engine)
- CORS middleware (allow all origins in dev)
- Request ID middleware (inject x-request-id UUID into every request)
- Include all routers with prefixes: /auth, /intake, /analysis, /progress
- GET /health route: checks DB connection + Redis ping, returns {status, db, redis, version}
- Structured JSON logging via structlog

== FILE 6: docker-compose.yml ==
Services: api (port 8000, auto-reload), worker (same image, celery worker CMD), db (postgres:15, persistent volume), redis (redis:7, persistent volume).
All share one network. api and worker depend on db and redis.

After generating all 6 files, show me the exact terminal commands to:
1. Create a virtual environment
2. Install requirements
3. Start docker-compose
4. Run the app with uvicorn`
    },
    {
        id: "schema",
        step: "03",
        label: "Database Schema",
        instruction: "Paste after setup is confirmed working. This is the most critical file — everything depends on it.",
        badge: "CRITICAL",
        badgeColor: "#ef4444",
        text: `Build the complete database layer for Switch. Two files.

== FILE 1: app/models/db_models.py ==
SQLAlchemy async ORM models for every table below. Use mapped_column() syntax (SQLAlchemy 2.0). Every model inherits from Base. Every table has: id (UUID primary key, server_default=uuid_generate_v4()), created_at (DateTime, server_default=now()), updated_at (DateTime, onupdate=now()).

Tables to build:

User — email (unique, indexed), hashed_password, plan_tier (Enum: basic/pro/elite), is_active bool

UserProfile — user_id (FK→User, unique), current_role str, years_experience int, monthly_net_income float, monthly_expenses float, savings float, location str, weekly_hours_available int, is_confirmed bool default False
RULE: is_confirmed must be True before any analysis can run. Add a check constraint.

ProfileSkill — profile_id (FK→UserProfile), skill_name str, proficiency_level int (1-5), confidence_score float, source (Enum: resume/free_text/inferred)

ProfileConstraint — profile_id (FK→UserProfile), constraint_type (Enum: family/location/visa/financial/other), description str, confidence_score float

Career — title str, category str, avg_salary_p25 float, avg_salary_p75 float, demand_score float (0-100), remote_score float (0-100), required_skills JSON

CareerTransition — from_career_id (FK→Career), to_career_id (FK→Career), skill_overlap_score float, avg_months_to_transition float, hiring_friction_score float, location_dependent bool
Add unique constraint on (from_career_id, to_career_id).

CareerAnalysis — user_id (FK→User), profile_id (FK→UserProfile), version int default 1, is_active bool default True

CareerPath — analysis_id (FK→CareerAnalysis), career_id (FK→Career), rank int (1-3), feasibility_reasoning text, key_tradeoffs JSON, top_risks JSON, skill_gaps JSON, is_selected bool default False

RejectedPath — analysis_id (FK→CareerAnalysis), career_id (FK→Career), rejection_reason text

SalaryBridgeResult — analysis_id FK, career_path_id FK, transition_duration_months float, monthly_gap float, total_bridge_required float, uncertainty_buffer_pct float, current_runway_months float, runway_covers_transition bool, shortfall_amount float, failure_threshold_month int, risk_score float, risk_band (Enum: DO_NOT_SWITCH/SWITCH_WITH_SAFEGUARDS/SAFE_TO_PROCEED), plain_english_summary text
RULE: This table is APPEND-ONLY. Never UPDATE rows. Add a comment in the model.

Roadmap — analysis_id FK, career_path_id FK, salary_bridge_id FK, total_duration_weeks int, version int default 1

RoadmapPhase — roadmap_id FK, phase_name str, phase_order int, duration_weeks int, weekly_effort_hours int, narrative text, success_criteria JSON, failure_signals JSON, fallback_actions JSON

RoadmapMilestone — phase_id FK, title str, description text, due_week int, is_completed bool default False, verification_method str

ScenarioSimulation — user_id FK, base_analysis_id FK, modified_inputs JSON, result_snapshot JSON
RULE: APPEND-ONLY. Add comment.

ProgressCheckin — user_id FK, roadmap_id FK, checkin_month int, completed_milestone_ids JSON, current_monthly_net float, current_expenses float, current_savings float, blockers text, plan_status (Enum: ON_TRACK/AT_RISK/OFF_TRACK/ABORT_RECOMMENDED), ai_explanation text

JobStatus — job_id (UUID), user_id FK, job_type str, status (Enum: pending/processing/complete/failed), result_id UUID nullable, error_message text nullable

LLMAuditLog — user_id FK, agent_name str, prompt_hash str, response_hash str, tokens_used int, latency_ms int, validation_passed bool, contamination_detected bool

== FILE 2: app/models/schemas.py ==
Pydantic v2 schemas for every request/response in the API. One Input schema and one Response schema per entity. Response schemas must never expose hashed_password. Include a generic JobStatusResponse schema used across all async endpoints.`
    },
    {
        id: "deterministic",
        step: "04",
        label: "Salary Bridge Engine",
        instruction: "The most important file in the entire system. Build and unit test this before touching any AI code.",
        badge: "NO AI ALLOWED",
        badgeColor: "#ef4444",
        text: `Build the Salary Bridge Engine for Switch. This is the most critical file in the system.

ABSOLUTE RULE: Zero LLM involvement anywhere in this file. Pure Python math only. No imports from agents/. No Gemini calls. Add a module-level comment at the top: "# DETERMINISTIC ENGINE — NO AI. Every function here is pure math. Do not add LLM calls."

== FILE: app/services/bridge_service.py ==

Build these exact functions:

--- calculate_salary_bridge(inputs: SalaryBridgeInputs, skill_overlap_score: float, demand_score: float, hiring_friction_score: float) -> SalaryBridgeCalculation ---

Use these exact formulas, no deviation:

transition_duration_months = inputs.transition_months_estimate * 1.20
# 20% time buffer — always applied, non-negotiable

monthly_gap = max(0.0, inputs.monthly_expenses - inputs.monthly_side_income)
# Worst case: no income during transition

total_bridge_required = monthly_gap * transition_duration_months * 1.20
# Additional 20% uncertainty buffer on top of time buffer

current_runway_months = inputs.savings / inputs.monthly_expenses if inputs.monthly_expenses > 0 else 999.0

runway_covers_transition = current_runway_months >= transition_duration_months

shortfall_amount = max(0.0, total_bridge_required - inputs.savings)

failure_threshold_month = int(current_runway_months * 0.80)
# When savings hit 20% remaining = danger zone trigger

# RISK SCORE — weighted deterministic formula, result always 0-100
financial_safety_score = min(1.0, current_runway_months / max(transition_duration_months, 1)) * 35
skill_readiness_score = skill_overlap_score * 30
market_viability_score = (demand_score / 100.0) * 20
hiring_ease_score = (1.0 - hiring_friction_score) * 15
risk_score = round(financial_safety_score + skill_readiness_score + market_viability_score + hiring_ease_score, 2)

# RISK BAND
if risk_score < 40: risk_band = "DO_NOT_SWITCH"
elif risk_score < 70: risk_band = "SWITCH_WITH_SAFEGUARDS"
else: risk_band = "SAFE_TO_PROCEED"

Return a SalaryBridgeCalculation Pydantic model with all values. Never return partial results.

--- derive_phase_structure(risk_band: str, transition_months: float, weekly_hours_available: int) -> List[PhaseTemplate] ---

Exact logic:
weekly_effort = min(weekly_hours_available, 15)  # cap at 15 — realistic maximum
total_weeks = int(transition_months * 4.33)

if risk_band == "DO_NOT_SWITCH":
    phases = [
        PhaseTemplate(name="Stabilization", order=1, weeks=8, effort=weekly_effort,
                      gate="Must achieve: 3 months expenses saved + risk score >= 40 before proceeding"),
        PhaseTemplate(name="Skill Building", order=2, weeks=int(remaining * 0.45), effort=weekly_effort),
        PhaseTemplate(name="Market Validation", order=3, weeks=int(remaining * 0.25), effort=weekly_effort),
        PhaseTemplate(name="Transition", order=4, weeks=int(remaining * 0.30), effort=weekly_effort),
    ]
elif risk_band == "SWITCH_WITH_SAFEGUARDS":
    phases = [SkillBuilding 45%, MarketValidation 25%, Transition 30%]
else:  # SAFE_TO_PROCEED
    phases = [AcceleratedSkillBuild 50%, MarketValidation 20%, Transition 30%]

--- recalculate_with_checkin(original: SalaryBridgeCalculation, checkin: ProgressCheckinInput) -> DriftResult ---

Calculates:
financial_drift_pct = (original.current_runway_months - new_runway) / original.current_runway_months
milestone_completion_rate = completed_count / expected_by_month

if new_runway < months_remaining: plan_status = "ABORT_RECOMMENDED"
elif financial_drift_pct > 0.35 or milestone_completion_rate < 0.50: plan_status = "OFF_TRACK"
elif financial_drift_pct > 0.20: plan_status = "AT_RISK"
else: plan_status = "ON_TRACK"

Also re-run calculate_salary_bridge() with updated financial inputs.
Return DriftResult with all figures.

== UNIT TESTS: tests/test_bridge_service.py ==

Write pytest tests for every function. Test cases must include:
1. User with exactly enough runway — should be SWITCH_WITH_SAFEGUARDS
2. User with 2x required runway — should be SAFE_TO_PROCEED
3. User with 50% required runway — should be DO_NOT_SWITCH
4. Zero side income (most common case)
5. Side income covers expenses (shortfall = 0)
6. Monthly expenses = 0 (edge case, should not divide by zero)
7. Drift detection: 35% financial drop → OFF_TRACK
8. Drift detection: runway < months remaining → ABORT_RECOMMENDED

Run tests with: pytest tests/test_bridge_service.py -v`
    },
    {
        id: "intake",
        step: "05",
        label: "Intake Agent",
        instruction: "First AI module. Parses messy user input into a validated profile. User must confirm all fields before analysis runs.",
        badge: "AI MODULE 1",
        badgeColor: "#7c3aed",
        text: `Build the Intake Agent for Switch. This converts resume text + free-form context into a structured, validated user profile.

RULES:
- Every AI-inferred field must have a confidence_score (0.0-1.0)
- Financial fields (income, expenses, savings) must NEVER be inferred by AI — they come from the confirmed form only
- is_confirmed must be set to True manually by the user after reviewing assumptions — never set it automatically
- Low confidence fields (< 0.75) are flagged as needs_review = True for the frontend to highlight

== FILE 1: app/agents/intake_agent.py ==

Build an async Gemini-powered intake agent.

System prompt to use (store as a constant, not hardcoded in the function):
"You are a precise career data extraction system for a career transition platform. Your job is to extract structured professional information from resume text and free-form descriptions. Rules: (1) Extract only what is explicitly stated or strongly implied — never invent. (2) confidence_score: 1.0=explicitly stated, 0.75=strongly implied, 0.5=inferred, 0.25=guessed. (3) NEVER infer, estimate, or touch any financial field — income, expenses, savings. These are forbidden. (4) If a field is not present in the input, omit it rather than guess. (5) Be conservative."

Use temperature=0.

Output schema the agent must return as JSON:
{
  "current_role": str,
  "years_experience": int,
  "location": str,
  "weekly_hours_available": int,
  "career_change_motivation": str,
  "skills": [{"skill_name": str, "proficiency_level": 1-5, "confidence_score": float, "source": "resume|free_text|inferred"}],
  "constraints": [{"constraint_type": "family|location|visa|financial|other", "description": str, "confidence_score": float}],
  "assumptions": [{"field_name": str, "inferred_value": any, "confidence_score": float, "needs_review": bool}],
  "overall_confidence": float
}

Function signature: async def run_intake_agent(resume_text: str, free_text_context: str) -> IntakeAgentOutput

Implementation:
- Call Gemini with system prompt + user content
- Parse response as JSON into IntakeAgentOutput Pydantic model
- If JSON parsing fails: retry once with "Return valid JSON only, no markdown" appended
- If second attempt fails: raise IntakeAgentError
- Add # AI BOUNDARY comment above the Gemini call
- Log: agent name, token count, latency, validation_passed to LLMAuditLog

== FILE 2: app/services/intake_service.py ==

Orchestrates the full intake flow:

async def process_intake(user_id: UUID, resume_text: str, free_text_context: str, financial_inputs: FinancialInputs, db: AsyncSession) -> UUID

Steps:
1. Call run_intake_agent() for AI structuring
2. Merge AI output + financial_inputs (financials always override, never from AI)
3. Save to UserProfile with is_confirmed=False
4. Save skills to ProfileSkill table
5. Save constraints to ProfileConstraint table
6. Return profile_id

async def confirm_profile(profile_id: UUID, user_edits: ProfileConfirmRequest, db: AsyncSession) -> UserProfile

Steps:
1. Apply any user edits to the profile
2. Validate all required fields are present: current_role, years_experience, monthly_net_income, monthly_expenses, savings, location, weekly_hours_available
3. If any required field is missing: raise HTTPException 422 with specific field name
4. Set is_confirmed = True
5. Save and return

== FILE 3: app/worker/tasks.py (intake tasks only for now) ==

@celery_app.task(bind=True, max_retries=3)
def process_intake_task(self, user_id, resume_text, free_text_context, financial_inputs_dict):
- Updates JobStatus: pending → processing
- Calls process_intake() via asyncio.run()
- On success: updates JobStatus to complete, stores profile_id as result_id
- On failure: updates JobStatus to failed with error_message, retries with exponential backoff

== FILE 4: app/routers/intake.py ==

POST /intake/submit
- Accepts: multipart form with optional resume file + free_text field + financial fields
- If resume file provided: extract text using basic file read (assume .txt for now)
- Creates JobStatus row with status=pending
- Queues process_intake_task
- Returns: {job_id, status: "pending", message: "Processing your profile"}

GET /intake/status/{job_id}
- Returns current JobStatus row as JobStatusResponse

GET /intake/result/{job_id}
- If job not complete: returns 202 with status
- If complete: returns full UserProfile with all skills, constraints, assumptions

PATCH /intake/confirm/{profile_id}
- Calls confirm_profile() service
- On success: returns confirmed UserProfile
- GUARD: If profile already confirmed, return 409 "Profile already confirmed"`
    },
    {
        id: "career",
        step: "06",
        label: "Career Path Engine",
        instruction: "Hybrid engine — deterministic graph query first, Gemini reasons about the filtered results only.",
        badge: "AI MODULE 2",
        badgeColor: "#7c3aed",
        text: `Build the Career Path Engine for Switch. Hybrid architecture: deterministic graph query first, Gemini reasoning second.

CRITICAL RULE: Gemini receives only the pre-filtered career candidates from the graph query. It cannot introduce, add, or remove careers from the list. It only reasons about fit and generates explanations.

== FILE 1: app/services/career_service.py ==

--- async def query_career_graph(profile: UserProfile, db: AsyncSession) -> List[CareerCandidate] ---

Query CareerTransition table joined with Career table where from_career matches user's current_role (or closest match).

Filter rules — ALL must pass:
1. skill_overlap_score >= 0.30
2. avg_months_to_transition <= (user.timeline_months + 6) — use 24 as default if no timeline
3. demand_score >= 50
4. location_dependent == False OR user.location is flexible
5. career_id != user's current career

Score each candidate:
composite_score = (skill_overlap_score * 0.40) + ((demand_score/100) * 0.35) + ((1 - hiring_friction_score) * 0.25)

Sort by composite_score descending. Return top 8 maximum.

If fewer than 2 candidates pass filters: lower skill_overlap threshold to 0.20 and retry once.
If still fewer than 2: raise InsufficientCandidatesError with message "Your profile needs more skill data to generate career paths. Please add more detail to your intake."

--- async def save_analysis_result(user_id, profile_id, result: CareerPathAnalysisResult, db) -> CareerAnalysis ---

Saves CareerAnalysis + all CareerPath rows + all RejectedPath rows in a single transaction.
Deactivates any previous is_active=True analysis for this user before saving new one.

--- async def select_career_path(analysis_id, career_path_id, user_id, db) -> CareerPath ---

Sets is_selected=True on the chosen path.
Guard: If another path is already selected in this analysis, raise 409 "A path is already selected. Deselect it first."

== FILE 2: app/agents/career_agent.py ==

System prompt (store as constant):
"You are a conservative career transition analyst for Switch, a platform that protects professionals from costly career mistakes. You have been given a list of pre-screened career candidates and a user's professional profile. Your job: reason about which 2-3 careers are the most feasible transitions for this specific user, and explain clearly why the remaining candidates were rejected. Rules: (1) You may ONLY select careers from the provided candidates list — never introduce new ones. (2) Be honest about tradeoffs and risks — do not be encouraging for its own sake. (3) Rejection reasons must be specific to this user, not generic. (4) Do not perform any salary calculations or financial estimates."

Use temperature=0.

Function: async def run_career_agent(candidates: List[CareerCandidate], profile: UserProfile) -> CareerAgentOutput

Output JSON schema:
{
  "feasible_paths": [
    {
      "career_id": str,
      "rank": 1|2|3,
      "feasibility_reasoning": str,
      "key_tradeoffs": [str, str, str],  // max 4
      "top_risks": [str, str],            // max 3
      "skill_gaps": [str]                 // skills user needs to acquire
    }
  ],
  "rejected_paths": [
    {"career_id": str, "rejection_reason": str}  // specific to this user
  ],
  "analysis_summary": str  // 2-3 sentences, conservative tone
}

Parse response into CareerAgentOutput Pydantic model.
Validate: feasible_paths length must be 2-3. If not, retry once.
Log to LLMAuditLog.
Add # AI BOUNDARY comment above Gemini call.

== FILE 3: app/routers/analysis.py (career paths section) ==

POST /analysis/career-paths
- GUARD: require profile is_confirmed == True, else 409
- Queues career analysis as Celery task
- Returns {job_id, analysis_id}

GET /analysis/career-paths/{analysis_id}
- Returns full CareerPathAnalysisResult with all paths and rejected paths

POST /analysis/career-paths/{analysis_id}/select
- Body: {career_path_id}
- Calls select_career_path()
- Returns selected CareerPath`
    },
    {
        id: "roadmap",
        step: "07",
        label: "Roadmap Generator",
        instruction: "Phase structure is deterministic. Gemini writes the narrative, milestones, failure signals, and fallbacks.",
        badge: "AI MODULE 3",
        badgeColor: "#7c3aed",
        text: `Build the Roadmap Generator for Switch. Phase structure and timing come from the deterministic engine. Gemini generates narrative and tasks only.

RULE: Gemini receives fixed phase names, durations, and weekly hours. It cannot change any number. failure_signals and fallback_actions are MANDATORY in every phase — never allow empty arrays.

== FILE 1: app/agents/roadmap_agent.py ==

System prompt (store as constant):
"You are building an execution roadmap for a professional making a career transition. You will receive the phase structure with fixed names, durations in weeks, and weekly effort hours — these are FIXED, do not change them. For each phase generate: (1) A 2-3 sentence narrative explaining what this phase is about and why it matters. (2) 3-5 concrete, verifiable milestones with specific due weeks. (3) 2-3 specific success criteria — measurable, not vague. (4) 2-3 failure signals — specific early warning signs the plan is off track. (5) 2-3 fallback actions — concrete steps to take if this phase fails. Failure signals and fallback actions are MANDATORY. Do not write motivational content. Write operational content. If risk_band is DO_NOT_SWITCH, the opening_statement must clearly recommend the user pause and satisfy the Stabilization phase gate criteria before proceeding."

Use temperature=0.2.

Function: async def run_roadmap_agent(phase_templates: List[PhaseTemplate], context: RoadmapContext) -> RoadmapAgentOutput

RoadmapContext includes: target_career_title, user_current_role, skill_gaps, risk_band, risk_score, weekly_hours_available, transition_duration_months

Output JSON schema:
{
  "opening_statement": str,
  "critical_assumptions": [str, str, str],
  "phases": [
    {
      "phase_name": str,         // must match template exactly
      "phase_order": int,
      "duration_weeks": int,     // must match template exactly
      "weekly_effort_hours": int, // must match template exactly
      "narrative": str,
      "milestones": [
        {
          "title": str,
          "description": str,
          "due_week": int,
          "verification_method": str
        }
      ],
      "success_criteria": [str],  // min 2 items
      "failure_signals": [str],   // min 2 items — MANDATORY
      "fallback_actions": [str]   // min 2 items — MANDATORY
    }
  ]
}

Validation after parsing:
- Every phase must have failure_signals length >= 2
- Every phase must have fallback_actions length >= 2
- Phase names and durations must match input templates exactly
- If any validation fails: retry once with explicit correction instruction
- If second attempt fails: raise RoadmapGenerationError

Log to LLMAuditLog.

== FILE 2: app/services/roadmap_service.py ==

async def generate_roadmap(analysis_id: UUID, user_id: UUID, db: AsyncSession) -> UUID

Steps:
1. Load CareerAnalysis → selected CareerPath → SalaryBridgeResult (must all exist)
2. Load UserProfile for weekly_hours_available
3. Call derive_phase_structure() from bridge_service (deterministic)
4. Build RoadmapContext from all loaded data
5. Call run_roadmap_agent() — # AI BOUNDARY
6. Save Roadmap + all RoadmapPhase + all RoadmapMilestone in single DB transaction
7. Return roadmap_id

GUARD at step 1: If SalaryBridgeResult does not exist for the selected path, raise 409 "Complete salary bridge analysis before generating roadmap"

== CELERY TASK: add to app/worker/tasks.py ==

@celery_app.task(bind=True, max_retries=2)
def generate_roadmap_task(self, analysis_id, user_id):
- Updates JobStatus
- Calls generate_roadmap() via asyncio.run()
- On success: updates JobStatus complete with roadmap_id
- On failure: updates JobStatus failed

== ROUTER: add to app/routers/analysis.py ==

POST /analysis/roadmap
- GUARD: salary bridge must exist for selected path
- Queues generate_roadmap_task
- Returns {job_id}

GET /analysis/roadmap/{roadmap_id}
- Returns full roadmap with all phases and milestones nested`
    },
    {
        id: "guardrails",
        step: "08",
        label: "Guardrails Layer",
        instruction: "Every AI response passes through this before touching the DB. Non-negotiable.",
        badge: "CRITICAL",
        badgeColor: "#ef4444",
        text: `Build the LLM Guardrails Layer for Switch. Every single Gemini response passes through this before reaching the database or the user.

== FILE: app/core/guardrails.py ==

--- CLASS: FinancialContaminationDetector ---

Method: def scan(self, text: str, allowed_numbers: List[float] = []) -> ContaminationResult

Scans LLM-generated text for financial contamination — signs the model invented or modified financial figures.

Patterns to flag:
- Currency symbols ($, £, €, ₹) followed by any number NOT in allowed_numbers list
- Phrases: "you will earn", "expect to make", "salary will be", "you can achieve", "projected income", "estimated salary"
- Any standalone number > 1000 not present in allowed_numbers
- Percentage figures not passed as context

ContaminationResult: {contaminated: bool, violations: List[str], cleaned_text: str}

If contaminated:
- Replace offending sentences with: "[Figure removed — see your salary bridge analysis for all financial projections]"
- Set contaminated=True
- Log violation to LLMAuditLog with full original text

--- FUNCTION: async def safe_gemini_call ---

Signature: async def safe_gemini_call(prompt: str, output_schema: Type[BaseModel], agent_name: str, allowed_numbers: List[float] = [], max_retries: int = 2) -> BaseModel

Logic:
1. Call Gemini, get raw response text
2. Strip markdown code fences (\`\`\`json ... \`\`\`) if present
3. Parse as JSON
4. Run FinancialContaminationDetector.scan() on all string fields
5. Validate against output_schema using model_validate()
6. If JSON parse fails or Pydantic validation fails on attempt 1: retry with "Return only valid JSON matching this schema: {schema_json}" appended
7. If fails on attempt 2: raise StructuredOutputError(agent_name, raw_response)
8. Log everything to LLMAuditLog: tokens, latency, validation_passed, contamination_detected
9. Return validated Pydantic model

Never return raw LLM text. Always return a validated Pydantic model.

--- CLASS: PipelineGuard ---

Build as a FastAPI dependency factory.

Usage: Depends(PipelineGuard.require("bridge_calculated"))

Stages and what they check in DB:
- "profile_confirmed" → UserProfile.is_confirmed == True for this user_id
- "path_analyzed" → CareerAnalysis exists with is_active=True for this user_id
- "path_selected" → CareerPath with is_selected=True exists in active analysis
- "bridge_calculated" → SalaryBridgeResult exists for the selected path
- "roadmap_generated" → Roadmap exists linked to the bridge result

If guard fails:
Return HTTP 409:
{
  "error": "pipeline_incomplete",
  "required_stage": stage_name,
  "message": "You must complete [stage] before this step",
  "request_id": from_header
}

--- REDIS RATE LIMITER ---

async def check_rate_limit(user_id: UUID, action: str, limit: int, window_seconds: int) -> bool

Uses Redis INCR + EXPIRE pattern.
Keys: f"ratelimit:{user_id}:{action}"

Limits to enforce:
- LLM calls: 10 per hour per user
- What-if simulations: 20 per hour per user
- Intake submissions: 3 per day per user

If limit exceeded: raise HTTP 429 {"error": "rate_limit_exceeded", "retry_after_seconds": remaining_window}`
    },
    {
        id: "whatif",
        step: "09",
        label: "What-If Simulator",
        instruction: "Pure deterministic re-calculation. One small Gemini call for explanation only. Cache aggressively.",
        badge: "DETERMINISTIC",
        badgeColor: "#ff6b35",
        text: `Build the What-If Scenario Simulator for Switch. This is almost entirely deterministic — just re-runs the salary bridge math with modified inputs.

RULE: No new Gemini call if the same input combination has been run before. Cache explanation by input hash in Redis. Gemini generates only a 2-3 sentence consequence explanation after the math is done.

== FILE: add to app/services/bridge_service.py ==

--- async def run_what_if(base_analysis_id: UUID, user_id: UUID, modified_inputs: WhatIfInputs, db: AsyncSession, redis: Redis) -> WhatIfResult ---

Steps:

1. Load original SalaryBridgeResult for base_analysis_id
2. Load selected CareerPath → CareerTransition edge data (for skill_overlap, hiring_friction)
3. Build new SalaryBridgeInputs by merging: original inputs overridden with modified_inputs
4. Call calculate_salary_bridge() — pure math, same function as always
5. Compute input_hash = sha256(json(modified_inputs + career_path_id))
6. Check Redis for cached explanation: GET "whatif_explanation:{input_hash}"
7. If cache miss: call Gemini for 2-3 sentence explanation — # AI BOUNDARY
   System prompt: "You are explaining the financial impact of a what-if scenario change to a career transition plan. You have been given the original calculations and the new calculations. Explain in 2-3 sentences: what changed, whether this makes the transition safer or riskier, and one concrete action the user should consider. Do not add any financial figures not present in the provided data."
   Cache result in Redis with TTL=3600
8. Save to ScenarioSimulations table (append-only — always insert, never update)
9. Return WhatIfResult with: original snapshot, new calculations, delta summary, explanation

WhatIfResult must include delta fields:
- risk_score_delta (new - original, positive = better)
- runway_delta_months
- shortfall_delta
- risk_band_changed (bool)
- risk_band_previous, risk_band_new

== ADD TO app/routers/analysis.py ==

POST /analysis/what-if
- GUARD: bridge_calculated
- Rate limit: 20 per hour per user
- Body: WhatIfInputs (any subset of: monthly_expenses, savings, monthly_side_income, weekly_hours_available, transition_months_override)
- Returns WhatIfResult

GET /analysis/what-if/history
- Returns all ScenarioSimulations for this user, ordered by created_at desc
- Useful for showing the user how different scenarios compare

== WHAT-IF INPUT SCHEMA ==

class WhatIfInputs(BaseModel):
    monthly_expenses: Optional[float] = None
    savings: Optional[float] = None
    monthly_side_income: Optional[float] = None
    weekly_hours_available: Optional[int] = None
    transition_months_override: Optional[float] = None
    
    model_validator(mode='after')
    def at_least_one_field_changed(self):
        values = [self.monthly_expenses, self.savings, self.monthly_side_income, 
                  self.weekly_hours_available, self.transition_months_override]
        if all(v is None for v in values):
            raise ValueError("At least one field must be provided for what-if simulation")
        return self`
    },
    {
        id: "replan",
        step: "10",
        label: "Replanning Agent",
        instruction: "Post-purchase subscription feature. Re-runs all math monthly, Gemini explains the drift.",
        badge: "AI MODULE 4",
        badgeColor: "#7c3aed",
        text: `Build the Progress Tracking and Replanning Agent for Switch. This is the post-purchase monthly recalibration feature (Pro/Elite plans only).

RULE: Deterministic drift detection runs first and sets plan_status. Gemini only explains what the numbers mean — it cannot change plan_status or any figure.

== FILE 1: app/agents/replan_agent.py ==

System prompt (constant):
"You are reviewing a career transition plan's monthly check-in. The plan_status, all financial figures, and milestone completion rate have been calculated and are provided as fixed facts. Your job is to explain them clearly to the user. Rules: (1) If plan_status is ABORT_RECOMMENDED, you must clearly and directly state the user should pause the transition — do not soften this message. (2) Phase adjustments must be specific actions, not encouragement. (3) drift_summary must name the specific metric that changed and what it means for the user's safety margin. (4) Never add financial figures not in the provided data."

Use temperature=0.

Function: async def run_replan_agent(drift: DriftResult, original_roadmap: RoadmapSummary, checkin: ProgressCheckinInput) -> ReplanAgentOutput

Output JSON schema:
{
  "drift_summary": str,          // specific: what changed, by how much, what it means
  "phase_adjustments": [str],    // concrete actions, min 2
  "abort_reasoning": str | null, // only if plan_status == ABORT_RECOMMENDED, must be direct
  "motivational_note": null      // always null — Switch does not do motivation
}

Log to LLMAuditLog.

== FILE 2: app/services/replan_service.py ==

async def process_monthly_checkin(user_id: UUID, checkin_input: ProgressCheckinInput, db: AsyncSession) -> ReplanResult

Steps:
1. Load active Roadmap → linked SalaryBridgeResult (original figures)
2. Calculate elapsed_months since roadmap created_at
3. Calculate expected_milestones_by_now based on phase structure
4. Call recalculate_with_checkin() from bridge_service (deterministic drift detection)
5. Save ProgressCheckin to DB with calculated plan_status
6. Call run_replan_agent() — # AI BOUNDARY
7. Update ProgressCheckin with ai_explanation from agent
8. If plan_status == ABORT_RECOMMENDED: also re-run full calculate_salary_bridge() with new figures to show updated projections
9. Return full ReplanResult

== FILE 3: add to app/routers/progress.py ==

POST /progress/checkin
- GUARD: plan_tier must be "pro" or "elite" — return 403 for "basic" with message "Monthly recalibration requires Pro or Elite plan"
- GUARD: roadmap_generated
- GUARD: rate limit — 1 checkin per 25 days per roadmap (prevent abuse)
- Queues replan as Celery task (low priority queue)
- Returns {job_id}

GET /progress/replan/{checkin_id}
- Returns full ReplanResult with all figures and AI explanation

GET /progress/history/{roadmap_id}
- Returns all ProgressCheckin rows for this roadmap, ordered by checkin_month asc
- Each row includes: plan_status, risk_score at time, ai_explanation
- Useful for showing trajectory over time

== ADD CELERY TASK: app/worker/tasks.py ==

@celery_app.task(bind=True, max_retries=2, queue='replan')
def process_checkin_task(self, user_id, checkin_input_dict):
- Low priority queue, background processing
- Full error handling + JobStatus updates`
    }
];

export default function SwitchPromptGuide() {
    const [active, setActive] = useState(0);
    const [copied, setCopied] = useState(false);
    const [allCopied, setAllCopied] = useState(false);

    const section = PROMPTS[active];

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyAll = () => {
        const all = PROMPTS.map(p => `${"=".repeat(60)}\nSECTION ${p.step}: ${p.label.toUpperCase()}\n${"=".repeat(60)}\n\n${p.text}`).join("\n\n\n");
        navigator.clipboard.writeText(all);
        setAllCopied(true);
        setTimeout(() => setAllCopied(false), 2000);
    };

    const badgeStyle = (color) => ({
        background: color + "18",
        color: color,
        border: `1px solid ${color}30`,
        fontSize: 9,
        letterSpacing: 3,
        padding: "3px 8px",
        borderRadius: 2,
        fontWeight: 700
    });

    return (
        <div style={{ display: "flex", height: "100vh", background: "#080808", color: "#d4d4d4", fontFamily: "'IBM Plex Mono', monospace", overflow: "hidden" }}>

            {/* Sidebar */}
            <div style={{ width: 240, background: "#0f0f0f", borderRight: "1px solid #1c1c1c", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid #1a1a1a" }}>
                    <div style={{ fontSize: 10, letterSpacing: 5, color: "#3a3a3a", marginBottom: 5 }}>SWITCH</div>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, letterSpacing: 0.5 }}>Build Guide</div>
                    <div style={{ fontSize: 10, color: "#383838", marginTop: 3 }}>10 prompts · paste into ChatGPT</div>
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                    {PROMPTS.map((p, i) => (
                        <button key={p.id} onClick={() => setActive(i)} style={{
                            width: "100%", textAlign: "left", background: active === i ? "#161616" : "transparent",
                            border: "none", borderLeft: active === i ? `2px solid ${p.badgeColor}` : "2px solid transparent",
                            padding: "11px 16px", cursor: "pointer", transition: "all 0.1s"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                                <span style={{ fontSize: 9, color: active === i ? p.badgeColor : "#2e2e2e", fontWeight: 700 }}>{p.step}</span>
                                <span style={{ fontSize: 8, color: active === i ? p.badgeColor + "aa" : "#252525", letterSpacing: 1 }}>{p.badge}</span>
                            </div>
                            <div style={{ fontSize: 11, color: active === i ? "#fff" : "#555", lineHeight: 1.3 }}>{p.label}</div>
                        </button>
                    ))}
                </div>

                <div style={{ padding: "12px 16px", borderTop: "1px solid #1a1a1a" }}>
                    <button onClick={copyAll} style={{
                        width: "100%", background: allCopied ? "#1a2a1a" : "#141414",
                        border: `1px solid ${allCopied ? "#00e5a044" : "#2a2a2a"}`,
                        color: allCopied ? "#00e5a0" : "#555", fontSize: 10, padding: "8px",
                        borderRadius: 3, cursor: "pointer", transition: "all 0.2s"
                    }}>
                        {allCopied ? "✓ All copied" : "Copy all 10 prompts"}
                    </button>
                </div>
            </div>

            {/* Main */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                {/* Header */}
                <div style={{ padding: "20px 32px 16px", borderBottom: "1px solid #141414", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <span style={badgeStyle(section.badgeColor)}>{section.badge}</span>
                                <span style={{ fontSize: 10, color: "#2e2e2e" }}>STEP {section.step} OF 10</span>
                            </div>
                            <div style={{ fontSize: 20, color: "#fff", fontWeight: 800 }}>{section.label}</div>
                            <div style={{ fontSize: 11, color: "#484848", marginTop: 4 }}>{section.instruction}</div>
                        </div>
                        <button onClick={() => copyText(section.text)} style={{
                            background: copied ? section.badgeColor + "18" : "#111",
                            border: `1px solid ${copied ? section.badgeColor + "50" : "#222"}`,
                            color: copied ? section.badgeColor : "#666",
                            fontSize: 11, padding: "10px 20px", borderRadius: 3,
                            cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0
                        }}>
                            {copied ? "✓ Copied to clipboard" : "Copy this prompt"}
                        </button>
                    </div>

                    {/* Step indicators */}
                    <div style={{ display: "flex", gap: 4, marginTop: 14 }}>
                        {PROMPTS.map((p, i) => (
                            <div key={i} onClick={() => setActive(i)} style={{
                                height: 3, flex: 1, borderRadius: 2, cursor: "pointer",
                                background: i === active ? p.badgeColor : i < active ? "#2a2a2a" : "#161616",
                                transition: "background 0.2s"
                            }} />
                        ))}
                    </div>
                </div>

                {/* Prompt text */}
                <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
                    <pre style={{
                        margin: 0, fontSize: 11.5, lineHeight: 1.8, color: "#b0b0b0",
                        whiteSpace: "pre-wrap", wordBreak: "break-word",
                        background: "#0c0c0c", border: "1px solid #1a1a1a",
                        borderRadius: 6, padding: "24px 28px"
                    }}>
                        {section.text}
                    </pre>

                    {/* Nav buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                        {active > 0 ? (
                            <button onClick={() => setActive(active - 1)} style={{
                                background: "transparent", border: "1px solid #1e1e1e",
                                color: "#484848", padding: "9px 18px", fontSize: 11,
                                cursor: "pointer", borderRadius: 3
                            }}>← {PROMPTS[active - 1].label}</button>
                        ) : <div />}
                        {active < PROMPTS.length - 1 ? (
                            <button onClick={() => setActive(active + 1)} style={{
                                background: section.badgeColor + "12",
                                border: `1px solid ${section.badgeColor}35`,
                                color: section.badgeColor, padding: "9px 18px",
                                fontSize: 11, cursor: "pointer", borderRadius: 3
                            }}>Next: {PROMPTS[active + 1].label} →</button>
                        ) : (
                            <div style={{ fontSize: 10, color: "#2e2e2e", padding: "9px 0", letterSpacing: 1 }}>ALL PROMPTS COMPLETE</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
