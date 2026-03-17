"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text(); // Ambil sebagai text dulu (lebih aman)

      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Response bukan JSON valid");
      }

      if (!res.ok) {
        setError(data.error || "Login gagal");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-emerald-700 text-center">
          Login Admin
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}