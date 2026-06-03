import { Router, Request, Response } from 'express';
import Appointment from '../models/Appointment';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const appointments = await Appointment.find({ userId: decoded.userId }).sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const appointment = new Appointment({ ...req.body, userId: decoded.userId });
    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: decoded.userId },
      req.body,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    await Appointment.findOneAndDelete({ _id: req.params.id, userId: decoded.userId });

    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/upcoming', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const today = new Date();

    const appointments = await Appointment.find({
      userId: decoded.userId,
      date: { $gte: today },
      status: 'upcoming',
    }).sort({ date: 1 }).limit(5);

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
