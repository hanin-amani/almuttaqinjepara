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
  hasError: boolean;
  metadata: { title: string; artist: string; art: string };
  listeners: number;
  togglePlay: () => void;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  isYouTubeLive: boolean;
  setIsYouTubeLive: React.Dispatch<React.SetStateAction<boolean>>;
  isYouTubePlaying: boolean;
  setIsYouTubePlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const isInitialized = useRef(false);
  const lastSyncedUrlRef = useRef("");
  const userStoppedRef = useRef(false);
  const isAutoSwitchingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [listeners, setListeners] = useState(0);
  const [metadata, setMetadata] = useState({
    title: "Mencari Sinyal...",
    artist: "Radio Suara Al Muttaqin",
    art: "/bg-player.png",
  });

  const [isYouTubeLive, setIsYouTubeLive] = useState(false);
  const [isYouTubePlaying, setIsYouTubePlaying] = useState(false);

  // ==========================
  // Fetch Radio MP3 Data
  // ==========================
  const fetchCurrentRadio = useCallback(async () => {
    const res = await fetch("/api/get-current-radio", { cache: "no-store" });
    if (!res.ok) throw new Error("Radio API offline");
    return res.json();
  }, []);

  const applyRadioDataToAudio = useCallback(
    async (data: any, forceReload = false) => {
      if (!audioRef.current || !data?.active || !data.audio_url) return false;

      // Stop MP3 saat YouTube live aktif
      if (isYouTubeLive && isYouTubePlaying) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
        setIsPlaying(false);
        return false;
      }

      const audio = audioRef.current;
      const audioCtx = audioContextRef.current;
      const nextSrc = new URL(data.audio_url, window.location.href).href;
      const currentSrc = audio.src;

      const shouldReload =
        forceReload || currentSrc !== nextSrc || lastSyncedUrlRef.current !== nextSrc;

      setMetadata({
        title: data.title || "Siaran Sedang Aktif",
        artist: data.program_title || "Radio Suara Al Muttaqin",
        art: data.cover_art || "/bg-player.png",
      });
      setListeners(1);

      if (!shouldReload) return true;

      try {
        isAutoSwitchingRef.current = true;
        audio.src = data.audio_url;
        audio.load();

        await new Promise<void>((resolve) => {
          const onLoaded = () => {
            audio.removeEventListener("loadedmetadata", onLoaded);
            resolve();
          };
          audio.addEventListener("loadedmetadata", onLoaded);
          setTimeout(resolve, 1200);
        });

        if (audioCtx && audioCtx.state === "suspended") await audioCtx.resume();
        await audio.play();

        lastSyncedUrlRef.current = nextSrc;
        userStoppedRef.current = false;
        setIsPlaying(true);
        setHasError(false);
        return true;
      } catch (err) {
        console.error("Gagal memutar audio:", err);
        setHasError(true);
        return false;
      } finally {
        isAutoSwitchingRef.current = false;
      }
    },
    [isYouTubeLive, isYouTubePlaying]
  );

  const initAudio = useCallback(() => {
    if (isInitialized.current || !audioRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      isInitialized.current = true;
    } catch (err) {
      console.error("Gagal inisialisasi AudioContext:", err);
    }
  }, []);

  const startPlayback = useCallback(async () => {
    if (isYouTubeLive && isYouTubePlaying) return;
    try {
      const data = await fetchCurrentRadio();
      if (data && data.active) await applyRadioDataToAudio(data, true);
    } catch (err) {
      console.error(err);
      setHasError(true);
    }
  }, [applyRadioDataToAudio, fetchCurrentRadio, isYouTubeLive, isYouTubePlaying]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (!isInitialized.current) initAudio();

    if (isPlaying) {
      userStoppedRef.current = true;
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      setIsPlaying(false);
    } else {
      userStoppedRef.current = false;
      setHasError(false);
      await startPlayback();
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        hasError,
        metadata,
        listeners,
        togglePlay,
        analyserRef,
        isYouTubeLive,
        setIsYouTubeLive,
        isYouTubePlaying,
        setIsYouTubePlaying,
      }}
    >
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="none"
        className="hidden"
        onPause={() => { if (userStoppedRef.current) setIsPlaying(false); }}
        onPlay={() => { userStoppedRef.current = false; setIsPlaying(true); setHasError(false); }}
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