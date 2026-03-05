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

      {/* EDITOR */}
      <div>
        <label className="font-bold">Isi Artikel</label>

        <RichTextEditor
          value={content}
          onChange={setContent}
        />

        <input type="hidden" name="content" value={content} />
      </div>

      {/* UPLOAD GAMBAR */}
      <ImageUpload onUpload={(url) => setThumbnail(url)} />

      <input type="hidden" name="thumbnail" value={thumbnail} />

      {/* STATUS */}
      <div>
        <label>Status</label>

        <select
          name="status"
          defaultValue="publish"
          className="w-full px-4 py-3 border rounded-xl"
        >
          <option value="publish">Publish</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold">
        Simpan Artikel
      </button>

    </form>
  );
}