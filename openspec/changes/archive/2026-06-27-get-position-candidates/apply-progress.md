# Apply Progress: get-position-candidates

All tasks for implementing the `GET /positions/:id/candidates` endpoint have been successfully executed and validated.

## Implemented Files
- [backend/src/index.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/index.ts): Registered `/positions` router.
- [backend/src/routes/positionRoutes.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/routes/positionRoutes.ts): Maps `GET /:id/candidates` route to the controller.
- [backend/src/application/services/positionService.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/application/services/positionService.ts): Contains database querying (using selective projection) and candidates' average scores calculation logic.
- [backend/src/presentation/controllers/positionController.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/presentation/controllers/positionController.ts): Validates position ID parameters and handles HTTP status responses (200, 400, 404, 500).
- [backend/tests/position.test.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/tests/position.test.ts): Tests cases for happy path (score calculations, null checks, name mapping), 404 (not found position), 400 (invalid format id), and empty candidate lists.

## Verification
- Prettier/formatting checks run and passed.
- Database tables initialized/pushed correctly.
- Test suite run using Jest and Supertest, passing with 100% success rate:
  - `GET /positions/:id/candidates`
    - `should return 400 with Invalid ID format if position ID is not a number (passed)`
    - `should return 404 with Position not found if position does not exist (passed)`
    - `should return 200 with an empty list if position exists but has no candidates (passed)`
    - `should return 200 with candidate summaries and correct average scores (happy path) (passed)`
