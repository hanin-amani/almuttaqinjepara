import prisma from "@/lib/prisma";
import { deleteInfo } from "./actions";
import InfoForm from "./InfoForm";
import SearchInfo from "./SearchInfo";
import Link from "next/link";

export default async function InfoPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams?.q || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 6; 
  const skip = (currentPage - 1) * pageSize;

  const [allInfo, totalCount] = await Promise.all([
    prisma.info.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { created_at: "desc" },
      take: pageSize,
      skip: skip,
    }),
    prisma.info.count({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-emerald-900 mb-10 uppercase italic tracking-tighter">
          Portal Berita & Artikel 📰
        </h1>

        <InfoForm />
        <hr className="my-12 border-emerald-100" />
        <SearchInfo />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {allInfo.map((info) => (
            <div key={info.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:border-emerald-300 transition-all">
              {info.thumbnail && (
                <div className="w-full h-56 relative overflow-hidden">
                  <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight uppercase italic">{info.title}</h3>
                <div className="mt-auto flex justify-between items-center pt-6 border-t border-gray-50">
                  <div className="flex gap-2">
                    <Link href={`/admin/info/${info.id}/edit`} className="px-4 py-2 bg-blue-50 text-blue-500 rounded-xl text-[10px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all">✏️ Edit</Link>
                    
                    {/* PERBAIKAN DI SINI: Gunakan inline async function untuk membungkus deleteInfo */}
                    <form action={async () => {
                      "use server"; 
                      await deleteInfo(info.id);
                    }}>
                      <button 
                        type="submit" 
                        onClick={(e) => { if(!confirm("Yakin hapus?")) e.preventDefault(); }}
                        className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                      >
                        🗑️ Hapus
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            {currentPage > 1 && (
              <Link
                href={`/admin/info?page=${currentPage - 1}${query ? `&q=${query}` : ""}`}
                className="px-6 py-3 bg-white border border-emerald-100 rounded-xl text-emerald-600 font-black text-[10px] uppercase hover:bg-emerald-600 hover:text-white transition-all"
              >
                &larr; Prev
              </Link>
            )}
            
            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">
              Halaman {currentPage} dari {totalPages}
            </span>

            {currentPage < totalPages && (
              <Link
                href={`/admin/info?page=${currentPage + 1}${query ? `&q=${query}` : ""}`}
                className="px-6 py-3 bg-white border border-emerald-100 rounded-xl text-emerald-600 font-black text-[10px] uppercase hover:bg-emerald-600 hover:text-white transition-all"
              >
                Next &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}