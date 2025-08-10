import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { title, content, courseCode, learningStyle, explanation } = await request.json();

    // Find the course by code to get its ID
    const course = await prisma.course.findUnique({
      where: { code: courseCode },
    });

    if (!course) {
      return NextResponse.json(
        { message: 'Kelas tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validate and convert learning style to match Prisma enum
    const learningStyleUpper = learningStyle.toUpperCase();
    let learningStyleEnum;
    
    if (learningStyleUpper.includes('VISUAL')) {
      learningStyleEnum = 'VISUAL';
    } else if (learningStyleUpper.includes('AUDITORI') || learningStyleUpper.includes('AUDITORY')) {
      learningStyleEnum = 'AUDITORY';
    } else if (learningStyleUpper.includes('KINESTETIK') || learningStyleUpper.includes('KINESTHETIC')) {
      learningStyleEnum = 'KINESTHETIC';
    } else {
      return NextResponse.json(
        { message: 'Gaya belajar tidak valid' },
        { status: 400 }
      );
    }

    // Save the material to the database
    const material = await prisma.material.create({
      data: {
        title,
        content,
        learningStyle: learningStyleEnum,
        courseId: course.id,
        explanation: explanation || null,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error('Error saving material:', error);
    return NextResponse.json(
      { message: 'Gagal menyimpan materi', error: error.message },
      { status: 500 }
    );
  }
}
