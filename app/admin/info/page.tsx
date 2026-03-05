import prisma from "@/lib/prisma";
import InfoForm from "./InfoForm";
import { deleteInfo } from "./actions";

export const dynamic = "force-dynamic";

export default async function InfoPage() {
  const infos = await prisma.info.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-black mb-10">
        Manajemen Artikel / Berita
      </h1>

      <InfoForm />

      <div className="space-y-6">
        {infos.map((info) => (
          <div
            key={info.id}
            className="bg-white p-6 rounded-xl border shadow-sm"
          >
            <h2 className="text-xl font-bold mb-2">
              {info.title}
            </h2>

            <p className="text-gray-600 text-sm mb-4">
              {info.content.slice(0, 150)}...
            </p>

            <form action={deleteInfo}>
              <input type="hidden" name="id" value={info.id} />

              <button className="text-red-500 font-bold">
                Hapus
              </button>
            </form>
          </div>
        ))}

        {infos.length === 0 && (
          <p className="text-gray-400">
            Belum ada artikel
          </p>
        )}
      </div>
    </div>
  );
}