"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/context/AudioContext";

export const dynamic = "force-dynamic";

const YOUTUBE_CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID!;
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!;

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady: any; }
}

export default function LiveSection() {
  const {
    isPlaying,
    togglePlay,
    analyserRef,
    metadata,
    listeners,
    isYouTubeLive,
    setIsYouTubeLive,
    isYouTubePlaying,
    setIsYouTubePlaying,
  } = useAudio();

  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const playerRef = useRef<any>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ==========================
  // Load YouTube IFrame API
  // ==========================
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  // ==========================
  // Check Live YouTube
  // ==========================
  const checkYouTubeLive = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&type=video&eventType=live&key=${API_KEY}`
      );
      const data = await res.json();
      if (data.items?.length > 0) {
        const videoId = data.items[0].id.videoId;
        setYoutubeVideoId(videoId);
        setIsYouTubeLive(true);
      } else {
        setYoutubeVideoId(null);
        setIsYouTubeLive(false);
        setIsYouTubePlaying(false);
      }
    } catch (err) {
      console.error("YouTube API error", err);
      setYoutubeVideoId(null);
      setIsYouTubeLive(false);
      setIsYouTubePlaying(false);
    }
  };

  useEffect(() => {
    checkYouTubeLive();
    const interval = setInterval(checkYouTubeLive, 30000);
    return () => clearInterval(interval);
  }, []);

  // ==========================
  // Play click handler
  // ==========================
  const handlePlayClick = async () => {
    // Stop MP3 jika ada
    if (isPlaying) togglePlay();

    // Mainkan YouTube jika ada live
    if (isYouTubeLive && youtubeVideoId && iframeContainerRef.current) {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player(iframeContainerRef.current, {
          videoId: youtubeVideoId,
          playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, playsinline: 1 },
          events: {
            onReady: (event: any) => {
              event.target.playVideo();
              setIsYouTubePlaying(true);
            },
            onStateChange: (event: any) => {
              if (event.data === 0 || event.data === 2) setIsYouTubePlaying(false); // ended/paused
            },
          },
        });
      } else {
        playerRef.current.loadVideoById(youtubeVideoId);
        playerRef.current.playVideo();
        setIsYouTubePlaying(true);
      }
    } else {
      // Jika YouTube tidak live, jalankan MP3 biasa
      togglePlay();
    }
  };

  // ==========================
  // Visualizer
  // ==========================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let animationId: number;
    const draw = () => {
      animationId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if ((!isPlaying && !isYouTubePlaying) || !analyserRef?.current) return;

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      for (let i = 0; i < 120; i++) {
        const dataIndex = Math.floor(i * (bufferLength / 120));
        const value = (dataArray[dataIndex] || 0) / 255;
        const barHeight = value * centerY * 1.4;
        const x = i * (width / 120);
        const yTop = centerY - barHeight;
        const yBottom = centerY + barHeight;

        const gradient = ctx.createLinearGradient(0, yTop, 0, yBottom);
        gradient.addColorStop(0, "#00ffcc");
        gradient.addColorStop(0.3, "#10b981");
        gradient.addColorStop(0.6, "#065f46");
        gradient.addColorStop(1, "#001f1f");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yBottom);
        ctx.stroke();
      }
    };

    draw();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); };
  }, [isPlaying, isYouTubePlaying, analyserRef]);

  return (
    <section className="relative overflow-hidden bg-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/80 to-black" />
      <div className="relative z-20 mx-auto max-w-6xl">

        {/* TITLE */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black text-emerald-400 uppercase tracking-[0.2em] sm:tracking-[0.35em]">
            ⚡ ON AIR NOW ⚡
          </h2>
        </div>

        {/* CARD */}
        <div className="rounded-2xl lg:rounded-3xl border border-emerald-500/20 bg-white/5 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6 lg:gap-8">

            {/* COVER */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-3xl animate-pulse" />
              <img
                src={metadata?.art || "/bg-player.png"}
                alt={metadata?.title}
                onError={(e) => { (e.target as HTMLImageElement).src = "/bg-player.png"; }}
                className="relative z-10 w-full h-full object-cover rounded-2xl border border-white/20"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 w-full">
              <div className="h-20 sm:h-24 lg:h-28 bg-black rounded-xl overflow-hidden border border-emerald-500/20">
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>
              <div className="mt-4 text-center md:text-left">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white leading-tight">
                  {metadata?.title || "Radio Suara Al Muttaqin"}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-emerald-400 uppercase tracking-wider">
                  {metadata?.artist || "Virtual Live Stream"}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-3 sm:items-center sm:justify-between">
            <div className="text-center sm:text-left text-emerald-400 text-sm font-bold">
              👥 {listeners} Pendengar
            </div>
            <button
              type="button"
              onClick={handlePlayClick}
              className={`w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 lg:py-4 rounded-xl font-black uppercase tracking-wide transition-all active:scale-95 ${
                isPlaying || isYouTubePlaying
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {isPlaying || isYouTubePlaying ? "Stop Radio" : "Putar Radio"}
            </button>
          </div>
        </div>

        {/* Hidden YouTube IFrame Player */}
        <div ref={iframeContainerRef} style={{ width: 1, height: 1, opacity: 0, overflow: "hidden" }} />

      </div>
    </section>
  );
}