"use client";

import { useState } from "react";
import { addInfo } from "./actions";
import RichTextEditor from "./RichTextEditor";

export default function InfoForm() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi perantara agar TypeScript tidak protes soal return value
  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const result = await addInfo(formData);
      if (result.success) {
        alert("Berita berhasil diterbitkan! 🚀");
        // Optional: reset form atau redirect di sini
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-emerald-100 mb-12">
      <h2 className="text-xl font-black text-emerald-800 mb-8 uppercase tracking-tight">Tulis Artikel Baru ✍️</h2>
      
      {/* Gunakan action={handleSubmit} agar type-safe */}
      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">Judul Artikel</label>
              <input 
                name="title" 
                required 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none font-bold" 
                placeholder="Contoh: Info Ramadhan 2026..." 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">Kategori</label>
                <select name="category" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none font-bold appearance-none">
                  <option value="Berita">📰 Berita Pondok</option>
                  <option value="Kajian">🎙️ Artikel Kajian</option>
                  <option value="Pengumuman">📢 Pengumuman</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">URL Thumbnail</label>
                <input 
                  name="thumbnail" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none font-bold" 
                  placeholder="Paste link gambar..." 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">Status</label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border border-gray-100 bg-gray-50 cursor-pointer has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-500 transition-all">
                  <input type="radio" name="status" value="published" defaultChecked className="hidden" />
                  <span className="text-xs font-black uppercase italic">🚀 Publish</span>
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border border-gray-100 bg-gray-50 cursor-pointer has-[:checked]:bg-orange-50 has-[:checked]:border-orange-500 transition-all">
                  <input type="radio" name="status" value="draft" className="hidden" />
                  <span className="text-xs font-black uppercase italic">💾 Draft</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">Isi Berita</label>
            <RichTextEditor value={content} onChange={setContent} />
            {/* Hidden input agar content dari editor terkirim lewat formData */}
            <input type="hidden" name="content" value={content} />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95 disabled:bg-gray-400"
        >
          {loading ? "MEMPROSES..." : "TERBITKAN SEKARANG 🚀"}
        </button>
      </form>
    </div>
  );
}