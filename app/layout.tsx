import type { Metadata, Viewport } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LivePlayer from "@/components/LivePlayer"
import { AudioProvider } from "@/context/AudioContext"

// Konfigurasi Viewport untuk responsivitas mobile yang lebih baik
export const viewport: Viewport = {
  themeColor: "#022c22", // Emerald 950 sesuai identitas Al Muttaqin
  width: "device-width",
  initialScale: 1,
}

// SEO MASTER CONFIGURATION
export const metadata: Metadata = {
  metadataBase: new URL("https://almuttaqinjepara.vercel.app"),
  manifest: "/manifest.json", // Menambahkan properti manifest agar Next.js mengenalinya secara otomatis
  title: {
    default: "Radio Suara Al Muttaqin Jepara | Menginspirasi Hati Menguatkan Iman", 
    template: "%s | Radio Suara Al Muttaqin",
  },
  description:
    "Radio dakwah resmi Pondok Pesantren Islam Al Muttaqin Jepara. Menyiarkan kajian Al-Qur'an, naskah khutbah Jum'at tematik, dan informasi program Baitul Maal Al Muttaqin.",
  keywords: [
    "Radio Suara Al Muttaqin", 
    "Pondok Pesantren Islam Al Muttaqin Jepara",
    "Radio Dakwah Jepara", 
    "Materi Khutbah Jum'at Tematik",
    "Baitul Maal Al Muttaqin",
    "Kajian Islam Online", 
    "Dakwah Sunnah Jawa Tengah"
  ],
  authors: [{ name: "Radio Suara Al Muttaqin" }],
  creator: "Radio Suara Al Muttaqin",
  
  // Icons & Favicon (Pastikan file ini ada di folder /public)
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },

  // Fitur WhatsApp & Facebook Sharing (Open Graph)
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://almuttaqinjepara.vercel.app",
    siteName: "Radio Suara Al Muttaqin Jepara",
    title: "Radio Suara Al Muttaqin Jepara - Menginspirasi Hati, Menguatkan Iman",
    description: "Streaming radio dakwah 24 jam dan pusat warta serta materi khutbah Pondok Pesantren Islam Al Muttaqin Jepara.",
    images: [
      {
        url: "/og-image.jpg", // Gambar 1200x630px untuk preview sosmed
        width: 1200,
        height: 630,
        alt: "Radio Suara Al Muttaqin Jepara",
      },
    ],
  },

  // Fitur Twitter/X Card
  twitter: {
    card: "summary_large_image",
    title: "Radio Suara Al Muttaqin Jepara",
    description: "Streaming radio dakwah dan informasi program Pondok Pesantren Al Muttaqin.",
    images: ["/og-image.jpg"],
  },

  // Verifikasi Mesin Pencari (Google Search Console)
  verification: {
    google: "kode-verifikasi-google-anda", 
  },

  // Navigasi Crawler
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-white text-slate-900 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <AudioProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow">
              {children}
            </main>
            
            <Footer />
            <LivePlayer />
          </div>
        </AudioProvider>
      </body>
    </html>
  )
}