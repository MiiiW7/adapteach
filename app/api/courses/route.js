import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
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
    const data = await request.json();
    const newCourse = await prisma.course.create({
      data,
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
