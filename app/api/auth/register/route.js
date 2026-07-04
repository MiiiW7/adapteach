import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    // Cek user existing by email (unique)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || undefined, // kalau null, pakai default (STUDENT)
      },
    });

    // Generate JWT token with user data
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        name: newUser.name || newUser.email.split('@')[0],
        role: newUser.role || 'STUDENT'
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Jangan kirim hash ke client
    const { password: _, ...userWithoutPassword } = newUser;

    return Response.json({ 
      user: userWithoutPassword, 
      token 
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Failed to register user' }, { status: 500 });
  }
}

