# Prompts — AI4Devs Backend Exercise

> **Author:** ADLC  
> **Exercise:** Creating endpoints for candidate manipulation in a kanban interface  
> **Tool:** OpenCode (CLI with SDD skills: sdd-init, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive + judgment-day) + Gemini/Claude as model

---

## Exercise Context

The exercise consists of creating two endpoints in the backend (Express + Prisma + PostgreSQL):

1. **`GET /positions/:id/candidates`** — Get all candidates in process for a specific position.
2. **`PUT /candidates/:id/stage`** — Update the interview stage of a candidate for a specific position.

---

## Prompt Sequence

The prompts run **in sequential order**. The agent maintains context between steps.

---

### PHASE 0 — Environment Setup

#### Prompt 0.1 — Installing Dependencies

```
I'm going to share with you the steps needed to install the repository:

First steps
To get started with this project, follow these steps:

Clone the repository.
Install the dependencies for the frontend and backend:
cd frontend
npm install

cd ../backend
npm install
Build the backend server:
cd backend
npm run build
Start the backend server:
cd backend
npm start
In a new terminal window, build the frontend server:
cd frontend
npm run build
Start the frontend server:
cd frontend
npm start
```

> **Note:** If the project uses `pnpm` instead of `npm`, specify it explicitly (see Prompt 2.6).

---

### PHASE 1 — SDD Start and Instructions

#### Prompt 1.1 — Exercise Instructions with SDD + OpenSpec

```
I'm going to give you the instructions for what needs to be done, follow the SDD phases with openspec to complete the task.

Complete the exercise:
Your mission in this exercise is to create two new endpoints that will allow us to manipulate the candidate list of an application in a kanban-style interface.

GET /positions/:id/candidates
This endpoint will fetch all candidates in process for a given position, i.e., all applications for a specific positionID. It must return a list with the data needed to fill the candidate kanban component. The list must provide the following information for each candidate:
- Candidate ID
- Candidate full name
- Information about the candidate's current interview stage (step id and name)
- The candidate's average score (if they have no interviews with scores, return a consistent and identifiable value)

PUT /candidates/:id/stage
This endpoint will update the interview process stage a candidate is in for a specific position. It will receive the candidate ID, the positionId, and the new interview stage (interviewStepId).
```

---

### PHASE 2 — Design Clarifications (Interactive Q&A with the agent)

During the sdd-propose phase, the agent conducts a round of product questions. The answers guide the design of the specs.

#### Prompt 2.1 — Answers to Proposal Q&A

```
1) The candidate ID
2) Check the README.md for project context. If still unclear, ask again
3) For security, we should adopt a restrictive version of the data
4) A consistent and identifiable value for recruitment processes, reason your answer to me,
   but I think null would be better to separate it from numeric scores
5) Interactive, and each endpoint should be a different spec
```

> **Decisions made:**
> - The "full name" field is built from the `Candidate` model
> - Minimum data exposure (principle of least privilege — only necessary fields)
> - `null` as the value for `average_score` when there are no scores (semantically separated from `0`)
> - Interactive mode for SDD; independent specs per endpoint

#### Prompt 2.2 — Continue after proposal

```
let's continue
```

#### Prompt 2.3 — Codebase exploration with codegraph

```
first of all, I want you to do a codegraph scan of the project structure and code
to have a clearer and more surgical view
```

#### Prompt 2.4 — Review with existing codegraph

```
before that, I already have codegraph, do a review before continuing
```

#### Prompt 2.5 — Approval and continuation

```
yes, continue
```

#### Prompt 2.6 — Package Manager Correction

```
use pnpm
```

#### Prompt 2.7 — Answers to PUT endpoint Q&A

```
1) that's right, we need to send the positionId to identify the application
2) interviewStepId, it's more descriptive
3) yes, validate
4) yes, but changing the currentInterviewStep field to the one defined in point 2
```

> **Decisions made:**
> - The PUT body includes `positionId` (necessary to identify the specific application within the candidate)
> - The field is named `interviewStepId` (more descriptive than `stageId` or `stepId`)
> - IDs are validated before operating on the DB
> - The DB field to update is `currentInterviewStep` (field of the Prisma `Application` model)

#### Prompt 2.8 — Remember existing candidate structure

```
remember that the structure for saving candidates is:

POST http://localhost:3010/candidates
{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-01-01",
            "endDate": "2010-01-01"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "Intern",
            "description": "",
            "startDate": "2009-01-01",
            "endDate": "2010-01-01"
        }
    ],
    "cv": {}
}
```

