"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { LogIn, LogOut, User, Loader2, Heart, Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Warta", path: "/warta" },
    { name: "Jadwal", path: "/jadwal" },
    { name: "Komunitas", path: "/komunitas" },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_15px_50px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        
        {/* LOGO SECTION - Sekarang Tampil di Mobile */}
        <div className="flex flex-col">
          <Link href="/" className="group flex items-center gap-2 md:gap-3">
            <span className="text-xl md:text-2xl transition-transform duration-300 group-hover:rotate-12">
              🎙️
            </span>
            <div className="flex flex-col">
              <h1 className="text-sm md:text-lg font-black text-slate-900 uppercase italic leading-none tracking-tighter">
                Radio Suara <span className="text-emerald-600">Al Muttaqin</span>
              </h1>
              <p className="text-[8px] md:text-[10px] text-emerald-600/80 font-bold uppercase tracking-[0.15em] mt-1">
                Menginspirasi hati, menguatkan iman
              </p>
            </div>
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* AUTH & ACTIONS (Desktop) */}
        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-100">
          <Link
            href="/donasi"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            <Heart size={12} fill="currentColor" /> Donasi
          </Link>

          {status === "loading" ? (
            <Loader2 className="animate-spin text-slate-300" size={20} />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-[4px] overflow-hidden border border-slate-200">
                <Image src={session.user?.image || ""} alt="User" fill className="object-cover" />
              </div>
              <button onClick={() => signOut()} className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-[4px] hover:bg-red-500 hover:text-white transition-all">
                <LogOut size={16} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-100 active:scale-95"
            >
              <LogIn size={14} strokeWidth={3} /> Login
            </Link>
          )}
        </div>

        {/* MOBILE TOGGLE - Hamburger */}
        <button 
          className="md:hidden p-2 text-slate-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 border-b border-slate-50 pb-2"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Link
              href="/donasi"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-[4px] text-[10px] font-black uppercase tracking-widest"
            >
              <Heart size={14} fill="currentColor" /> Donasi Sekarang
            </Link>
            
            {!session ? (
              <Link 
                href="/login"
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-[4px] text-[10px] font-black uppercase tracking-widest"
              >
                <LogIn size={14} /> Login Jamaah
              </Link>
            ) : (
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-red-600 py-4 rounded-[4px] text-[10px] font-black uppercase tracking-widest"
              >
                <LogOut size={14} /> Logout ({session.user?.name?.split(' ')[0]})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}