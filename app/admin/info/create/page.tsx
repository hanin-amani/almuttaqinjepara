"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createInfo } from "@/app/admin/info/actions"; 
import RichTextEditor from "../RichTextEditor";
import TagInput from "@/components/TagInput";
import { 
  Loader2, CheckCircle2, LayoutGrid, FileText, 
  ImageIcon, Tag, ChevronLeft, AlertCircle, 
  Upload, Link as LinkIcon, Lock, Unlock 
} from "lucide-react";

export default function CreateInfoPage() {
  const router = useRouter();
  
  // ✅ STATE UTAMA & AUTO-SLUG
  const [title, setTitle] = useState(""); 
  const [slug, setSlug] = useState("");   
  const [isSlugLocked, setIsSlugLocked] = useState(true); 

  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ FUNGSI GENERATOR SLUG (Clean & SEO Friendly)
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")           // Ganti spasi dengan strip
      .replace(/[^\w-]+/g, "")       // Hapus simbol aneh
      .replace(/--+/g, "-")          // Cegah strip ganda
      .trim();
  };

  // ✅ EFFECT: Update Slug otomatis saat judul berubah (jika terkunci)
  useEffect(() => {
    if (isSlugLocked) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugLocked]);

  // ✅ FETCH KATEGORI DARI API
  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Gagal memuat kategori.");
      }
    }
    fetchCats();
  }, []);

  // ✅ CLEANUP: Revoke URL object untuk cegah memory leak
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /**
   * ✅ CLIENT ACTION: Penanganan agar tidak kena Digest Error saat Redirect
   */
  async function clientAction(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    // Masukkan data manual ke FormData
    formData.append("content", content);
    formData.append("tags", tags.join(","));
    formData.append("slug", slug); 

    try {
      // Panggil Server Action
      await createInfo(formData);
      
      // Jika berhasil sampai sini, tampilkan overlay sukses
      setSuccess(true);
      // Catatan: redirect() di server action biasanya akan langsung memindahkan halaman
    } catch (err: any) {
      /**
       * PENTING: Next.js 'redirect' melempar error internal. 
       * Jika pesan error mengandung 'NEXT_REDIRECT', itu bukan error beneran.
       */
      if (err.message === "NEXT_REDIRECT") {
        setSuccess(true);
        return;
      }

      console.error("Error Detail:", err);
      setError(err.message || "Database sedang Stun! Cek koneksi di Vercel.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-10 text-left font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* NAVIGASI KEMBALI */}
        <div className="mb-6">
          <Link 
            href="/admin/info" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
          >
            <ChevronLeft size={14} /> Kembali ke Dashboard
          </Link>
        </div>

        <form
          action={clientAction}
          className="relative bg-white border border-slate-100 rounded-[4px] shadow-2xl p-6 md:p-10 space-y-8 overflow-hidden"
        >
          {/* SUCCESS OVERLAY */}
          {success && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-emerald-600/95 text-white animate-in fade-in duration-500">
              <CheckCircle2 size={60} className="mb-4 animate-bounce" />
              <h2 className="text-xl font-black uppercase tracking-[0.3em] italic text-center">Warta Berhasil Terbit</h2>
              <p className="text-xs text-emerald-100 mt-2 font-bold uppercase tracking-widest text-center px-6">
                Data tersimpan di database & storage. Mengarahkan kembali...
              </p>
            </div>
          )}

          {/* HEADER EDITOR */}
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 bg-slate-900 text-emerald-400 flex items-center justify-center rounded-[4px] shadow-lg">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Editor Warta Utama</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">RSM Media Center Al Muttaqin</p>
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-[4px] flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <p className="text-[11px] font-black uppercase tracking-wider">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              {/* JUDUL ARTIKEL */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Judul Artikel Berita</label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul berita..."
                  required
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white p-4 rounded-[4px] font-bold text-slate-800 transition-all outline-none shadow-sm"
                />
              </div>

              {/* AUTO-SLUG */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <LinkIcon size={12} className="text-emerald-500" /> URL / Slug Berita
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setIsSlugLocked(!isSlugLocked)}
                    className={`text-[9px] font-black uppercase px-2 py-1 rounded flex items-center gap-1 transition-all ${isSlugLocked ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-600'}`}
                  >
                    {isSlugLocked ? <><Lock size={10} /> Terkunci</> : <><Unlock size={10} /> Edit Manual</>}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-[11px]">/warta/</span>
                  <input
                    type="text"
                    value={slug}
                    readOnly={isSlugLocked}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    className={`w-full bg-slate-50 border-2 ${isSlugLocked ? 'border-transparent text-slate-400' : 'border-amber-400 bg-white text-slate-800'} p-4 pl-16 rounded-[4px] font-bold text-xs transition-all outline-none shadow-sm`}
                  />
                </div>
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
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  ) : (
                    <option disabled>Memuat kategori dari database...</option>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-8">
              {/* UPLOAD COVER */}
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
                    name="thumbnailFile" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover animate-in fade-in" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-black text-[10px] uppercase">
                        <Upload size={24} className="mb-2" /> Ganti Foto
                      </div>
                    </>
                  ) : (
                    <div className="text-center px-4">
                      <ImageIcon size={40} className="text-slate-200 mx-auto mb-2" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Klik untuk pilih foto cover</p>
                    </div>
                  )}
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Status Publikasi</label>
                <select
                  name="status"
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white p-4 rounded-[4px] font-black text-slate-600 transition-all outline-none shadow-sm"
                >
                  <option value="publish">Langsung Terbitkan (Live)</option>
                  <option value="draft">Simpan sebagai Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* TAGS AREA */}
          <div className="space-y-3 pt-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
              <Tag size={12} className="text-emerald-500" /> Tags / Kata Kunci SEO
            </label>
            <TagInput tags={tags} setTags={setTags} />
          </div>

          {/* EDITOR AREA */}
          <div className="space-y-4 border-t border-slate-50 pt-8">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Isi Artikel Lengkap</label>
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
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest max-w-[250px] leading-relaxed italic">
                 Konten akan dioptimasi secara otomatis untuk pencarian Google.
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
                  SEDANG MENERBITKAN...
                </>
              ) : (
                "Terbitkan Warta Sekarang 🚀"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}