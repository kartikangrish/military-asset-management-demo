import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import type { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// List purchases with filters
router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { baseId, assetType, startDate, endDate } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.baseId;

    let purchases;
    const where: any = {
      ...(startDate && { date: { gte: new Date(startDate as string) } }),
      ...(endDate && { date: { lte: new Date(endDate as string) } }),
    };

    // Base Commander can only see their base's purchases
    if (userRole === 'Base Commander' && userBaseId) {
      where.baseId = userBaseId;
    } else if (baseId) {
      where.baseId = parseInt(baseId as string);
    }

    if (assetType) {
      where.asset = { type: assetType as string };
    }

    purchases = await prisma.purchase.findMany({
      where,
      include: {
        asset: true,
        base: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(purchases);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching purchases', error: error.message });
  }
});

// Create new purchase
router.post('/', authenticateJWT, authorize(['Admin', 'Logistics Officer']), async (req: AuthRequest, res) => {
  try {
    const { assetId, baseId, quantity } = req.body;

    // Validate base access for Base Commander
    if (req.user.role === 'Base Commander' && req.user.baseId !== parseInt(baseId)) {
      return res.status(403).json({ message: 'You can only create purchases for your assigned base' });
    }

    const purchase = await prisma.purchase.create({
      data: {
        assetId: parseInt(assetId),
        baseId: parseInt(baseId),
        quantity: parseInt(quantity),
        createdById: req.user.id,
      },
      include: {
        asset: true,
        base: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log the purchase
    await prisma.apiLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE',
        entity: 'PURCHASE',
        entityId: purchase.id,
        details: `Purchased ${quantity} units of asset ${assetId} for base ${baseId}`,
      },
    });

    res.json(purchase);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating purchase', error: error.message });
  }
});

export default router; 