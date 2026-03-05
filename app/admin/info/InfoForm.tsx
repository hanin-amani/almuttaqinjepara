"use client";  // Bismillah update

import { useState } from "react";
// Hapus baris createBrowserClient @supabase/ssr di sini!
import { addInfo } from "./actions";
import RichTextEditor from "./RichTextEditor";

export default function InfoForm() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState(""); // State baru untuk menampung isi berita

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('thumbnails')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('thumbnails').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (error) {
      console.error("Gagal upload:", error);
      alert("Gagal upload gambar! Pastikan Bucket 'thumbnails' sudah Public.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-emerald-100 mb-12">
      <h2 className="text-xl font-black text-emerald-800 mb-8 uppercase tracking-tight">Tulis Artikel Baru ✍️</h2>
      <form action={addInfo} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* KOLOM KIRI: METADATA */}
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">Judul Artikel</label>
              <input name="title" required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none font-bold" placeholder="Contoh: Info Ramadhan 2026..." />
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
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">Upload Thumbnail</label>
                <input type="file" accept="image/*" onChange={handleUpload} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer" />
                <input type="hidden" name="thumbnail" value={imageUrl} />
                {imageUrl && <p className="text-[9px] text-emerald-600 mt-2 font-bold italic">✅ Gambar siap diterbitkan!</p>}
              </div>
            </div>

            {/* STATUS PUBLIKASI */}
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

          {/* KOLOM KANAN: RICH TEXT EDITOR */}
          <div className="flex flex-col">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">Isi Berita (Tanpa Kode HTML!)</label>
            
            {/* Memanggil Editor yang baru saja antum instal */}
            <RichTextEditor value={content} onChange={setContent} />
            
            {/* Input hidden ini SANGAT PENTING agar isi editor bisa terbaca oleh Server Action antum */}
            <input type="hidden" name="content" value={content} />
          </div>
        </div>

        <button type="submit" disabled={uploading} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95 disabled:bg-gray-300">
          {uploading ? "SEDANG UPLOAD GAMBAR..." : "TERBITKAN SEKARANG 🚀"}
        </button>
      </form>
    </div>
  );
}


// Update Terakhir 2026