"use client";
import { useEffect, useRef, memo } from "react";

interface Star         { x: number; y: number; r: number; o: number; speed: number; layer: number }
interface ShootingStar { x: number; y: number; vx: number; vy: number; len: number; o: number }
interface AuroraWave   { y: number; amp: number; freq: number; speed: number; phase: number; c0: string; c1: string }
interface Ripple       { x: number; y: number; r: number; maxR: number; o: number }

// ✅ React.memo — parent re-renders never recreate the canvas
const AuroraBackground = memo(function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // ✅ 1 — prefers-reduced-motion gate (WCAG 2.1 AA)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ─── devicePixelRatio + resize ──────────────────────── */
    const dpr = window.devicePixelRatio || 1;

    // Stars declared here so resize can reposition them
    const stars: Star[] = [];

    const populateStars = () => {
      stars.length = 0;
      Array.from({ length: 240 }).forEach(() => {
        const layer = Math.floor(Math.random() * 3);
        stars.push({
          x:     Math.random() * window.innerWidth,
          y:     Math.random() * window.innerHeight,
          r:     [0.5 + Math.random() * 0.6, 0.8 + Math.random() * 0.9, 1.2 + Math.random() * 1.2][layer],
          o:     Math.random(),
          speed: Math.random() * 0.004 + 0.001,
          layer,
        });
      });
    };

    const setSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width        = w * dpr;
      canvas.height       = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // ✅ 2 — reposition stars on resize, no top-left clustering
      populateStars();
    };
    setSize();
    window.addEventListener("resize", setSize);

    /* ─── Mouse parallax ─────────────────────────────────── */
    const onMouse = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouse, { passive: true });

    /* ─── Click ripple ────────────────────────────────────── */
    const ripples: Ripple[] = [];
    // ✅ 3 — listen on canvas directly for mobile Safari reliability
    const onCanvasClick = (e: MouseEvent | TouchEvent) => {
      let cx: number, cy: number;
      if (e instanceof TouchEvent) {
        cx = e.changedTouches[0].clientX;
        cy = e.changedTouches[0].clientY;
      } else {
        cx = e.clientX;
        cy = e.clientY;
      }
      ripples.push({ x: cx, y: cy, r: 0, maxR: 120 + Math.random() * 60, o: 0.7 });
    };
    // Both click + touchend for full cross-device coverage
    window.addEventListener("click",    onCanvasClick as EventListener);
    window.addEventListener("touchend", onCanvasClick as EventListener, { passive: true });

    /* ─── Shooting stars ─────────────────────────────────── */
    const shoots: ShootingStar[] = [];
    const spawnShoot = () => {
      const angle = -Math.PI / 5 + (Math.random() - 0.5) * 0.4;
      const spd   = Math.random() * 14 + 8;
      shoots.push({
        x:   Math.random() * window.innerWidth  * 0.75,
        y:   Math.random() * window.innerHeight * 0.45,
        vx:  Math.cos(angle) * spd,
        vy:  Math.sin(angle) * spd,
        len: Math.random() * 120 + 60,
        o:   1,
      });
    };

    /* ─── Aurora waves ───────────────────────────────────── */
    const waves: AuroraWave[] = [
      { y:.22, amp:.055, freq:.0030, speed:.00080, phase:0.0, c0:"rgba(212,160,23,0.08)",  c1:"rgba(212,160,23,0)"  },
      { y:.30, amp:.045, freq:.0040, speed:.00060, phase:2.1, c0:"rgba(192,57,43,0.065)",  c1:"rgba(192,57,43,0)"   },
      { y:.18, amp:.035, freq:.0055, speed:.00100, phase:4.3, c0:"rgba(230,200,80,0.045)", c1:"rgba(230,200,80,0)"  },
      { y:.72, amp:.040, freq:.0028, speed:.00070, phase:1.0, c0:"rgba(192,57,43,0.05)",   c1:"rgba(100,20,20,0)"   },
    ];

    const drawWave = (w: AuroraWave) => {
      w.phase += w.speed;
      const W     = window.innerWidth;
      const H     = window.innerHeight;
      const baseY = H * w.y;
      const waveH = H * w.amp;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      for (let x = 0; x <= W; x += 5) {
        const y = baseY
          + Math.sin(x * w.freq + w.phase) * waveH
          + Math.sin(x * w.freq * 1.7 + w.phase * 0.8) * waveH * 0.4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, baseY + waveH * 4);
      ctx.lineTo(0, baseY + waveH * 4);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, baseY - waveH, 0, baseY + waveH * 4);
      g.addColorStop(0, w.c0);
      g.addColorStop(1, w.c1);
      ctx.fillStyle = g;
      ctx.fill();
    };

    /* ─── Render loop ────────────────────────────────────── */
    let frame:     number;
    let t        = 0;
    let paused   = false;
    // ✅ 5 — time-delta shooting star spawn, no setInterval drift
    let lastShootT = 0;
    const SHOOT_INTERVAL = 2.8;

    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) frame = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const draw = () => {
      if (paused) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);
      t += 0.01;

      // ✅ 5 — spawn shooting star via time-delta (no setInterval)
      if (t - lastShootT > SHOOT_INTERVAL) {
        if (Math.random() < 0.65) spawnShoot();
        lastShootT = t;
      }

      // 1 — Aurora waves
      waves.forEach(drawWave);

      // 2 — Parallax stars
      const mx = (mouse.current.x / W - 0.5) * 2;
      const my = (mouse.current.y / H - 0.5) * 2;
      stars.forEach((s) => {
        const shift = s.layer * 5;
        const px    = s.x + mx * shift;
        const py    = s.y + my * shift;
        s.o = 0.15 + Math.abs(Math.sin(t * s.speed * 100)) * 0.85;
        if (s.layer === 2 && s.r > 1.8) {
          ctx.shadowBlur  = 5;
          ctx.shadowColor = "rgba(255,240,200,0.6)";
        }
        ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.o})`; ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3 — Shooting stars
      for (let i = shoots.length - 1; i >= 0; i--) {
        const ss = shoots[i];
        ss.x += ss.vx; ss.y += ss.vy; ss.o -= 0.011;
        if (ss.o <= 0 || ss.x > W || ss.y > H) { shoots.splice(i, 1); continue; }
        const spd  = Math.hypot(ss.vx, ss.vy);
        const tx   = ss.x - (ss.vx / spd) * ss.len;
        const ty   = ss.y - (ss.vy / spd) * ss.len;
        const grad = ctx.createLinearGradient(tx, ty, ss.x, ss.y);
        grad.addColorStop(0,   "transparent");
        grad.addColorStop(0.5, `rgba(220,180,90,${ss.o * 0.35})`);
        grad.addColorStop(1,   `rgba(255,255,255,${ss.o})`);
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(ss.x, ss.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${ss.o})`; ctx.fill();
      }

      // 4 — Click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += (rp.maxR - rp.r) * 0.06;
        rp.o -= 0.018;
        if (rp.o <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,160,23,${rp.o * 0.9})`;
        ctx.lineWidth   = 1.5; ctx.stroke();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,220,120,${rp.o * 0.4})`;
        ctx.lineWidth   = 1; ctx.stroke();
        if (rp.r < 18) {
          ctx.beginPath(); ctx.arc(rp.x, rp.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${rp.o})`; ctx.fill();
        }
      }

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize",      setSize);
      window.removeEventListener("mousemove",   onMouse);
      window.removeEventListener("click",       onCanvasClick as EventListener);
      window.removeEventListener("touchend",    onCanvasClick as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050508]" />

      {/* ✅ 4 & 6 — split opacity/scale into separate keyframes, will-change added */}
      <div className="absolute rounded-full" style={{
        width:"700px", height:"700px", top:"-18%", right:"-12%",
        background:"radial-gradient(circle, rgba(212,160,23,0.22) 0%, rgba(180,100,10,0.08) 45%, transparent 70%)",
        filter:"blur(72px)",
        willChange:"opacity, transform",
        animation:"orbFloat 7s ease-in-out infinite",
      }} />

      <div className="absolute rounded-full" style={{
        width:"800px", height:"800px", bottom:"-25%", left:"-18%",
        background:"radial-gradient(circle, rgba(192,57,43,0.18) 0%, rgba(150,20,20,0.07) 45%, transparent 70%)",
        filter:"blur(90px)",
        willChange:"opacity, transform",
        animation:"orbFloat 9s ease-in-out infinite",
        animationDelay:"3.5s",
      }} />

      <div className="absolute rounded-full" style={{
        width:"500px", height:"500px", top:"35%", left:"38%",
        transform:"translate(-50%,-50%)",
        background:"radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%)",
        filter:"blur(70px)",
        willChange:"opacity",
        animation:"orbPulse 12s ease-in-out infinite",
        animationDelay:"6s",
      }} />

      <div className="absolute rounded-full" style={{
        width:"420px", height:"420px", top:"-5%", left:"-5%",
        background:"radial-gradient(circle, rgba(20,165,145,0.09) 0%, transparent 70%)",
        filter:"blur(65px)",
        willChange:"opacity, transform",
        animation:"orbFloat 10s ease-in-out infinite",
        animationDelay:"1.5s",
      }} />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage:`linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),
                         linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)`,
        backgroundSize:"60px 60px",
      }} />

      <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <div className="absolute inset-0" style={{
        background:"radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.9) 100%)",
      }} />

      <style>{`
        /* ✅ 4 — orbFloat uses translate only (no scale conflict w/ fixed children) */
        @keyframes orbFloat {
          0%,100% { opacity: 1;    transform: translateY(0px);   }
          50%      { opacity: 0.5; transform: translateY(-18px);  }
        }
        /* Center orb has no translateY since it uses translate(-50%,-50%) */
        @keyframes orbPulse {
          0%,100% { opacity: 1;   }
          50%      { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
});

export default AuroraBackground;
