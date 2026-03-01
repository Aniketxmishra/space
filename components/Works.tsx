"use client";
import { motion } from "framer-motion";
import type { Repo } from "@/lib/github";

const LANG_COLORS: Record<string, string> = {
  Java: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  TypeScript: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  JavaScript: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Python: "bg-green-500/20 text-green-300 border-green-500/30",
  default: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

export default function Works({ repos }: { repos: Repo[] }) {
  return (
    <section id="works" className="relative z-10 px-6 py-28 max-w-6xl mx-auto">
      <p className="section-tag text-center">Open Source & Projects</p>
      <h2 className="font-serif text-5xl font-light text-center mb-16">
        My <span className="italic text-violet-400">Works</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {repos.map((repo, i) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(124,58,237,0.2)" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-5 flex flex-col gap-3 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-accent text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                {repo.name}
              </h3>
              <span className="text-[#94A3B8] text-xs">★ {repo.stargazers_count}</span>
            </div>

            <p className="font-sans text-xs text-[#94A3B8] line-clamp-2 flex-1">
              {repo.description || "No description provided."}
            </p>

            <div className="flex items-center gap-2 flex-wrap mt-auto pt-2 border-t border-white/5">
              {repo.language && (
                <span className={`font-accent text-[10px] px-2 py-0.5 rounded-full border tracking-wider ${LANG_COLORS[repo.language] || LANG_COLORS.default}`}>
                  {repo.language}
                </span>
              )}
              {repo.topics?.slice(0, 2).map((t) => (
                <span key={t} className="font-accent text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-[#94A3B8]">
                  {t}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
