export const runtime = 'nodejs';

import { auth } from "auth";
import { NextResponse } from "next/server";

export default auth((req) =>{
    const {pathname} = req.nextUrl;
    const isLoggedIn = !!req.auth;

    const publicRoutes = ["/", "/api/auth"];
    const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

    if(!isLoggedIn && !isPublic){
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};