"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  Heart,
  MessageCircle,
} from "lucide-react";

export default function DonasiPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const bankAccounts = [
    {
      bank: "Bank Syariah Indonesia",
      number: "7120202043",
      name: "Baitul Maal Al Muttaqin",
      logo: "/bsi.png",
    },
    {
      bank: "Bank Rakyat Indonesia",
      number: "002201028443533",
      name: "Baitul Maal Al Muttaqin",
      logo: "/bri.png",
    },
  ];

  const waLink =
    "https://wa.me/6281325182875?text=Assalamualaikum,%20saya%20ingin%20konfirmasi%20transfer%20donasi%20untuk%20Baitul%20Maal%20Al%20Muttaqin";

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopied(number);

    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  const formatAccount = (value: string) => {
    return value.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* HERO */}
      <section className="border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* KIRI */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">
                <Heart
                  size={15}
                  className="fill-emerald-600 text-emerald-600"
                />

                <span className="text-sm font-medium text-emerald-700">
                  Infaq & Sedekah Jariyah
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
                Dukung Dakwah
                <span className="block text-emerald-600">
                  Al Muttaqin
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                Setiap donasi yang Anda salurkan akan digunakan
                untuk mendukung operasional dakwah, pendidikan,
                pembinaan santri, serta pengembangan Pondok
                Pesantren Islam Al Muttaqin.
              </p>

              <div className="mt-8">
                <Link
                  href={waLink}
                  target="_blank"
                  className="inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-7 py-4 font-semibold text-white transition hover:bg-emerald-700"
                >
                  <MessageCircle size={20} />
                  Konfirmasi via WhatsApp
                </Link>
              </div>
            </div>

            {/* KANAN */}
            <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Donasi Online
              </div>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Transfer ke rekening berikut
              </h2>

              <p className="mt-3 text-slate-600">
                Pilih salah satu rekening lalu lakukan
                konfirmasi setelah transfer.
              </p>

              {/* REKENING KECIL DI DALAM CARD */}
              <div className="mt-8 space-y-4">
                {bankAccounts.map((acc) => (
                  <div
                    key={acc.number}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white">
                        <Image
                          src={acc.logo}
                          alt={acc.bank}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="text-xs text-slate-500">
                          {acc.bank}
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-900">
                            {formatAccount(acc.number)}
                          </span>

                          <button
                            onClick={() =>
                              handleCopy(acc.number)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-emerald-50"
                          >
                            {copied === acc.number ? (
                              <Check
                                size={15}
                                className="text-emerald-600"
                              />
                            ) : (
                              <Copy size={15} />
                            )}
                          </button>
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          a.n. {acc.name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 pt-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl bg-emerald-600 p-10 text-white">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

              <div>
                <h3 className="text-3xl font-bold">
                  Sudah melakukan transfer?
                </h3>

                <p className="mt-3 text-emerald-50">
                  Silakan lakukan konfirmasi melalui
                  WhatsApp agar donasi Anda dapat segera
                  kami catat dan verifikasi.
                </p>
              </div>

              <div className="flex justify-start lg:justify-end">
                <Link
                  href={waLink}
                  target="_blank"
                  className="inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  <MessageCircle size={20} />
                  Konfirmasi via WhatsApp
                </Link>
              </div>

            </div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            Jazakumullahu khairan katsiran atas dukungan
            dan kontribusi Anda untuk dakwah Islam.
          </div>
        </div>
      </section>
    </main>
  );
}