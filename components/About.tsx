"use client";
import { motion, useReducedMotion } from "framer-motion";

const timeline = [
  { year: "2022", event: "Started BTech CS at SRM IST Chennai",           tag: "Origin"      },
  { year: "2024", event: "Built Nomad — a platform for shared adventures", tag: "Buildspace S5"},
  { year: "2025", event: "Launched Blink — AI-powered GPU prediction engine", tag: "AI Project"},
  { year: "2025", event: "Joined Deccan AI Experts as AI Expert",          tag: "Current Role"},
  { year: "2026", event: "Graduating. Building what comes next.",           tag: "Now"         },
];

const skills = [
  { name: "Java",         color: "border-orange-500/40 text-orange-300" },
  { name: "Spring Boot",  color: "border-green-500/40  text-green-300"  },
  { name: "Next.js",      color: "border-white/30      text-white"      },
  { name: "TypeScript",   color: "border-blue-500/40   text-blue-300"   },
  { name: "React",        color: "border-cyan-500/40   text-cyan-300"   },
  { name: "CUDA",         color: "border-emerald-500/40 text-emerald-300"},
  { name: "Web3",         color: "border-purple-500/40 text-purple-300" },
  { name: "PostgreSQL",   color: "border-sky-500/40    text-sky-300"    },
  { name: "Node.js",      color: "border-lime-500/40   text-lime-300"   },
  { name: "REST APIs",    color: "border-pink-500/40   text-pink-300"   },
  { name: "Git & GitHub", color: "border-violet-500/40 text-violet-300" },
  { name: "React Native", color: "border-teal-500/40   text-teal-300"   },
];

const statusItems = [
  { label: "Role",     value: "AI Expert @ Deccan AI Experts"    },
  { label: "Degree",   value: "BTech CS · SRM IST · 2026"        },
  { label: "Building", value: "This portfolio & more AI tools"   },
  { label: "Based in", value: "Chennai, India 🇮🇳"               },
];

// ✅ viewport config with margin — animations start 80px before element hits edge
const vp = (margin = "-80px") => ({ once: true, margin });

export default function About() {
  const reduced = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial:    { opacity: 0, y: reduced ? 0 : 40 },
    whileInView:{ opacity: 1, y: 0 },
    transition: { delay: reduced ? 0 : delay, duration: reduced ? 0.01 : 0.8 },
    viewport:   vp(),
  });

  const fadeX = (dir: 1 | -1, delay = 0) => ({
    initial:    { opacity: 0, x: reduced ? 0 : dir * 40 },
    whileInView:{ opacity: 1, x: 0 },
    transition: { delay: reduced ? 0 : delay, duration: reduced ? 0.01 : 0.8 },
    viewport:   vp(),
  });

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative z-10 px-6 py-28 max-w-6xl mx-auto"
    >
      <p className="section-tag text-center">The Person Behind the Code</p>

      {/* ✅ blockquote — semantically correct for a personal statement */}
      <motion.div {...fadeUp()} className="text-center max-w-4xl mx-auto mb-24">
        <blockquote className="font-serif text-[clamp(2rem,5vw,4rem)] font-light
                               leading-tight text-white mb-6"
                    id="about-heading">
          {"I did not start with a passion for coding. "}
          <span className="italic text-transparent bg-clip-text
                           bg-gradient-to-r from-violet-400 to-cyan-400">
            I started with a need to understand how things work.
          </span>
        </blockquote>
        <p className="font-sans text-[#94A3B8] text-sm max-w-xl mx-auto leading-relaxed">
          Final year CS student at SRM IST Chennai. C++ was where it began —
          now I build AI tools, full-stack apps, and whatever needs building.
          Purpose fuels everything.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

        {/* ─── Timeline ─────────────────────────────────────── */}
        <motion.div {...fadeX(-1)}>
          <p className="font-accent text-xs text-[#94A3B8] tracking-widest uppercase mb-8"
             aria-hidden="true">
            The Journey
          </p>

          {/* ✅ <ol> — ordered list for chronological timeline */}
          <ol aria-label="Career and education timeline" className="relative">
            {/* Vertical line */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-px
                         bg-gradient-to-b from-violet-500/50 via-cyan-500/30 to-transparent"
            />
            <div className="space-y-8 pl-8">
              {timeline.map((item) => (
                <motion.li
                  key={item.tag}               // ✅ stable key
                  initial={{ opacity: 0, x: reduced ? 0 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduced ? 0.01 : 0.5 }}
                  viewport={vp("-60px")}
                  className="relative list-none"
                >
                  {/* Timeline dot */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-8 top-1.5 w-2 h-2 rounded-full
                               bg-violet-400 ring-2 ring-violet-400/20"
                  />
                  <span className="font-accent text-[10px] text-cyan-400
                                   tracking-widest uppercase">
                    {item.tag}
                  </span>
                  <p className="font-sans text-sm text-white mt-1">{item.event}</p>
                  <time
                    dateTime={item.year}
                    className="font-accent text-xs text-[#94A3B8] mt-0.5 block"
                  >
                    {item.year}
                  </time>
                </motion.li>
              ))}
            </div>
          </ol>
        </motion.div>

        {/* ─── Right column ──────────────────────────────────── */}
        <motion.div {...fadeX(1)} className="space-y-10">

          {/* Status card */}
          <div className="glass-card p-6 border-violet-500/20">
            <p className="font-accent text-[10px] text-violet-400 tracking-widest
                          uppercase mb-4" aria-hidden="true">
              ● Currently
            </p>
            <dl className="space-y-3">
              {statusItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <dt className="font-accent text-[10px] text-[#94A3B8] tracking-widest
                                 uppercase w-20 shrink-0">
                    {item.label}
                  </dt>
                  <dd className="font-sans text-xs text-white">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Skills */}
          <div>
            <p className="font-accent text-xs text-[#94A3B8] tracking-widest uppercase mb-5">
              Stack &amp; Tools
            </p>
            <ul
              aria-label="Technical skills"
              className="flex flex-wrap gap-2"
            >
              {skills.map((skill, i) => (
                <motion.li
                  key={skill.name}              // ✅ stable key
                  initial={{ opacity: 0, scale: reduced ? 1 : 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={vp("-40px")}
                  // ✅ entrance transition separate from hover
                  transition={{ delay: reduced ? 0 : i * 0.04, duration: reduced ? 0.01 : 0.3 }}
                  className="list-none"
                >
                  <motion.span
                    // ✅ hover has its own transition — no delay inheritance
                    whileHover={{ scale: reduced ? 1 : 1.08 }}
                    transition={{ duration: 0.15 }}
                    className={`
                      font-accent text-xs px-3 py-1.5 rounded-full border
                      cursor-default block select-none
                      /* ✅ no glass-card — simple border only, zero blur layers */
                      bg-white/[0.03] ${skill.color}
                    `}
                  >
                    {skill.name}
                  </motion.span>
                </motion.li>
              ))}
            </ul>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
