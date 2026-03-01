"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";

/* ─── Global TypeScript Declarations for YouTube API ──────── */
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

/* ─── Palette ─────────────────────────────────────────────── */
const C = {
    base: "#08060A",
    pink: "#FFB7C5",
    rose: "#E8899A",
    amber: "#D4956A",
    cream: "#FFF0F5",
    glass: "rgba(255,182,193,0.04)",
    border: "rgba(255,183,197,0.12)",
    glow: "rgba(255,183,197,0.25)",
    orb1: "rgba(255,150,180,0.13)",
    orb2: "rgba(200,80,120,0.12)",
    orb3: "rgba(180,100,180,0.07)",
    lcdOn: "#FFB7C5",
    lcdOff: "rgba(255,183,197,0.07)",
    lcdGlow: "rgba(255,183,197,0.5)",
};

/* ─── 7-segment display map ───────────────────────────────── */
//   segments:  a=top, b=top-right, c=bottom-right,
//              d=bottom, e=bottom-left, f=top-left, g=middle
const SEG_MAP: Record<string, boolean[]> = {
    //         a      b      c      d      e      f      g
    "0": [true, true, true, true, true, true, false],
    "1": [false, true, true, false, false, false, false],
    "2": [true, true, false, true, true, false, true],
    "3": [true, true, true, true, false, false, true],
    "4": [false, true, true, false, false, true, true],
    "5": [true, false, true, true, false, true, true],
    "6": [true, false, true, true, true, true, true],
    "7": [true, true, true, false, false, false, false],
    "8": [true, true, true, true, true, true, true],
    "9": [true, true, true, true, false, true, true],
};

function Segment({ on }: { on: boolean }) {
    return (
        <div style={{
            background: on ? C.lcdOn : C.lcdOff,
            boxShadow: on ? `0 0 6px ${C.lcdGlow}, 0 0 12px ${C.lcdGlow}` : "none",
            transition: "all 0.08s ease",
            borderRadius: "2px",
        }} />
    );
}

function SevenSegDigit({ digit }: { digit: string }) {
    const segs = SEG_MAP[digit] ?? SEG_MAP["8"].map(() => false);
    const [a, b, c, d, e, f, g] = segs;
    const W = 22, H = 38, T = 4; // width, height, thickness

    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            {/* a — top */}
            <rect x={T} y={0} width={W - T * 2} height={T} rx={1.5}
                fill={a ? C.lcdOn : C.lcdOff}
                filter={a ? `drop-shadow(0 0 3px ${C.lcdGlow})` : "none"} />
            {/* f — top-left */}
            <rect x={0} y={T} width={T} height={H / 2 - T * 1.5} rx={1.5}
                fill={f ? C.lcdOn : C.lcdOff}
                filter={f ? `drop-shadow(0 0 3px ${C.lcdGlow})` : "none"} />
            {/* b — top-right */}
            <rect x={W - T} y={T} width={T} height={H / 2 - T * 1.5} rx={1.5}
                fill={b ? C.lcdOn : C.lcdOff}
                filter={b ? `drop-shadow(0 0 3px ${C.lcdGlow})` : "none"} />
            {/* g — middle */}
            <rect x={T} y={H / 2 - T / 2} width={W - T * 2} height={T} rx={1.5}
                fill={g ? C.lcdOn : C.lcdOff}
                filter={g ? `drop-shadow(0 0 3px ${C.lcdGlow})` : "none"} />
            {/* e — bottom-left */}
            <rect x={0} y={H / 2 + T / 2} width={T} height={H / 2 - T * 1.5} rx={1.5}
                fill={e ? C.lcdOn : C.lcdOff}
                filter={e ? `drop-shadow(0 0 3px ${C.lcdGlow})` : "none"} />
            {/* c — bottom-right */}
            <rect x={W - T} y={H / 2 + T / 2} width={T} height={H / 2 - T * 1.5} rx={1.5}
                fill={c ? C.lcdOn : C.lcdOff}
                filter={c ? `drop-shadow(0 0 3px ${C.lcdGlow})` : "none"} />
            {/* d — bottom */}
            <rect x={T} y={H - T} width={W - T * 2} height={T} rx={1.5}
                fill={d ? C.lcdOn : C.lcdOff}
                filter={d ? `drop-shadow(0 0 3px ${C.lcdGlow})` : "none"} />
        </svg>
    );
}

function Colon({ blink }: { blink: boolean }) {
    return (
        <div className="flex flex-col justify-center gap-2 pb-1" style={{ height: "38px" }}>
            {[0, 1].map((i) => (
                <div key={i} style={{
                    width: "4px", height: "4px", borderRadius: "50%",
                    background: blink ? C.lcdOn : C.lcdOff,
                    boxShadow: blink ? `0 0 6px ${C.lcdGlow}` : "none",
                    transition: "all 0.15s ease",
                }} />
            ))}
        </div>
    );
}

