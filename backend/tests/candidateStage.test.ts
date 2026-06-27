import request from 'supertest';
import app from '../src/index';
import { prisma } from '../src/infrastructure/database/client';

describe('PUT /candidates/:id/stage', () => {
  let testCompanyId: number;
  let flow1Id: number;
  let flow2Id: number;
  let step1Id: number;
  let step2Id: number;
  let position1Id: number;
  let position2Id: number;
  let candidateId: number;
  let applicationId: number;
  let testTypeId: number;

  beforeAll(async () => {
    // 1. Create a test company
    const company = await prisma.company.create({
      data: { name: `Stage Test Company ${Date.now()}` },
    });
    testCompanyId = company.id;

    // 2. Create Interview Flows
    const flow1 = await prisma.interviewFlow.create({
      data: { description: `Flow 1 ${Date.now()}` },
    });
    flow1Id = flow1.id;

    const flow2 = await prisma.interviewFlow.create({
      data: { description: `Flow 2 ${Date.now()}` },
    });
    flow2Id = flow2.id;

    // 3. Create Interview Type
    const interviewType = await prisma.interviewType.create({
      data: {
        name: 'Screening',
        description: 'Initial screening',
      },
    });
    testTypeId = interviewType.id;

    // 4. Create Interview Steps
    const step1 = await prisma.interviewStep.create({
      data: {
        name: 'Step 1 (Flow 1)',
        orderIndex: 1,
        interviewFlowId: flow1Id,
        interviewTypeId: testTypeId,
      },
    });
    step1Id = step1.id;

    const step2 = await prisma.interviewStep.create({
      data: {
        name: 'Step 2 (Flow 2)',
        orderIndex: 1,
        interviewFlowId: flow2Id,
        interviewTypeId: testTypeId,
      },
    });
    step2Id = step2.id;

    // 5. Create Positions
    const pos1 = await prisma.position.create({
      data: {
        title: 'Backend Dev',
        description: 'Node position',
        location: 'Remote',
        jobDescription: 'Express coding',
        companyId: testCompanyId,
        interviewFlowId: flow1Id,
      },
    });
    position1Id = pos1.id;

    const pos2 = await prisma.position.create({
      data: {
        title: 'Frontend Dev',
        description: 'React position',
        location: 'Remote',
        jobDescription: 'React coding',
        companyId: testCompanyId,
        interviewFlowId: flow2Id,
      },
    });
    position2Id = pos2.id;

    // 6. Create Candidate
    const candidate = await prisma.candidate.create({
      data: {
        firstName: 'John',
        lastName: 'Stage',
        email: `john.stage-${Date.now()}@example.com`,
      },
    });
    candidateId = candidate.id;

    // 7. Create Application for candidate on position 1, at step 1
    const app = await prisma.application.create({
      data: {
        positionId: position1Id,
        candidateId: candidateId,
        applicationDate: new Date(),
        currentInterviewStep: step1Id,
      },
    });
    applicationId = app.id;
  });

  afterAll(async () => {
    // Clean up
    if (applicationId) {
      await prisma.application.deleteMany({
        where: { id: applicationId },
      });
    }
    if (candidateId) {
      await prisma.candidate.deleteMany({
        where: { id: candidateId },
      });
    }
    await prisma.position.deleteMany({
      where: { id: { in: [position1Id, position2Id].filter(Boolean) } },
    });
    await prisma.interviewStep.deleteMany({
      where: { id: { in: [step1Id, step2Id].filter(Boolean) } },
    });
    await prisma.interviewFlow.deleteMany({
      where: { id: { in: [flow1Id, flow2Id].filter(Boolean) } },
    });
    await prisma.interviewType.deleteMany({
      where: { id: testTypeId },
    });
    if (testCompanyId) {
      await prisma.company.deleteMany({
        where: { id: testCompanyId },
      });
    }

    await prisma.$disconnect();
  });

  it('should return 400 for invalid candidate ID in path', async () => {
    const res = await request(app)
      .put('/candidates/invalid/stage')
      .send({ positionId: position1Id, interviewStepId: step1Id });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid ID format' });
  });

  it('should return 400 for missing or invalid parameters in body', async () => {
    const res1 = await request(app)
      .put(`/candidates/${candidateId}/stage`)
      .send({ positionId: position1Id });
    expect(res1.status).toBe(400);
    expect(res1.body).toEqual({ error: 'Invalid parameter format' });

    const res2 = await request(app)
      .put(`/candidates/${candidateId}/stage`)
      .send({ positionId: 'abc', interviewStepId: step1Id });
    expect(res2.status).toBe(400);
    expect(res2.body).toEqual({ error: 'Invalid parameter format' });
  });

  it('should return 404 if candidate is not found', async () => {
    const res = await request(app)
      .put('/candidates/999999/stage')
      .send({ positionId: position1Id, interviewStepId: step1Id });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Candidate not found' });
  });

  it('should return 404 if position is not found', async () => {
    const res = await request(app)
      .put(`/candidates/${candidateId}/stage`)
      .send({ positionId: 999999, interviewStepId: step1Id });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Position not found' });
  });

  it('should return 404 if application is not found', async () => {
    // candidate is valid, position2 is valid, but no application for candidate on position2
    const res = await request(app)
      .put(`/candidates/${candidateId}/stage`)
      .send({ positionId: position2Id, interviewStepId: step2Id });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Application not found' });
  });

  it('should return 400 if interview step does not belong to position flow', async () => {
    // candidate has application on position1 (Flow 1). But we try to update to step2 which belongs to Flow 2
    const res = await request(app)
      .put(`/candidates/${candidateId}/stage`)
      .send({ positionId: position1Id, interviewStepId: step2Id });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Interview step does not belong to position flow',
    });
  });

  it('should return 200 and successfully update the candidate stage', async () => {
    let step3: any;
    try {
      // To do happy path, let's create a new step3 belonging to Flow 1 and update to it
      step3 = await prisma.interviewStep.create({
        data: {
          name: 'Step 3 (Flow 1)',
          orderIndex: 2,
          interviewFlowId: flow1Id,
          interviewTypeId: testTypeId,
        },
      });

      const res = await request(app)
        .put(`/candidates/${candidateId}/stage`)
        .send({ positionId: position1Id, interviewStepId: step3.id });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'Stage updated successfully',
        candidateId: candidateId,
        interviewStepId: step3.id,
      });

      // Verify in db
      const appRecord = await prisma.application.findUnique({
        where: { id: applicationId },
      });
      expect(appRecord?.currentInterviewStep).toBe(step3.id);

      // Reset application back to step1Id to avoid foreign key violation when step3 is deleted
      await prisma.application.update({
        where: { id: applicationId },
        data: { currentInterviewStep: step1Id },
      });
    } finally {
      if (step3) {
        await prisma.application.update({
          where: { id: applicationId },
          data: { currentInterviewStep: step1Id },
        }).catch(() => {});
        // Clean up step3
        await prisma.interviewStep.delete({ where: { id: step3.id } });
      }
    }
  });
});
