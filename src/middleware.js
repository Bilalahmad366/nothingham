import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // ignore login/signup/api routes
  if (pathname.startsWith("/api") || pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // Read cookie
  const token = req.cookies.get("token")?.value;

  console.log("Middleware token:", token); // debug

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
