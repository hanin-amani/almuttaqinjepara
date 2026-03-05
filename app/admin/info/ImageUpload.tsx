"use client";

import { useState } from "react";

export default function ImageUpload({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.url) {
      onUpload(data.url);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold">Upload Thumbnail</label>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="w-full border p-3 rounded-xl"
      />

      {loading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}