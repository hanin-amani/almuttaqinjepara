import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = Date.now() + "-" + file.name.replace(/\s/g, "-");

    const uploadPath = path.join(process.cwd(), "public/uploads", fileName);

    fs.writeFileSync(uploadPath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${fileName}`,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload gagal" }, { status: 500 });
  }
}