function LCDClock() {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    if (!mounted) return null;

    const hh = time.getHours().toString().padStart(2, "0");
    const mm = time.getMinutes().toString().padStart(2, "0");
    const ss = time.getSeconds().toString().padStart(2, "0");
    const blink = time.getSeconds() % 2 === 0;

    const dayJP = time.toLocaleDateString("ja-JP", { weekday: "short" });
    const dateStr = time.toLocaleDateString("ja-JP", { month: "long", day: "numeric" });

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Date row */}
            <p className="font-accent text-[9px] tracking-[0.4em] uppercase"
                style={{ color: C.rose, opacity: 0.5 }}>
                {dayJP} · {dateStr}
            </p>

            {/* LCD display bezel */}
            <div className="rounded-xl px-6 py-4 relative" style={{
                background: "rgba(10,6,14,0.8)",
                border: `1px solid ${C.border}`,
                backdropFilter: "blur(10px)",
                boxShadow: `0 0 30px rgba(255,183,197,0.06), inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}>
                {/* Scanline overlay */}
                <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
                    style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)" }} />

                {/* Digits */}
                <div className="flex items-center gap-1.5 relative z-10">
                    <SevenSegDigit digit={hh[0]} />
                    <SevenSegDigit digit={hh[1]} />
                    <Colon blink={blink} />
                    <SevenSegDigit digit={mm[0]} />
                    <SevenSegDigit digit={mm[1]} />
                    <Colon blink={blink} />
                    <SevenSegDigit digit={ss[0]} />
                    <SevenSegDigit digit={ss[1]} />
                </div>
            </div>

            {/* AM/PM */}
            <p className="font-mono text-[9px] tracking-[0.5em] opacity-20"
                style={{ color: C.cream }}>
                {time.getHours() >= 12 ? "午後 · PM" : "午前 · AM"}
            </p>
        </div>
    );
}

/* ─── Stable sakura petals ────────────────────────────────── */
const PETALS = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i / 20) * 110 - 5}%`,
    size: 5 + (i % 4) * 3,
    delay: `${(i * 0.35) % 7}s`,
    duration: `${6 + (i % 5) * 2}s`,
    drift: (i % 2 === 0 ? 1 : -1) * (25 + (i % 4) * 12),
    rotate: i * 43,
}));

const VIDEO_ID = "jfKfPfyJRdk";

