"use client";

import { useState, useEffect } from "react";
import { Upload, Loader2, AlertCircle, ImageIcon, CheckCircle2 } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultPreview?: string; // Menyediakan preview awal jika sedang mode EDIT warta
}

export default function ImageUpload({ onUpload, defaultPreview = "" }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultPreview);

  // Sync ulang preview jika defaultPreview berubah (misal saat data edit baru mendarat)
  useEffect(() => {
    if (defaultPreview) {
      setPreviewUrl(defaultPreview);
    }
  }, [defaultPreview]);

  // Cleanup object URL untuk mencegah memory leak di browser admin
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // 🟢 OPTIMASI SEO & STORAGE: Batasi ukuran file cover (Maksimal 2MB)
    const max_size = 2 * 1024 * 1024; // 2MB
    if (file.size > max_size) {
      setError("Ukuran foto terlalu gajah! Maksimal bunderan 2MB saja biar hemat storage & SEO cepat.");
      return;
    }

    // Buat preview lokal instan di browser sebelum dilempar ke server
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Server merespon dengan status buruk saat upload");
      }

      const data = await res.json();

      if (data.url) {
        onUpload(data.url);
        setPreviewUrl(data.url); // Perbarui dengan URL Cloud/Supabase Storage asli yang sah
      } else {
        throw new Error(data.message || "URL upload tidak ditemukan");
      }
    } catch (err: any) {
      console.error("💥 Gagal mengunggah gambar cover:", err);
      setError("Gagal upload gambar ke storage serverless. Cek koneksi Supabase/Cloudinary antum!");
      // Kembalikan ke preview awal jika gagal
      setPreviewUrl(defaultPreview);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 text-left font-sans">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">
        Gambar Cover / Thumbnail Warta
      </label>

      {/* ERROR MESSAGE DILAPISI TAMENG */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-[4px] flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
          <AlertCircle size={16} className="shrink-0" />
          <p className="text-[10px] font-black uppercase tracking-wider leading-relaxed">{error}</p>
        </div>
      )}

      {/* BINDING AREA KLIK UPLOAD */}
      <div 
        onClick={() => !loading && document.getElementById("file-upload-input")?.click()}
        className={`group relative w-full aspect-video bg-slate-50 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all overflow-hidden p-4 shadow-inner ${
          loading 
            ? "border-amber-400 bg-amber-50/20 cursor-wait" 
            : "border-slate-200 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30"
        }`}
      >
        {/* HIDDEN INPUT FILE */}
        <input
          id="file-upload-input"
          type="file"
          accept="image/*"
          disabled={loading}
          onChange={handleUpload}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img src={previewUrl} alt="Preview Cover" className="w-full h-full object-cover" />
            
            {/* OVERLAY KONDISIONAL SIAP GANTI FOTO */}
            {!loading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all text-white">
                <Upload size={24} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-wider">Ganti Cover Baru</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Klik untuk unggah foto utama</p>
          </div>
        )}

        {/* LOADING STATE INTERAKTIF */}
        {loading && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
            <Loader2 className="animate-spin text-amber-400 mb-3" size={32} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
              Mengompres & Mengunggah...
            </p>
          </div>
        )}
      </div>

      {/* INFORMASI SUKSES KECIL DI BAWAH KOTAK */}
      {previewUrl && !loading && !error && (
        <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1">
          <CheckCircle2 size={12} /> Gambar cover terverifikasi & siap rilis
        </p>
      )}
    </div>
  );
}