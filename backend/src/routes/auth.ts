import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await prisma.user.findUnique({
    where: { email },
    include: { 
      base: true,
      role: true
    },
  });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role.name,
      baseId: user.baseId,
    },
    process.env.JWT_SECRET || '',
    { expiresIn: '8h' }
  );
  res.json({ 
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      baseId: user.baseId,
    }
  });
});

// Add a route to create an admin user
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Get or create Admin role
    let adminRole = await prisma.role.findUnique({
      where: { name: 'Admin' },
    });

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { name: 'Admin' },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with Admin role
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: {
          connect: { id: adminRole.id }
        }
      },
      include: {
        role: true
      }
    });

    res.json({ 
      message: 'Admin user created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

export default router; 