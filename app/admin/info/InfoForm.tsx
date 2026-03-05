"use client";

import { createInfo } from "./actions";

export default function InfoForm() {
  return (
    <form
      action={createInfo}
      className="bg-white p-6 rounded-2xl shadow mb-10 space-y-4"
    >
      <h2 className="text-xl font-bold">Tambah Artikel</h2>

      <input
        type="text"
        name="title"
        placeholder="Judul Artikel"
        className="w-full border p-3 rounded-lg"
        required
      />

      <textarea
        name="content"
        placeholder="Isi artikel..."
        rows={6}
        className="w-full border p-3 rounded-lg"
        required
      />

      <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold">
        Simpan Artikel
      </button>
    </form>
  );
}