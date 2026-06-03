import { Router, Request, Response } from 'express';
import HealthRecord from '../models/HealthRecord';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const records = await HealthRecord.find({ userId: decoded.userId }).sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const record = new HealthRecord({ ...req.body, userId: decoded.userId });
    await record.save();

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    await HealthRecord.findOneAndDelete({ _id: req.params.id, userId: decoded.userId });

    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
