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
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isInitialized = useRef(false);
  const lastSyncedUrlRef = useRef<string>("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [listeners, setListeners] = useState(0);
  const [metadata, setMetadata] = useState({
    title: "Mencari Sinyal...",
    artist: "Radio Suara Al Muttaqin",
    art: "/bg-player.png",
  });

  const applyRadioDataToAudio = useCallback(
    async (data: any, forceReload = false) => {
      if (!audioRef.current || !data?.active || !data.audio_url) return false;

      const audio = audioRef.current;
      const audioCtx = audioContextRef.current;
      const nextSrc = new URL(data.audio_url, window.location.href).href;
      const currentSrc = audio.src;
      const targetTime = Number(data.elapsed_seconds || 0);
      const currentTime = Number(audio.currentTime || 0);
      const timeDrift = Math.abs(currentTime - targetTime);

      const shouldReload =
        forceReload ||
        currentSrc !== nextSrc ||
        lastSyncedUrlRef.current !== nextSrc ||
        timeDrift > 8;

      if (!shouldReload) {
        setMetadata({
          title: data.title || "Siaran Sedang Aktif",
          artist: "Radio Suara Al Muttaqin",
          art: "/bg-player.png",
        });
        return true;
      }

      audio.src = data.audio_url;
      audio.load();

      await new Promise<void>((resolve) => {
        const onLoadedMetadata = () => {
          audio.removeEventListener("loadedmetadata", onLoadedMetadata);
          resolve();
        };

        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        setTimeout(resolve, 1200);
      });

      if (targetTime > 0 && (!audio.duration || targetTime < audio.duration)) {
        audio.currentTime = targetTime;
      } else {
        audio.currentTime = 0;
      }

      if (audioCtx && audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      await audio.play();

      lastSyncedUrlRef.current = nextSrc;
      setIsPlaying(true);
      setHasError(false);
      setMetadata({
        title: data.title || "Siaran Sedang Aktif",
        artist: "Radio Suara Al Muttaqin",
        art: "/bg-player.png",
      });

      return true;
    },
    []
  );

  const fetchCurrentRadio = useCallback(async () => {
    const res = await fetch("/api/get-current-radio", { cache: "no-store" });
    if (!res.ok) throw new Error("Radio API offline");
    return res.json();
  }, []);

  const fetchMetadata = useCallback(async () => {
    try {
      const data = await fetchCurrentRadio();

      if (data && data.active) {
        setMetadata({
          title: data.title || "Siaran Sedang Aktif",
          artist: "Radio Suara Al Muttaqin",
          art: "/bg-player.png",
        });
        setListeners(1);
      } else {
        setMetadata({
          title: "Siaran Sedang Offline",
          artist: "Radio Suara Al Muttaqin",
          art: "/bg-player.png",
        });
        setListeners(0);
      }
    } catch (err) {
      setMetadata({
        title: "Siaran Sedang Offline",
        artist: "Radio Suara Al Muttaqin",
        art: "/bg-player.png",
      });
      setListeners(0);
    }
  }, [fetchCurrentRadio]);

  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 15000);

    return () => clearInterval(interval);
  }, [fetchMetadata]);

  const initAudio = useCallback(() => {
    if (isInitialized.current || !audioRef.current) return;

    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      sourceRef.current = source;

      isInitialized.current = true;
      console.log("Audio Engine Virtual Radio RSM Aktif Terpusat");
    } catch (err) {
      console.error("Gagal inisialisasi Audio Engine:", err);
    }
  }, []);

  const startPlayback = useCallback(async () => {
    try {
      const data = await fetchCurrentRadio();

      if (data && data.active) {
        await applyRadioDataToAudio(data, true);
      } else {
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Gagal memulai playback:", err);
      setHasError(true);
      setIsPlaying(false);
    }
  }, [applyRadioDataToAudio, fetchCurrentRadio]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (!isInitialized.current) {
      initAudio();
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      lastSyncedUrlRef.current = "";
      setIsPlaying(false);
    } else {
      setHasError(false);
      await startPlayback();
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    const syncInterval = setInterval(async () => {
      try {
        const data = await fetchCurrentRadio();
        await applyRadioDataToAudio(data, false);
      } catch (err) {
        console.error("Gagal sync radio:", err);
      }
    }, 5000);

    return () => clearInterval(syncInterval);
  }, [applyRadioDataToAudio, fetchCurrentRadio, isPlaying]);

  const handleAudioEnded = async () => {
    console.log("File MP3 selesai diputar. Melompat ke track virtual berikutnya...");

    if (isPlaying) {
      await startPlayback();
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        hasError,
        metadata,
        listeners,
        togglePlay,
        analyserRef,
      }}
    >
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="none"
        onPause={() => setIsPlaying(false)}
        onPlay={() => {
          setIsPlaying(true);
          setHasError(false);
        }}
        onEnded={handleAudioEnded}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
          console.warn("Virtual Radio RSM Offline / CORS Issue");
        }}
        className="hidden"
      />

      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio harus di dalam AudioProvider");
  }

  return context;
};