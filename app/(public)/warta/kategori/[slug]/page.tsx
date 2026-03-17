import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {

  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const category = await prisma.infoCategory.findUnique({
    where: { slug },
    include: {
      infos: {
        where: {
          status: "publish",
          is_active: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">

      <div className="container mx-auto px-6 max-w-7xl">

        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>&gt;</span>
          <Link href="/warta" className="hover:text-emerald-600">Warta</Link>
          <span>&gt;</span>
          <span className="text-slate-900 font-medium">{category.name}</span>
        </nav>

        {/* TITLE */}
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-widest text-emerald-600 mb-3">
            KATEGORI
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            {category.name}
          </h1>
        </div>

        {/* GRID ARTIKEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {category.infos.map((post) => (

            <Link
              key={post.id}
              href={`/warta/${post.slug}`}
              className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
            >

              {/* THUMBNAIL */}
              <div className="relative aspect-video overflow-hidden">

                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-semibold">
                    RSM
                  </div>
                )}

              </div>

              {/* CONTENT */}
              <div className="p-6">

                {/* DATE */}
                <p className="text-xs text-slate-400 mb-3">
                  {new Date(post.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-slate-900 leading-snug group-hover:text-emerald-600 transition">
                  {post.title}
                </h3>

                {/* EXCERPT */}
                {post.excerpt && (
                  <p className="text-sm text-slate-500 mt-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

              </div>

            </Link>

          ))}

        </div>

        {/* JIKA KOSONG */}
        {category.infos.length === 0 && (
          <div className="py-24 text-center border border-dashed border-slate-200 rounded-xl mt-12">
            <p className="text-slate-400">
              Belum ada warta untuk kategori ini.
            </p>
          </div>
        )}

      </div>

    </main>
  );
}