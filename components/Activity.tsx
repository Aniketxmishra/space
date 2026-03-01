"use client";
import { motion } from "framer-motion";
import type { ActivityItem } from "@/lib/github";

export default function Activity({ events }: { events: ActivityItem[] }) {
  return (
    <section id="activity" className="relative z-10 px-6 py-28 max-w-4xl mx-auto">
      <p className="section-tag text-center">Latest Activity</p>
      <h2 className="font-serif text-5xl font-light text-center mb-16">
        GitHub <span className="italic text-cyan-400">Feed</span>
      </h2>

      <div className="space-y-4">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-5 flex items-start gap-4 hover:border-white/20 transition-all duration-300"
          >
            <div className={`w-1 self-stretch rounded-full ${event.color} shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm text-white truncate">{event.title}</p>
              <p className="font-sans text-xs text-[#94A3B8] mt-0.5">{event.subtitle}</p>
            </div>
            <span className="font-accent text-[10px] text-[#94A3B8] whitespace-nowrap">{event.time}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
