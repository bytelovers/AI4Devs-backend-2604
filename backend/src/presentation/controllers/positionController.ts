import { Request, Response } from 'express';
import { getCandidatesByPosition as getCandidatesByPositionService } from '../../application/services/positionService';
import { isValidId, parsePositiveIntParam } from '../utils/validation';

export const getCandidatesByPosition = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    if (!isValidId(idParam)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const positionId = parseInt(idParam, 10);

    let take = 100;
    let skip = 0;

    if (req.query.limit !== undefined) {
      const result = parsePositiveIntParam(req.query.limit);
      if (!result.ok) {
        return res.status(400).json({ error: 'Invalid limit parameter' });
      }
      if (result.value > 100) {
        return res.status(400).json({ error: 'Invalid limit parameter' });
      }
      take = result.value;
    }

    if (req.query.offset !== undefined) {
      const result = parsePositiveIntParam(req.query.offset);
      if (!result.ok) {
        return res.status(400).json({ error: 'Invalid offset parameter' });
      }
      skip = result.value;
    }

    const result = await getCandidatesByPositionService(positionId, take, skip);
    if (result === null) {
      return res.status(404).json({ error: 'Position not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getCandidatesByPosition controller:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
