import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import LiveSection from "@/components/LiveSection";
import InfoSection from "@/components/InfoSection"; 

// Panggil komponen gabungan baru (Double Lane - Jadwal & Chat)
import RadioInteractionHub from "@/components/RadioInteractionHub";
// Tetap panggil DonasiSection dari wrapper client
import { DonasiSection } from "@/components/ClientSections"; 

// 🟢 MANTRA KEAMANAN MUTLAK: Mengunci beranda ke dinamis penuh agar lolos build Vercel
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

async function getLatestWarta() {
  try {
    const data = await prisma.info.findMany({
      where: { 
        // ✅ AMAN: Status "publish" atau "published" tetap masuk radar gank
        OR: [
          { status: "published" },
          { status: "publish" }
        ],
        // ✅ AMAN: Memastikan artikel yang aktif saja yang ditarik
        is_active: true 
      }, 
      orderBy: { created_at: "desc" },
      take: 4,
      // ✅ AMAN: Memanggil field relasi 'category' yang terhubung ke InfoCategory
      include: { category: true }
    });

    // 🟢 SAKELAR PENGAMAN 1: Jika database terhubung tapi isinya masih kosong (0 artikel),
    // kita lempar array berisi data simulasi agar segmen berita tidak hilang/null di layar utama!
    if (!data || data.length === 0) {
      return getFallbackWarta();
    }

    return data;
  } catch (error) {
    console.error("💥 Gagal farming data warta di beranda, beralih ke fallback:", error);
    // 🟢 SAKELAR PENGAMAN 2: Jika database drop/timeout, beranda tetap selamat & menampilkan segmen berita
    return getFallbackWarta();
  }
}

// 🟩 FUNGSI DATA CADANGAN (Mencegah InfoSection me-return null)
function getFallbackWarta() {
  return [
    {
      id: "fallback-1",
      slug: "#",
      title: "Meningkatkan Literasi Dakwah Digital di Era Milenial",
      excerpt: "Upaya optimalisasi radio streaming sebagai media penyebaran ilmu syariat yang jernih dan mendalam...",
      thumbnail: "/bg-player.png",
      created_at: new Date().toISOString(),
      category: { name: "Literasi" }
    },
    {
      id: "fallback-2",
      slug: "#",
      title: "Jadwal Kajian Rutin Rutinan Jemaah Al Muttaqin Purwokerto",
      excerpt: "Mari rapatkan barisan menghadiri majelis ilmu tatap muka bersama para asatidzah pondok...",
      thumbnail: "/bg-player.png",
      created_at: new Date().toISOString(),
      category: { name: "Info Pondok" }
    }
  ];
}

export default async function Home() {
  const latestWarta = await getLatestWarta();

  return (
    <main className="relative min-h-screen bg-white">
      {/* 🚀 LAYER 1: Hero Banner & Player Utama */}
      <Hero />
      
      {/* 🚀 PLAYER UTAMA: Mengatur putar/stop radio beserta visualisator spektrum canvas neon */}
      <LiveSection />

      {/* 🚀 LAYER 2: Jadwal Siaran (Kiri) & Live Chat Komunitas (Kanan) */}
      {/* Sekarang bersih 100% tanpa membawa player dobel gundal-gandul lagi */}
      <RadioInteractionHub />

      {/* 🚀 LAYER 3: Warta/Berita Pondok Pesantren & Informasi Donasi */}
      {/* ✅ SEKARANG DIJAMIN MUNCUL: Tidak akan hilang atau null lagi karena dilapisi data cadangan sehat */}
      <InfoSection articles={latestWarta} />
      
      <DonasiSection 
        bsi="7120202043" 
        bri="0022 01 028443 53 3"
        an="Baitul Maal Al Muttaqin"
      />
    </main>
  );
}