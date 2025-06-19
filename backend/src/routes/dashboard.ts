import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get dashboard metrics
router.get('/metrics', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate, baseId, assetType } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.baseId;

    // Base Commander can only see their base's metrics
    const effectiveBaseId = userRole === 'Base Commander' ? userBaseId : (baseId ? parseInt(baseId as string) : undefined);

    // Build common where clause for filtering
    const commonWhereClause = {
      ...(assetType && { 
        asset: { type: assetType }
      }),
      ...(startDate && endDate && {
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      })
    };

    // Get purchases
    const purchases = await prisma.purchase.findMany({
      where: {
        ...commonWhereClause,
        ...(effectiveBaseId && { baseId: effectiveBaseId })
      },
      include: {
        asset: true
      }
    });

    // Get transfers
    const transfersIn = await prisma.transfer.findMany({
      where: {
        ...commonWhereClause,
        ...(effectiveBaseId && { toBaseId: effectiveBaseId })
      },
      include: {
        asset: true
      }
    });

    const transfersOut = await prisma.transfer.findMany({
      where: {
        ...commonWhereClause,
        ...(effectiveBaseId && { fromBaseId: effectiveBaseId })
      },
      include: {
        asset: true
      }
    });

    // Get assignments
    const assignments = await prisma.assignment.findMany({
      where: {
        ...commonWhereClause,
        ...(effectiveBaseId && { baseId: effectiveBaseId })
      },
      include: {
        asset: true
      }
    });

    // Get expenditures
    const expenditures = await prisma.expenditure.findMany({
      where: {
        ...commonWhereClause,
        ...(effectiveBaseId && { baseId: effectiveBaseId })
      },
      include: {
        asset: true
      }
    });

    // Calculate metrics
    const purchasesTotal = purchases.reduce((sum, p) => sum + p.quantity, 0);
    const transfersInTotal = transfersIn.reduce((sum, t) => sum + t.quantity, 0);
    const transfersOutTotal = transfersOut.reduce((sum, t) => sum + t.quantity, 0);
    const assignedTotal = assignments.reduce((sum, a) => sum + a.quantity, 0);
    const expendedTotal = expenditures.reduce((sum, e) => sum + e.quantity, 0);

    // Calculate opening and closing balances
    const netMovement = purchasesTotal + transfersInTotal - transfersOutTotal;
    const openingBalance = await calculateOpeningBalance(effectiveBaseId, startDate as string);
    const closingBalance = openingBalance + netMovement - expendedTotal;

    const metrics = {
      openingBalance,
      closingBalance,
      netMovement: {
        total: netMovement,
        purchases: purchasesTotal,
        transfersIn: transfersInTotal,
        transfersOut: transfersOutTotal
      },
      assigned: assignedTotal,
      expended: expendedTotal
    };

    res.json(metrics);
  } catch (error: any) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ message: 'Error fetching dashboard metrics', error: error.message });
  }
});

// Helper function to calculate opening balance
async function calculateOpeningBalance(baseId: number | undefined, startDate: string): Promise<number> {
  if (!baseId || !startDate) return 0;

  const beforeStartDate = new Date(startDate);

  // Get all transactions before start date
  const [purchases, transfersIn, transfersOut, expenditures] = await Promise.all([
    prisma.purchase.aggregate({
      where: {
        baseId,
        date: { lt: beforeStartDate }
      },
      _sum: { quantity: true }
    }),
    prisma.transfer.aggregate({
      where: {
        toBaseId: baseId,
        date: { lt: beforeStartDate }
      },
      _sum: { quantity: true }
    }),
    prisma.transfer.aggregate({
      where: {
        fromBaseId: baseId,
        date: { lt: beforeStartDate }
      },
      _sum: { quantity: true }
    }),
    prisma.expenditure.aggregate({
      where: {
        baseId,
        date: { lt: beforeStartDate }
      },
      _sum: { quantity: true }
    })
  ]);

  // Calculate opening balance
  const totalPurchases = purchases._sum.quantity || 0;
  const totalTransfersIn = transfersIn._sum.quantity || 0;
  const totalTransfersOut = transfersOut._sum.quantity || 0;
  const totalExpenditures = expenditures._sum.quantity || 0;

  return totalPurchases + totalTransfersIn - totalTransfersOut - totalExpenditures;
}

export default router;