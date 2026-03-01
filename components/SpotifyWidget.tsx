"use client";
import { useEffect, useRef, useState } from "react";

interface Track {
  name: string;
  artist: string;
  isPlaying: boolean;
  albumArt?: string;
  songUrl?: string;
}

const POLL_INTERVAL = 30_000; // refresh every 30s

export default function SpotifyWidget() {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTrack = async () => {
    try {
      const res = await fetch("/api/spotify");
      if (!res.ok) throw new Error();
      const data: Track = await res.json();
      setTrack(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack();
    // ✅ Poll so now-playing stays fresh
    timerRef.current = setInterval(fetchTrack, POLL_INTERVAL);

    // ✅ Pause polling when tab is hidden to save bandwidth/battery
    const onVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        fetchTrack();
        timerRef.current = setInterval(fetchTrack, POLL_INTERVAL);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  /* ─── Loading skeleton ─────────────────────────────────── */
  if (loading) {
    return (
      <div className="glass-card px-4 py-3 flex items-center gap-3 w-64"
        aria-label="Loading currently playing track">
        <div className="w-9 h-9 rounded-lg bg-white/10 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-2 w-16 rounded bg-white/10 animate-pulse" />
          <div className="h-2 w-28 rounded bg-white/10 animate-pulse" />
          <div className="h-2 w-20 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    );
  }

  /* ─── Error / no track ─────────────────────────────────── */
  if (error || !track) {
    return (
      <div className="glass-card px-4 py-3 flex items-center gap-3 w-64 opacity-50"
        aria-label="Spotify unavailable">
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1DB954]">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>
        <p className="text-xs text-white/40">Spotify unavailable</p>
      </div>
    );
  }

  const reduced = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <a
      href={track.songUrl ?? "https://open.spotify.com"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${track.isPlaying ? "Now playing" : "Last played"}: ${track.name} by ${track.artist}`}
      className="glass-card px-4 py-3 flex items-center gap-3 w-64
                 hover:border-green-500/30 hover:scale-[1.02]
                 transition-all duration-300 cursor-pointer group"
    >
      {/* Album art */}
      <div className="relative shrink-0">
        {track.albumArt ? (
          <img
            src={track.albumArt}
            alt={`${track.name} album art`}
            width={36} height={36}          // ✅ prevents CLS
            className="w-9 h-9 rounded-lg object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1DB954]">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
        )}

        {/* ✅ Pulsing green dot when actively playing */}
        {track.isPlaying && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5
                           rounded-full bg-[#1DB954] border-2 border-[#050508]">
            {!reduced && (
              <span className="absolute inset-0 rounded-full bg-[#1DB954]
                               animate-ping opacity-75" />
            )}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-accent text-[10px] text-[#1DB954] tracking-widest uppercase mb-0.5 flex items-center gap-1">
          {track.isPlaying ? "▶ Now Playing" : "◼ Last Played"}
        </p>
        <p className="font-sans text-xs text-white truncate
                      group-hover:text-[#1DB954] transition-colors duration-200">
          {track.name}
        </p>
        <p className="font-sans text-xs text-[#94A3B8] truncate">{track.artist}</p>
      </div>

      {/* ✅ Animated equaliser bars — only when playing + motion OK */}
      {track.isPlaying && !reduced && (
        <div className="flex items-end gap-[2px] h-4 shrink-0" aria-hidden>
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-[#1DB954]"
              style={{
                animation: `eqBar 0.${6 + i}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes eqBar {
          from { height: 4px;  }
          to   { height: 16px; }
        }
      `}</style>
    </a>
  );
}
