import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import type { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all assets (filtered by base for Base Commander)
router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { baseId, type } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.baseId;

    let assets;
    if (userRole === 'Base Commander' && userBaseId) {
      // Base commanders can only see their base's assets
      assets = await prisma.asset.findMany({
        where: {
          baseId: userBaseId,
          ...(type && { type: type as string }),
        },
        include: {
          base: true,
        },
      });
    } else {
      // Admins and Logistics Officers can see all assets with optional base filter
      assets = await prisma.asset.findMany({
        where: {
          ...(baseId && { baseId: parseInt(baseId as string) }),
          ...(type && { type: type as string }),
        },
        include: {
          base: true,
        },
      });
    }
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error });
  }
});

// Create new asset (Admin only)
router.post('/', authenticateJWT, authorize(['Admin']), async (req: AuthRequest, res) => {
  try {
    const { type, serial, description, baseId } = req.body;
    const asset = await prisma.asset.create({
      data: {
        type,
        serial,
        description,
        baseId: parseInt(baseId),
      },
      include: {
        base: true,
      },
    });

    // Log the creation
    await prisma.apiLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE',
        entity: 'ASSET',
        entityId: asset.id,
        details: `Created ${type} asset with serial ${serial}`,
      },
    });

    res.json(asset);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Asset with this serial number already exists' });
    } else {
      res.status(500).json({ message: 'Error creating asset', error: error.message });
    }
  }
});

// Get asset by ID
router.get('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const asset = await prisma.asset.findUnique({
      where: { id: parseInt(id) },
      include: {
        base: true,
        purchases: true,
        transfers: true,
        assignments: true,
        expenditures: true,
      },
    });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Check if user has access to this asset
    if (req.user.role === 'Base Commander' && req.user.baseId !== asset.baseId) {
      return res.status(403).json({ message: 'Access denied to this asset' });
    }

    res.json(asset);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching asset', error: error.message });
  }
});

// Update asset (Admin only)
router.put('/:id', authenticateJWT, authorize(['Admin']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { type, description, baseId } = req.body;
    const asset = await prisma.asset.update({
      where: { id: parseInt(id) },
      data: {
        type,
        description,
        baseId: parseInt(baseId),
      },
      include: {
        base: true,
      },
    });

    // Log the update
    await prisma.apiLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE',
        entity: 'ASSET',
        entityId: asset.id,
        details: `Updated ${type} asset`,
      },
    });

    res.json(asset);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating asset', error: error.message });
  }
});

export default router; 