import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from 'auth';

// GET all events
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    where: { userId: session.user.id },
    orderBy: { startTime: 'asc' },
  });
  return NextResponse.json(events);
}

// POST a new event
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const event = await prisma.event.create({
    data: {
      title: body.title,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      type: body.type,
      color: body.color,
      duration: body.duration,
      userId: session.user.id,
    },
  });
  return NextResponse.json(event, { status: 201 });
}