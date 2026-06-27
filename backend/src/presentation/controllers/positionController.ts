import { Request, Response } from 'express';
import { getCandidatesByPosition as getCandidatesByPositionService } from '../../application/services/positionService';
import { isValidId } from '../utils/validation';

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
      const limitStr = String(req.query.limit);
      if (!/^\d+$/.test(limitStr)) {
        return res.status(400).json({ error: 'Invalid limit parameter' });
      }
      const parsedLimit = parseInt(limitStr, 10);
      if (parsedLimit <= 0 || parsedLimit > 2147483647) {
        return res.status(400).json({ error: 'Invalid limit parameter' });
      }
      const limitVal = Math.min(parsedLimit, 100);
      take = limitVal;
    }

    if (req.query.offset !== undefined) {
      const offsetStr = String(req.query.offset);
      if (!/^\d+$/.test(offsetStr)) {
        return res.status(400).json({ error: 'Invalid offset parameter' });
      }
      const offsetVal = parseInt(offsetStr, 10);
      if (offsetVal < 0 || offsetVal > 2147483647) {
        return res.status(400).json({ error: 'Invalid offset parameter' });
      }
      skip = offsetVal;
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
