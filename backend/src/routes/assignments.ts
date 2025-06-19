import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import type { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all assignments
router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { baseId, assetType, startDate, endDate } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.baseId;

    // Build where clause
    const where: any = {
      ...(userRole === 'Base Commander' ? { baseId: userBaseId } : {}),
      ...(baseId ? { baseId: parseInt(baseId as string) } : {}),
      ...(assetType ? { asset: { type: assetType as string } } : {}),
      ...(startDate ? { date: { gte: new Date(startDate as string) } } : {}),
      ...(endDate ? { date: { lte: new Date(endDate as string) } } : {})
    };

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        asset: true,
        personnel: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        base: true,
        assignedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
});

// Create new assignment
router.post('/', authenticateJWT, authorize(['Admin', 'Base Commander']), async (req: AuthRequest, res) => {
  try {
    const { assetId, personnelId, quantity } = req.body;
    const userBaseId = req.user.baseId;

    // Verify asset belongs to user's base
    const asset = await prisma.asset.findUnique({
      where: { id: parseInt(assetId) }
    });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    if (req.user.role === 'Base Commander' && asset.baseId !== userBaseId) {
      return res.status(403).json({ message: 'You can only assign assets from your base' });
    }

    // Create assignment
    const assignment = await prisma.assignment.create({
      data: {
        assetId: parseInt(assetId),
        baseId: asset.baseId,
        personnelId: parseInt(personnelId),
        quantity: parseInt(quantity),
        assignedById: req.user.id
      },
      include: {
        asset: true,
        personnel: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        base: true,
        assignedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Log the assignment
    await prisma.apiLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE',
        entity: 'ASSIGNMENT',
        entityId: assignment.id,
        details: `Assigned ${quantity} units of asset ${assetId} to personnel ${personnelId}`
      }
    });

    res.json(assignment);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating assignment', error: error.message });
  }
});

export default router; 