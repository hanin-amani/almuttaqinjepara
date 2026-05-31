import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET COMMENTS
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const infoId = searchParams.get("infoId");

    if (!infoId) {
      return NextResponse.json([], { status: 200 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        info_id: String(infoId),
        is_approved: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error: any) {
    console.error("GET_COMMENTS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Gagal mengambil komentar",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST COMMENT
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      infoId,
      name,
      email,
      content,
      website,
      image,
      parent_id,
    } = body;

    if (!infoId || !name || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap",
        },
        {
          status: 400,
        }
      );
    }

    let validParentId = null;

    if (
      parent_id &&
      parent_id !== "" &&
      parent_id !== "null" &&
      parent_id !== "undefined"
    ) {
      validParentId = parent_id;
    }

    const newComment = await prisma.comment.create({
      data: {
        info_id: String(infoId),
        name: String(name),
        email: email || "guest@rsm.id",
        content: String(content),
        website: website || null,
        image: image || null,
        parent_id: validParentId,
        is_approved: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newComment,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error("POST_COMMENT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Gagal menyimpan komentar",
      },
      {
        status: 500,
      }
    );
  }
}