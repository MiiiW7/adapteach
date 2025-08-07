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
