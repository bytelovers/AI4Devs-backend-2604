# Initial Prompts - Candidate Kanban Exercise

This document compiles the instructions, clarification questions, architecture decisions, and the workflow used in the development and implementation process of the new backend endpoints.

## Exercise Context
The goal was to create two new endpoints in the LTI backend to interact with the candidate list in a Kanban recruitment flow:
1. `GET /positions/:id/candidates`: Retrieves the candidates in process for a position with their current stage and average score.
2. `PUT /candidates/:id/stage`: Modifies the stage of a candidate's application for a specific position.

---

## 1. Clarification Questions and Product Decisions
During the proposal phase for both endpoints, the following product decisions were formulated and agreed upon:

* **PUT Disambiguation**: Since a candidate can have multiple active applications at the same time, it was decided to send the `positionId` in the request body (`PUT /candidates/:id/stage`) to uniquely identify the corresponding application (`Application`).
* **Process Stage**: It was decided to use the `interviewStepId` field (more descriptive) instead of a generic `stage` or `currentInterviewStep` when updating the interview stage.
* **Average Score Calculation (`average_score`)**:
  - It is calculated as the arithmetic mean of all scored interviews associated with the application.
  - If a candidate has no interviews or all their scores are null, the average is set to `null` (to properly separate it from numeric scores of `0`).
* **Data Security**: A restrictive data projection policy was adopted to avoid exposing sensitive candidate information (returning only candidate ID, Full Name, Current Stage Name, and Average Score).
* **Stage Validation**: The backend validates that the interview stage requested in the `PUT` actually belongs to the selection flow (`InterviewFlow`) configured for the position.

---

## 2. Prompts Used in the Process

### Install the Repository with pnpm
> *"I'm going to share with you the steps needed to install the repository ... instead of using npm and npx, use pnpm and pnpx"*

### Execution with OpenSpec and Branches
> *"I'm going to give you the instructions for what needs to be done, follow the SDD phases with openspec to complete the task. Complete the exercise ... create a new branch for your deliverable named backend-iniciales. Before doing anything, tell me if everything is 100% defined, otherwise ask."*

---

## 3. Tests and Coverage
Exhaustive integration test suites were implemented with **Jest** and **supertest** to cover all expected scenarios and ensure no regressions in the system:
* **GET `/positions/:id/candidates`**:
  - `400 Bad Request` for non-numeric position ID.
  - `404 Not Found` for non-existent position.
  - `200 OK` with empty array `[]` if the position exists but has no candidates.
  - `200 OK` happy path with correct data mapping and correct average score calculation (ignoring null values).
* **PUT `/candidates/:id/stage`**:
  - `400 Bad Request` for incorrect ID/parameter format in route or body.
  - `404 Not Found` if the candidate, position, or associated application does not exist.
  - `400 Bad Request` if the interview stage does not belong to the position's flow.
  - `200 OK` successfully updating the step in the PostgreSQL database.