---

### PHASE 3 — Implementation

#### Prompt 3.1 — Continue with the implementation

```
continue
```

#### Prompt 3.2 — Continue

```
continue
```

#### Prompt 3.3 — Approve implementation

```
yes, continue
```

---

### PHASE 4 — Adversarial Review (Judgment Day)

#### Prompt 4.1 — Start adversarial review

```
/judgment-day
```

> The **Judgment Day** skill launches two independent judges in parallel (Judge A and Judge B) who
> review the code blindly, without knowing each other's opinion. Only the findings
> **confirmed by both** are considered real issues and are candidates for a fix.

#### Prompt 4.2 — Confirm review (second invocation due to session reset)

```
/judgment-day
```

#### Prompt 4.3 — Approve Round 1 fixes

```
go ahead
```

#### Prompt 4.4 — Continue with fixes

```
continue fixing
```

---

### PHASE 5 — Continuation in new session (after quota reset)

> The previous session was interrupted by API quota limits (error 429). It is resumed in a new session; the agent recovers the state of the previous work from the conversation history.

#### Prompt 5.1 — Resume work

```
continue
```

---

### PHASE 6 — Final Judgment Day Rounds (Rounds 7–10)

#### Prompt 6.1 — Authorize fixes for the 5 confirmed WARNINGs (Round 7→8)

> The orchestrator presents the findings confirmed by both judges:
> - **C1:** `isValidId` accepts `0` as a valid ID and is duplicated in two controllers
> - **C2:** N+1 double-query in `positionService` (full fetch only for null-check)
> - **C3:** `Promise.all` diagnostic leaks info by checking if candidate/position exists individually
> - **C4:** `export { addCandidate }` from the controller breaks layered architecture
> - **C5:** CORS hardcoded to `localhost:3000` without environment variable

```
fix the confirmed ones
```

#### Prompt 6.2 — Launch re-judgment after fixes (Round 8)

```
launch it
```

#### Prompt 6.3 — Additional confirmed fix NC1 (Round 8→9)

> Round 8 detects that `include: { position: true }` in `candidateService` still loads
> the entire `Position` row when only `interviewFlowId` is needed.

```
yes, leave it fixed
```

#### Prompt 6.4 — Launch re-judgment (Round 9)

```
launch it
```

#### Prompt 6.5 — Confirmed fixes NC2 + NC3 (Round 9→10)

> Round 9 detects:
> - **NC2:** Middleware `req.prisma` and `declare global` are dead code (no controller uses it)
> - **NC3:** `findFirst` of `interviewStep` without `select` loads the entire row; it is only used for null-check

```
with everything
```

#### Prompt 6.6 — Process closure

```
done then
```

---

## Final Result

| Metric | Value |
|---------|-------|
| Tests | **14/14 passing** |
| Adversarial review rounds | **10** |
| Confirmed and resolved WARNINGs(real) | **8** (C1–C5 + NC1–NC3) |
| Pending WARNINGs(real) | **0** |
| Verdict | **JUDGMENT: APPROVED ✅** |

---

## Created / Modified Files

| File | Operation | Description |
|---------|-----------|-------------|
| `src/presentation/utils/validation.ts` | ✨ Created | Shared `isValidId` utility with bound `>= 1` |
| `src/routes/positionRoutes.ts` | ✏️ Modified | `GET /positions/:id/candidates` route |
| `src/routes/candidateRoutes.ts` | ✏️ Modified | `PUT /candidates/:id/stage` route |
| `src/presentation/controllers/positionController.ts` | ✏️ Modified | Controller with validation and pagination |
| `src/presentation/controllers/candidateController.ts` | ✏️ Modified | Controller `updateCandidateStage` |
| `src/application/services/positionService.ts` | ✏️ Modified | GET logic with lightweight existence check and `average_score` calculation |
| `src/application/services/candidateService.ts` | ✏️ Modified | PUT logic with minimal selects in all queries |
| `src/index.ts` | ✏️ Modified | CORS reads `CORS_ORIGIN` from env; dead code removal (`req.prisma`, `PrismaClient`) |
| `tests/position.test.ts` | ✨ Created | GET endpoint integration tests (pagination, 404, validations) |
| `tests/candidateStage.test.ts` | ✨ Created | PUT endpoint integration tests (happy path, business errors, validations) |

---

## Endpoints implemented

