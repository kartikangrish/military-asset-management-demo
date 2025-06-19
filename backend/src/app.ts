import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import { authenticateJWT, AuthRequest } from './middleware/auth';
import { authorize } from './middleware/rbac';
import assetsRouter from './routes/assets';
import purchasesRouter from './routes/purchases';
import transfersRouter from './routes/transfers';
import dashboardRouter from './routes/dashboard';
import basesRouter from './routes/bases';
import assignmentsRouter from './routes/assignments';
import expendituresRouter from './routes/expenditures';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://frontend-dzrjus2wz-kartiks-projects-3f634b70.vercel.app',
    'https://*.vercel.app',
    'https://*.netlify.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Military Asset Management API', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/transfers', transfersRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/bases', basesRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/expenditures', expendituresRouter);

// Example protected route
app.get('/api/protected', authenticateJWT, authorize(['Admin', 'Base Commander', 'Logistics Officer']), (req: AuthRequest, res) => {
  res.json({ message: 'You have access!', user: req.user });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 