import { NextResponse } from "next/server";

export async function GET() {
  try {

    const res = await fetch(
      "https://rsm.my.id/api/nowplaying/salaam",
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn("AZURACAST DOWN:", res.status);

      return NextResponse.json({
        current: 0,
        unique: 0,
        total: 0,
        status: "offline",
      });
    }

    const data = await res.json();

    return NextResponse.json({
      current: data.listeners?.current ?? 0,
      unique: data.listeners?.unique ?? 0,
      total: data.listeners?.total ?? 0,
      status: "online",
    });

  } catch (error) {

    console.warn("SERVER TIDAK BISA MENGHUBUNGI AZURACAST");

    return NextResponse.json({
      current: 0,
      unique: 0,
      total: 0,
      status: "offline",
    });
  }
}