"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Send, User, MessageSquare, ShieldCheck, Volume2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LiveChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Fitur Mute agar jamaah nyaman
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null); // Ref untuk suara notifikasi

  useEffect(() => {
    const fetchInitialMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(20);
      if (data) setMessages(data);
    };

    fetchInitialMessages();

    const channel = supabase
      .channel("live_chat_radio")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          
          // MAINKAN SUARA: Hanya jika tidak di-mute dan bukan pesan dari diri sendiri
          // (Opsional: tambahkan logika cek username jika ingin suara hanya muncul untuk pesan orang lain)
          if (audioRef.current && !isMuted) {
            audioRef.current.play().catch(err => console.log("Audio play blocked by browser"));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isMuted]); // Re-subscribe saat status mute berubah

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !username.trim() || isSending) return;

    setIsSending(true);
    await supabase.from("chat_messages").insert([
      { username: username.toUpperCase(), message: newMessage }
    ]);
    setNewMessage("");
    setIsSending(false);
  };

  return (
    <section className="bg-white border-x border-b border-slate-200 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
      
      {/* AUDIO ELEMENT (Hidden) */}
      <audio ref={audioRef} src="/notify.mp3" preload="auto" />

      {/* KIRI: PANEL INFORMASI */}
      <div className="lg:col-span-4 bg-emerald-950 text-white p-10 flex flex-col justify-between border-r border-white/5">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-emerald-400">
              <MessageSquare size={18} />
              <span className="text-[9px] font-black uppercase tracking-[0.5em]">Live Conversation</span>
            </div>
            
            {/* TOMBOL MUTE - Fitur Canggih */}
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 border transition-all ${isMuted ? 'border-red-500 text-red-500' : 'border-emerald-500 text-emerald-500'}`}
              title={isMuted ? "Bunyi Mati" : "Bunyi Hidup"}
            >
              <Volume2 size={12} className={isMuted ? 'opacity-30' : 'opacity-100'} />
            </button>
          </div>

          <h2 className="text-3xl font-black uppercase leading-[0.9] mb-6">
            Interaksi <br /> <span className="text-emerald-500">Jamaah</span>
          </h2>
          <p className="text-slate-400 text-[11px] font-bold leading-relaxed uppercase tracking-wider max-w-xs">
            Suara antum, dakwah kita. Sampaikan salam melalui Radio Suara Al Muttaqin.
          </p>
        </div>
        
        <div className="pt-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">
            <ShieldCheck size={12} />
            Realtime & Sound Enabled
          </div>
          <div className="h-1 w-12 bg-emerald-500"></div>
        </div>
      </div>

      {/* KANAN: CHAT INTERFACE */}
      <div className="lg:col-span-8 flex flex-col bg-slate-50">
        <div 
          ref={scrollRef} 
          className="h-[400px] overflow-y-auto p-8 space-y-4 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col items-start group animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-1 ml-1">
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{msg.username}</span>
                <span className="text-[8px] text-slate-300 font-bold">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bg-white border border-slate-200 px-5 py-3 shadow-sm group-hover:border-emerald-200 transition-colors">
                <p className="text-sm font-medium text-slate-700 leading-snug">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form Input */}
        <form onSubmit={sendMessage} className="p-8 bg-white border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input
                type="text"
                placeholder="NAMA"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              />
            </div>
            <div className="md:col-span-3 flex gap-3">
              <input
                type="text"
                placeholder="TULIS PESAN..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              />
              <button
                type="submit"
                disabled={isSending}
                className="bg-emerald-950 text-white px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 active:scale-95 transition-all disabled:bg-slate-300 flex items-center gap-2"
              >
                {isSending ? "..." : <Send size={14} />}
                {isSending ? "" : "KIRIM"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}