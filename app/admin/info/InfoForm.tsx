"use client";

import { useState } from "react";
import { createInfo } from "./actions";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";

export default function InfoForm() {
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  return (
    <form
      action={createInfo}
      className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8"
    >
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-emerald-100">
          📝
        </div>
        <div className="text-left">
          <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">
            Manajemen <span className="text-emerald-600">Warta Pondok</span>
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Update berita terbaru Radio Suara Al Muttaqin
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Kolom Judul & Kategori */}
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Judul Artikel
            </label>
            <input
              type="text"
              name="title"
              placeholder="Masukkan judul artikel..."
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl transition-all font-bold text-slate-800 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Kategori Berita
            </label>
            <select
              name="category_id"
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl transition-all font-bold text-slate-600 outline-none cursor-pointer"
              required
            >
              <option value="">Pilih Kategori...</option>
              <option value="11111111-1111-1111-1111-111111111111">Artikel Umum</option>
              <option value="22222222-2222-2222-2222-222222222222">Kabar Pondok</option>
              <option value="33333333-3333-3333-3333-333333333333">Materi Khutbah</option>
              <option value="44444444-4444-4444-4444-444444444444">Info Donasi</option>
              <option value="55555555-5555-5555-5555-555555555555">Kegiatan Santri</option>
            </select>
          </div>
        </div>

        {/* Kolom Media & Status */}
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Thumbnail Utama
            </label>
            <ImageUpload onUpload={(url) => setThumbnail(url)} />
            <input type="hidden" name="thumbnail" value={thumbnail} />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Status Publikasi
            </label>
            <select 
              name="status" 
              className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 outline-none"
            >
              <option value="publish">Diterbitkan (Live)</option>
              <option value="draft">Simpan sebagai Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* AREA EDITOR ANTI-MOLOR */}
      <div className="space-y-3">
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
          Isi Artikel Lengkap
        </label>
        
        <div className="quill-modern-container">
          <RichTextEditor
            content={content}
            onChange={setContent}
          />
        </div>

        <input type="hidden" name="content" value={content} />
      </div>

      {/* Tombol Simpan */}
      <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center md:text-left leading-relaxed">
          PENTING: Pastikan data rekening donasi sudah benar <br/> 
          (BSI 7120202043 & BRI 0022 01 028443 53 3).
        </p>
        <button 
          type="submit"
          className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-300 text-emerald-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-yellow-100 active:scale-95 transform hover:-translate-y-1"
        >
          Simpan & Publikasikan
        </button>
      </div>
    </form>
  );
}