"use client"

import { useState } from "react"
import { generateSlug } from "@/lib/slug"

export default function NewPostPage() {

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setTitle(value)

    const autoSlug = generateSlug(value)
    setSlug(autoSlug)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {

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

        alert("✅ Artikel berhasil dibuat")

        setTitle("")
        setSlug("")

      } else {

        const data = await res.json()
        alert("❌ Gagal membuat artikel: " + data.message)

      }

    } catch (error) {

      console.error(error)
      alert("❌ Terjadi kesalahan server")

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="max-w-3xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        Buat Artikel Baru
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 shadow space-y-6"
      >

        {/* TITLE */}

        <div>

          <label className="block mb-2 font-semibold">
            Judul Artikel
          </label>

          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Masukkan judul artikel..."
            required
          />

        </div>

        {/* SLUG */}

        <div>

          <label className="block mb-2 font-semibold">
            Slug URL
          </label>

          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <p className="text-sm text-gray-500 mt-2">
            URL artikel: <span className="font-mono">/artikel/{slug}</span>
          </p>

        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Simpan Artikel"}
        </button>

      </form>

    </div>
  )
}