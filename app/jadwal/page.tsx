// 🟢 AMAN: Kita hapus "use client" agar bertindak sebagai Server Component gahar
import { client } from "../../sanity/lib/client"; // 🛠️ Sesuaikan tingkat folder jika letak file ini berbeda

// 🟢 MANTRA KEAMANAN: Memastikan Turbopack meloloskan halaman tanpa mencoba caching kaku pas build
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Fungsi Pembantu Mengonversi Nama Hari Inggris dari Sanity ke Bahasa Indonesia
const translateDay = (day: string) => {
  const dayMap: { [key: string]: string } = {
    everyday: "Setiap Hari",
    monday: "Senin",
    tuesday: "Selasa",
    wednesday: "Rabu",
    thursday: "Kamis",
    friday: "Jumat",
    saturday: "Sabtu",
    sunday: "Minggu",
  };
  return dayMap[day.toLowerCase()] || day;
};

// Fungsi Mengambil Data Jadwal Terkini dari Sanity CMS
async function getRadioSchedules() {
  const query = `
    *[_type == "radioConfig"][0] {
      schedules[] {
        day,
        eventName,
        speaker,
        startTime,
        endTime,
        broadcastMode
      }
    }
  `;
  try {
    const data = await client.fetch(query, {}, { cache: 'no-store' });
    return data?.schedules || [];
  } catch (error) {
    console.error("Gagal menyinkronkan jadwal dari Sanity:", error);
    return [];
  }
}

export default async function JadwalPage() {
  // Tarik data schedules langsung di sisi server sebelum HTML dikirim ke jemaah
  const schedules = await getRadioSchedules();

  return (
    <div className="min-h-screen bg-emerald-950 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Halaman dengan Efek Neon */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-[0.3em] drop-shadow-lg">
            Jadwal Siaran
          </h1>
          <div className="h-1 w-24 bg-cyan-400 mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(0,242,255,0.8)]" />
          <p className="mt-6 text-emerald-200/80 font-medium">
            Program rutin Radio Suara Al Muttaqin Purwokerto untuk menginspirasi hati Anda.
          </p>
        </div>

        {/* Grid Jadwal Dinamis yang Terintegrasi Sanity CMS */}
        {schedules.length === 0 ? (
          <div className="text-center py-12 text-emerald-200/40 border border-dashed border-emerald-500/20 rounded-[2rem]">
            Belum ada jadwal siaran yang dirilis dari studio Sanity.
          </div>
        ) : (
          <div className="grid gap-4">
            {schedules.map((prog: any, index: number) => (
              <div 
                key={index} 
                className="group bg-white/5 backdrop-blur-md border border-emerald-500/20 p-6 rounded-[2rem] hover:bg-emerald-800/20 transition-all duration-300 hover:border-cyan-500/40 shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                    
                    {/* Wadah Jam & Badge Hari */}
                    <div className="flex items-center gap-2">
                      <span className="bg-cyan-500/10 text-cyan-400 font-mono text-xs px-4 py-2 rounded-xl border border-cyan-500/20 shadow-inner whitespace-nowrap">
                        {prog.startTime} - {prog.endTime}
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 font-sans text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg border border-emerald-500/20">
                        {translateDay(prog.day)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      {prog.eventName}
                    </h3>
                  </div>

                  {/* Deskripsi Pembicara / Pengisi Acara */}
                  <p className="text-sm text-emerald-100/60 font-light max-w-sm md:text-right">
                    🎙️ {prog.speaker || "Pondok Pesantren Al Muttaqin"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer info sistem yang sudah terotomatisasi penuh */}
        <div className="mt-12 p-8 rounded-[2.5rem] bg-black/20 border border-emerald-500/10 text-center">
          <p className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.4em]">
            Sync Status: Verified with SANITY HEADLESS CMS v5
          </p>
          <p className="text-xs text-emerald-300/50 mt-2">
            Pemberitahuan: Seluruh rangkaian jadwal di atas disinkronkan secara real-time langsung dari Dasbor Studio Admin.
          </p>
        </div>
      </div>
    </div>
  );
}