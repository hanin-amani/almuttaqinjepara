import { Metadata } from "next"; // Tambahkan ini
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. DYNAMIC METADATA: Biar link di WA/FB muncul gambar & judul rapi
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.info.findUnique({
    where: { slug: slug },
    include: { category: true },
  });

  if (!article) return { title: "Artikel Tidak Ditemukan" };

  // Bersihkan HTML untuk deskripsi meta (max 160 karakter)
  const plainText = article.content.replace(/<[^>]*>?/gm, "").slice(0, 160);
  const title = `${article.title} | Radio Suara Al Muttaqin`;
  const url = `https://radioalmuttaqin.com/warta/${article.slug}`;

  return {
    title: title,
    description: plainText,
    alternates: { canonical: url },
    openGraph: {
      title: title,
      description: plainText,
      url: url,
      siteName: "Radio Suara Al Muttaqin",
      images: [{ url: article.thumbnail || "/og-default.jpg" }],
      type: "article",
      publishedTime: article.created_at.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: plainText,
      images: [article.thumbnail || "/og-default.jpg"],
    },
  };
}

// Fungsi data fetching
async function getArticle(slug: string) {
  if (!slug) return null;
  return await prisma.info.findUnique({
    where: { slug: slug },
    include: { category: true },
  });
}

async function getRelatedPosts(categoryId: string | null, currentId: string) {
  if (!categoryId) return [];
  return await prisma.info.findMany({
    where: {
      category_id: categoryId,
      NOT: { id: currentId },
      status: "publish",
    },
    take: 3,
    orderBy: { created_at: "desc" },
  });
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const relatedPosts = await getRelatedPosts(article.category_id, article.id);
  const shareUrl = `https://radioalmuttaqin.com/warta/${article.slug}`;

  // 2. STRUCTURED DATA (JSON-LD): Biar Google kasih badge "News" atau "Article"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.thumbnail || "https://radioalmuttaqin.com/og-default.jpg"],
    "datePublished": article.created_at.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Radio Suara Al Muttaqin",
      "url": "https://radioalmuttaqin.com"
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Masukkan JSON-LD ke dalam skrip agar dibaca bot Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="bg-white border-b border-slate-100 pt-32 pb-12">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6">
            {article.category?.name || "Warta Pondok"}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-6 italic uppercase">
            {article.title}
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Diterbitkan pada {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </header>

      <div className="container mx-auto px-6 max-w-4xl -mt-10">
        {article.thumbnail && (
          <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-8 border-white">
            <Image 
              src={article.thumbnail} 
              alt={`Foto Utama: ${article.title}`} // Alt tag yang deskriptif untuk SEO Gambar
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}

        <ShareButtons url={shareUrl} title={article.title} />

        <article className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
          <div 
            className="prose prose-emerald prose-lg max-w-none text-slate-700 
            [&>p]:mb-6 [&>p]:mt-0 [&>p]:leading-[1.8] [&>p]:text-slate-600
            prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:mt-10 prose-headings:mb-4
            prose-strong:text-emerald-900 prose-img:rounded-[1.5rem] prose-img:my-10 prose-img:shadow-lg
            prose-ul:my-6 prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />

          {/* Kartu Donasi */}
          {article.category_id === '44444444-4444-4444-4444-444444444444' && (
             <section aria-label="Informasi Donasi" className="mt-16 p-8 md:p-12 bg-emerald-950 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
               {/* Konten Donasi */}
             </section>
          )}
        </article>

        {/* RELATED POSTS */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">
                Artikel Terkait
              </h4>
              <div className="h-[1px] w-full bg-slate-200"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <Link 
                  href={`/warta/${post.slug}`} 
                  key={post.id} 
                  className="group bg-white rounded-[1.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col"
                >
                  <div className="relative aspect-video">
                    {post.thumbnail ? (
                      <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-200 font-black italic">AL MUTTAQIN</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h5 className="font-black text-slate-800 text-[12px] uppercase italic leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors tracking-tight">
                      {post.title}
                    </h5>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}