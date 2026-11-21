import { Hero } from "@/components/Hero";
import { IntroOverlay } from "@/components/IntroOverlay";
import { Intro } from "@/components/Intro";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { JsonLd } from "@/components/JsonLd";
import { homeJsonLd } from "@/lib/structured-data";
import { SignalDivider } from "@/components/SignalDivider";

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      {/* Server-rendered opening screen + the client sequence that animates it. */}
      <IntroOverlay />
      <Intro />
      <Hero />
      <About />
      <SignalDivider />
      <Skills />
      <Projects />
      <SignalDivider />
      <Services />
      <Experience />
      <Education />
      <Testimonials />
      <Contact />
    </>
  );
}
