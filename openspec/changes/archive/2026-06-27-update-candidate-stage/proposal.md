# SDD Proposal: Update Candidate Stage (`PUT /candidates/:id/stage`)

## Executive Summary
Introduce the endpoint `PUT /candidates/:id/stage` to update the current interview step/stage of a candidate's application for a specific position. The request must validate candidate existence, position existence, application existence, and ensure the requested interview step belongs to the flow associated with that position.

---

## 1. Requirements & Specifications
- **Endpoint**: `PUT /candidates/:id/stage`
- **Controller Method**: `updateCandidateStageController(req, res)`
- **Request Parameters**:
  - `id`: number (Candidate ID in path)
- **Request Body**:
  ```json
  {
    "positionId": 1,
    "interviewStepId": 2
  }
  ```
- **Validation Rules**:
  1. **Candidate Exists**: Verify `id` (candidateId) matches an existing candidate. If not, return `404 Not Found`.
  2. **Position Exists**: Verify `positionId` matches an existing position. If not, return `404 Not Found`.
  3. **Application Exists**: Verify an application exists for this `candidateId` and `positionId`. If not, return `404 Not Found`.
  4. **Interview Step Belongs to Position's Flow**: Verify the `interviewStepId` belongs to the `InterviewFlow` associated with the target position. If not, return `400 Bad Request`.
- **Response Structure**:
  - **Status Code**: `200 OK` (on success)
  - **Body**:
    ```json
    {
      "message": "Stage updated successfully",
      "candidateId": 1,
      "interviewStepId": 2
    }
    ```

---

## 2. Technical Design & Flow

### Proposed Database Queries (via Prisma client)
1. **Verify Candidate**:
   `prisma.candidate.findUnique({ where: { id: candidateId } })`
2. **Verify Position**:
   `prisma.position.findUnique({ where: { id: positionId } })`
3. **Verify Application**:
   `prisma.application.findFirst({ where: { candidateId, positionId } })`
4. **Verify Step Mapping**:
   Find the position's `interviewFlowId` and ensure there is an `InterviewStep` with the given `interviewStepId` that points to that `interviewFlowId`:
   `prisma.interviewStep.findFirst({ where: { id: interviewStepId, interviewFlowId: position.interviewFlowId } })`
5. **Update Stage**:
   Update `currentInterviewStep` on the existing application:
   `prisma.application.update({ where: { id: application.id }, data: { currentInterviewStep: interviewStepId } })`

### Architecture Layers
1. **Presentation / Route**:
   Add Route `router.put('/:id/stage', updateCandidateStage);` inside [candidateRoutes.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/routes/candidateRoutes.ts).
2. **Presentation / Controller**:
   Add `updateCandidateStageController` (as `updateCandidateStage`) in [candidateController.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/presentation/controllers/candidateController.ts).
3. **Application / Service**:
   Create or append service method `updateCandidateStage(candidateId, positionId, interviewStepId)` in [candidateService.ts](file:///Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604/backend/src/application/services/candidateService.ts).

---

## 3. Rollback Plan
- **Database Rollback**: None required as the database schema does not change.
- **Code Rollback**: Revert candidate routes, candidate controller, and candidate service files to their pre-change state (`git checkout HEAD -- <files>`).

---

## 4. Success Criteria & Verification
- **Success Criteria**:
  - Valid updates result in code `200` with the expected JSON response.
  - Invalid candidate, position, or application IDs result in `404` errors.
  - Mismatched interview step/flow IDs result in `400` errors.
  - DB correctly reflects the updated `currentInterviewStep` on the application record.
- **Verification Steps**:
  - Run integration tests validating all success/error cases.
  - Run `pnpm test` (or the equivalent test suite configured in the project) to ensure no regressions.
