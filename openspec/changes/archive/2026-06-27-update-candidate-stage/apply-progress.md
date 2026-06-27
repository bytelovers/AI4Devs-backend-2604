# Apply Progress: update-candidate-stage

The implementation tasks for the change 'update-candidate-stage' have been fully completed.

## Summary of Changes
1. **Route Mapping**: Mapped `PUT /candidates/:id/stage` to the `updateCandidateStage` controller handler in [candidateRoutes.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/routes/candidateRoutes.ts).
2. **Controller Logic**: Implemented parameter parsing, input type validations (returning `400` status on malformed parameters), and try/catch error wrapping in [candidateController.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/presentation/controllers/candidateController.ts).
3. **Service Logic**: Implemented `updateCandidateStage` in [candidateService.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/application/services/candidateService.ts) to:
   - Check if candidate, position, and application exist (returning descriptive errors).
   - Check if the requested interview step belongs to the position's interview flow.
   - Perform the database update on the application's `currentInterviewStep`.
4. **Unit Tests**: Created a full Jest unit test suite covering 200 happy path, 400 parameter formats and mismatched step flows, and 404 missing records in [candidateStage.test.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/tests/candidateStage.test.ts).
5. **Verification**: Executed the test runner (`pnpm test`) showing 100% success on all test suites, and formatted all files with `pnpm format`.
