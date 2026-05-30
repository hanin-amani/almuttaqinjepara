"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Mic2, Github, ChevronLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    
    try {
      // 🚀 SUPABASE OAUTH MURNI: Langsung lempar jemaah ke gerbang otentikasi Google/GitHub
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          // Setelah sukses, arahkan jemaah kembali ke panggung utama warta berita
          redirectTo: `${window.location.origin}/warta`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error(`💥 Gagal memicu login via ${provider}:`, err.message);
      alert(`Waduh Fal, gagal login via ${provider}. Pastikan credentials keys di Supabase aktif!`);
      setLoadingProvider(null);
    }
  };

  return (
    <main className="min-h-[90vh] flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-[4px] shadow-[0_25px_70px_rgba(0,0,0,0.07)] p-12 text-center relative overflow-hidden">
        
        {/* AKSEN DEKORATIF EMERALD */}
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>

        {/* LOGO SECTION - Mic Broadcast Icon */}
        <div className="mb-12">
          <div className="w-20 h-20 bg-emerald-600 text-white flex items-center justify-center rounded-full mx-auto mb-6 shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-transform hover:scale-110 duration-500">
            <Mic2 size={36} strokeWidth={2} className={loadingProvider ? "animate-pulse" : ""} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            Halaman <span className="text-emerald-600">Login</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-4">
            Akses Diskusi Radio Al Muttaqin
          </p>
        </div>

        {/* PILIHAN LOGIN AUTHENTIC VIA SUPABASE */}
        <div className="space-y-4">
          
          {/* ✅ GOOGLE AUTHENTIC */}
          <button 
            type="button"
            disabled={loadingProvider !== null}
            onClick={() => handleOAuthLogin("google")}
            className="w-full flex items-center justify-center gap-4 bg-white border border-slate-200 p-4 rounded-[4px] hover:border-emerald-500 hover:bg-slate-50 transition-all group active:scale-95 shadow-sm disabled:bg-slate-50 disabled:text-slate-400"
          >
            {loadingProvider === "google" ? (
              <Loader2 className="animate-spin text-emerald-600" size={20} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">
              {loadingProvider === "google" ? "Menghubungkan..." : "Masuk dengan Google"}
            </span>
          </button>

          {/* ✅ GITHUB BRAND */}
          <button 
            type="button"
            disabled={loadingProvider !== null}
            onClick={() => handleOAuthLogin("github")}
            className="w-full flex items-center justify-center gap-4 bg-slate-900 text-white p-4 rounded-[4px] hover:bg-slate-800 transition-all shadow-md active:scale-95 border-b-4 border-slate-950 disabled:bg-slate-200"
          >
            {loadingProvider === "github" ? (
              <Loader2 className="animate-spin text-white" size={20} />
            ) : (
              <Github size={20} fill="currentColor" />
            )}
            <span className="text-[11px] font-black uppercase tracking-widest italic">
              {loadingProvider === "github" ? "Menghubungkan..." : "Masuk dengan GitHub"}
            </span>
          </button>
        </div>

        {/* FOOTER & BACK */}
        <div className="mt-12 pt-8 border-t border-slate-50">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
          </Link>
        </div>

      </div>
    </main>
  );
}