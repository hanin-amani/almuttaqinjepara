"use client";

import { useFormStatus } from "react-dom";
import { deleteInfo } from "./actions";
import { Loader2, Trash2 } from "lucide-react";

// 🟢 SUB-KOMPONEN INTERNAL: Dibuat terpisah agar useFormStatus bisa mendeteksi form induknya
function SubmitFormButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-12 h-12 rounded-2xl border transition-all flex items-center justify-center shadow-sm active:scale-95 ${
        pending
          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-wait animate-pulse"
          : "bg-white hover:bg-red-50 text-red-500 border-slate-100 hover:scale-105"
      }`}
      title={pending ? "Sedang Menghapus..." : "Hapus Artikel"}
    >
      {pending ? (
        <Loader2 size={18} className="animate-spin text-red-500" />
      ) : (
        <Trash2 size={18} strokeWidth={2.5} />
      )}
    </button>
  );
}

export default function DeleteButton({ id }: { id: string }) {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 🚀 CEGATAN VALIDASI: Konfirmasi mutlak di level Form Event agar Next.js Action aman dari klik tidak sengaja
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus warta ini? Materi yang dihapus akan sirna selamanya dari database RSM dan tidak bisa dikembalikan."
    );
    
    if (!confirmDelete) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteInfo} onSubmit={handleFormSubmit} className="inline-block">
      {/* Pengiriman ID unik UUID warta secara aman via hidden input */}
      <input type="hidden" name="id" value={id} />
      
      {/* Tombol dengan indikator pending loading otomatis */}
      <SubmitFormButton />
    </form>
  );
}