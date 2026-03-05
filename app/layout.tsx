import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LivePlayer from "@/components/LivePlayer"
import { AudioProvider } from "@/context/AudioContext"

export const metadata: Metadata = {
  metadataBase: new URL("https://radio-suara-al-muttaqin.vercel.app"),
  title: {
    default: "Radio Suara Al Muttaqin Jepara", 
    template: "%s | Radio Suara Al Muttaqin",
  },
  description:
    "Radio dakwah Pondok Pesantren Al Muttaqin Jepara. Menginspirasi hati, menguatkan iman melalui siaran islami dan kajian Al-Qur'an.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-gray-50 text-gray-900 antialiased font-sans">
        <AudioProvider>
          <Navbar />
          
          {/* PERBAIKAN: Hapus padding bottom di sini agar menempel ke Footer */}
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Tambahkan padding di dalam Footer agar tidak tertutup player */}
          <Footer />
          
          <LivePlayer />
        </AudioProvider>
      </body>
    </html>
  )
}