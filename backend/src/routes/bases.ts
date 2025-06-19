import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all bases
router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const userRole = req.user.role;
    const userBaseId = req.user.baseId;

    let bases;
    if (userRole === 'Base Commander' && userBaseId) {
      // Base commanders can only see their own base
      bases = await prisma.base.findMany({
        where: {
          id: userBaseId
        }
      });
    } else {
      // Admins and Logistics Officers can see all bases
      bases = await prisma.base.findMany();
    }
    
    res.json(bases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bases', error });
  }
});

export default router; 