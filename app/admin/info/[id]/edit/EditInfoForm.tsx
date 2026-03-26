"use client";

import { useState, useRef, useEffect } from "react";
import { updateInfo } from "../../actions"; 
import RichTextEditor from "../../RichTextEditor";
import { 
  ArrowLeft, Save, ImageIcon, Upload, X, RefreshCcw, 
  Link as LinkIcon, Lock, Unlock, CheckCircle2, Loader2 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InfoData {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string | null;
  status: string;
  category_id?: string | null;
}

export default function EditInfoForm({ data }: { data: InfoData }) {
  const router = useRouter();
  
  // ✅ STATE UTAMA (Auto-Slug Logic)
  const [title, setTitle] = useState(data.title);
  const [slug, setSlug] = useState(data.slug);
  const [isSlugLocked, setIsSlugLocked] = useState(true); 

  const [content, setContent] = useState(data.content);
  const [previewUrl, setPreviewUrl] = useState(data.thumbnail || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ FUNGSI GENERATOR SLUG
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .trim();
  };

  // ✅ EFFECT: Sync Slug saat judul berubah (jika Unlocked)
  useEffect(() => {
    if (!isSlugLocked) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugLocked]);

  // ✅ CLEANUP: Revoke URL object untuk cegah memory leak
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleResetImage = () => {
    setPreviewUrl(data.thumbnail || "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /**
   * CLIENT ACTION: Membungkus Server Action untuk feedback UI
   */
  const clientAction = async (formData: FormData) => {
    setLoading(true);
    
    // Pastikan data state terbaru ikut terkirim
    formData.append("content", content);
    formData.append("slug", slug);

    try {
      await updateInfo(formData);
      setSuccess(true);
      // Redirect setelah 2 detik agar admin bisa lihat notifikasi sukses
      setTimeout(() => router.push("/admin/info"), 2000);
    } catch (err) {
      console.error("Gagal simpan:", err);
      setLoading(false);
      alert("Waduh, gagal simpan perubahan. Cek koneksi database!");
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-slate-100 mb-12 relative overflow-hidden text-left font-sans">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

      {/* ✅ SUCCESS OVERLAY (Savage Feedback) */}
      {success && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-emerald-600/95 text-white animate-in fade-in duration-500">
          <CheckCircle2 size={60} className="mb-4 animate-bounce" />
          <h2 className="text-xl font-black uppercase tracking-[0.3em] italic">Perubahan Tersimpan!</h2>
          <p className="text-xs text-emerald-100 mt-2 font-bold uppercase tracking-widest">Sinkronisasi data berhasil...</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-emerald-950 uppercase italic tracking-tighter flex items-center gap-3">
            <span className="p-3 bg-emerald-100 rounded-2xl">✏️</span>
            Edit <span className="text-emerald-600">Warta Pondok</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 ml-1">Pusat Kendali Al Muttaqin</p>
        </div>
        <Link href="/admin/info" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={14} /> Kembali ke Daftar
        </Link>
      </div>

      <form action={clientAction} className="space-y-8 relative z-10">
        <input type="hidden" name="id" value={data.id} />
        <input type="hidden" name="oldThumbnail" value={data.thumbnail || ""} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            {/* Judul */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1 text-left">Judul Warta Utama</label>
              <input 
                name="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
                className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none font-bold text-slate-800 transition-all shadow-sm" 
              />
            </div>

            {/* ✅ AUTO-SLUG FIELD (Premium Edit Mode) */}
            <div>
              <div className="flex justify-between items-center mb-3 ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <LinkIcon size={12} className="text-emerald-500" /> URL / Slug (SEO)
                </label>
                <button 
                  type="button" 
                  onClick={() => setIsSlugLocked(!isSlugLocked)}
                  className={`text-[9px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 transition-all ${isSlugLocked ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-600'}`}
                >
                  {isSlugLocked ? <><Lock size={10} /> Locked</> : <><Unlock size={10} /> Unlocked</>}
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-[11px]">/warta/</span>
                <input
                  type="text"
                  value={slug}
                  readOnly={isSlugLocked}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  className={`w-full px-6 py-5 pl-20 rounded-[1.5rem] border-2 ${isSlugLocked ? 'border-transparent bg-slate-50 text-slate-400' : 'border-amber-400 bg-white text-slate-800'} outline-none font-bold text-xs transition-all shadow-inner`}
                />
              </div>
              <p className="mt-2 ml-1 text-[8px] text-slate-300 italic uppercase font-bold tracking-wider">
                * Hati-hati: Mengubah slug akan mematikan link lama yang sudah tersebar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-left">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Kategori</label>
                <select 
                  name="category_id" 
                  defaultValue={data.category_id || ""} 
                  className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none font-black text-slate-700 appearance-none focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
                >
                  <option value="11111111-1111-1111-1111-111111111111">📰 Kabar Pondok</option>
                  <option value="33333333-3333-3333-3333-333333333333">🎙️ Materi Khutbah</option>
                  <option value="44444444-4444-4444-4444-444444444444">💰 Info Donasi</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Status</label>
                <select 
                  name="status" 
                  defaultValue={data.status || "publish"} 
                  className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none font-black text-slate-700 appearance-none focus:ring-4 focus:ring-emerald-100 shadow-sm"
                >
                  <option value="publish">Terbitkan (Live)</option>
                  <option value="draft">Simpan Draft</option>
                </select>
              </div>
            </div>

            {/* UPLOAD GAMBAR */}
            <div className="text-left">
              <div className="flex justify-between items-center mb-3 ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gambar Utama</label>
                {previewUrl !== data.thumbnail && (
                  <button type="button" onClick={handleResetImage} className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1 hover:underline">
                    <RefreshCcw size={10} /> Reset
                  </button>
                )}
              </div>
              <div onClick={() => fileInputRef.current?.click()} className="group relative cursor-pointer border-2 border-dashed border-slate-200 rounded-[2rem] p-4 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all overflow-hidden bg-slate-50/50">
                <input ref={fileInputRef} type="file" name="thumbnailFile" className="hidden" accept="image/*" onChange={handleFileChange} />
                {previewUrl ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all text-white">
                      <Upload size={24} className="mb-2" />
                      <span className="text-[10px] font-black uppercase">Ganti Gambar</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Klik unggah foto</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* EDITOR KONTEN */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Isi Warta / Konten Utama</label>
            <div className="flex-1 bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden focus-within:ring-4 focus-within:ring-emerald-100 transition-all min-h-[500px] shadow-inner">
              <RichTextEditor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-6 bg-emerald-950 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-emerald-900 shadow-2xl active:scale-[0.98] transition-all disabled:bg-slate-300 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} className="text-emerald-400" /> SIMPAN PERUBAHAN 💾</>}
          </button>
        </div>
      </form>
    </div>
  );
}