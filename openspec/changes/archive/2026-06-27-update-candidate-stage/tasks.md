# Tasks: Update Candidate Stage

## Review Workload Forecast
- **Estimated changed lines:** 170-220 lines (very low risk)
- **400-line budget risk:** Low
- **Chained PRs recommended:** No
- **Delivery strategy:** ask-on-risk
- **Chain strategy:** stacked-to-main
- **Decision needed before apply:** No

---

## Phases

### Phase 1: Foundation
- [x] **Register Route Map**: Update [candidateRoutes.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/routes/candidateRoutes.ts) to map `PUT /:id/stage` to the controller function `updateCandidateStage`.
  * *Verification*: Verify route loads without errors when starting the application.

### Phase 2: Core Implementation
- [x] **Controller Handler**: In [candidateController.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/presentation/controllers/candidateController.ts), implement validation for `id` (path), `positionId` (body), and `interviewStepId` (body) to ensure they are integers. Return HTTP 400 if invalid.
- [x] **Service Logic**: In [candidateService.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/application/services/candidateService.ts), implement:
  * Check candidate exists.
  * Check position exists.
  * Check candidate application exists for this position.
  * Check the interview step belongs to the position's flow.
  * Update `currentInterviewStep` on the candidate's application.
- [x] **Error Mapping**: Catch exceptions in the controller and map to appropriate HTTP status codes:
  * Candidate, position, or application not found: HTTP 404.
  * Step not in flow: HTTP 400.
  * Other errors: HTTP 500.

### Phase 3: Testing
- [x] **Write Test Suite**: Create [candidateStage.test.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/tests/candidateStage.test.ts) covering:
  * **200 Success**: Correctly updates valid stage and returns JSON payload.
  * **400 Bad Request**: Invalid parameters or mismatched step that does not belong to the position's flow.
  * **404 Not Found**: Candidate, position, or application does not exist.

### Phase 4: Verification
- [x] **Run Tests**: Execute `pnpm test` (or local npm test command) inside `/Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend` to run the test suite and ensure all tests pass.
- [x] **Linter check**: Run `pnpm lint` to ensure code conforms to style guide.
