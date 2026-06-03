import express from 'express';
import cors from 'cors';
import next from 'next';
import dotenv from 'dotenv';
import connectDB from './backend/config/db';
import authRoutes from './backend/routes/auth';
import medicineRoutes from './backend/routes/medicines';
import appointmentRoutes from './backend/routes/appointments';
import recordRoutes from './backend/routes/records';
import familyRoutes from './backend/routes/family';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const server = express();

server.use(cors());
server.use(express.json());

server.use('/api/auth', authRoutes);
server.use('/api/medicines', medicineRoutes);
server.use('/api/appointments', appointmentRoutes);
server.use('/api/records', recordRoutes);
server.use('/api/family', familyRoutes);

server.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

server.use((req, res) => {
  return handle(req, res);
});

const start = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await nextApp.prepare();
    console.log('Next.js prepared');

    server.listen(port, () => {
      console.log(`> MediTime ready on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
