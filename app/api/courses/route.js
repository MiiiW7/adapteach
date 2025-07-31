import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return Response.json({ error: 'Unauthorized: token missing' }, { status: 401 });
    }
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json({ error: 'Unauthorized: invalid token' }, { status: 401 });
    }
    // Hanya ambil course milik guru ini
    const courses = await prisma.course.findMany({
      where: { teacherId: user.userId },
      include: { materials: true },
    });
    return Response.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return Response.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Ambil token dari header Authorization
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return Response.json({ error: 'Unauthorized: token missing' }, { status: 401 });
    }

    // Verifikasi token dan ambil user
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json({ error: 'Unauthorized: invalid token' }, { status: 401 });
    }

    // Hanya TEACHER yang boleh membuat kelas
    if (user.role !== 'TEACHER') {
      return Response.json({ error: 'Forbidden: only teachers can create courses' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description } = body;
    if (!title || !description) {
      return Response.json({ error: 'Title and description are required' }, { status: 400 });
    }

    // Generate kode unik 4 digit jika tidak dikirim
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = (body.code && body.code.length === 4) ? body.code : Math.floor(1000 + Math.random() * 9000).toString();
      const existing = await prisma.course.findUnique({ where: { code } });
      if (!existing) isUnique = true;
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        code,
        teacherId: user.userId,
      },
    });
    return Response.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return Response.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
