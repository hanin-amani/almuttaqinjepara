"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { Send, User, MessageCircle, Loader2, Globe, Mail, Facebook, Reply, X } from "lucide-react";

export default function CommentSection({ infoId }: { infoId: string }) {
  const { data: session, status } = useSession();
  const formRef = useRef<HTMLDivElement>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [content, setContent] = useState("");
  
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const fetchComments = useCallback(async () => {
    if (!infoId) return;
    setFetching(true);
    try {
      const res = await fetch(`/api/comments?infoId=${infoId}&t=${Date.now()}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal load komentar");
    } finally {
      setFetching(false);
    }
  }, [infoId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || (!session && (!name || !email))) return;
    setLoading(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          infoId,
          content,
          name,
          email,
          website,
          image: session?.user?.image || null,
          parent_id: replyTo?.id || null,
        }),
      });

      if (res.ok) {
        setContent("");
        setReplyTo(null);
        fetchComments();
      } else {
        alert("Gagal mengirim komentar. Cek koneksi database.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 space-y-8 border-t border-slate-100 pt-10 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <MessageCircle size={22} className="text-emerald-600" /> 
          Diskusi Netizen ({comments.length})
        </h3>
        
        {!session && status !== "loading" && (
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest mr-2 uppercase">Login Cepat:</span>
              <button onClick={() => signIn("google")} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-[4px] hover:border-emerald-500 transition-all shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button onClick={() => signIn("facebook")} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-[4px] hover:border-blue-500 transition-all text-blue-600 shadow-sm">
                <Facebook size={16} fill="currentColor" />
              </button>
           </div>
        )}
      </div>

      <div ref={formRef} className="scroll-mt-32">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-[4px] border border-slate-100 shadow-sm">
          {replyTo && (
            <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-[4px] border border-emerald-100 animate-in slide-in-from-top-1">
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-tighter">
                Membalas: <span className="underline font-black text-emerald-900">{replyTo.name}</span>
              </p>
              <button type="button" onClick={() => setReplyTo(null)} className="text-emerald-800 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          )}

          {!session && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Nama Lengkap *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-[4px] text-sm focus:border-emerald-500 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-[4px] text-sm focus:border-emerald-500 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Website</label>
                <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-[4px] text-sm focus:border-emerald-500 outline-none font-bold" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            {session && (
               <label className="text-[10px] font-bold tracking-widest text-emerald-600 mb-2 flex items-center gap-2 uppercase">
                 <User size={10} /> Menulis sebagai {session.user?.name}
               </label>
            )}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan tanggapan antum..."
              required
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[4px] text-sm focus:border-emerald-500 outline-none min-h-[120px] font-medium leading-relaxed transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !content}
            className="bg-slate-900 text-white px-10 py-4 rounded-[4px] text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-emerald-600 transition-all shadow-xl disabled:bg-slate-200"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} /> Kirim Komentar</>}
          </button>
        </form>
      </div>

      <div className="space-y-10">
        {fetching ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-200" size={30} /></div>
        ) : comments.length > 0 ? (
          comments.filter(c => !c.parent_id).map((c) => (
            <div key={c.id} className="space-y-6">
              <div className="flex gap-5 p-6 bg-white border border-slate-100 rounded-[4px] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-100"></div>
                
                {/* ✅ AVATAR BAPAK (Bunder) */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                  {c.image ? (
                    <Image src={c.image} alt={c.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[13px] font-black tracking-tight text-slate-900 leading-none">{c.name}</p>
                    <time className="text-[10px] text-slate-300 font-bold">{new Date(c.created_at).toLocaleDateString("id-ID")}</time>
                  </div>
                  <div className="text-[15px] text-slate-600 leading-relaxed font-medium bg-slate-50/30 p-4 rounded-[4px] border-l-2 border-emerald-500">
                    {c.content}
                  </div>
                  <button 
                    onClick={() => { setReplyTo({ id: c.id, name: c.name }); scrollToForm(); }}
                    className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Reply size={12} /> Balas Tanggapan
                  </button>
                </div>
              </div>

              <div className="ml-10 md:ml-20 space-y-4 border-l-2 border-slate-100 pl-6">
                {comments.filter(sub => sub.parent_id === c.id).map(sub => (
                  <div key={sub.id} className="flex gap-4 p-5 bg-slate-50 border border-slate-100 rounded-[4px] animate-in slide-in-from-left-2 duration-500">
                    
                    {/* ✅ AVATAR ANAK (Bunder) */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-slate-100 shrink-0 relative shadow-sm">
                      {sub.image ? (
                        <Image src={sub.image} alt={sub.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <User size={18} />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between mb-2">
                        <p className="text-[12px] font-black text-slate-900 leading-none">
                          {sub.name} <span className="text-[9px] text-emerald-500 ml-2 font-bold uppercase">Replied</span>
                        </p>
                        <time className="text-[9px] text-slate-300 font-bold">{new Date(sub.created_at).toLocaleDateString("id-ID")}</time>
                      </div>
                      <p className="text-[14px] text-slate-600 leading-relaxed font-medium">{sub.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-50 rounded-[4px]">
             <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">Jadilah yang pertama berdiskusi!</p>
          </div>
        )}
      </div>
    </div>
  );
}