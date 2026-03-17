import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronRight } from "lucide-react";

interface RelatedPostProps {
  currentPostId: string;
  categoryId: string;
}

export default async function RelatedPost({ currentPostId, categoryId }: RelatedPostProps) {
  // Jika categoryId kosong, jangan tampilkan apa-apa
  if (!categoryId) return null;

  // Ambil 3 postingan terkait berdasarkan kategori yang sama
  const relatedPosts = await prisma.info.findMany({
    where: {
      // ✅ FIX: Menggunakan category_id (sesuai schema database antum)
      category_id: categoryId,
      id: { not: currentPostId }, // Kecualikan artikel yang sedang dibaca
      status: { in: ["published", "publish"] },
      is_active: true
    },
    orderBy: { created_at: "desc" },
    take: 3,
    include: { category: true }
  });

  if (relatedPosts.length === 0) return null;

  return (
    <section className="py-12">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-6 w-1 bg-emerald-600 rounded-full"></div>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">
          Warta <span className="text-emerald-600">Terkait</span>
        </h2>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/warta/${post.slug}`}
            className="group flex flex-col bg-white border border-slate-100 rounded-[4px] overflow-hidden hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="relative aspect-video bg-slate-50 overflow-hidden">
              {post.thumbnail ? (
                <Image 
                  src={post.thumbnail} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] font-black text-slate-200 italic uppercase">RSM Media</div>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1">
              <time className="text-[8px] font-bold text-slate-400 uppercase mb-2 block">
                {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </time>
              
              <h3 className="text-[13px] font-black text-slate-800 leading-snug uppercase italic line-clamp-2 group-hover:text-emerald-700 transition-colors">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}