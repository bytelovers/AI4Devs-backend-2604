import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { prisma } from '../../infrastructure/database/client';

export const addCandidate = async (candidateData: any) => {
  try {
    validateCandidateData(candidateData); // Validar los datos del candidato
  } catch (error: any) {
    throw new Error(error);
  }

  const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
  try {
    const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
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
    const candidate = await Candidate.findOne(id); // Cambio aquí: pasar directamente el id
    return candidate;
  } catch (error) {
    console.error('Error al buscar el candidato:', error);
    throw new Error('Error al recuperar el candidato');
  }
};

export const updateCandidateStage = async (
  candidateId: number,
  positionId: number,
  interviewStepId: number,
) => {
  const application = await prisma.application.findUnique({
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
    const candidateExists = await prisma.candidate.findUnique({ where: { id: candidateId }, select: { id: true } });
    if (!candidateExists) throw new Error('Candidate not found');
    const positionExists = await prisma.position.findUnique({ where: { id: positionId }, select: { id: true } });
    if (!positionExists) throw new Error('Position not found');
    throw new Error('Application not found');
  }

  const interviewStep = await prisma.interviewStep.findFirst({
    where: {
      id: interviewStepId,
      interviewFlowId: application.position.interviewFlowId,
    },
    select: { id: true },
  });

  if (!interviewStep) {
    throw new Error('Interview step does not belong to position flow');
  }

  await prisma.application.update({
    where: { id: application.id },
    data: { currentInterviewStep: interviewStepId },
  });
};
