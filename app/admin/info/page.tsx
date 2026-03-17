"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Pencil, Trash2, Loader2, Plus } from "lucide-react";

export default function InfoPage() {
  const [infos, setInfos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/info?t=${Date.now()}`);
      const data = await res.json();
      setInfos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin mau menghapus warta: "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/info/${id}`, { method: "DELETE" });
      if (res.ok) setInfos(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert("Gagal menghapus");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400 italic">MEMUAT DATA...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-slate-900 p-6 rounded-[4px] shadow-lg border-b-4 border-emerald-500">
        <div className="text-left">
          <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">Manajemen <span className="text-emerald-400">Warta Pondok</span></h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Daftar semua berita Radio RSM</p>
        </div>
        <Link href="/admin/info/create" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-[4px] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
          <Plus size={14} /> Tambah Warta
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-[4px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-500">
              <th className="p-4">Judul Warta</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {infos.map((info) => (
              <tr key={info.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="text-sm font-bold text-slate-800 line-clamp-1 italic uppercase tracking-tight">{info.title}</p>
                  <p className="text-[10px] text-slate-400 italic">/{info.slug}</p>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[9px] font-black uppercase rounded-[2px]">{info.category?.name || "Warta"}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-[2px] ${info.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>{info.status}</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {/* TOMBOL EDIT - Mengarah ke folder [id]/edit */}
                    <Link href={`/admin/info/${info.id}/edit`} className="p-2 bg-slate-100 text-slate-600 rounded-[4px] hover:bg-emerald-600 hover:text-white transition-all">
                      <Pencil size={14} />
                    </Link>
                    {/* TOMBOL HAPUS */}
                    <button 
                      onClick={() => handleDelete(info.id, info.title)}
                      disabled={deletingId === info.id}
                      className="p-2 bg-red-50 text-red-500 rounded-[4px] hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                    >
                      {deletingId === info.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}