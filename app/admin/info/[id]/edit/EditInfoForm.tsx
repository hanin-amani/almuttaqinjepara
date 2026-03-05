"use client";

import { useState } from "react";
import { updateInfo } from "../../actions"; 
import RichTextEditor from "../../RichTextEditor";

interface InfoData {
  id: string;
  title: string;
  content: string;
  thumbnail?: string | null;
  category: string;
}

export default function EditInfoForm({ data }: { data: InfoData }) {
  const [content, setContent] = useState(data.content);
  const [imageUrl, setImageUrl] = useState(data.thumbnail || "");
  const [loading, setLoading] = useState(false);

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    try {
      // PERBAIKAN DI SINI:
      // Kita panggil updateInfo dengan 2 argumen: (id, formData)
      const result = await updateInfo(data.id, formData);
      
      if (result.success) {
        alert("Data berhasil diperbarui! 📝");
      } else {
        alert("Gagal update: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat memperbarui data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-orange-100 mb-12">
      <h2 className="text-xl font-black text-orange-800 mb-8 uppercase tracking-tight">Edit Artikel ✏️</h2>
      
      <form action={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">Judul Artikel</label>
              <input 
                name="title" 
                defaultValue={data.title}
                required 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-orange-100 outline-none font-bold" 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">Kategori</label>
                <select 
                  name="category" 
                  defaultValue={data.category}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none font-bold appearance-none"
                >
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
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-left">Isi Berita</label>
            <RichTextEditor value={content} onChange={setContent} />
            <input type="hidden" name="content" value={content} />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:bg-gray-400"
        >
          {loading ? "MENYIMPAN..." : "SIMPAN PERUBAHAN 💾"}
        </button>
      </form>
    </div>
  );
}