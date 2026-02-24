import { NextResponse } from "next/server";
import { auth } from "auth";
import { prisma } from "@/lib/prisma";
import { syncCanvasData } from "@/lib/canvas/sync";

export async function POST(){
    const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const result = await syncCanvasData(session.user.id);

    if(!result.success){
        return NextResponse.json(
            {error: result.error ?? 'Sync failed'},
            {status: 500}
        );
    }

    const integration = await prisma.canvasIntegration.findUnique({
        where: {userId: session.user.id},
        select: {lastSyncedAt: true},
    });

    return NextResponse.json({
        success: true,
        lastSyncedAt: integration?.lastSyncedAt ?? null,
    });
}