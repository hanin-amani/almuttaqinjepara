import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  const { pathname } = request.nextUrl;

  // 1. PROTEKSI HALAMAN ADMIN (Kecuali halaman login admin itu sendiri)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Jika tidak ada token admin
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url); // 👈 Larikan ke pintu khusus admin
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Jika ada token, verifikasi keasliannya
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "rsm-secret-key-123"
      );
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      // Token palsu/expired, hapus cookie dan tendang ke login admin
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_session");
      return response;
    }
  }

  // 2. CEK STATUS ADMIN DI HALAMAN LOGIN ADMIN
  // Jika sudah login admin tapi iseng buka halaman login admin lagi
  if (pathname === "/admin/login" && token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "rsm-secret-key-123"
      );
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } catch {
      // Token tidak valid, biarkan di halaman login admin
      return NextResponse.next();
    }
  }

  // 3. HALAMAN /login (PEMBACA) TETAP BEBAS
  // Middleware ini tidak akan mengganggu NextAuth di halaman /login
  // supaya pembaca tetap bisa login Google/Facebook dengan lancar.

  return NextResponse.next();
}

// Konfigurasi matcher
export const config = {
  // Kita pantau semua rute admin
  matcher: ["/admin/:path*"],
};