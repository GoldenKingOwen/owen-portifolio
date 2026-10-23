import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";
import { GitHubActivity } from "@/components/GitHubActivity";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { JsonLd } from "@/components/JsonLd";
import { homeJsonLd } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Services />
      <GitHubActivity />
      <Experience />
      <Education />
      <Contact />
    </>
  );
}