/* ─── Main ────────────────────────────────────────────────── */
export default function LofiPage() {
    const router = useRouter();
    const reduced = useReducedMotion();

    const [visible, setVisible] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(65);
    const [ready, setReady] = useState(false);

    const playerRef = useRef<any | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (!document.getElementById("yt-api")) {
            const tag = document.createElement("script");
            tag.id = "yt-api";
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }
        window.onYouTubeIframeAPIReady = () => {
            if (!containerRef.current) return;
            playerRef.current = new window.YT.Player(containerRef.current, {
                videoId: VIDEO_ID,
                playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: VIDEO_ID, playsinline: 1 },
                events: {
                    onReady: (e: any) => { e.target.setVolume(volume); setReady(true); },
                },
            });
        };
        if (window.YT?.Player && containerRef.current) window.onYouTubeIframeAPIReady();
        return () => { playerRef.current?.destroy(); playerRef.current = null; };
    }, []);

    const togglePlay = useCallback(() => {
        if (!ready || !playerRef.current) return;
        playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
        setPlaying((p) => !p);
    }, [playing, ready]);

    const handleVolume = (v: number) => {
        setVolume(v);
        playerRef.current?.setVolume(v);
    };

    const handleClose = () => {
        setVisible(false);
        playerRef.current?.pauseVideo();
        setTimeout(() => router.back(), 600);
    };

    return (
        <div
            className="lofi-root fixed inset-0 z-[99999] overflow-hidden
                 transition-opacity duration-700"
            style={{ opacity: visible ? 1 : 0, background: C.base }}
        >

            {/* ─── Orbs ───────────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute rounded-full" style={{
                    width: "550px", height: "550px", top: "-15%", right: "-10%",
                    background: `radial-gradient(circle, ${C.orb1} 0%, transparent 70%)`,
                    filter: "blur(80px)",
                    animation: reduced ? "none" : "orbFloat 9s ease-in-out infinite",
                }} />
                <div className="absolute rounded-full" style={{
                    width: "600px", height: "600px", bottom: "-20%", left: "-15%",
                    background: `radial-gradient(circle, ${C.orb2} 0%, transparent 70%)`,
                    filter: "blur(90px)",
                    animation: reduced ? "none" : "orbFloat 12s ease-in-out infinite",
                    animationDelay: "4s",
                }} />
                <div className="absolute rounded-full" style={{
                    width: "400px", height: "400px", top: "40%", left: "40%",
                    transform: "translate(-50%,-50%)",
                    background: `radial-gradient(circle, ${C.orb3} 0%, transparent 70%)`,
                    filter: "blur(70px)",
                    animation: reduced ? "none" : "orbFloat 15s ease-in-out infinite",
                    animationDelay: "7s",
                }} />
            </div>

            {/* ─── Sakura petals ──────────────────────────────── */}
            {!reduced && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none"
                    aria-hidden="true">
                    {PETALS.map((p) => (
                        <div key={p.id} className="absolute top-0" style={{
                            left: p.left,
                            animation: `petal ${p.duration} ease-in ${p.delay} infinite`,
                            "--drift": `${p.drift}px`,
                            "--rot": `${p.rotate}deg`,
                        } as React.CSSProperties}>
                            <svg width={p.size} height={p.size * 1.4} viewBox="0 0 10 14">
                                <ellipse cx="5" cy="7" rx="3.5" ry="6"
                                    fill={p.id % 3 === 0 ? C.pink : p.id % 3 === 1 ? C.rose : "#FFC8D5"}
                                    opacity="0.4"
                                    transform={`rotate(${p.rotate} 5 7)`}
                                />
                            </svg>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── Torii silhouette ───────────────────────────── */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
                aria-hidden="true" style={{ opacity: 0.05 }}>
                <svg viewBox="0 0 400 300" width="480" height="360">
                    <rect x="60" y="80" width="18" height="220" fill={C.pink} />
                    <rect x="322" y="80" width="18" height="220" fill={C.pink} />
                    <rect x="20" y="60" width="360" height="22" rx="4" fill={C.pink} />
                    <path d="M20 60 Q0 50 20 42" fill={C.pink} />
                    <path d="M380 60 Q400 50 380 42" fill={C.pink} />
                    <rect x="50" y="110" width="300" height="14" rx="2" fill={C.pink} />
                    <rect x="30" y="82" width="340" height="12" rx="2" fill={C.pink} />
                </svg>
            </div>

            {/* ─── Grain ──────────────────────────────────────── */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.025]
                      mix-blend-overlay pointer-events-none"
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <filter id="grain-komorebi">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65"
                        numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#grain-komorebi)" />
            </svg>

            {/* ─── Vignette ───────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
                style={{ background: "radial-gradient(ellipse at center, transparent 25%, rgba(4,2,6,0.95) 100%)" }} />

            {/* ─── Header ─────────────────────────────────────── */}
            <div className="absolute top-7 left-8 flex items-center gap-2.5 z-10">
                <span className="w-1.5 h-1.5 rounded-full" aria-hidden="true"
                    style={{ background: C.pink, animation: reduced ? "none" : "glowPulse 2.5s ease-in-out infinite", boxShadow: `0 0 6px ${C.glow}` }} />
                <span className="font-accent text-[10px] tracking-[0.35em] uppercase"
                    style={{ color: C.pink, opacity: 0.4 }}>
                    秘密の部屋
                </span>
            </div>

            {/* ─── Close ──────────────────────────────────────── */}
            <button
                onClick={handleClose}
                aria-label="Close — ESC"
                className="absolute top-5 right-7 z-10 w-9 h-9 rounded-full flex items-center
                   justify-center transition-all duration-200 hover:scale-110"
                style={{ border: `1px solid ${C.border}`, color: C.rose, background: C.glass, opacity: 0.6 }}
            >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth={2}>
                    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
            </button>

            {/* ─── Main content ───────────────────────────────── */}
            <div className="absolute inset-0 flex items-center justify-center px-6
                      pointer-events-none">
                <div className="w-full max-w-xs space-y-5 pointer-events-auto">

                    {/* LCD Clock */}
                    <LCDClock />

                    {/* Divider */}
                    <div className="flex items-center gap-3" aria-hidden="true">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.border})` }} />
                        <span className="font-serif text-xs" style={{ color: C.rose, opacity: 0.4 }}>音楽</span>
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${C.border})` }} />
                    </div>

                    {/* Player card */}
                    <div
                        className="rounded-2xl p-6 space-y-5"
                        style={{
                            background: C.glass,
                            backdropFilter: "blur(20px)",
                            border: `1px solid ${C.border}`,
                            boxShadow: `0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
                        }}
                        role="region"
                        aria-label="Lofi music player"
                    >
                        {/* Track info */}
                        <div className="text-center space-y-1">
                            <p className="font-accent text-[9px] tracking-[0.4em] uppercase"
                                style={{ color: C.pink, opacity: 0.5 }}>再生中</p>
                            <p className="font-serif text-xl font-light italic"
                                style={{ color: C.cream }}>
                                lofi hip hop radio
                            </p>
                            <p className="font-accent text-[9px] tracking-widest"
                                style={{ color: C.rose, opacity: 0.45 }}>
                                beats to relax / study to
                            </p>
                        </div>

                        {/* EQ bars */}
                        <div className="flex items-end justify-center gap-[2.5px] h-8"
                            aria-hidden="true">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div key={i} className="rounded-full" style={{
                                    width: "2.5px",
                                    height: playing ? `${10 + Math.sin(i * 0.9) * 9}px` : "3px",
                                    background: i % 3 === 0 ? C.pink : i % 3 === 1 ? C.rose : "#F0A0B8",
                                    opacity: 0.5 + Math.sin(i * 0.5) * 0.25,
                                    animation: playing && !reduced
                                        ? `eqBar ${0.5 + (i % 7) * 0.09}s ease-in-out infinite alternate`
                                        : "none",
                                    animationDelay: `${(i % 5) * 0.07}s`,
                                    transition: "height 0.4s ease",
                                    boxShadow: playing ? `0 0 4px ${C.glow}` : "none",
                                }} />
                            ))}
                        </div>

                        {/* Play button */}
                        <div className="flex justify-center">
                            <button
                                onClick={togglePlay}
                                disabled={!ready}
                                aria-label={playing ? "一時停止" : "再生"}
                                className="w-14 h-14 rounded-full flex items-center justify-center
                           transition-all duration-300 hover:scale-105 active:scale-95
                           disabled:opacity-30"
                                style={{
                                    background: playing ? `rgba(255,183,197,0.15)` : `rgba(255,183,197,0.07)`,
                                    border: `1px solid rgba(255,183,197,0.35)`,
                                    boxShadow: playing
                                        ? `0 0 24px ${C.glow}, 0 0 48px rgba(255,183,197,0.1)`
                                        : "none",
                                }}
                            >
                                {playing ? (
                                    <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: C.pink }}>
                                        <rect x="6" y="4" width="4" height="16" rx="1" />
                                        <rect x="14" y="4" width="4" height="16" rx="1" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 ml-0.5" style={{ fill: C.pink }}>
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Volume */}
                        <div className="flex items-center gap-3">
                            <span className="font-accent text-[8px] tracking-widest"
                                style={{ color: C.rose, opacity: 0.4 }}>音量</span>
                            <div className="relative flex-1 h-px rounded-full"
                                style={{ background: "rgba(255,255,255,0.07)" }}>
                                <div className="absolute top-0 left-0 h-full rounded-full"
                                    style={{ width: `${volume}%`, background: C.rose, opacity: 0.6 }} />
                                <input
                                    type="range" min="0" max="100" step="1" value={volume}
                                    onChange={(e) => handleVolume(Number(e.target.value))}
                                    aria-label="Volume"
                                    className="absolute w-full opacity-0 cursor-pointer"
                                    style={{ top: "-8px", height: "18px" }}
                                />
                            </div>
                            <span className="font-mono text-[9px]"
                                style={{ color: C.cream, opacity: 0.2 }}>{volume}</span>
                        </div>

                        {!ready && (
                            <p className="text-center font-accent text-[9px] tracking-widest uppercase"
                                style={{ color: C.rose, opacity: 0.3 }}>読み込み中…</p>
                        )}
                    </div>

                    {/* ESC hint */}
                    <p className="text-center font-accent text-[8px] tracking-widest uppercase"
                        style={{ color: C.cream, opacity: 0.08 }} aria-hidden="true">
                        ESC で閉じる
                    </p>
                </div>
            </div>

            {/* Hidden YouTube container */}
            <div ref={containerRef} className="absolute -bottom-96 -left-96 w-1 h-1"
                aria-hidden="true" />

            <style>{`
        .lofi-root, .lofi-root * { cursor: default !important; }
        .lofi-root button, .lofi-root input[type="range"] { cursor: pointer !important; }

        @keyframes orbFloat {
          0%,100% { opacity: 1;   transform: translateY(0px);   }
          50%      { opacity: 0.5; transform: translateY(-22px); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 1;   }
          50%      { opacity: 0.2; }
        }
        @keyframes eqBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1.7); }
        }
        @keyframes petal {
          from { transform: translateY(-20px) translateX(0px)       rotate(0deg);   opacity: 0;   }
          8%   {                                                                     opacity: 0.6; }
          90%  {                                                                     opacity: 0.3; }
          to   { transform: translateY(110vh)  translateX(var(--drift)) rotate(540deg); opacity: 0; }
        }
      `}</style>
        </div>
    );
}
