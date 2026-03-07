"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Send, User, MessageSquare, Volume2, Activity, RefreshCcw } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { sendChatMessage, getChatMessages } from "@/app/actions/chatActions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LiveChat() {
  const { isPlaying } = useAudio();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const loadMessages = async () => {
    setIsLoading(true);
    const data = await getChatMessages();
    setMessages(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMessages();

    // REALTIME: Mendengarkan database secara langsung
    const channel = supabase.channel("live_chat_radio")
      .on("postgres_changes", 
        { event: "INSERT", schema: "public", table: "chat_messages" }, 
        (payload) => {
          setMessages((prev) => {
            // Cek agar tidak ada pesan ganda jika Optimistic UI sudah jalan
            const exists = prev.find(m => m.id === payload.new.id);
            if (exists) return prev;
            return [...prev, payload.new];
          });
          if (audioRef.current && !isMuted) {
            audioRef.current.play().catch(() => {});
          }
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isMuted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !username.trim() || isSending) return;

    // OPTIMISTIC UPDATE: Langsung munculkan di layar
    const tempMsg = {
      id: Math.random().toString(),
      username: username,
      message: newMessage,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);

    setIsSending(true);
    const result = await sendChatMessage(username, newMessage);

    if (result.success) {
      setNewMessage("");
    } else {
      alert("Koneksi bermasalah.");
    }
    setIsSending(false);
  };

  return (
    <section className="max-w-5xl mx-auto my-16 overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white border border-slate-100 grid grid-cols-1 lg:grid-cols-12">
      <audio ref={audioRef} src="/notify.mp3" preload="auto" />

      {/* SIDEBAR - DARK PROFESSIONAL */}
      <div className="lg:col-span-4 bg-[#022c22] p-10 flex flex-col justify-between border-r border-slate-50">
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></div>
              <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">Live Connect</span>
            </div>
            <button onClick={() => setIsMuted(!isMuted)} className="text-emerald-500 hover:text-white transition-colors">
              <Volume2 size={16} className={isMuted ? "opacity-20" : "opacity-100"} />
            </button>
          </div>
          
          <h2 className="text-2xl font-black text-white leading-none mb-3 italic">
            INTERAKSI <br /> <span className="text-emerald-400 text-3xl">JAMAAH</span>
          </h2>
          <p className="text-emerald-100/30 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed mb-8">
            Radio Suara Al Muttaqin <br /> Jepara, Jawa Tengah
          </p>
        </div>
        
        <button onClick={loadMessages} className="flex items-center gap-2 text-[10px] font-bold text-emerald-500/30 uppercase tracking-widest hover:text-emerald-400 transition-all">
          <RefreshCcw size={12} className={isLoading ? "animate-spin" : ""} />
          Sync Data
        </button>
      </div>

      {/* CHAT AREA - CLEAN WHITE */}
      <div className="lg:col-span-8 flex flex-col bg-white">
        <div ref={scrollRef} className="h-[380px] overflow-y-auto p-10 space-y-6 scroll-smooth custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-2 mb-1 ml-1">
                <span className="text-[11px] font-bold text-emerald-700">{msg.username}</span>
                <span className="text-[9px] text-slate-300 font-medium">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {/* Pesan Tanpa Kotak Kaku (Bubble Style) */}
              <div className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-[1.6rem] rounded-tl-none shadow-sm max-w-[85%]">
                <p className="text-[14px] font-medium text-slate-700 leading-relaxed capitalize">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT - MODERN & FLOATING */}
        <form onSubmit={handleSend} className="p-8 bg-slate-50/30 border-t border-slate-100">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative md:w-1/3">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input
                type="text" placeholder="Nama Anda" value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-[12px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all"
                required
              />
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text" placeholder="Tulis pesan..." value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[12px] font-medium text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all"
                required
              />
              <button
                type="submit" disabled={isSending}
                className="bg-[#022c22] text-white px-8 py-4 rounded-2xl font-black transition-all hover:bg-emerald-800 active:scale-95 disabled:bg-slate-200 shadow-xl shadow-emerald-950/10"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}