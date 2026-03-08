"use client"; // WAJIB: Menandakan ini adalah Client Component

import dynamic from "next/dynamic";

// Memuat komponen secara dinamis hanya di sisi Client
export const LiveChat = dynamic(() => import("./LiveChat"), { 
  ssr: false,
  loading: () => <div className="h-40 animate-pulse bg-slate-50 rounded-[3rem] mx-auto max-w-6xl my-10" /> 
});

export const DonasiSection = dynamic(() => import("./DonasiSection"), { 
  ssr: false 
});