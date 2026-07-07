import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/user/me
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return Response.json({ error: 'Unauthorized: token missing' }, { status: 401 });
    }
    let user;
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return Response.json({ error: 'Unauthorized: invalid token' }, { status: 401 });
    }
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true, name: true, email: true, role: true, learningStyle: true }
    });
    if (!dbUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    return Response.json(dbUser);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// PUT /api/user/me
export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return Response.json({ error: 'Unauthorized: token missing' }, { status: 401 });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return Response.json({ error: 'Unauthorized: invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, learningStyle } = body;

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser && existingUser.id !== decoded.userId) {
        return Response.json({ error: 'Email sudah terdaftar oleh pengguna lain' }, { status: 400 });
      }
      dataToUpdate.email = email;
    }
    
    if (password) {
      const bcrypt = await import('bcrypt');
      dataToUpdate.password = await bcrypt.default.hash(password, 10);
    }
    
    if (learningStyle) {
      if (['VISUAL', 'AUDITORY', 'KINESTHETIC'].includes(learningStyle.toUpperCase())) {
        dataToUpdate.learningStyle = learningStyle.toUpperCase();
      } else {
        return Response.json({ error: 'Gaya belajar tidak valid' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, role: true, learningStyle: true }
    });

    return Response.json({ message: 'Profil berhasil diperbarui', user: updatedUser });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
