import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// PATCH /api/user/learning-style
export async function PATCH(request) {
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
    if (user.role !== 'STUDENT') {
      return Response.json({ error: 'Unauthorized: not a student' }, { status: 401 });
    }
    const { learningStyle } = await request.json();

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: { learningStyle },
      select: { id: true, learningStyle: true }
    });
    return Response.json({ success: true, user: updated });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
