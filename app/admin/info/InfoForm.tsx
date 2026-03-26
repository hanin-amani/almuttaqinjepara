"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createInfo } from "@/app/admin/info/actions"; // ✅ Gunakan Server Action yang sudah kita perbaiki
import RichTextEditor from "./RichTextEditor";
import TagInput from "@/components/TagInput";
import { 
  Loader2, CheckCircle2, LayoutGrid, FileText, 
  Image as ImageIcon, Tag, AlertCircle, Upload 
} from "lucide-react";

export default function InfoForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk Preview Gambar
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ AMBIL KATEGORI DARI API
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error("Gagal memuat kategori.");
      }
    };
    fetchCats();
  }, []);

  // Handle Preview Gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ✅ HANDLER SUBMIT (Savage Logic)
  const clientAction = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    // Masukkan data manual (RichText & Tags) ke FormData
    formData.append("content", content);
    formData.append("tags", tags.join(","));

    try {
      // Panggil Server Action
      await createInfo(formData);
      setSuccess(true);
      setTimeout(() => router.push("/admin/info"), 2000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan.");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      action={clientAction}
      className="relative bg-white border border-slate-100 rounded-[4px] shadow-2xl p-6 md:p-10 space-y-8 overflow-hidden"
    >
      {/* SUCCESS OVERLAY */}
      {success && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-emerald-600/95 text-white animate-in fade-in duration-500">
          <CheckCircle2 size={60} className="mb-4 animate-bounce" />
          <h2 className="text-xl font-black uppercase tracking-[0.3em] italic">Warta Berhasil Terbit</h2>
          <p className="text-xs text-emerald-100 mt-2 font-bold uppercase tracking-widest">Mengarahkan ke dashboard...</p>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-slate-50 pb-6 text-left">
        <div className="w-12 h-12 bg-slate-900 text-emerald-400 flex items-center justify-center rounded-[4px] shadow-lg">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Editor Warta Utama</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">RSM Media Center Al Muttaqin Jepara</p>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-[4px] flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
          <AlertCircle size={18} />
          <p className="text-[11px] font-black uppercase tracking-wider">{error}</p>
        </div>
      )}

      {/* GRID FORM */}
      <div className="grid md:grid-cols-2 gap-10 text-left">
        <div className="space-y-8">
          {/* JUDUL */}
          <div className="group">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2 group-focus-within:text-emerald-600 transition-colors">
               Judul Artikel Berita
            </label>
            <input
              type="text"
              name="title"
              placeholder="Masukkan judul yang menarik..."
              required
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white p-4 rounded-[4px] font-bold text-slate-800 transition-all outline-none shadow-sm"
            />
          </div>

          {/* KATEGORI */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <LayoutGrid size={12} className="text-emerald-500" /> Kategori Berita
            </label>
            <select
              name="category_id"
              required
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white p-4 rounded-[4px] font-black text-slate-600 transition-all outline-none cursor-pointer shadow-sm appearance-none"
            >
              <option value="">Pilih Kategori...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-8">
          {/* UPLOAD GAMBAR */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <ImageIcon size={12} className="text-emerald-500" /> Gambar Cover Berita
            </label>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4px] flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all overflow-hidden group shadow-inner"
            >
              <input 
                type="file" 
                name="thumbnailFile" // ✅ Nama ini harus sama dengan yang ada di actions.ts
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <Upload className="text-white" size={30} />
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <ImageIcon size={40} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Klik untuk unggah foto utama</p>
                </div>
              )}
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">
              Status Publikasi
            </label>
            <select
              name="status"
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white p-4 rounded-[4px] font-black text-slate-600 transition-all outline-none shadow-sm"
            >
              <option value="publish">Siap Terbitkan (Live)</option>
              <option value="draft">Simpan sebagai Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAGS AREA */}
      <div className="space-y-3 pt-4 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
          <Tag size={12} className="text-emerald-500" /> Kata Kunci (SEO)
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* EDITOR AREA */}
      <div className="space-y-4 border-t border-slate-50 pt-8 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
          Isi Artikel Lengkap
        </label>
        <div className="border-2 border-slate-50 rounded-[4px] overflow-hidden bg-white shadow-xl min-h-[500px] focus-within:border-emerald-500 transition-all">
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-50">
        <div className="flex items-center gap-4 text-left">
           <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
              <CheckCircle2 size={20} />
           </div>
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
             Konten akan otomatis dioptimasi untuk mesin pencari (SEO).
           </p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto min-w-[320px] bg-slate-900 hover:bg-emerald-600 text-white py-6 px-12 rounded-[4px] font-black uppercase tracking-[0.3em] text-[12px] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:bg-slate-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Memproses Data...
            </>
          ) : (
            "Terbitkan Warta Sekarang 🚀"
          )}
        </button>
      </div>
    </form>
  );
}