import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request, context) {
  const params = await context.params;
  const code = params.code;
  if (!code) {
    return Response.json({ error: 'Kode kelas wajib diisi' }, { status: 400 });
  }
  // Ambil token dari header
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
  try {
    const course = await prisma.course.findUnique({
      where: { code },
      include: { 
        materials: true,
        teacher: {
          select: {
            name: true,
            email: true
          }
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
    });
    if (!course) {
      return Response.json({ error: 'Kelas tidak ditemukan' }, { status: 404 });
    }
    
    // Add student count to response
    const courseWithStudentCount = {
      ...course,
      studentCount: course.enrollments?.length || 0,
      students: course.enrollments?.map(e => e.user) || []
    };
    
    // Tidak perlu cek teacherId, endpoint ini untuk siswa
    return Response.json(courseWithStudentCount);
  } catch (error) {
    console.error('Error fetching course by code:', error);
    return Response.json({ error: 'Gagal mengambil data kelas' }, { status: 500 });
  }
}