### `GET /positions/:id/candidates`

**Request:**
```http
GET /positions/1/candidates?limit=10&offset=0
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "fullName": "John Doe",
    "current_interview_step": "Technical Interview",
    "average_score": 8.5
  },
  {
    "id": 2,
    "fullName": "Jane Smith",
    "current_interview_step": "HR Interview",
    "average_score": null
  }
]
```

**Errors:**
| Code | Cause |
|--------|-------|
| `400` | Invalid `:id` (not a positive integer), `limit` or `offset` out of range |
| `404` | Position not found |

---

### `PUT /candidates/:id/stage`

**Request:**
```http
PUT /candidates/1/stage
Content-Type: application/json

{
  "positionId": 1,
  "interviewStepId": 3
}
```

**Response `200 OK`:**
```json
{
  "message": "Candidate stage updated successfully",
  "candidateId": 1,
  "interviewStepId": 3
}
```

**Errors:**
| Code | Cause |
|--------|-------|
| `400` | Invalid `:id`, `positionId`, or `interviewStepId` |
| `404` | Candidate, position, or application not found |
| `422` | The `interviewStepId` does not belong to the position's interview flow |

---

## Reproducibility Notes

To reproduce the exercise from scratch with an AI agent:

1. Start from the base repository **without the endpoints implemented**
2. Run the prompts **in the indicated order**, respecting the agent's interactive pauses
3. At each Q&A pause, copy the corresponding answer block
4. After the implementation is finished, run `/judgment-day` for the adversarial review
5. Authorize the fixes for the WARNINGs confirmed by both judges

> **Tool used:** OpenCode CLI with:
> - Skills SDD (sdd-init, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive)
> - Skill `judgment-day` (adversarial review with two parallel judges)
> - MCP `codegraph` (surgical codebase exploration)
> - SDD methodology with openspec artifact store (specs in versionable files)

---

### PHASE 7 — Post-PR Fixes (CodeRabbit + Language Domain Contract)

> After CodeRabbit's review on PR #2 and a manual Language Domain Contract audit, 23 accumulated tips were identified across code quality, language consistency, and security. This single prompt resolves them all.

#### Prompt 7.1 — Integral post-PR fix

