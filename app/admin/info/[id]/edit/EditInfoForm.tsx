"use client";

import { useState, useRef } from "react";
import { updateInfo } from "../../actions";
import RichTextEditor from "../../RichTextEditor";
import { ArrowLeft, Save, ImageIcon, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditInfoForm({ data }: { data: any }) {
  const [content, setContent] = useState(data.content);
  const [previewUrl, setPreviewUrl] = useState(data.thumbnail || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi Preview Gambar saat dipilih
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-slate-100 mb-12 relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-emerald-950 uppercase italic tracking-tighter flex items-center gap-3">
            <span className="p-3 bg-emerald-100 rounded-2xl">✏️</span>
            Edit <span className="text-emerald-600">Warta Pondok</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 ml-1">Pusat Kendali Al Muttaqin</p>
        </div>
        <Link href="/admin/info" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={14} /> Kembali
        </Link>
      </div>

      <form action={updateInfo} onSubmit={() => setLoading(true)} className="space-y-8 relative z-10">
        <input type="hidden" name="id" value={data.id} />
        <input type="hidden" name="content" value={content} />
        {/* Input hidden untuk simpan URL lama jika tidak ganti gambar */}
        <input type="hidden" name="oldThumbnail" value={data.thumbnail || ""} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            {/* Judul */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Judul Warta</label>
              <input name="title" defaultValue={data.title} required className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none font-bold text-slate-800 transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Kategori</label>
                <select name="category_id" defaultValue={data.category_id || ""} className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 appearance-none focus:ring-4 focus:ring-emerald-100 transition-all">
                  <option value="11111111-1111-1111-1111-111111111111">📰 Kabar Pondok</option>
                  <option value="33333333-3333-3333-3333-333333333333">🎙️ Materi Khutbah</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Status</label>
                <select name="status" defaultValue={data.status || "publish"} className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 appearance-none">
                  <option value="publish">Terbitkan</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* ✅ UPLOAD GAMBAR UTAMA */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Upload Gambar Utama</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative cursor-pointer border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all overflow-hidden"
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  name="thumbnailFile" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                {previewUrl ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-black text-[10px] uppercase">
                      <Upload size={18} className="mr-2" /> Ganti Gambar
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <ImageIcon className="mx-auto text-slate-300 mb-4" size={40} />
                    <p className="text-xs font-bold text-slate-400 uppercase">Klik untuk pilih foto</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Konten Berita</label>
            <div className="flex-1 bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden focus-within:ring-4 focus-within:ring-emerald-100 transition-all">
              <RichTextEditor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-6 bg-emerald-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-900 shadow-2xl disabled:bg-slate-300 flex items-center justify-center gap-3">
          {loading ? "PROSES MENYIMPAN..." : <> <Save size={16} className="text-emerald-400" /> SIMPAN PERUBAHAN 💾 </>}
        </button>
      </form>
    </div>
  );
}