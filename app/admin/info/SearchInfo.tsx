"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export default function SearchInfo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // ✅ STATE LOKAL: Biar ketikan di input terasa instan, enteng, dan responsif
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q")?.toString() || "");

  // ✅ LOGIKA DEBOUNCE: Menunggu 400ms setelah berhenti mengetik baru menembak URL (Hemat Query DB!)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchTerm) {
        params.set("q", searchTerm);
      } else {
        params.delete("q");
      }

      // Jalankan transisi URL secara non-blocking
      startTransition(() => {
        router.push(`/admin/info?${params.toString()}`);
      });
    }, 400); // 🟢 Jeda toleransi ketikan

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams]);

  return (
    <div className="relative w-full mb-8 font-sans text-left">
      {/* ICON SEARCH */}
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <span className="text-xl">🔍</span>
      </div>
      
      {/* INPUT FIELD */}
      <input
        type="text"
        placeholder="Cari judul artikel atau konten... [Savage!]"
        className="w-full pl-14 pr-16 py-5 bg-white rounded-[2rem] border border-emerald-100 shadow-sm focus:ring-4 focus:ring-emerald-100 outline-none font-bold text-emerald-900 transition-all shadow-emerald-900/5"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* SPINNER LOADING INDIKATOR */}
      {isPending && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}