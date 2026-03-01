import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import KonamiCode from "@/components/KonamiCode";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: "Aniket Mishra — Software Engineer",
  description: "Personal space of Aniket Mishra. Works, thoughts, and everything in between.",
  openGraph: {
    title: "Aniket Mishra",
    description: "Software Engineer · Builder · Creator",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#050508] text-[#F1F5F9] font-sans antialiased overflow-x-hidden">
        <SmoothScroll />
        <CustomCursor />
        <KonamiCode />
        {children}
      </body>
    </html>
  );
}
