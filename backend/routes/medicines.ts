import { Router, Request, Response } from 'express';
import Medicine from '../models/Medicine';
import MedicineSchedule from '../models/MedicineSchedule';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const medicines = await Medicine.find({ userId: decoded.userId, isActive: true }).sort({ createdAt: -1 });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const medicine = new Medicine({ ...req.body, userId: decoded.userId });
    await medicine.save();

    const startDate = new Date(req.body.duration.startDate);
    const endDate = req.body.duration.endDate ? new Date(req.body.duration.endDate) : new Date();
    endDate.setDate(endDate.getDate() + 30);

    const schedules = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      for (const time of req.body.times) {
        const [hours, minutes] = time.split(':').map(Number);
        const scheduledTime = new Date(currentDate);
        scheduledTime.setHours(hours, minutes, 0, 0);

        if (scheduledTime > new Date()) {
          schedules.push({
            userId: decoded.userId,
            medicineId: medicine._id,
            scheduledTime,
            status: 'pending',
          });
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (schedules.length > 0) {
      await MedicineSchedule.insertMany(schedules);
    }

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: decoded.userId },
      req.body,
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: decoded.userId },
      { isActive: false }
    );

    res.json({ message: 'Medicine deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/schedule/today', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const schedules = await MedicineSchedule.find({
      userId: decoded.userId,
      scheduledTime: { $gte: today, $lt: tomorrow },
    }).populate('medicineId');

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/schedule/:id/status', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const { status, notes } = req.body;

    const schedule = await MedicineSchedule.findOneAndUpdate(
      { _id: req.params.id, userId: decoded.userId },
      { status, takenAt: status === 'taken' ? new Date() : undefined, notes },
      { new: true }
    ).populate('medicineId');

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    if (status === 'taken' && schedule.medicineId) {
      await Medicine.findByIdAndUpdate(schedule.medicineId, {
        $inc: { remainingQuantity: -1 },
      });
    }

    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = verifyToken(token);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await MedicineSchedule.aggregate([
      {
        $match: {
          userId: decoded.userId,
          scheduledTime: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = stats.reduce((acc, stat) => acc + stat.count, 0);
    const taken = stats.find((s) => s._id === 'taken')?.count || 0;
    const adherence = total > 0 ? Math.round((taken / total) * 100) : 0;

    res.json({ stats, adherence, total, taken });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
