import { Router, Request, Response } from 'express';
import FamilyMember from '../models/FamilyMember';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const members = await FamilyMember.find({ userId: decoded.userId });

    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const member = new FamilyMember({ ...req.body, userId: decoded.userId });
    await member.save();

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const member = await FamilyMember.findOneAndUpdate(
      { _id: req.params.id, userId: decoded.userId },
      req.body,
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ error: 'Family member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    await FamilyMember.findOneAndDelete({ _id: req.params.id, userId: decoded.userId });

    res.json({ message: 'Family member removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
