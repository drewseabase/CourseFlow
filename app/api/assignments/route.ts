import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'auth';
import { prisma } from '@/lib/prisma';
import { transformAssignment } from '@/lib/canvas/transformer';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');

  const now = new Date();

  const assignments = await prisma.assignment.findMany({
    where: {
      userId: session.user.id,
      ...(courseId ? { courseId } : {}),
      // Only return upcoming assignments (next 14 days) for the courses page
      dueAt: {
        gte: now,
        lte: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { dueAt: 'asc' },
    include: {
      course: {
        select: {
          code: true,
          gradientClass: true,
        },
      },
    },
  });

  return NextResponse.json(assignments.map(transformAssignment));
}