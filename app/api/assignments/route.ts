import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest){
    const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const {searchParams} = new URL(req.url);
    const courseId = searchParams.get('courseId');

    const assignments = await prisma.assignment.findMany({
        where: {
            userId: session.user.id,
            ...(courseId ? {courseId} : {}),
        },
        orderBy: [
            {dueAt: 'asc'},
        ],
        include: {
            course: {
                select: {
                    name: true,
                    code: true,
                    gradientClass: true,
                },
            },
        },
    });
    
    return NextResponse.json(assignments);
}