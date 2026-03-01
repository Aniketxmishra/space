export default function SectionDivider() {
  return (
    <div className="relative z-10 flex items-center gap-4 px-8 lg:px-20 max-w-7xl mx-auto py-2">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 shrink-0" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
    </div>
  );
}
