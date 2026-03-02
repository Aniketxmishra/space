"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import SpotifyWidget from "./SpotifyWidget";

const marqueeItems = [
  "Blink — AI GPU Prediction Engine",
  "Nomad — Adventures Platform",
  "Spring Boot · Java · Next.js",
  "SRM IST Chennai · 2026",
  "AI Expert @ Deccan AI",
  "Purpose Fuels Passion",
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion(); // ✅ framer-motion hook, SSR-safe

  // ✅ offset fix — parallax starts when section top hits viewport top
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -100]);

  // ✅ shared transition factory — respects reduced motion
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: reduced ? 0.01 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <>
      <section
        ref={ref}
        aria-label="Hero — Aniket Mishra, Software Engineer"
        className="relative min-h-screen z-10"  // ✅ removed overflow-hidden
      >
        {/* Top-left rotated label */}
        <motion.div
          {...fadeUp(0.3)}
          className="absolute top-28 left-8 hidden lg:block"
          aria-hidden="true"
        >
          <p className="font-accent text-[10px] text-[#94A3B8] tracking-[0.3em] uppercase
                        rotate-[-90deg] origin-left translate-y-16">
            Portfolio · 2026
          </p>
        </motion.div>

        {/* Top-right availability badge */}
        <motion.div
          {...fadeUp(0.4)}
          className="absolute top-28 right-8 hidden lg:flex items-center gap-2"
          aria-label="Currently open to roles"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          <span className="font-accent text-[10px] text-[#94A3B8] tracking-widest uppercase">
            Open to Roles
          </span>
        </motion.div>

        {/* Main content */}
        <div className="flex flex-col justify-center min-h-screen px-8 lg:px-20 pt-20
                        max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0.01 : 0.5 }}
            style={{ y }}
          >
            <motion.p
              {...fadeUp(0.2)}
              className="font-accent text-xs text-cyan-400 tracking-[0.4em] uppercase mb-6"
            >
              Aniket Mishra — Software Engineer
            </motion.p>

            {/* ✅ Single h1 with two spans — fixes double-h1 SEO bug */}
            <h1 className="font-serif font-light leading-[0.85] tracking-tight
                           text-[clamp(5rem,15vw,13rem)]"
              aria-label="Aniket Mishra">
              <div className="overflow-hidden mb-2">
                <motion.span
                  className="block text-white"
                  initial={{ y: reduced ? 0 : 120 }}
                  animate={{ y: 0 }}
                  transition={{ duration: reduced ? 0.01 : 0.9, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  Aniket
                </motion.span>
              </div>
              <div className="overflow-hidden mb-8">
                <motion.span
                  className="block font-semibold italic text-transparent bg-clip-text
                             bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400"
                  initial={{ y: reduced ? 0 : 120 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: reduced ? 0.01 : 0.9,
                    delay: reduced ? 0 : 0.1,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                >
                  Mishra
                </motion.span>
              </div>
            </h1>

            <motion.div
              {...fadeUp(0.6)}
              className="flex flex-col lg:flex-row items-start lg:items-end
                         justify-between gap-8 mt-12"
            >
              <p className="font-sans text-base max-w-sm leading-relaxed
                            border-l-2 border-violet-500/40 pl-4">
                <span className="bg-[#D4A017]/30 text-[#F1F5F9]">
                  Building AI tools, full-stack apps, and things that actually matter.
                  Final year CS @ SRM IST. Currently at Deccan AI.
                </span>
              </p>

              <div className="flex gap-3">
                <a
                  href="#works"
                  className="glass-card px-7 py-3.5 font-accent text-xs tracking-wider
                             text-white hover:border-violet-500/50 transition-all duration-300
                             hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                >
                  View Works
                </a>
                <a
                  href="#contact"
                  className="px-7 py-3.5 font-accent text-xs tracking-wider rounded-2xl
                             bg-gradient-to-r from-violet-600 to-cyan-600
                             hover:opacity-90 transition-all duration-300 text-white"
                >
                  Let&apos;s Connect
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ✅ Scroll indicator */}
        {!reduced && (
          <motion.div
            {...fadeUp(1.4)}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col
                       items-center gap-2"
            aria-hidden="true"
          >
            <span className="font-accent text-[9px] text-white/20 tracking-widest uppercase">
              Scroll
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent
                            animate-[scrollLine_1.8s_ease-in-out_infinite]" />
          </motion.div>
        )}

        {/* ✅ Marquee — fixed keyframe ref + reduced motion guard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 1 }}
          className="absolute bottom-0 left-0 right-0 border-t border-white/5 py-4 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="flex gap-12 whitespace-nowrap"
            style={{
              animation: reduced ? "none" : "marquee 25s linear infinite",
            }}
          >
            {/* ✅ 4 copies for seamless loop + stable keys */}
            {[0, 1, 2, 3].flatMap((copy) =>
              marqueeItems.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="font-accent text-[11px] text-[#94A3B8] tracking-widest uppercase shrink-0"
                >
                  {item}
                  <span className="text-violet-400 mx-3" aria-hidden="true">·</span>
                </span>
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* ✅ SpotifyWidget lifted OUTSIDE section — no overflow-hidden conflict */}
      <div className="fixed bottom-6 left-6 z-50">
        <SpotifyWidget />
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scrollLine {
          0%, 100% { opacity: 0.2; transform: scaleY(1);    }
          50%       { opacity: 0.6; transform: scaleY(1.15); }
        }
      `}</style>
    </>
  );
}
