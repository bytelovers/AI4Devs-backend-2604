import { prisma } from '../../infrastructure/database/client';

interface CandidateSummary {
  id: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number | null;
}

export const getCandidatesByPosition = async (
  positionId: number,
  take?: number,
  skip?: number
): Promise<CandidateSummary[] | null> => {
  const positionExists = await prisma.position.findUnique({ where: { id: positionId }, select: { id: true } });
  if (!positionExists) {
    return null;
  }

  // Use Prisma Client to query application where positionId = positionId
  const applications = await prisma.application.findMany({
    where: {
      positionId: positionId,
    },
    take: take,
    skip: skip,
    orderBy: { id: 'asc' },
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
    const currentInterviewStep = app.interviewStep.name;

    // Extract non-null interview scores
    const nonNullScores = app.interviews
      .map((i) => i.score)
      .filter(
        (score): score is number => score !== null && score !== undefined,
      );

    // Calculate arithmetic average score
    const averageScore =
      nonNullScores.length > 0
        ? nonNullScores.reduce((sum, score) => sum + score, 0) /
          nonNullScores.length
        : null;

    return {
      id: candidate.id,
      fullName: fullName,
      currentInterviewStep: currentInterviewStep,
      averageScore: averageScore,
    };
  });
};
