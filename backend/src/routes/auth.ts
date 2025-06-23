import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  console.log('Login attempt received:', { email: req.body.email, hasPassword: !!req.body.password });
  
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        base: true,
        role: true
      },
    });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User found:', { id: user.id, email: user.email, role: user.role.name });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('Password valid, generating token for user:', email);
    
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
    
    const response = { 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        baseId: user.baseId,
      }
    };
    
    console.log('Login successful for user:', email);
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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