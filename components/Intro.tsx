"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { EASE } from "@/lib/gsap";
import { MOTION } from "@/lib/motion-timing";

/**
 * Animated name introduction that plays once on initial page load.
 * Then transitions to the main portfolio content.
 * 
 * Features:
 - Letter-by-letter/staggered reveal of the developer's name
 - Controlled timing that doesn't keep visitors waiting
 - Seamless transition to main content
 - Respects prefers-reduced-motion
 - Only plays once per session (tracked via localStorage)
 */
export function Intro() {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Only run once per session
  useEffect(() => {
    const previouslyPlayed = localStorage.getItem("portfolioIntroPlayed");
    if (previouslyPlayed === "1") {
      setHasPlayed(true);
      return;
    }
  }, []);

  useEffect(() => {
    if (hasPlayed) {
      setIsComplete(true);
      return;
    }

    // Check for reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Skip animation, just show the name instantly
      setHasPlayed(true);
      localStorage.setItem("portfolioIntroPlayed", "1");
      setIsComplete(true);
      return;
    }

    // Find the name element
    const nameEl = document.querySelector<HTMLElement>('[data-hero-split="words"]');
    if (!nameEl) {
      setHasPlayed(true);
      localStorage.setItem("portfolioIntroPlayed", "1");
      setIsComplete(true);
      return;
    }

    // Split the name into words and lines for animation
    const nameSplit = SplitText.create(nameEl, {
      type: "words,lines",
      mask: "lines",
    });

    // Create the intro timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setHasPlayed(true);
        localStorage.setItem("portfolioIntroPlayed", "1");
        nameSplit.revert();
        setIsComplete(true);
      },
    });

    // Animate words with staggered reveal
    tl.from(
      nameSplit.words,
      {
        yPercent: 110,
        duration: MOTION.hero.name,
        ease: EASE,
        stagger: MOTION.stagger.heroWords,
      },
      0
    );

    // Animate the subtitle lines
    const subEl = document.querySelector<HTMLElement>('[data-hero-split="lines"]');
    if (subEl) {
      const subSplit = SplitText.create(subEl, {
        type: "lines",
        mask: "lines",
      });

      tl.from(
        subSplit.lines,
        {
          yPercent: 110,
          duration: MOTION.hero.headline,
          ease: EASE,
          stagger: MOTION.stagger.heroHeadline,
        },
        0.16
      );
    }

    // Wait a moment then mark as complete so the main content can show
    const waitComplete = setTimeout(() => {
      setIsComplete(true);
    }, MOTION.hero.name + MOTION.hero.headline + 0.3);

    return () => {
      clearTimeout(waitComplete);
    };
  }, [hasPlayed]);

  return null; // This component doesn't render anything visible;
  // it just runs the animation and sets states
}