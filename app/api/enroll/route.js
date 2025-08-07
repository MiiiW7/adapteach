import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/enroll
export async function POST(request) {
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
    const { code } = await request.json();
    // Validasi kode: 4 digit angka
    if (!/^\d{4}$/.test(code)) {
      return Response.json({ error: 'Kode kelas harus 4 digit angka' }, { status: 400 });
    }
    // Cari kelas berdasarkan kode
    const course = await prisma.course.findUnique({ where: { code } });
    if (!course) {
      return Response.json({ error: 'Kode kelas tidak ditemukan' }, { status: 404 });
    }
    // Daftarkan siswa ke kelas (Enrollment)
    const userId = user.userId;
    // Cek apakah sudah terdaftar
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });
    if (existing) {
      return Response.json({ error: 'Anda sudah terdaftar di kelas ini' }, { status: 409 });
    }
    await prisma.enrollment.create({
      data: {
        user: { connect: { id: userId } },
        course: { connect: { id: course.id } },
      },
    });
    return Response.json({ success: true, courseId: course.id });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
