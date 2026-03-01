"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const scale = useRef({ ring: 1, dot: 1 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.style.cursor = "none";

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    /* ─── Mouse position (only raw coords, nothing else) ── */
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    /* ─── Hover / click via event delegation ─────────────── */
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]")) {
        scale.current = { ring: 1.5, dot: 0 };
      }
    };
    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null;
      if (!to?.closest("a, button, [data-cursor]")) {
        scale.current = { ring: 1, dot: 1 };
      }
    };
    const onDown = () => { scale.current.ring = 0.7; scale.current.dot = 0.5; };
    const onUp = () => { scale.current = { ring: 1, dot: 1 }; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    /* ─── Single RAF loop — transform only, zero layout ─── */
    let frame: number;
    let ringScale = 1, dotScale = 1;

    const animate = () => {
      const { x, y } = pos.current;

      // Dot — instant, no layout cost
      dotRef.current?.style &&
        (dotRef.current.style.transform =
          `translate(${x - 4}px,${y - 4}px) scale(${dotScale})`);

      // Ring — lerp position AND scale, no width/height change ever
      ringPos.current.x = lerp(ringPos.current.x, x, 0.14);
      ringPos.current.y = lerp(ringPos.current.y, y, 0.14);
      ringScale = lerp(ringScale, scale.current.ring, 0.14);
      dotScale = lerp(dotScale, scale.current.dot, 0.18);

      if (ringRef.current?.style) {
        ringRef.current.style.transform =
          `translate(${ringPos.current.x - 20}px,${ringPos.current.y - 20}px) scale(${ringScale})`;
      }

      // Ring color swap — only write when state actually changes
      if (ringRef.current?.style && scale.current.ring === 1.5) {
        ringRef.current!.style.borderColor = "rgba(212,160,23,0.85)";
        ringRef.current!.style.boxShadow = "0 0 18px rgba(212,160,23,0.4)";
      } else if (ringRef.current?.style && scale.current.ring === 0.7) {
        ringRef.current!.style.borderColor = "rgba(192,57,43,0.85)";
        ringRef.current!.style.boxShadow = "0 0 14px rgba(192,57,43,0.5)";
      } else if (ringRef.current?.style) {
        ringRef.current!.style.borderColor = "rgba(255,255,255,0.25)";
        ringRef.current!.style.boxShadow = "none";
      }

      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.body.style.cursor = "auto";
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>

      {/* Ring — fixed 40×40, scale via transform ONLY */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border"
        style={{
          width: "40px", height: "40px",
          borderColor: "rgba(255,255,255,0.25)",
          willChange: "transform",
          // NO transition on width/height — only transform is GPU composited
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
    </>
  );
}
