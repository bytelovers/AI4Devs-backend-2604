import { Request, Response } from 'express';
import {
  addCandidate,
  findCandidateById,
  updateCandidateStage as updateCandidateStageService,
} from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
  try {
    const candidateData = req.body;
    const candidate = await addCandidate(candidateData);
    res
      .status(201)
      .json({ message: 'Candidate added successfully', data: candidate });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: 'Error adding candidate', error: error.message });
    } else {
      res
        .status(400)
        .json({ message: 'Error adding candidate', error: 'Unknown error' });
    }
  }
};

export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const candidate = await findCandidateById(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { addCandidate };

export const updateCandidateStage = async (req: Request, res: Response) => {
  const candidateId = parseInt(req.params.id, 10);
  if (isNaN(candidateId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const { positionId, interviewStepId } = req.body;

  if (
    positionId === undefined ||
    positionId === null ||
    interviewStepId === undefined ||
    interviewStepId === null
  ) {
    return res.status(400).json({ error: 'Invalid parameter format' });
  }

  const parsedPositionId = parseInt(positionId, 10);
  const parsedInterviewStepId = parseInt(interviewStepId, 10);

  if (isNaN(parsedPositionId) || isNaN(parsedInterviewStepId)) {
    return res.status(400).json({ error: 'Invalid parameter format' });
  }

  try {
    await updateCandidateStageService(
      candidateId,
      parsedPositionId,
      parsedInterviewStepId,
    );
    return res.status(200).json({
      message: 'Stage updated successfully',
      candidateId,
      interviewStepId: parsedInterviewStepId,
    });
  } catch (error: any) {
    const msg = error.message;
    if (
      msg === 'Candidate not found' ||
      msg === 'Position not found' ||
      msg === 'Application not found'
    ) {
      return res.status(404).json({ error: msg });
    }
    if (msg === 'Interview step does not belong to position flow') {
      return res.status(400).json({ error: msg });
    }
    return res.status(500).json({ error: msg || 'Internal Server Error' });
  }
};
