import AuroraBackground from "@/components/AuroraBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Works from "@/components/Works";
import Activity from "@/components/Activity";
import About from "@/components/About";
import Contact from "@/components/Contact";
import SectionDivider from "@/components/SectionDivider";
import { getGithubRepos, getGithubActivity } from "@/lib/github";

export default async function Home() {
  const [repos, events] = await Promise.all([
    getGithubRepos("Aniketxmishra"),
    getGithubActivity("Aniketxmishra"),
  ]);

  return (
    <main className="relative min-h-screen">
      <AuroraBackground />
      <Navbar />
      <Hero />
      <SectionDivider />
      <Works repos={repos} />
      <SectionDivider />
      <Activity events={events} />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Contact />
    </main>
  );
}
