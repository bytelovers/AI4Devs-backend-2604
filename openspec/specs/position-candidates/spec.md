# Specification: Position Candidates (`position-candidates`)

## Purpose
The `position-candidates` capability provides a secure API endpoint to fetch a minimal summary of all candidates currently in process for a specific job position.

## Requirements
1. The endpoint MUST be accessible via `GET /positions/:id/candidates`.
2. The endpoint MUST validate if the Position exists in the database. If it does not exist, it MUST return a `404 Not Found` response.
3. The endpoint MUST return a `200 OK` status with a JSON array of candidates when the Position is found.
4. For each candidate in progress, the response MUST map to the following schema:
   - `id`: The candidate's unique identifier.
   - `fullName`: The candidate's concatenated first and last name (`firstName` + " " + `lastName`).
   - `current_interview_step`: The name of the current interview step.
   - `average_score`: The average of the scores from all interviews for that application.
5. The `average_score` MUST be calculated as the arithmetic mean of all numeric interview scores associated with the application.
6. The `average_score` MUST be `null` if the candidate has no interviews, or if all interview scores are `null`.
7. The endpoint MUST return an empty array `[]` if the position exists but has no candidates in progress.

## Scenarios

### Scenario 1: Happy Path - Candidates in Process
Given a valid Position ID `pos-123` exists in the database
And candidates `cand-1` and `cand-2` are associated with `pos-123`
And candidate `cand-1` has current step "Technical Interview" and interview scores [80, 90]
When a `GET` request is made to `/positions/pos-123/candidates`
Then the response status code MUST be `200`
And the response body MUST be:
```json
[
  {
    "id": "cand-1",
    "fullName": "Jane Doe",
    "current_interview_step": "Technical Interview",
    "average_score": 85.0
  }
]
```

### Scenario 2: Edge Case - No Candidates in Process
Given a valid Position ID `pos-456` exists in the database
And there are no candidates associated with `pos-456`
When a `GET` request is made to `/positions/pos-456/candidates`
Then the response status code MUST be `200`
And the response body MUST be `[]`

### Scenario 3: Error State - Position Does Not Exist
Given a Position ID `pos-999` does not exist in the database
When a `GET` request is made to `/positions/pos-999/candidates`
Then the response status code MUST be `404`
And the response body MUST indicate that the position was not found.

### Scenario 4: Average Score Calculation Details
Given a valid Position ID `pos-789` exists in the database
And `cand-3` has interviews with scores [null, 90, null]
And `cand-4` has interviews with scores [null, null]
And `cand-5` has no interviews
When a `GET` request is made to `/positions/pos-789/candidates`
Then the response status code MUST be `200`
And `cand-3` MUST have an `average_score` of `90.0`
And `cand-4` MUST have an `average_score` of `null`
And `cand-5` MUST have an `average_score` of `null`
