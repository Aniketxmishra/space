import Link from "next/link";

const links = ["Works", "Activity", "About", "Contact"];

export default function Navbar() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between backdrop-blur-sm border-b border-white/5"
    >
      <Link href="/" className="font-serif text-xl font-semibold tracking-wide text-white/90">
        AM<span className="text-violet-400">.</span>
      </Link>
      <ul className="hidden sm:flex gap-8">
        {links.map((l) => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
