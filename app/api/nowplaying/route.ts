import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://rsm.my.id/api/nowplaying/1", {
      cache: "no-store",
      headers: {
        "X-API-Key": "9a155edf8534f670:93599d57dd1e78c87b6adea7b6f73749", // ✅ Aman di Server
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error();
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Offline" }, { status: 200 });
  }
}