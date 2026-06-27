import { Request, Response } from 'express';
import {
  addCandidate,
  findCandidateById,
  updateCandidateStage as updateCandidateStageService,
} from '../../application/services/candidateService';
import { isValidId } from '../utils/validation';

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
    const idParam = req.params.id;
    if (!isValidId(idParam)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const id = parseInt(idParam, 10);
    const candidate = await findCandidateById(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const updateCandidateStage = async (req: Request, res: Response) => {
  const idParam = req.params.id;
  if (!isValidId(idParam)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  const candidateId = parseInt(idParam, 10);

  const { positionId, interviewStepId } = req.body || {};

  if (!isValidId(positionId) || !isValidId(interviewStepId)) {
    return res.status(400).json({ error: 'Invalid parameter format' });
  }

  const parsedPositionId = typeof positionId === 'number' ? positionId : parseInt(positionId, 10);
  const parsedInterviewStepId = typeof interviewStepId === 'number' ? interviewStepId : parseInt(interviewStepId, 10);

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
    const msg = error instanceof Error ? error.message : String(error);
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
    console.error('Unhandled error in updateCandidateStage:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
