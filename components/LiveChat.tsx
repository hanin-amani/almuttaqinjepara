"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Send, User, MessageSquare } from "lucide-react";

// Inisialisasi Supabase Client menggunakan env yang sudah ada
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LiveChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Berlangganan Realtime Chat
  useEffect(() => {
    const channel = supabase
      .channel("live_chat_radio")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ChatMessage" }, 
      (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 2. Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !username.trim()) return;

    await supabase.from("ChatMessage").insert([
      { username: username, message: newMessage }
    ]);
    setNewMessage("");
  };

  return (
    <section className="bg-white border-x border-b border-slate-200 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
      {/* Kolom Info Chat */}
      <div className="lg:col-span-4 bg-slate-900 text-white p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-emerald-400 mb-6">
            <MessageSquare size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Conversation</span>
          </div>
          <h2 className="text-3xl font-bold uppercase leading-tight mb-4">
            Interaksi <br /> <span className="text-emerald-500">Jamaah</span>
          </h2>
          <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-wider">
            Sampaikan salam, pertanyaan kajian, atau sapaan untuk pendengar Radio Al Muttaqin lainnya.
          </p>
        </div>
        <div className="pt-8 border-t border-white/10 text-[9px] font-mono text-emerald-500/50 uppercase tracking-widest">
          Status: Realtime Connected // RSM-CHAT-v1.0
        </div>
      </div>

      {/* Kolom Pesan Chat */}
      <div className="lg:col-span-8 flex flex-col h-[500px] bg-slate-50">
        {/* Area Pesan */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <p className="text-[10px] font-black uppercase tracking-widest">Belum ada percakapan</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className="bg-white border border-slate-200 p-4 shadow-sm">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                {msg.username}
              </p>
              <p className="text-sm font-medium text-slate-700 leading-snug">
                {msg.message}
              </p>
            </div>
          ))}
        </div>

        {/* Form Input */}
        <form onSubmit={sendMessage} className="p-6 bg-white border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input
                type="text"
                placeholder="NAMA ANDA"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none text-[10px] font-bold uppercase outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <input
                type="text"
                placeholder="TULIS PESAN..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border-none text-[10px] font-bold uppercase outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              />
              <button
                type="submit"
                className="bg-emerald-950 text-white px-6 py-3 hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Send size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">KIRIM</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}