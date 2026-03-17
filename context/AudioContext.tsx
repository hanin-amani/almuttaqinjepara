"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

interface AudioContextType {
  isPlaying: boolean;
  hasError: boolean; // State baru untuk deteksi server offline
  togglePlay: () => void;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const streamUrl = "https://rsm.my.id/radio/8010/radio.mp3";

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isInitialized = useRef(false); // ✅ Kunci agar tidak double-init

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // ===============================
  // INIT AUDIO ENGINE
  // ===============================
  const initAudio = useCallback(() => {
    if (isInitialized.current || !audioRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256; // Lebih kecil lebih ringan untuk visualizer petir antum
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Hubungkan elemen audio ke jalur engine
      const source = audioCtx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      sourceRef.current = source;

      isInitialized.current = true;
      console.log("✅ Audio Engine Radio RSM Aktif");
    } catch (err) {
      console.error("Gagal inisialisasi Audio Engine:", err);
    }
  }, []);

  // Clean up saat komponen mati
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // ===============================
  // TOGGLE PLAY (LIVE STREAM LOGIC)
  // ===============================
  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    // Pastikan engine aktif saat user klik pertama kali
    if (!isInitialized.current) initAudio();

    const audio = audioRef.current;
    const audioCtx = audioContextRef.current;

    try {
      if (isPlaying) {
        audio.pause();
        // ✅ TRICK: Untuk Live Stream, kosongkan src saat stop agar tidak buffering tertunda
        audio.src = ""; 
        audio.load();
        setIsPlaying(false);
      } else {
        setHasError(false);
        
        // Kembalikan URL aslinya sebelum play
        audio.src = streamUrl;
        audio.load();

        if (audioCtx && audioCtx.state === "suspended") {
          await audioCtx.resume();
        }

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn("Autoplay diblokir atau Server Offline:", err);
              setHasError(true);
              setIsPlaying(false);
            });
        }
      }
    } catch (err) {
      setHasError(true);
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, hasError, togglePlay, analyserRef }}>
      <audio
        ref={audioRef}
        crossOrigin="anonymous" // Wajib buat visualizer
        preload="none"
        onPause={() => setIsPlaying(false)}
        onPlay={() => {
          setIsPlaying(true);
          setHasError(false);
        }}
        onError={() => {
          // ✅ JANGAN PAKAI ALERT! Silent error handling.
          setHasError(true);
          setIsPlaying(false);
          console.warn("⚠️ Radio RSM Offline / CORS Issue");
        }}
        className="hidden"
      />
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio harus di dalam AudioProvider");
  return context;
};