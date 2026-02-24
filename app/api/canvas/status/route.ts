import { NextResponse } from "next/server";
import { auth } from "auth";
import { prisma } from "@/lib/prisma";

export async function GET(){
    const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const integration = await prisma.canvasIntegration.findUnique({
        where: {userId: session.user.id},
        select: {
            lastSyncedAt: true,
            canvasBaseUrl: true,
        },
    });

    return NextResponse.json({
        conneted: !!integration,
        lastSyncedAt: integration?.lastSyncedAt ?? null,
        canvasBaseUrl: integration?.canvasBaseUrl ?? null,
    });
}