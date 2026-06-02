"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import {
  LogIn,
  LogOut,
  Loader2,
  Heart,
  Menu,
  X,
  Search,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoadingAuth(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLoadingAuth(true);

    await supabase.auth.signOut();

    setIsMenuOpen(false);

    router.refresh();
  };

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    router.push(
      `/search?q=${encodeURIComponent(searchQuery)}`
    );

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
    <header className="sticky top-0 z-[999] bg-white border-b border-slate-200 shadow-sm">

      {/* NAVBAR */}
      <div className="max-w-7xl mx-auto px-3">

        <div className="h-[50px] flex items-center justify-between">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 overflow-hidden flex-1 min-w-0"
          >
            <span className="text-base shrink-0">
              🎙️
            </span>

            <h1 className="font-black text-[12px] sm:text-sm text-slate-900 truncate">
              Radio Suara{" "}
              <span className="text-emerald-600">
                Al Muttaqin
              </span>
            </h1>
          </Link>

          {/* MOBILE ACTION */}
          <div className="flex lg:hidden items-center shrink-0 gap-1 ml-2">

            {user && (
              <img
                src={getAvatarUrl()}
                alt="avatar"
                className="w-7 h-7 rounded-full object-cover"
              />
            )}

            <button
              onClick={() =>
                setIsMenuOpen(!isMenuOpen)
              }
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
            >
              {isMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

          </div>

          {/* DESKTOP */}
          <div className="hidden lg:flex items-center gap-8">

            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-emerald-600"
              >
                {item.name}
              </Link>
            ))}

            <form
              onSubmit={handleSearch}
              className="relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Cari artikel..."
                className="w-64 h-10 rounded-full border border-slate-200 px-4 pr-10 text-sm outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search size={16} />
              </button>
            </form>

            <Link
              href="/donasi"
              className="h-10 px-4 rounded-lg bg-emerald-600 text-white flex items-center gap-2 text-xs font-bold"
            >
              <Heart
                size={14}
                fill="currentColor"
              />
              Donasi
            </Link>

            {loadingAuth ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : user ? (
              <button
                onClick={handleLogout}
                className="h-10 px-4 rounded-lg bg-red-50 text-red-600 flex items-center gap-2 text-xs font-bold"
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="h-10 px-4 rounded-lg bg-slate-900 text-white flex items-center gap-2 text-xs font-bold"
              >
                <LogIn size={14} />
                Login
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white shadow-lg">

          <div className="p-4 space-y-4">

            <form
              onSubmit={handleSearch}
              className="relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Cari artikel..."
                className="w-full h-11 rounded-xl border border-slate-200 px-4 pr-10 text-sm outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search size={16} />
              </button>
            </form>

            {user && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">

                <img
                  src={getAvatarUrl()}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold text-sm">
                    {getShortName()}
                  </p>

                  <p className="text-xs text-slate-500">
                    Jemaah Terdaftar
                  </p>
                </div>

              </div>
            )}

            <nav className="flex flex-col">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() =>
                    setIsMenuOpen(false)
                  }
                  className="py-3 border-b border-slate-100 text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <Link
              href="/donasi"
              onClick={() =>
                setIsMenuOpen(false)
              }
              className="w-full h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center gap-2 font-bold text-sm"
            >
              <Heart
                size={16}
                fill="currentColor"
              />
              Donasi Sekarang
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}