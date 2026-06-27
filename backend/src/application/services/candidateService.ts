import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { prisma } from '../../infrastructure/database/client';
import { AppError } from '../errors';

export const addCandidate = async (candidateData: any) => {
  try {
    validateCandidateData(candidateData);
  } catch (error: any) {
    throw error;
  }

  const candidate = new Candidate(candidateData); // Create a Candidate model instance
  try {
    const savedCandidate = await candidate.save(); // Save the candidate to the database
    return savedCandidate;
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint failed on the fields: (`email`)
      throw new Error('The email already exists in the database');
    } else {
      throw error;
    }
  }
};

export const findCandidateById = async (
  id: number,
): Promise<Candidate | null> => {
  try {
    const candidate = await Candidate.findOne(id);
    return candidate;
  } catch (error) {
    console.error('Error finding candidate:', error);
    throw new Error('Error retrieving candidate');
  }
};

export const updateCandidateStage = async (
  candidateId: number,
  positionId: number,
  interviewStepId: number,
) => {
  return await prisma.$transaction(async (tx) => {
    const application = await tx.application.findUnique({
      where: {
        positionId_candidateId: {
          positionId,
          candidateId,
        },
      },
      select: {
        id: true,
        position: {
          select: {
            interviewFlowId: true,
          },
        },
      },
    });

    if (!application) {
      const candidateExists = await tx.candidate.findUnique({ where: { id: candidateId }, select: { id: true } });
      if (!candidateExists) throw new AppError('Candidate not found', 'NOT_FOUND');
      const positionExists = await tx.position.findUnique({ where: { id: positionId }, select: { id: true } });
      if (!positionExists) throw new AppError('Position not found', 'NOT_FOUND');
      throw new AppError('Application not found', 'NOT_FOUND');
    }

    const interviewStep = await tx.interviewStep.findFirst({
      where: {
        id: interviewStepId,
        interviewFlowId: application.position.interviewFlowId,
      },
      select: { id: true },
    });

    if (!interviewStep) {
      throw new AppError('Interview step does not belong to position flow', 'VALIDATION');
    }

    await tx.application.update({
      where: { id: application.id },
      data: { currentInterviewStep: interviewStepId },
    });
  });
};
