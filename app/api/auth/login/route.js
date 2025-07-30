import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token with user data
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name || user.email.split('@')[0],
        role: user.role || 'student'
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    return Response.json({
      user: userWithoutPassword,
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
