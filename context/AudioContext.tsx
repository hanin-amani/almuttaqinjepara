"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AudioContextType {
  isPlaying: boolean;
  hasError: boolean;
  metadata: { title: string; artist: string; art: string };
  listeners: number;
  togglePlay: () => void;
  toggleLivePlayback: () => void;
  registerYouTubeToggle: (handler: (() => void) | null) => void;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  isYouTubeLive: boolean;
  setIsYouTubeLive: React.Dispatch<React.SetStateAction<boolean>>;
  isYouTubePlaying: boolean;
  setIsYouTubePlaying: React.Dispatch<React.SetStateAction<boolean>>;
  youtubeVideoId: string | null;
  setYoutubeVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  youtubeThumbnail: string;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const youtubeToggleRef = useRef<(() => void) | null>(null);

  const isInitialized = useRef(false);
  const lastSyncedUrlRef = useRef("");
  const userStoppedRef = useRef(false);
  const isAutoSwitchingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const [hasError, setHasError] = useState(false);
  const [listeners, setListeners] = useState(0);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: "Mencari Sinyal...",
    artist: "Radio Suara Al Muttaqin",
    art: "/bg-player.png",
  });

  const [isYouTubeLive, setIsYouTubeLive] = useState(false);
  const [isYouTubePlaying, setIsYouTubePlaying] = useState(false);

  const youtubeThumbnail = youtubeVideoId
    ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`
    : "/bg-player.png";

  // --- Jingle setup ---
  const jingleRef = useRef<HTMLAudioElement | null>(null);
  const jingleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isJinglePlayingRef = useRef(false);

  const JINGLE_INTERVAL = 5 * 60 * 1000; // 5 menit
  const JINGLE_FILE = "https://sdit.my.id/radio/jingle.mp3"; // sesuaikan dengan nama file sebenarnya

  // --- Reset MP3 ---
  const resetMp3Playback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Hentikan jingle jika ada
    if (jingleRef.current) {
      jingleRef.current.pause();
      jingleRef.current.currentTime = 0;
    }
    isJinglePlayingRef.current = false;

    if (jingleIntervalRef.current) {
      clearInterval(jingleIntervalRef.current);
      jingleIntervalRef.current = null;
    }

    userStoppedRef.current = true;
    isAutoSwitchingRef.current = false;

    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    lastSyncedUrlRef.current = "";
    setIsPlaying(false);
  }, []);

  const fetchCurrentRadio = useCallback(async () => {
    const res = await fetch("/api/get-current-radio", { cache: "no-store" });
    if (!res.ok) throw new Error("Radio API offline");
    return res.json();
  }, []);

  const registerYouTubeToggle = useCallback((handler: (() => void) | null) => {
    youtubeToggleRef.current = handler;
  }, []);

  const playJingle = useCallback(async () => {
    try {
      if (
        !audioRef.current ||
        !isPlayingRef.current ||
        isYouTubeLive ||
        isJinglePlayingRef.current
      ) {
        return;
      }

      isJinglePlayingRef.current = true;

      if (!jingleRef.current) {
        jingleRef.current = new Audio(JINGLE_FILE);
        jingleRef.current.preload = "auto";
        jingleRef.current.crossOrigin = "anonymous";
        jingleRef.current.onerror = () => {
          console.error("Jingle gagal dimuat");
          if (audioRef.current) audioRef.current.volume = 1;
          isJinglePlayingRef.current = false;
        };
      }

      const mainAudio = audioRef.current;
      const originalVolume = mainAudio.volume;

      mainAudio.volume = 0.25; // ducking
      jingleRef.current.currentTime = 0;

      await jingleRef.current.play();

      jingleRef.current.onended = () => {
        mainAudio.volume = originalVolume;
        isJinglePlayingRef.current = false;
      };
    } catch (err) {
      console.error("Gagal memutar jingle:", err);
      if (audioRef.current) audioRef.current.volume = 1;
      isJinglePlayingRef.current = false;
    }
  }, [isYouTubeLive]);

  const applyRadioDataToAudio = useCallback(
    async (data: any, forceReload = false) => {
      if (!audioRef.current || !data?.active || !data.audio_url) return false;

      if (data.type === "youtube_live" || isYouTubeLive) {
        resetMp3Playback();
        setIsYouTubeLive(true);
        setMetadata({
          title: data.title || "YouTube Live Streaming",
          artist: "YouTube Live Stream",
          art: youtubeThumbnail,
        });
        setListeners(1);
        return false;
      }

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

      setMetadata({
        title: data.title || "Siaran Sedang Aktif",
        artist: "Radio Suara Al Muttaqin",
        art: "/bg-player.png",
      });
      setListeners(1);

      if (!shouldReload) return true;

      try {
        isAutoSwitchingRef.current = true;
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
        userStoppedRef.current = false;
        setIsPlaying(true);
        setHasError(false);

        return true;
      } catch (err) {
        console.error("Gagal menerapkan audio radio:", err);
        setHasError(true);
        setIsPlaying(false);
        return false;
      } finally {
        isAutoSwitchingRef.current = false;
      }
    },
    [isYouTubeLive, resetMp3Playback, youtubeThumbnail]
  );

  const fetchMetadata = useCallback(async () => {
    try {
      const data = await fetchCurrentRadio();

      if (data?.active && data.type === "youtube_live") {
        resetMp3Playback();
        setIsYouTubeLive(true);
        setMetadata({
          title: data.title || "YouTube Live Streaming",
          artist: "YouTube Live Stream",
          art: youtubeThumbnail,
        });
        setListeners(1);
        return;
      }

      setIsYouTubeLive(false);
      setIsYouTubePlaying(false);

      if (data?.active) {
        setMetadata({
          title: data.title || "Siaran Sedang Aktif",
          artist: "Radio Suara Al Muttaqin",
          art: "/bg-player.png",
        });
        setListeners(1);
        return;
      }

      setMetadata({
        title: "Siaran Sedang Offline",
        artist: "Radio Suara Al Muttaqin",
        art: "/bg-player.png",
      });
      setListeners(0);
    } catch {
      setMetadata({
        title: "Siaran Sedang Offline",
        artist: "Radio Suara Al Muttaqin",
        art: "/bg-player.png",
      });
      setListeners(0);
    }
  }, [fetchCurrentRadio, resetMp3Playback, youtubeThumbnail]);

  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 15000);
    return () => clearInterval(interval);
  }, [fetchMetadata]);

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
      sourceRef.current = source;

      isInitialized.current = true;
    } catch (err) {
      console.error("Gagal inisialisasi Audio Engine:", err);
    }
  }, []);

  const startPlayback = useCallback(async () => {
    try {
      const data = await fetchCurrentRadio();

      if (data?.type === "youtube_live") {
        resetMp3Playback();
        setIsYouTubeLive(true);
        setMetadata({
          title: data.title || "YouTube Live Streaming",
          artist: "YouTube Live Stream",
          art: youtubeThumbnail,
        });
        setListeners(1);
        return;
      }

      if (data?.active) {
        await applyRadioDataToAudio(data, true);
      } else {
        setIsPlaying(false);
      }
    } catch {
      setHasError(true);
      setIsPlaying(false);
    }
  }, [applyRadioDataToAudio, fetchCurrentRadio, resetMp3Playback, youtubeThumbnail]);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;

    if (!isInitialized.current) {
      initAudio();
    }

    if (isPlaying) {
      resetMp3Playback();
      return;
    }

    userStoppedRef.current = false;
    setHasError(false);

    await startPlayback();
  }, [initAudio, isPlaying, resetMp3Playback, startPlayback]);

  const toggleLivePlayback = useCallback(() => {
    if (isYouTubeLive && youtubeToggleRef.current) {
      youtubeToggleRef.current();
      return;
    }

    togglePlay();
  }, [isYouTubeLive, togglePlay]);

  useEffect(() => {
    if (isYouTubeLive) {
      resetMp3Playback();
    }
  }, [isYouTubeLive, resetMp3Playback]);

  // --- Scheduler Jingle ---
  useEffect(() => {
    if (jingleIntervalRef.current) {
      clearInterval(jingleIntervalRef.current);
      jingleIntervalRef.current = null;
    }

    if (isPlaying && !isYouTubeLive) {
      jingleIntervalRef.current = setInterval(() => {
        playJingle();
      }, JINGLE_INTERVAL);
    }

    return () => {
      if (jingleIntervalRef.current) {
        clearInterval(jingleIntervalRef.current);
        jingleIntervalRef.current = null;
      }
    };
  }, [isPlaying, isYouTubeLive, playJingle]);

  useEffect(() => {
    return () => {
      if (jingleIntervalRef.current) clearInterval(jingleIntervalRef.current);
      if (jingleRef.current) jingleRef.current.pause();
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
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
        toggleLivePlayback,
        registerYouTubeToggle,
        analyserRef,
        isYouTubeLive,
        setIsYouTubeLive,
        isYouTubePlaying,
        setIsYouTubePlaying,
        youtubeVideoId,
        setYoutubeVideoId,
        youtubeThumbnail,
      }}
    >
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="none"
        onPause={() => {
          if (!isAutoSwitchingRef.current && userStoppedRef.current) {
            setIsPlaying(false);
          }
        }}
        onPlay={() => {
          userStoppedRef.current = false;
          setIsPlaying(true);
          setHasError(false);
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