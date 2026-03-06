"use client";

import { useState } from "react";
import { updateInfo } from "../../actions";
import RichTextEditor from "../../RichTextEditor";
import { ArrowLeft, Save, ImageIcon } from "lucide-react";
import Link from "next/link";

interface InfoData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  thumbnail?: string | null;
  status: string;
  is_active: boolean;
  category_id?: string | null;
  author_id?: string | null;
  created_at: Date;
  updated_at: Date;
}

export default function EditInfoForm({ data }: { data: InfoData }) {
  const [content, setContent] = useState(data.content);
  const [imageUrl, setImageUrl] = useState(data.thumbnail || "");
  const [loading, setLoading] = useState(false);

  // Fungsi untuk menangani loading saat submit
  const handleFormSubmit = () => {
    setLoading(true);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-slate-100 mb-12 relative overflow-hidden">
      {/* Dekorasi Latar Belakang */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

      {/* Header Form */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="text-left">
          <h2 className="text-2xl font-black text-emerald-950 uppercase italic tracking-tighter flex items-center gap-3">
            <span className="p-3 bg-emerald-100 rounded-2xl text-emerald-700">✏️</span>
            Edit <span className="text-emerald-600">Warta Pondok</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 ml-1">
            Pusat Kendali Informasi Al Muttaqin
          </p>
        </div>

        <Link
          href="/admin/info"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Daftar
        </Link>
      </div>

      <form action={updateInfo} onSubmit={handleFormSubmit} className="space-y-8 relative z-10">
        {/* Identitas Data (Hidden) */}
        <input type="hidden" name="id" value={data.id} />
        <input type="hidden" name="content" value={content} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* KOLOM KIRI: Metadata Artikel */}
          <div className="lg:col-span-5 space-y-8">
            {/* Judul Artikel */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1 text-left">
                Judul Warta / Materi Khutbah
              </label>
              <input
                name="title"
                defaultValue={data.title}
                required
                placeholder="Masukkan judul artikel..."
                className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none font-bold text-slate-800 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Kategori Berdasarkan Konteks Pondok */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1 text-left">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    name="category_id"
                    defaultValue={data.category_id || ""}
                    className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 appearance-none focus:ring-4 focus:ring-emerald-100 transition-all"
                  >
                    <option value="11111111-1111-1111-1111-111111111111">📰 Kabar Pondok</option>
                    <option value="33333333-3333-3333-3333-333333333333">🎙️ Materi Khutbah</option>
                    <option value="44444444-4444-4444-4444-444444444444">💰 Info Donasi</option>
                    <option value="55555555-5555-5555-5555-555555555555">📢 Pengumuman</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Status Publikasi */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1 text-left">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={data.status || "publish"}
                  className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 appearance-none focus:ring-4 focus:ring-emerald-100 transition-all"
                >
                  <option value="publish">Terbitkan (Live)</option>
                  <option value="draft">Simpan Draft</option>
                </select>
              </div>
            </div>

            {/* URL Thumbnail dengan Preview Sederhana */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1 text-left">
                URL Gambar Utama
              </label>
              <div className="relative">
                <input
                  name="thumbnail"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://link-gambar.com/foto.jpg"
                  className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none font-bold text-slate-600 focus:ring-4 focus:ring-emerald-100 transition-all pl-14"
                />
                <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
              {imageUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden border-4 border-emerald-50 aspect-video relative">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: Editor Konten */}
          <div className="lg:col-span-7 flex flex-col">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1 text-left">
              Isi Konten (Rich Text Editor)
            </label>
            <div className="flex-1 bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden focus-within:ring-4 focus-within:ring-emerald-100 transition-all">
              <RichTextEditor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* Tombol Aksi Utama */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-emerald-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-950/20 active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                PROSES MENYIMPAN...
              </>
            ) : (
              <>
                <Save size={16} className="text-emerald-400" />
                SIMPAN PERUBAHAN WARTA 💾
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}