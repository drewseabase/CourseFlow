import { NextRequest, NextResponse } from "next/server";
import {auth} from "auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import { syncCanvasData } from "@/lib/canvas/sync";

export async function POST(req: NextRequest){
    const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const {accessToken, canvasBaseUrl} = await req.json();

    if(!accessToken || !canvasBaseUrl){
        return NextResponse.json(
            {error: 'accessToken and canvasBaseUrl are required'},
            {status: 400}
        );
    }

    const normalizedUrl = canvasBaseUrl.replace(/\/$/, '');

    const validationRes = await fetch(`${normalizedUrl}/api/v1/users/self`, {
        headers: {Authorization: `Bearer ${accessToken}`},
    });

    if(!validationRes.ok){
        return NextResponse.json(
            {error: 'Invalid Canvas token or Canvas URL. Please check your credentials'},
            {status: 400}
        );
    }

    const {encryptedData, iv} = encrypt(accessToken);

    await prisma.canvasIntegration.upsert({
        where: {userId: session.user.id},
        update: {
            canvasBaseUrl: normalizedUrl,
            encryptedAccessToken: encryptedData,
            tokenIv: iv,
            lastSyncedAt: null,
            updatedAt: new Date()
        },
        create:{
            userId: session.user.id,
            canvasBaseUrl: normalizedUrl,
            encryptedAccessToken: encryptedData,
            tokenIv: iv,
        },
    });

    const syncResult = await syncCanvasData(session.user.id);

    if(!syncResult.success){
        return NextResponse.json({
            success: true,
            warning: 'Canvas connected but initial sync failed. Try syncing manually.',
        });
    }

    return NextResponse.json({success: true});
}