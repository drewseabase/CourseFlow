import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all events
export async function GET() {
  const events = await prisma.event.findMany({
    where: { userId: 'temp-user' },
    orderBy: { startTime: 'asc' },
  });
  return NextResponse.json(events);
}

// POST a new event
export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = await prisma.event.create({
    data: {
      title: body.title,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      type: body.type,
      color: body.color,
      duration: body.duration,
      userId: 'temp-user',
    },
  });
  return NextResponse.json(event, { status: 201 });
}