import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/my-courses
export async function GET(request) {
  try {
    // Ambil token dari header Authorization
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
    const userId = user.userId;
    // Ambil semua kelas yang diikuti siswa dengan informasi teacher
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { 
        course: {
          include: {
            teacher: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    // Map ke info course dengan teacher
    const courses = enrollments.map(e => ({
      id: e.course.id,
      title: e.course.title,
      description: e.course.description,
      code: e.course.code,
      createdAt: e.course.createdAt,
      instructor: e.course.teacher?.name || 'Tidak diketahui',
    }));
    return Response.json(courses);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
