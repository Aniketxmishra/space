"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const socials = [
  {
    name:   "GitHub",
    handle: "@Aniketxmishra",
    href:   "https://github.com/Aniketxmishra",
    color:  "hover:border-white/40",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    name:   "LinkedIn",
    handle: "anik8mishra",
    href:   "https://linkedin.com/in/anik8mishra",
    color:  "hover:border-blue-500/40",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0A66C2]" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name:   "Twitter / X",
    handle: "@ImAniketmishra",
    href:   "https://x.com/ImAniketmishra",
    color:  "hover:border-sky-500/40",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name:     "Email",
    handle:   "anik8mishra@gmail.com",
    href:     "mailto:anik8mishra@gmail.com",
    color:    "hover:border-violet-500/40",
    external: false,   // ✅ no target="_blank" for mailto
    copyable: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-violet-400 stroke-[1.5]" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
      </svg>
    ),
  },
];

export default function Contact() {
  const reduced  = useReducedMotion();
  const [copied, setCopied] = useState(false);

  // ✅ Copy email to clipboard
  const copyEmail = async (e: React.MouseEvent, email: string) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback — just follow the mailto
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative z-10 px-6 py-28 max-w-4xl mx-auto text-center"
    >
      <p className="section-tag text-center">Get In Touch</p>

      <h2
        id="contact-heading"
        className="font-serif text-5xl font-light mb-6"
      >
        Let&apos;s <span className="italic text-violet-400">Connect</span>
      </h2>

      <p className="font-sans text-[#94A3B8] text-sm max-w-md mx-auto mb-16">
        Open to new opportunities, collabs, or just a good conversation
        about tech, AI, and music.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
        {socials.map((s, i) => {
          const isEmail = s.name === "Email";

          const cardContent = (
            <>
              <span className="w-8 flex items-center justify-center shrink-0">
                {s.icon}
              </span>
              <div className="text-left">
                <p className="font-accent text-[10px] text-[#94A3B8] tracking-widest uppercase mb-1">
                  {s.name}
                </p>
                <p className="font-sans text-sm text-white">{s.handle}</p>
              </div>
              {/* ✅ Copy feedback for email, arrow for others */}
              <span className="ml-auto text-[#94A3B8] text-sm transition-all duration-200">
                {isEmail
                  ? copied ? (
                      <span className="text-violet-400 font-accent text-[10px] tracking-widest">
                        COPIED ✓
                      </span>
                    ) : (
                      <span className="font-accent text-[10px] text-[#94A3B8] tracking-widest">
                        COPY
                      </span>
                    )
                  : "→"
                }
              </span>
            </>
          );

          // ✅ Separate transition for hover vs entrance
          const entranceTransition = {
            delay:    reduced ? 0 : i * 0.1,
            duration: reduced ? 0.01 : 0.4,
          };

          return (
            <motion.a
              key={s.name}
              href={s.href}
              {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={`${s.name}: ${s.handle}${s.external ? ", opens in new tab" : ""}`}
              onClick={isEmail ? (e) => copyEmail(e, s.handle) : undefined}
              initial={{ opacity: 0, y: reduced ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: reduced ? 0 : -4 }}
              transition={entranceTransition}
              // ✅ Dedicated hover transition — no delay inheritance
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true }}
              className={`glass-card p-6 flex items-center gap-4 transition-all
                          duration-300 cursor-pointer ${s.color}`}
            >
              {cardContent}
            </motion.a>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 pt-8 space-y-2">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0.01 : 0.8 }}
          className="font-serif text-lg text-white/60 italic"
        >
          &ldquo;Purpose Fuels Passion&rdquo;
        </motion.p>
        <p className="font-sans text-xs text-[#94A3B8]">
          Designed &amp; Built by{" "}
          <span className="text-white font-medium">Aniket Mishra</span>
          {" "}· 2026
        </p>
      </div>
    </section>
  );
}
