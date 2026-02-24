import { NextResponse } from 'next/server';
import { auth } from 'auth';
import { prisma } from '@/lib/prisma';
import { transformCourse } from '@/lib/canvas/transformer';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const courses = await prisma.course.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
    include: {
      assignments: true, // needed for stats computation
    },
  });

  return NextResponse.json(courses.map(transformCourse));
}