```
Fix all the following issues in the backend. Work on the feature/backend-ADLC branch and verify that tests still pass at the end.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 BLOCK A: SECURITY AND FUNCTIONAL CORRECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A1 - Transaction in updateCandidateStage
In backend/src/application/services/candidateService.ts, the updateCandidateStage function makes 4 independent reads followed by a write. Wrap the entire block (from the findUnique of application to the final update) in a Prisma $transaction to avoid race conditions.

A2 - Fragile error handling in candidateController
In backend/src/presentation/controllers/candidateController.ts, the catch in updateCandidateStage matches errors by exact text message ('Candidate not found', etc.). Replace it with typed errors: create an AppError class with a code property (NOT_FOUND, VALIDATION, etc.) in a shared file, use it in candidateService, and match by code in the controller.

A3 - Nested-create duplicates child rows in Candidate.update
In backend/src/domain/models/Candidate.ts, the save() method when this.id exists reuses candidateData with nested create blocks for educations, workExperiences, resumes, and applications. On an update, this duplicates the child rows every time. Change the update branch to omit those nested-create blocks (or use connect/upsert as appropriate).

A4 - Missing uploadDate in nested create of resumes
In backend/src/domain/models/Candidate.ts, the candidateData.resumes.create mapping does not include uploadDate. The Prisma schema requires it, so any candidate creation with a CV will fail. Add uploadDate: new Date() to the mapping.

A5 - console.log(this) in Resume.create()
In backend/src/domain/models/Resume.ts, remove the console.log(this); line from the create() method. It's a debugging leftover.

A6 - console.log(error) without context in Candidate.ts
In backend/src/domain/models/Candidate.ts, replace console.log(error); with a structured throw with error context.

A7 - .catch(() => {}) silences cleanup errors in test
In backend/tests/candidateStage.test.ts, the finally block has a .catch(() => {}) that swallows Prisma errors. Remove the catch or add a console.error as a minimum.

A8 - Duplicate application reset in test try+finally
In backend/tests/candidateStage.test.ts, the try block resets currentInterviewStep to step1Id and the finally does the same. Remove the reset from try, keep only the one in finally.

A9 - step3 typed as any in test
In backend/tests/candidateStage.test.ts, change let step3: any to let step3: InterviewStep | undefined and import InterviewStep from @prisma/client.

A10 - Helmet for header security
In backend/src/index.ts, add app.use(helmet()) at the beginning of the middleware chain. Import helmet from the helmet package. If not installed, add it.

A11 - PrismaClient without guard for hot-reload
In backend/src/infrastructure/database/client.ts, cache the PrismaClient in globalThis to avoid multiple instances on dev reload, and register a process.on('beforeExit', () => prisma.$disconnect()) for clean shutdown.

A12 - Double-wrapping of error in candidateService
In backend/src/application/services/candidateService.ts, the catch in addCandidate wraps the validateCandidateData error in a new Error(error), losing the original stack. Change it to directly throw error.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟡 BLOCK B: CODE QUALITY AND MAINTAINABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

B1 - Extract parsePositiveIntParam helper
In backend/src/presentation/controllers/positionController.ts, the limit and offset validation is duplicated (regex + parse + bounds check). Extract a parsePositiveIntParam(val, max?) helper in backend/src/presentation/utils/validation.ts and use it in both branches.

B2 - Silent truncation of limit > 100
In backend/src/presentation/controllers/positionController.ts, when limit exceeds 100 it gets truncated with Math.min without notifying the client. Reject it with a 400 and a clear message, or at minimum document it in the spec.

B3 - Missing explicit return type in positionService
In backend/src/application/services/positionService.ts, define a CandidateSummary interface and use it as the explicit return type for getCandidatesByPosition.

B4 - current_interview_step to camelCase
In backend/src/application/services/positionService.ts, change the current_interview_step key to currentInterviewStep in the response object, to maintain consistency with camelCase in the rest of the API.

B5 - Spanish comments to English across the entire backend
Change ALL inline comments from Spanish to English in ALL .ts files in the backend. Includes: domain/models/*.ts, application/services/*.ts, presentation/controllers/*.ts, presentation/utils/*.ts, infrastructure/database/client.ts, index.ts, routes/*.ts. Examples of changes:
  // Solo añadir al objeto candidateData los campos que no son undefined
  → // Only add non-undefined fields to candidateData
  // Añadir educations si hay alguna para añadir
  → // Add educations if any exist
  // Verificar si el archivo fue rechazado por el filtro de archivos
  → // Check if the file was rejected by the file filter

B6 - Spanish error messages to English in domain models
Convert ALL error messages from Spanish to English in domain/models/*.ts. Examples:
  'No se pudo conectar con la base de datos...' → 'Database connection error...'
  'No se pudo encontrar el registro del candidato...' → 'Candidate record not found...'
  'No se permite la actualización de un currículum...' → 'Resume updates are not allowed...'

B7 - Type step3 correctly in candidateStage test
(already covered in A9 - same change)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 BLOCK C: DOCUMENTATION AND CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

C1 - Absolute paths in apply-progress.md
In openspec/changes/archive/2026-06-27-update-candidate-stage/apply-progress.md, replace the absolute paths file:///Users/develop/... with relative paths to the repository (backend/src/routes/candidateRoutes.ts, etc.).

C2 - Incorrect test description in apply-progress.md
In the same file, where it says "unit tests" change it to "integration tests".

C3 - Outdated verify-report in position-candidates
In openspec/changes/archive/2026-06-27-get-position-candidates/verify-report.md, update the entry that says "Handled with parseInt and isNaN check" to reflect that now isValidId() is used with stricter validation (regex /^\d+$/, range 1-2147483647).

C4 - Verify-report: separate responsibilities in candidate-stage
In openspec/changes/archive/2026-06-27-update-candidate-stage/verify-report.md, update the entry about body validation to distinguish that the controller validates format (400) and the service validates existence (404).

C5 - Google Antigravity → Gemini/Claude
In prompts-ADLC.md (this same file), change "Google Antigravity (Gemini/Claude)" to the actual tool that was used.

C6 - Unique constraint: document safe migration
In backend/prisma/schema.prisma, the @@unique([positionId, candidateId]) line may fail if there are duplicates in the DB. Add a comment warning to verify/clean data before migrating.

C7 - Duplicate pnpm config
In frontend/package.json, remove pnpm.onlyBuiltDependencies if allowBuilds already exists in frontend/pnpm-workspace.yaml. Standardize in one place.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT: After finishing each block, run npm run test (or the backend test command) to verify nothing is broken. If a test fails, fix it before moving to the next block.
```
