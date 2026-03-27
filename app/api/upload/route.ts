import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

    const { data: uploadData, error } = await supabase.storage
      .from("thumbnails")
      .upload(`posts/${fileName}`, file, {
        contentType: file.type,
      });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Upload gagal" }, { status: 500 });
    }

    const { data: publicUrl } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(`posts/${fileName}`);

    return NextResponse.json({
      success: true,
      url: publicUrl.publicUrl,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload gagal" }, { status: 500 });
  }
}