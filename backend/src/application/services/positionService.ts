import { PrismaClient } from '@prisma/client';
import { Position } from '../../domain/models/Position';

const prisma = new PrismaClient();

export const getCandidatesByPosition = async (positionId: number) => {
  // Validate if the Position exists in the database
  const positionExists = await Position.findOne(positionId);
  if (!positionExists) {
    return null;
  }

  // Use Prisma Client to query application where positionId = positionId
  const applications = await prisma.application.findMany({
    where: {
      positionId: positionId,
    },
    select: {
      candidate: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      interviewStep: {
        select: {
          name: true,
        },
      },
      interviews: {
        select: {
          score: true,
        },
      },
    },
  });

  // Map the results and compute average score
  return applications.map((app) => {
    const candidate = app.candidate;
    const fullName = `${candidate.firstName} ${candidate.lastName}`;
    const current_interview_step = app.interviewStep.name;

    // Extract non-null interview scores
    const nonNullScores = app.interviews
      .map((i) => i.score)
      .filter(
        (score): score is number => score !== null && score !== undefined,
      );

    // Calculate arithmetic average score
    const average_score =
      nonNullScores.length > 0
        ? nonNullScores.reduce((sum, score) => sum + score, 0) /
          nonNullScores.length
        : null;

    return {
      id: candidate.id,
      fullName: fullName,
      current_interview_step: current_interview_step,
      average_score: average_score,
    };
  });
};
