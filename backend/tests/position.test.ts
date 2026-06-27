import request from 'supertest';
import app from '../src/index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('GET /positions/:id/candidates', () => {
  let testCompanyId: number;
  let testEmployeeId: number;
  let testFlowId: number;
  let testStepId: number;
  let testTypeId: number;
  let activePositionId: number;
  let emptyPositionId: number;

  const candidateIds: number[] = [];
  const applicationIds: number[] = [];
  const interviewIds: number[] = [];

  beforeAll(async () => {
    // 1. Create a test company
    const company = await prisma.company.create({
      data: { name: `Test Company ${Date.now()}` },
    });
    testCompanyId = company.id;

    // 2. Create an employee
    const employee = await prisma.employee.create({
      data: {
        companyId: testCompanyId,
        name: 'Test Recruiter',
        email: `recruiter-${Date.now()}@example.com`,
        role: 'Recruiter',
      },
    });
    testEmployeeId = employee.id;

    // 3. Create an interview type
    const interviewType = await prisma.interviewType.create({
      data: {
        name: 'Technical Test',
        description: 'Assesses programming skills',
      },
    });
    testTypeId = interviewType.id;

    // 4. Create an interview flow
    const flow = await prisma.interviewFlow.create({
      data: { description: 'Standard Flow' },
    });
    testFlowId = flow.id;

    // 5. Create an interview step
    const step = await prisma.interviewStep.create({
      data: {
        name: 'Technical Interview',
        orderIndex: 1,
        interviewFlowId: testFlowId,
        interviewTypeId: testTypeId,
      },
    });
    testStepId = step.id;

    // 6. Create active position
    const position = await prisma.position.create({
      data: {
        title: 'Senior Developer',
        description: 'Test position with applications',
        location: 'Remote',
        jobDescription: 'Code coding',
        companyId: testCompanyId,
        interviewFlowId: testFlowId,
      },
    });
    activePositionId = position.id;

    // 7. Create empty position (no applications)
    const emptyPosition = await prisma.position.create({
      data: {
        title: 'Junior Developer',
        description: 'Test position without applications',
        location: 'Remote',
        jobDescription: 'Learn coding',
        companyId: testCompanyId,
        interviewFlowId: testFlowId,
      },
    });
    emptyPositionId = emptyPosition.id;

    // 8. Create Candidates
    // Candidate 1: scores [80, 90] => average 85
    const cand1 = await prisma.candidate.create({
      data: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: `jane.doe-${Date.now()}@example.com`,
      },
    });
    candidateIds.push(cand1.id);

    // Candidate 2: scores [null, 90, null] => average 90
    const cand2 = await prisma.candidate.create({
      data: {
        firstName: 'Bob',
        lastName: 'Smith',
        email: `bob.smith-${Date.now()}@example.com`,
      },
    });
    candidateIds.push(cand2.id);

    // Candidate 3: scores [null, null] => average null
    const cand3 = await prisma.candidate.create({
      data: {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: `alice.johnson-${Date.now()}@example.com`,
      },
    });
    candidateIds.push(cand3.id);

    // Candidate 4: no interviews => average null
    const cand4 = await prisma.candidate.create({
      data: {
        firstName: 'Charlie',
        lastName: 'Brown',
        email: `charlie.brown-${Date.now()}@example.com`,
      },
    });
    candidateIds.push(cand4.id);

    // 9. Create Applications
    const appDate = new Date();
    const app1 = await prisma.application.create({
      data: {
        positionId: activePositionId,
        candidateId: cand1.id,
        applicationDate: appDate,
        currentInterviewStep: testStepId,
      },
    });
    applicationIds.push(app1.id);

    const app2 = await prisma.application.create({
      data: {
        positionId: activePositionId,
        candidateId: cand2.id,
        applicationDate: appDate,
        currentInterviewStep: testStepId,
      },
    });
    applicationIds.push(app2.id);

    const app3 = await prisma.application.create({
      data: {
        positionId: activePositionId,
        candidateId: cand3.id,
        applicationDate: appDate,
        currentInterviewStep: testStepId,
      },
    });
    applicationIds.push(app3.id);

    const app4 = await prisma.application.create({
      data: {
        positionId: activePositionId,
        candidateId: cand4.id,
        applicationDate: appDate,
        currentInterviewStep: testStepId,
      },
    });
    applicationIds.push(app4.id);

    // 10. Create Interviews
    // app1: scores 80, 90
    const i1_1 = await prisma.interview.create({
      data: {
        applicationId: app1.id,
        interviewStepId: testStepId,
        employeeId: testEmployeeId,
        interviewDate: appDate,
        score: 80,
      },
    });
    const i1_2 = await prisma.interview.create({
      data: {
        applicationId: app1.id,
        interviewStepId: testStepId,
        employeeId: testEmployeeId,
        interviewDate: appDate,
        score: 90,
      },
    });
    interviewIds.push(i1_1.id, i1_2.id);

    // app2: scores null, 90, null
    const i2_1 = await prisma.interview.create({
      data: {
        applicationId: app2.id,
        interviewStepId: testStepId,
        employeeId: testEmployeeId,
        interviewDate: appDate,
        score: null,
      },
    });
    const i2_2 = await prisma.interview.create({
      data: {
        applicationId: app2.id,
        interviewStepId: testStepId,
        employeeId: testEmployeeId,
        interviewDate: appDate,
        score: 90,
      },
    });
    const i2_3 = await prisma.interview.create({
      data: {
        applicationId: app2.id,
        interviewStepId: testStepId,
        employeeId: testEmployeeId,
        interviewDate: appDate,
        score: null,
      },
    });
    interviewIds.push(i2_1.id, i2_2.id, i2_3.id);

    // app3: scores null, null
    const i3_1 = await prisma.interview.create({
      data: {
        applicationId: app3.id,
        interviewStepId: testStepId,
        employeeId: testEmployeeId,
        interviewDate: appDate,
        score: null,
      },
    });
    const i3_2 = await prisma.interview.create({
      data: {
        applicationId: app3.id,
        interviewStepId: testStepId,
        employeeId: testEmployeeId,
        interviewDate: appDate,
        score: null,
      },
    });
    interviewIds.push(i3_1.id, i3_2.id);
  });

  afterAll(async () => {
    // Delete in reverse order of foreign key dependencies
    await prisma.interview.deleteMany({ where: { id: { in: interviewIds } } });
    await prisma.application.deleteMany({
      where: { id: { in: applicationIds } },
    });
    await prisma.candidate.deleteMany({ where: { id: { in: candidateIds } } });
    await prisma.position.deleteMany({
      where: { id: { in: [activePositionId, emptyPositionId] } },
    });
    await prisma.interviewStep.delete({ where: { id: testStepId } });
    await prisma.interviewFlow.delete({ where: { id: testFlowId } });
    await prisma.interviewType.delete({ where: { id: testTypeId } });
    await prisma.employee.delete({ where: { id: testEmployeeId } });
    await prisma.company.delete({ where: { id: testCompanyId } });

    await prisma.$disconnect();
  });

  it('should return 400 with Invalid ID format if position ID is not a number', async () => {
    const res = await request(app).get('/positions/invalid-id/candidates');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid ID format' });
  });

  it('should return 404 with Position not found if position does not exist', async () => {
    const res = await request(app).get('/positions/999999/candidates');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Position not found' });
  });

  it('should return 200 with an empty list if position exists but has no candidates', async () => {
    const res = await request(app).get(
      `/positions/${emptyPositionId}/candidates`,
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return 200 with candidate summaries and correct average scores (happy path)', async () => {
    const res = await request(app).get(
      `/positions/${activePositionId}/candidates`,
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(4);

    // Sort by id for deterministic testing
    const candidates = res.body.sort((a: any, b: any) => a.id - b.id);

    // Candidate 1: Jane Doe, scores [80, 90] => average 85
    expect(candidates[0].fullName).toBe('Jane Doe');
    expect(candidates[0].current_interview_step).toBe('Technical Interview');
    expect(candidates[0].average_score).toBe(85);

    // Candidate 2: Bob Smith, scores [null, 90, null] => average 90
    expect(candidates[1].fullName).toBe('Bob Smith');
    expect(candidates[1].current_interview_step).toBe('Technical Interview');
    expect(candidates[1].average_score).toBe(90);

    // Candidate 3: Alice Johnson, scores [null, null] => average null
    expect(candidates[2].fullName).toBe('Alice Johnson');
    expect(candidates[2].current_interview_step).toBe('Technical Interview');
    expect(candidates[2].average_score).toBeNull();

    // Candidate 4: Charlie Brown, no interviews => average null
    expect(candidates[3].fullName).toBe('Charlie Brown');
    expect(candidates[3].current_interview_step).toBe('Technical Interview');
    expect(candidates[3].average_score).toBeNull();
  });
});
