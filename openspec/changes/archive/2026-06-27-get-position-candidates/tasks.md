# Tasks: Get Position Candidates

This file outlines the tasks needed to implement the candidate list retrieval endpoint (`GET /positions/:id/candidates`) for a given job position.

## Review Workload Forecast

- **Estimated changed lines**: 150-200 lines
- **400-line budget risk**: Low
- **Chained PRs recommended**: No
- **Delivery strategy**: ask-on-risk
- **Chain strategy**: stacked-to-main
- **Decision needed before apply**: No

---

## Phase 1: Foundation
- [x] **Router Registration**: Register `positionRoutes` router in `backend/src/index.ts` under `/positions`.
- [x] **Router Shell**: Create the file `backend/src/routes/positionRoutes.ts` with basic imports (`express`, `Router`) and export it to prevent compilation issues.
- [x] **Imports Audit**: Ensure all files export clean modules and are imported correctly.

## Phase 2: Core Implementation
- [x] **Database & Logic Service**: Create `backend/src/application/services/positionService.ts`.
  - Check position existence using `Position.findOne(id)`. Return null if not found.
  - Query application records for the position using `prisma.application.findMany`.
  - Use select projection to pull only candidate name fields, interview step name, and interview scores.
  - Calculate average interview score, filtering out null or undefined scores. Return `null` if no scores exist.
- [x] **Controller Request Handler**: Create `backend/src/presentation/controllers/positionController.ts`.
  - Validate parameters (e.g., ID must be numeric/integer).
  - Handle success (200 OK) with the candidate summaries payload.
  - Handle target resource missing errors (404 Not Found).
  - Handle unexpected internal errors (500 Internal Server Error).
- [x] **Route Mapping**: Define `GET /:id/candidates` mapping in `backend/src/routes/positionRoutes.ts` to call `positionController.getCandidatesByPosition`.

## Phase 3: Testing
- [x] **Test Setup**: Create `backend/tests/position.test.ts` imports for `supertest`, the main app, and database test utility frameworks.
- [x] **404 Not Found Test Case**: Write a unit/integration test expecting a `404` status for a non-existent position.
- [x] **Empty State Test Case**: Write a test case expecting a `200` status with an empty array `[]` when a position exists but has no applications.
- [x] **Happy Path Test Case**: Write a test case checking correct mapping of full names, status name, and calculation of average score (verifying that null scores are ignored).

## Phase 4: Verification
- [x] **Run Linter and Prettier**: Run formatting check to verify codebase compliance.
- [x] **Test Execution**: Run Jest test suites to ensure all test cases pass without regressions.
