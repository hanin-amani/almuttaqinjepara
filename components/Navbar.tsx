"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import {
  LogIn,
  LogOut,
  Loader2,
  Heart,
  Menu,
  X,
  Search,
  Radio,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Jadwal", path: "/jadwal" },
    { name: "Komunitas", path: "/komunitas" },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setLoadingAuth(true);
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsMenuOpen(false);
  };

  const getShortName = () => {
    if (!user) return "";
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "Jemaah";
    return fullName.split(" ")[0];
  };

  const getAvatarUrl = () => {
    return (
      user?.user_metadata?.avatar_url ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    );
  };

  return (
    <header className="sticky top-0 z-[999] w-full bg-emerald-50/75 backdrop-blur-xl border-b border-emerald-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 md:h-20 flex items-center justify-between gap-4">
          
          {/* LOGO (SINKRONISASI PANJANG TEKS ATAS DAN BAWAH) */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-all duration-300">
              <Radio size={20} className="animate-pulse" />
            </div>
            <div className="flex flex-col w-[105px] md:w-[122px]">
              <h1 className="font-black text-xs md:text-sm text-emerald-950 tracking-normal leading-none">
                RADIO SUARA
              </h1>
              <span className="text-[9px] md:text-[10px] font-black text-emerald-700 tracking-[0.32em] md:tracking-[0.38em] leading-none mt-1 block translate-x-[1px]">
                ALMUTTAQIN
              </span>
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`text-base font-bold tracking-wide transition-all relative py-2 block
                    ${isActive ? "text-emerald-700 font-extrabold scale-105" : "text-emerald-900/80 hover:text-emerald-950"}
                  `}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP SEARCH & ACTIONS */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xl justify-end ml-auto">
            
            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} className="relative w-full max-w-[280px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel atau kajian..."
                className="w-full h-11 rounded-xl bg-white/60 border border-emerald-200/60 pl-4 pr-10 text-sm font-medium text-emerald-950 outline-none transition-all placeholder:text-emerald-700/50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                <Search size={16} />
              </button>
            </form>

            {/* TOMBOL DONASI */}
            <Link
              href="/donasi"
              className="h-11 px-5 rounded-xl bg-emerald-600 text-white flex items-center gap-2 text-sm font-bold shadow-md shadow-emerald-700/10 hover:bg-emerald-700 transition-all active:scale-95"
            >
              <Heart size={15} fill="currentColor" />
              Donasi
            </Link>

            {/* AUTH SECTION */}
            <div className="h-11 border-l border-emerald-200/60 pl-4 flex items-center">
              {loadingAuth ? (
                <Loader2 size={16} className="animate-spin text-emerald-700" />
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={getAvatarUrl()}
                      alt="Profile"
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-200"
                    />
                    <ChevronDown size={14} className={`text-emerald-800 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-emerald-100 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-3 duration-200">
                      <div className="px-4 py-2 border-b border-emerald-50">
                        <p className="text-xs font-bold text-emerald-950 truncate">{getShortName()}</p>
                        <p className="text-[10px] text-emerald-500 mt-0.5">Jemaah Terdaftar</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={14} />
                        Keluar Akun
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="h-11 px-5 rounded-xl bg-emerald-950 text-white flex items-center gap-2 text-sm font-bold hover:bg-emerald-900 transition-colors"
                >
                  <LogIn size={15} />
                  Masuk
                </Link>
              )}
            </div>
          </div>

          {/* MOBILE ACTION TRIGGER BUTTONS */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/donasi"
              className="h-9 px-3 rounded-lg bg-emerald-600 text-white flex items-center gap-1.5 text-xs font-bold shadow-sm"
            >
              <Heart size={12} fill="currentColor" />
              Donasi
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-900 hover:bg-emerald-600/20 transition-colors"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white shadow-2xl">
          <div className="p-5 space-y-5">
            
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel atau kajian..."
                className="w-full h-11 rounded-xl bg-emerald-50/50 border border-emerald-100 px-4 pr-10 text-sm outline-none focus:border-emerald-500 focus:bg-white"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700">
                <Search size={16} />
              </button>
            </form>

            {user && (
              <div className="flex items-center justify-between p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarUrl()}
                    alt="avatar"
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white"
                  />
                  <div>
                    <p className="font-bold text-sm text-emerald-950">{getShortName()}</p>
                    <p className="text-[11px] text-emerald-600">Jemaah Terdaftar</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}

            <nav className="flex flex-col divide-y divide-emerald-50">
              {navLinks.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`py-3.5 text-base font-bold flex items-center justify-between ${isActive ? "text-emerald-600" : "text-emerald-950/80"}`}
                  >
                    {item.name}
                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 ${isActive ? "opacity-100" : ""}`} />
                  </Link>
                );
              })}
            </nav>

            {!user && (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full h-11 rounded-xl bg-emerald-950 text-white flex items-center justify-center gap-2 font-bold text-sm shadow-md"
              >
                <LogIn size={16} />
                Masuk ke Akun
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}