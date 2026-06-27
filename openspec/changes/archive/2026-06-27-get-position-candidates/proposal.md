# Proposal: Get Position Candidates

## Intent
Provide a clean, secure API endpoint to fetch a minimal summary of all candidates currently in process for a specific job position.

## Scope

### In Scope
- Endpoint `GET /positions/:id/candidates` returning candidate summaries.
- Validating position existence, returning 404 if not found.
- Restrictive payload mapping: Candidate ID, Full Name, current interview step name, and average interview score (or `null`).
- Unit and integration tests using Jest.

### Out of Scope
- Frontend UI development.
- Prisma database schema modifications.
- Pagination or search filtering.

## Capabilities

### New Capabilities
- `position-candidates`: Fetches all candidates in progress for a specific position with their current status and average interview score.

### Modified Capabilities
- None

## Approach
1. Register `positionRoutes` at `/positions` in `backend/src/index.ts`.
2. Map route `/positions/:id/candidates` to `positionController.getCandidatesByPosition`.
3. Query `Application` via Prisma where `positionId = id`.
4. Include `Candidate` (for `id`, `firstName`, `lastName`), `InterviewStep` (for `name`), and `Interview` (for `score`).
5. Process and return `id`, `fullName` (`firstName` + `lastName`), `current_interview_step`, and `average_score` (calculated from valid scores).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/src/index.ts` | Modified | Mount position router |
| `backend/src/routes/positionRoutes.ts` | New | Route definition |
| `backend/src/presentation/controllers/positionController.ts` | New | HTTP handler |
| `backend/src/application/services/positionService.ts` | New | Business logic & queries |
| `backend/tests/position.test.ts` | New | API & logic tests |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Database load from includes | Low | Query only necessary fields |
| Score division by zero | Low | Guard against zero count / null scores |

## Rollback Plan
- Revert commits on current branch; delete newly created files.

## Dependencies
- None

## Success Criteria
- [ ] Endpoint `GET /positions/:id/candidates` returns candidate arrays.
- [ ] Returns 404 for non-existent position IDs.
- [ ] average_score is correct or null.
