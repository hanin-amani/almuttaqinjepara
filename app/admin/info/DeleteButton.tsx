"use client"; // Wajib ada untuk tombol interaktif

import { deleteInfo } from "./actions";

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = (e: React.FormEvent) => {
    if (!confirm("Yakin ingin menghapus warta ini? Materi yang dihapus tidak bisa dikembalikan.")) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteInfo} onSubmit={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit"
        className="bg-white hover:bg-red-50 text-red-500 w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
        title="Hapus Artikel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </form>
  );
}