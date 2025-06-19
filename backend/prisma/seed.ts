import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create roles if not exist
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin' },
  });

  const baseCommanderRole = await prisma.role.upsert({
    where: { name: 'Base Commander' },
    update: {},
    create: { name: 'Base Commander' },
  });

  const logisticsOfficerRole = await prisma.role.upsert({
    where: { name: 'Logistics Officer' },
    update: {},
    create: { name: 'Logistics Officer' },
  });

  // Create bases
  const bases = [
    { name: 'HQ', location: 'Central Command' },
    { name: 'Northern Base', location: 'Northern Region' },
    { name: 'Southern Base', location: 'Southern Region' },
    { name: 'Eastern Base', location: 'Eastern Region' },
    { name: 'Western Base', location: 'Western Region' },
  ];

  const createdBases = [];
  for (const baseData of bases) {
    const base = await prisma.base.upsert({
      where: { name: baseData.name },
      update: { location: baseData.location },
      create: baseData,
    });
    createdBases.push(base);
  }

  // Create admin user
  const password = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@military.local' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@military.local',
      password,
      roleId: adminRole.id,
      baseId: createdBases[0].id, // HQ
    },
  });

  // Create test assets
  const assetTypes = ['Vehicle', 'Weapon', 'Ammunition', 'Equipment'];
  const assets = [];
  
  for (let i = 0; i < 10; i++) {
    const asset = await prisma.asset.create({
      data: {
        type: assetTypes[i % assetTypes.length],
        serial: `ASSET-${i + 1}`,
        description: `Test Asset ${i + 1}`,
        baseId: createdBases[0].id, // Initially all assets at HQ
      },
    });
    assets.push(asset);
  }

  // Create test purchases
  for (let i = 0; i < 5; i++) {
    await prisma.purchase.create({
      data: {
        assetId: assets[i].id,
        baseId: createdBases[0].id,
        quantity: 10,
        createdById: adminUser.id,
        date: new Date(2025, 5, 1), // June 1, 2025
      },
    });
  }

  // Create test transfers
  await prisma.transfer.create({
    data: {
      assetId: assets[0].id,
      fromBaseId: createdBases[0].id,
      toBaseId: createdBases[1].id,
      quantity: 3,
      createdById: adminUser.id,
      date: new Date(2025, 5, 5), // June 5, 2025
    },
  });

  // Create test assignments
  await prisma.assignment.create({
    data: {
      assetId: assets[1].id,
      baseId: createdBases[0].id,
      personnelId: adminUser.id,
      assignedById: adminUser.id,
      quantity: 2,
      date: new Date(2025, 5, 10), // June 10, 2025
    },
  });

  // Create test expenditures
  await prisma.expenditure.create({
    data: {
      assetId: assets[2].id,
      baseId: createdBases[0].id,
      personnelId: adminUser.id,
      expendedById: adminUser.id,
      quantity: 1,
      date: new Date(2025, 5, 15), // June 15, 2025
    },
  });

  console.log('Database seeded with:');
  console.log('- Admin user: admin@military.local / admin123');
  console.log('- Bases: HQ, Northern Base, Southern Base, Eastern Base, Western Base');
  console.log('- Test assets, purchases, transfers, assignments, and expenditures');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect()); 