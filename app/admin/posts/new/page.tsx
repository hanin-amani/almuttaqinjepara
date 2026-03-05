"use client"

import { useState } from "react"
import { createSlug } from "@/lib/slug"

export default function NewPostPage() {

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setTitle(value)

    const autoSlug = createSlug(value)
    setSlug(autoSlug)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        slug
      })
    })

    if (res.ok) {
      alert("Artikel berhasil dibuat")
      setTitle("")
      setSlug("")
    } else {
      alert("Gagal membuat artikel")
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Buat Artikel Baru
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-2 font-medium">
            Judul Artikel
          </label>

          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full border rounded p-2"
            placeholder="Masukkan judul artikel..."
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Slug URL
          </label>

          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border rounded p-2"
          />

          <p className="text-sm text-gray-500 mt-1">
            URL artikel: /artikel/{slug}
          </p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan Artikel
        </button>

      </form>
    </div>
  )
}