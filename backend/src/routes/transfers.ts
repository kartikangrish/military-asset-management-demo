import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import type { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// List transfers with filters
router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { baseId, assetType, startDate, endDate } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.baseId;

    let transfers;
    const where: any = {
      ...(startDate && { date: { gte: new Date(startDate as string) } }),
      ...(endDate && { date: { lte: new Date(endDate as string) } }),
    };

    // Base Commander can only see transfers involving their base
    if (userRole === 'Base Commander' && userBaseId) {
      where.OR = [
        { fromBaseId: userBaseId },
        { toBaseId: userBaseId },
      ];
    } else if (baseId) {
      where.OR = [
        { fromBaseId: parseInt(baseId as string) },
        { toBaseId: parseInt(baseId as string) },
      ];
    }

    if (assetType) {
      where.asset = { type: assetType as string };
    }

    transfers = await prisma.transfer.findMany({
      where,
      include: {
        asset: true,
        fromBase: true,
        toBase: true,
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

    res.json(transfers);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching transfers', error: error.message });
  }
});

// Create new transfer
router.post('/', authenticateJWT, authorize(['Admin', 'Logistics Officer']), async (req: AuthRequest, res) => {
  const { assetId, fromBaseId, toBaseId, quantity } = req.body;

  // Validate base access for Base Commander
  if (req.user.role === 'Base Commander') {
    if (req.user.baseId !== parseInt(fromBaseId) && req.user.baseId !== parseInt(toBaseId)) {
      return res.status(403).json({ message: 'You can only create transfers involving your assigned base' });
    }
  }

  try {
    // Start a transaction
    const transfer = await prisma.$transaction(async (tx) => {
      // Check if source base has enough quantity
      const asset = await tx.asset.findUnique({
        where: { id: parseInt(assetId) },
        include: {
          purchases: { where: { baseId: parseInt(fromBaseId) } },
          transfers: {
            where: {
              OR: [
                { fromBaseId: parseInt(fromBaseId) },
                { toBaseId: parseInt(fromBaseId) }
              ]
            }
          }
        },
      });

      if (!asset) {
        throw new Error('Asset not found');
      }

      // Calculate current quantity at source base
      const purchased = asset.purchases.reduce((sum: number, p: { quantity: number }) => sum + p.quantity, 0);
      const transferredOut = asset.transfers
        .filter(t => t.fromBaseId === parseInt(fromBaseId))
        .reduce((sum: number, t: { quantity: number }) => sum + t.quantity, 0);
      const transferredIn = asset.transfers
        .filter(t => t.toBaseId === parseInt(fromBaseId))
        .reduce((sum: number, t: { quantity: number }) => sum + t.quantity, 0);
      const currentQuantity = purchased + transferredIn - transferredOut;

      if (currentQuantity < parseInt(quantity)) {
        throw new Error('Insufficient quantity at source base');
      }

      // Create the transfer
      const newTransfer = await tx.transfer.create({
        data: {
          assetId: parseInt(assetId),
          fromBaseId: parseInt(fromBaseId),
          toBaseId: parseInt(toBaseId),
          quantity: parseInt(quantity),
          createdById: req.user.id,
        },
        include: {
          asset: true,
          fromBase: true,
          toBase: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Log the transfer
      await tx.apiLog.create({
        data: {
          userId: req.user.id,
          action: 'CREATE',
          entity: 'TRANSFER',
          entityId: newTransfer.id,
          details: `Transferred ${quantity} units of asset ${assetId} from base ${fromBaseId} to base ${toBaseId}`,
        },
      });

      return newTransfer;
    });

    res.json(transfer);
  } catch (error: any) {
    if (error.message === 'Insufficient quantity at source base') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error creating transfer', error: error.message });
    }
  }
});

export default router; 