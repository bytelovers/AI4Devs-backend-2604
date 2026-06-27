import { Request, Response } from 'express';
import { getCandidatesByPosition as getCandidatesByPositionService } from '../../application/services/positionService';

export const getCandidatesByPosition = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.id, 10);
    if (isNaN(positionId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const result = await getCandidatesByPositionService(positionId);
    if (result === null) {
      return res.status(404).json({ error: 'Position not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getCandidatesByPosition controller:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
