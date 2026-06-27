# Spec: Update Candidate Stage (`PUT /candidates/:id/stage`)

## Purpose
The purpose of the `candidate-stage` capability is to allow recruitment coordinators to advance or change a candidate's current stage (interview step) within an active job position application, enforcing domain integrity checks across candidates, positions, applications, and position interview flows.

## Requirements
* The system **MUST** provide an endpoint at `PUT /candidates/:id/stage`.
* The path parameter `:id` **MUST** represent a valid Candidate ID.
* The request body **MUST** contain `positionId` (integer) and `interviewStepId` (integer).
* The system **MUST** verify that the Candidate exists. If not, it **MUST** return HTTP 404.
* The system **MUST** verify that the Position exists. If not, it **MUST** return HTTP 404.
* The system **MUST** verify that the Candidate has applied to the Position (Application exists). If not, it **MUST** return HTTP 404.
* The system **MUST** verify that the `interviewStepId` belongs to the flow associated with the Position. If not, it **MUST** return HTTP 400.
* Upon passing all validation, the system **MUST** update the application's current interview step to the requested `interviewStepId`.
* On success, the system **MUST** return HTTP 200 with the confirmation message, candidate ID, and updated interview step ID.

## Scenarios

### Scenario 1: Happy Path
* **Given** a candidate with ID `1` exists
* **And** a position with ID `10` exists with an interview flow that includes step `5`
* **And** the candidate has applied to position `10`
* **When** a request `PUT /candidates/1/stage` is sent with:
  ```json
  {
    "positionId": 10,
    "interviewStepId": 5
  }
  ```
* **Then** the service updates the application to step `5`
* **And** returns HTTP `200 OK` with:
  ```json
  {
    "message": "Stage updated successfully",
    "candidateId": 1,
    "interviewStepId": 5
  }
  ```

### Scenario 2: Candidate Not Found
* **Given** no candidate exists with ID `999`
* **When** a request `PUT /candidates/999/stage` is sent with:
  ```json
  {
    "positionId": 10,
    "interviewStepId": 5
  }
  ```
* **Then** the service does not update any data
* **And** returns HTTP `404 Not Found`

### Scenario 3: Position Not Found
* **Given** a candidate with ID `1` exists
* **And** no position exists with ID `888`
* **When** a request `PUT /candidates/1/stage` is sent with:
  ```json
  {
    "positionId": 888,
    "interviewStepId": 5
  }
  ```
* **Then** the service does not update any data
* **And** returns HTTP `404 Not Found`

### Scenario 4: Application Not Found
* **Given** a candidate with ID `1` exists
* **And** a position with ID `10` exists
* **And** candidate `1` has not applied to position `10`
* **When** a request `PUT /candidates/1/stage` is sent with:
  ```json
  {
    "positionId": 10,
    "interviewStepId": 5
  }
  ```
* **Then** the service does not update any data
* **And** returns HTTP `404 Not Found`

### Scenario 5: Mismatched Interview Step
* **Given** a candidate with ID `1` exists
* **And** a position with ID `10` exists with a flow that does *not* contain step `99`
* **And** candidate `1` has applied to position `10`
* **When** a request `PUT /candidates/1/stage` is sent with:
  ```json
  {
    "positionId": 10,
    "interviewStepId": 99
  }
  ```
* **Then** the service does not update any data
* **And** returns HTTP `400 Bad Request`
