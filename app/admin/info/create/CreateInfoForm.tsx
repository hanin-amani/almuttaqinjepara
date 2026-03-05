"use client";

import { useState } from "react";
import RichTextEditor from "../RichTextEditor";

export default function CreateInfoForm() {

  const [content, setContent] = useState("");

  async function handleSubmit(formData: FormData) {

    formData.set("content", content);

    const res = await fetch("/admin/info/api/create", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      alert("Artikel berhasil dibuat");
      location.reload();
    } else {
      alert("Gagal membuat artikel");
    }

  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow">

      <h1 className="text-2xl font-bold mb-6">
        Buat Artikel
      </h1>

      <form action={handleSubmit} className="space-y-6">

        <div>
          <label className="block font-bold mb-2">
            Judul Artikel
          </label>

          <input
            name="title"
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block font-bold mb-2">
            Isi Artikel
          </label>

          <RichTextEditor
            value={content}
            onChange={setContent}
          />

          <input
            type="hidden"
            name="content"
            value={content}
          />
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-3 rounded"
        >
          Simpan Artikel
        </button>

      </form>

    </div>
  );
}