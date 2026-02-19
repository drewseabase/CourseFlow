-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('work', 'personal', 'appointment', 'other');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "type" "EventType" NOT NULL,
    "color" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'temp-user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
