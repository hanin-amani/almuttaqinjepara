import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LivePlayer from "@/components/LivePlayer"
import { AudioProvider } from "@/context/AudioContext"

// SEO MASTER CONFIGURATION
export const metadata: Metadata = {
  metadataBase: new URL("https://almuttaqinjepara.vercel.app"),
  title: {
    default: "Radio Suara Al Muttaqin Jepara | Menginspirasi Hati Menguatkan Iman", 
    template: "%s | Radio Suara Al Muttaqin",
  },
  description:
    "Radio dakwah resmi Pondok Pesantren Islam Al Muttaqin Jepara. Menyiarkan kajian Al-Qur'an, naskah khutbah Jum'at, dan informasi Baitul Maal Al Muttaqin.",
  keywords: [
    "Radio Suara Al Muttaqin", 
    "Pondok Pesantren Islam Al Muttaqin Jepara",
    "Radio Dakwah Jepara", 
    "Materi Khutbah Jum'at Tematik",
    "Baitul Maal Al Muttaqin",
    "Kajian Islam Online", 
    "PCM Kembaran"
  ],
  authors: [{ name: "Radio Suara Al Muttaqin" }],
  creator: "Radio Suara Al Muttaqin",
  
  // Fitur WhatsApp & Facebook Sharing (Open Graph)
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://radio-suara-al-muttaqin.vercel.app",
    siteName: "Radio Suara Al Muttaqin Jepara",
    title: "Radio Suara Al Muttaqin Jepara - Menginspirasi Hati, Menguatkan Iman",
    description: "Streaming radio dakwah 24 jam dan pusat warta Pondok Pesantren Islam Al Muttaqin Jepara.",
    images: [
      {
        url: "/og-image.jpg", // Letakkan gambar 1200x630px di folder /public
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
    description: "Streaming radio dakwah dan informasi Pondok Pesantren Al Muttaqin.",
    images: ["/og-image.jpg"],
  },

  // Verifikasi Mesin Pencari
  verification: {
    google: "kode-verifikasi-google-anda", // Ganti dengan kode dari Google Search Console
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
      <body className="bg-gray-50 text-gray-900 antialiased font-sans">
        <AudioProvider>
          <Navbar />
          
          <main className="min-h-screen">
            {children}
          </main>
          
          <Footer />
          
          <LivePlayer />
        </AudioProvider>
      </body>
    </html>
  )
}