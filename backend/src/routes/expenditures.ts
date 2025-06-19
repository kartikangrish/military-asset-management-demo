import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import type { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all expenditures
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

    const expenditures = await prisma.expenditure.findMany({
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
        expendedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json(expenditures);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching expenditures', error: error.message });
  }
});

// Create new expenditure
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
      return res.status(403).json({ message: 'You can only expend assets from your base' });
    }

    // Check if there are enough assets available
    const availableQuantity = await getAvailableQuantity(parseInt(assetId), asset.baseId);
    if (availableQuantity < parseInt(quantity)) {
      return res.status(400).json({ 
        message: 'Insufficient quantity available',
        available: availableQuantity,
        requested: parseInt(quantity)
      });
    }

    // Create expenditure
    const expenditure = await prisma.expenditure.create({
      data: {
        assetId: parseInt(assetId),
        baseId: asset.baseId,
        personnelId: parseInt(personnelId),
        quantity: parseInt(quantity),
        expendedById: req.user.id
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
        expendedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Log the expenditure
    await prisma.apiLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE',
        entity: 'EXPENDITURE',
        entityId: expenditure.id,
        details: `Expended ${quantity} units of asset ${assetId} by personnel ${personnelId}`
      }
    });

    res.json(expenditure);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating expenditure', error: error.message });
  }
});

// Helper function to get available quantity of an asset at a base
async function getAvailableQuantity(assetId: number, baseId: number): Promise<number> {
  // Get all transactions affecting this asset at this base
  const [
    purchases,
    transfersIn,
    transfersOut,
    assignments,
    expenditures
  ] = await Promise.all([
    prisma.purchase.aggregate({
      where: { assetId, baseId },
      _sum: { quantity: true }
    }),
    prisma.transfer.aggregate({
      where: { assetId, toBaseId: baseId },
      _sum: { quantity: true }
    }),
    prisma.transfer.aggregate({
      where: { assetId, fromBaseId: baseId },
      _sum: { quantity: true }
    }),
    prisma.assignment.aggregate({
      where: { assetId, baseId },
      _sum: { quantity: true }
    }),
    prisma.expenditure.aggregate({
      where: { assetId, baseId },
      _sum: { quantity: true }
    })
  ]);

  // Calculate available quantity
  const totalIn = (purchases._sum.quantity || 0) + (transfersIn._sum.quantity || 0);
  const totalOut = (transfersOut._sum.quantity || 0) + (assignments._sum.quantity || 0) + (expenditures._sum.quantity || 0);

  return totalIn - totalOut;
}

export default router; 