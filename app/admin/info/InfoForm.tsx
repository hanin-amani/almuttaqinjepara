"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";
import TagInput from "@/components/TagInput";
import { Loader2, CheckCircle2, LayoutGrid, FileText, Image as ImageIcon, Tag, AlertCircle } from "lucide-react";

export default function InfoForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ AMBIL KATEGORI ASLI DARI DATABASE
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error("Gagal memuat kategori asli dari database.");
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title"),
      category_id: formData.get("category_id"),
      status: formData.get("status"),
      thumbnail,
      content,
      tags: tags.join(","),
    };

    try {
      const res = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Redirect ke daftar warta setelah 2 detik
        setTimeout(() => router.push("/admin/info"), 2000);
      } else {
        throw new Error(result.error || "Gagal menyimpan data.");
      }
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-white border border-slate-100 rounded-[4px] shadow-2xl p-6 md:p-10 space-y-8 overflow-hidden"
    >
      {/* SUCCESS OVERLAY */}
      {success && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-emerald-600/95 text-white animate-in fade-in duration-500">
          <CheckCircle2 size={60} className="mb-4 animate-bounce" />
          <h2 className="text-xl font-black uppercase tracking-[0.3em] italic">Warta Berhasil Terbit</h2>
          <p className="text-xs text-emerald-100 mt-2 font-bold uppercase">Mengarahkan ke dashboard...</p>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-slate-50 pb-6 text-left">
        <div className="w-10 h-10 bg-slate-900 text-emerald-400 flex items-center justify-center rounded-[4px]">
          <FileText size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase italic tracking-tight leading-none">Editor Warta Utama</h2>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">RSM Media Center Al Muttaqin Jepara</p>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-[4px] flex items-center gap-3 text-red-600">
          <AlertCircle size={18} />
          <p className="text-[11px] font-bold uppercase tracking-wider">{error}</p>
        </div>
      )}

      {/* GRID FORM */}
      <div className="grid md:grid-cols-2 gap-8 text-left">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
               Judul Artikel
            </label>
            <input
              type="text"
              name="title"
              placeholder="Contoh: Keutamaan Sedekah Subuh..."
              required
              className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white p-3 rounded-[4px] font-bold text-slate-800 transition-all outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
              <LayoutGrid size={12} className="text-emerald-500" /> Kategori Berita
            </label>
            <select
              name="category_id"
              required
              className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white p-3 rounded-[4px] font-bold text-slate-600 transition-all outline-none cursor-pointer"
            >
              <option value="">Pilih Kategori Asli...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
              <ImageIcon size={12} className="text-emerald-500" /> Gambar Cover
            </label>
            <ImageUpload onUpload={(url) => setThumbnail(url)} />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
              Status Publikasi
            </label>
            <select
              name="status"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white p-3 rounded-[4px] font-bold text-slate-600 transition-all outline-none"
            >
              <option value="published">Siap Terbitkan (Live)</option>
              <option value="draft">Simpan sebagai Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAGS AREA */}
      <div className="space-y-3 pt-2 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
          <Tag size={12} className="text-emerald-500" /> Kata Kunci (SEO)
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* EDITOR AREA */}
      <div className="space-y-4 border-t border-slate-50 pt-8 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
          Isi Artikel Lengkap
        </label>
        <div className="border border-slate-200 rounded-[4px] overflow-hidden bg-white shadow-inner min-h-[400px]">
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-50">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest max-w-xs text-left leading-relaxed">
          Pastikan konten sudah diperiksa kembali sebelum diterbitkan ke publik.
        </p>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto min-w-[280px] bg-slate-900 hover:bg-emerald-600 text-white py-5 px-10 rounded-[4px] font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Menyimpan Data...
            </>
          ) : (
            "Simpan & Publikasikan Warta"
          )}
        </button>
      </div>
    </form>
  );
}