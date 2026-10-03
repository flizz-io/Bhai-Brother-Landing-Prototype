"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  initialExpeditions,
  TourExpedition,
  SquadMember,
} from "@/data/toursData";
import TripDetailModal from "@/components/TripDetailModal";
import BrotherProfileModal from "@/components/BrotherProfileModal";
import GadgetsSection from "@/components/GadgetsSection";
import Navbar from "@/components/Navbar";
import VaultParallaxReel from "@/components/VaultParallaxReel";
import SquadConstellation from "@/components/SquadConstellation";
import { HugeiconsIcon, SparklesIcon } from "@/components/HugeIcon";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  MapPin,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

// Mathematical animation helpers
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smoothstep = (e0: number, e1: number, v: number) => {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const segmentInOut = (s: number, a: number, b: number, c: number, d: number) => {
  const enter = smoothstep(a, b, s);
  const exit = smoothstep(c, d, s);
  return { enter, exit, active: enter * (1 - exit) };
};

export default function Home() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sightsControlsRef = useRef<HTMLDivElement>(null);

  // App States
  const [expeditions, setExpeditions] = useState<TourExpedition[]>(initialExpeditions);
  const [selectedExpedition, setSelectedExpedition] = useState<TourExpedition | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedBrother, setSelectedBrother] = useState<SquadMember | null>(null);

  // Bucket list state
  const [bucketList, setBucketList] = useState([
    {
      id: "b1",
      title: "সেন্ট মার্টিন ডিপ উইন্টার ক্যাম্পিং",
      location: "ছেঁড়া দ্বীপ ও সেন্ট মার্টিন সৈকত",
      targetSeason: "শীতকাল (ডিসেম্বর ২০২৬)",
      tag: "সমুদ্র ও কোরাল",
      votes: 14,
      voted: false,
    },
    {
      id: "b2",
      title: "আমিয়াখুম এক্সট্রিম ট্র্যাকিং ও ক্যাসকেড",
      location: "থানচি ও নাফাখুম, বান্দরবান",
      targetSeason: "বর্ষা পরবর্তী (অক্টোবর ২০২৬)",
      tag: "অ্যাডভেঞ্চার ট্রেইল",
      votes: 19,
      voted: true,
    },
    {
      id: "b3",
      title: "কাপ্তাই লেক কায়াকিং ও আইল্যান্ড ক্যাম্প",
      location: "রাঙ্গামাটি কাপ্তাই লেক",
      targetSeason: "বসন্তকাল (ফেব্রুয়ারি ২০২৭)",
      tag: "লেক ও ক্যাম্প",
      votes: 11,
      voted: false,
    },
  ]);

  // Load custom tours from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bhai_brothers_custom_tours");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => {
            setExpeditions([...parsed, ...initialExpeditions]);
          }, 0);
        }
      }
    } catch {
      // ignore
    }
  }, []);



  const handleVote = (id: string) => {
    setBucketList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            votes: item.voted ? item.votes - 1 : item.votes + 1,
            voted: !item.voted,
          };
        }
        return item;
      })
    );
  };

  // Section-by-section scroll animations (Apple-style subtle reveal, not over-animated)
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Subtle scroll reveals for section titles/eyebrows
    const sectionHeaders = gsap.utils.toArray<HTMLElement>(".section-reveal");
    sectionHeaders.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    // Bento grid cards stagger
    const bentoItems = gsap.utils.toArray<HTMLElement>(".bento-item");
    if (bentoItems.length > 0) {
      gsap.fromTo(
        bentoItems,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#expeditions",
            start: "top 75%",
            once: true,
          },
        }
      );
    }

    // Bucketlist cards stagger
    const bucketCards = gsap.utils.toArray<HTMLElement>(".bucket-card");
    if (bucketCards.length > 0) {
      gsap.fromTo(
        bucketCards,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#bucketlist",
            start: "top 80%",
            once: true,
          },
        }
      );
    }
  }, []);

  // Cinema Scroll Parallax Engine
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const sightsControls = sightsControlsRef.current;
    const targetEl = section;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!section || !track || !targetEl) return;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetScroll = 0;
    let smoothScroll = 0;
    let initialized = false;
    let rafPending = false;
    let sightCards: HTMLElement[] = [];
    let originalSightCount = 5;
    let activeSight = originalSightCount;

    const isSectionInView = () => {
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.bottom > -80 && rect.top < window.innerHeight + 80;
    };

    const getScrollDistance = () => {
      if (!section) return 0;
      return clamp(-section.getBoundingClientRect().top, 0, section.offsetHeight - window.innerHeight);
    };

    const update = () => {
      rafPending = false;
      if (!isSectionInView()) return;

      targetScroll = getScrollDistance();

      if (!initialized || reduceMotion.matches) {
        smoothScroll = targetScroll;
        initialized = true;
      } else {
        smoothScroll = lerp(smoothScroll, targetScroll, 0.18);
      }
      if (Math.abs(smoothScroll - targetScroll) < 0.1) smoothScroll = targetScroll;

      mouseX = lerp(mouseX, targetMouseX, 0.14);
      mouseY = lerp(mouseY, targetMouseY, 0.14);

      const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
      const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
      const progress = clamp(smoothScroll / 2700);
      const introExit = smoothstep(90, 650, smoothScroll);
      const sightsSlideRaw = smoothstep(2680, 3420, smoothScroll);
      const sightsEnter = Math.pow(sightsSlideRaw, 1.55);
      const sightsOpacity = smoothstep(2680, 2880, smoothScroll);
      const sightsControlsEnter = smoothstep(2680, 2880, smoothScroll);
      const blurActive = clamp(frame2.active + frame3.active);
      const frame2Opacity = frame2.active * (1 - frame3.enter);
      const splitDrift = Math.pow(frame2.enter, 1.5);
      const panel2Opacity = frame2.active * (1 - frame2.exit);
      const panel3Opacity = frame3.active * (1 - frame3.exit);
      const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
      const sharedHeroY = progress * -74;
      const sharedHeroScale = progress * 0.23;
      const sightsScreenTop = Math.min(240, Math.max(130, window.innerHeight * 0.20));

      // Variable writes strictly scoped to section element (prevents whole-page invalidation)
      targetEl.style.setProperty("--mx", (reduceMotion.matches ? 0 : mouseX).toFixed(4));
      targetEl.style.setProperty("--my", (reduceMotion.matches ? 0 : mouseY).toFixed(4));

      targetEl.style.setProperty("--back-opacity", (1 - frame2.active * 0.06).toFixed(4));
      targetEl.style.setProperty("--back-x", `${(mouseX * -12).toFixed(2)}px`);
      targetEl.style.setProperty("--back-y", `${(mouseY * -4).toFixed(2)}px`);
      targetEl.style.setProperty("--back-scale", backScale.toFixed(4));
      targetEl.style.setProperty("--four-y", `${(10 + progress * 10).toFixed(2)}vh`);
      targetEl.style.setProperty("--four-scale", (0.78 + progress * 0.16).toFixed(4));
      targetEl.style.setProperty("--bazaar-y", `${(20 - progress * 8).toFixed(2)}vh`);
      targetEl.style.setProperty("--back-brightness", (1 - blurActive * 0.255).toFixed(4));
      targetEl.style.setProperty("--bazaar-brightness", (1 - frame2.active * 0.255 - frame3.active * 0.06).toFixed(4));
      targetEl.style.setProperty("--bazaar-saturation", (1 + frame3.active * 0.18).toFixed(4));
      targetEl.style.setProperty("--shade-opacity", "1");
      targetEl.style.setProperty("--shade-z", frame2.active > 0.02 ? "2" : "0");
      targetEl.style.setProperty("--shade-top-alpha", (blurActive * 0.465).toFixed(4));
      targetEl.style.setProperty("--shade-mid-alpha", (blurActive * 0.42).toFixed(4));
      targetEl.style.setProperty("--shade-bottom-alpha", (blurActive * 0.51).toFixed(4));

      targetEl.style.setProperty("--title-y", `${(introExit * -210).toFixed(2)}px`);
      targetEl.style.setProperty("--title-scale", (1 - introExit * 0.08).toFixed(4));
      targetEl.style.setProperty("--title-opacity", (1 - introExit).toFixed(4));

      targetEl.style.setProperty("--bridge-x", `calc(-50% + ${(mouseX * 18).toFixed(2)}px)`);
      targetEl.style.setProperty("--bridge-y", `${(mouseY * 8 + sharedHeroY - frame2.exit * 760).toFixed(2)}px`);
      targetEl.style.setProperty("--bridge-bottom", `${(5 - frame2.enter * 13).toFixed(2)}vh`);
      targetEl.style.setProperty("--bridge-width", `${(67.2 + frame2.enter * 37.8).toFixed(2)}vw`);
      targetEl.style.setProperty("--bridge-scale", (1.02 + sharedHeroScale + frame2.exit * 0.46).toFixed(4));

      targetEl.style.setProperty("--split-left-x", `calc(-50% + ${(-splitDrift * 46).toFixed(2)}vw + ${(mouseX * 22).toFixed(2)}px)`);
      targetEl.style.setProperty("--split-left-y", `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`);
      targetEl.style.setProperty("--split-left-scale", (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4));
      targetEl.style.setProperty("--split-right-x", `calc(-50% + ${(splitDrift * 46).toFixed(2)}vw + ${(mouseX * 22).toFixed(2)}px)`);
      targetEl.style.setProperty("--split-right-y", `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`);
      targetEl.style.setProperty("--split-right-scale", (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4));

      targetEl.style.setProperty("--frame2-opacity", frame2Opacity.toFixed(4));
      targetEl.style.setProperty("--frame2-x", `calc(-50% + ${(mouseX * 10).toFixed(2)}px)`);
      targetEl.style.setProperty("--frame2-y", `calc(-50% + ${(mouseY * 8 - frame2.exit * 150).toFixed(2)}px)`);
      targetEl.style.setProperty("--frame2-scale", (1.06 + frame2.enter * 0.08 + frame2.exit * 0.08).toFixed(4));

      targetEl.style.setProperty("--intro-copy-y", `${(introExit * 90).toFixed(2)}px`);
      targetEl.style.setProperty("--intro-copy-opacity", (1 - introExit).toFixed(4));
      targetEl.style.setProperty("--panel2-opacity", panel2Opacity.toFixed(4));
      targetEl.style.setProperty("--panel2-y", `calc(-50% + ${(-frame2.exit * 18 + (1 - frame2.enter) * 18).toFixed(2)}px)`);
      targetEl.style.setProperty("--panel3-opacity", panel3Opacity.toFixed(4));
      targetEl.style.setProperty("--panel3-y", `calc(-50% + ${(-frame3.exit * 18 + (1 - frame3.enter) * 18).toFixed(2)}px)`);

      targetEl.style.setProperty("--sights-opacity", sightsOpacity.toFixed(4));
      targetEl.style.setProperty("--sights-controls-opacity", sightsControlsEnter.toFixed(4));
      if (sightsControls) {
        sightsControls.classList.toggle("is-ready", sightsControlsEnter > 0.98);
      }
      targetEl.style.setProperty("--sights-visibility", sightsOpacity > 0.01 ? "visible" : "hidden");
      targetEl.style.setProperty("--sights-y", "0px");
      targetEl.style.setProperty("--sights-enter-x", `${((1 - sightsEnter) * 420).toFixed(2)}vw`);
      targetEl.style.setProperty("--sights-scale", "1");
      targetEl.style.setProperty("--sights-top", `${sightsScreenTop}px`);
      targetEl.style.setProperty("--sights-screen-top", `${sightsScreenTop}px`);

      if (
        isSectionInView() &&
        (Math.abs(smoothScroll - targetScroll) > 0.1 ||
          Math.abs(mouseX - targetMouseX) > 0.001 ||
          Math.abs(mouseY - targetMouseY) > 0.001)
      ) {
        requestTick();
      }
    };

    const requestTick = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(update);
      }
    };

    // Card slider logic
    const updateSightSlider = () => {
      if (!sightCards.length || !track) return;
      const cardWidth = sightCards[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || "0");
      const centerOffset = (window.innerWidth - cardWidth) / 2;
      const shift = centerOffset - (cardWidth + gap) * activeSight;
      targetEl.style.setProperty("--sights-shift", `${shift}px`);

      sightCards.forEach((c, idx) => {
        c.classList.toggle("is-active", idx === activeSight);
      });

      const activeIdx = ((activeSight % 5) + 5) % 5;
      const counterEl = document.querySelector(".dock-counter");
      if (counterEl) {
        counterEl.textContent = `0${activeIdx + 1} / 05`;
      }
      const titleEl = document.querySelector(".dock-active-title");
      const expTitles = [
        "সাজেক ভ্যালি",
        "কেওক্রাডং সামিট",
        "ইনানী বিচ ক্যাম্পফায়ার",
        "টাঙ্গুয়ার হাওড়",
        "লাউয়াছড়া ও শ্রীমঙ্গল",
      ];
      if (titleEl && expTitles[activeIdx]) {
        titleEl.textContent = expTitles[activeIdx];
      }
    };

    const jumpSightSlider = (i: number) => {
      if (!track) return;
      track.classList.add("is-jumping");
      activeSight = i;
      updateSightSlider();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.classList.remove("is-jumping");
        });
      });
    };

    const normalizeSightSlider = () => {
      if (activeSight >= originalSightCount * 2) {
        jumpSightSlider(activeSight - originalSightCount);
      } else if (activeSight < originalSightCount) {
        jumpSightSlider(activeSight + originalSightCount);
      }
    };

    const selectSightCard = (card: HTMLElement) => {
      const idx = Number(card.dataset.sightIndex);
      if (Number.isFinite(idx)) {
        activeSight = idx;
        updateSightSlider();
      }
    };

    const moveSightSlider = (dir: number) => {
      activeSight += dir;
      updateSightSlider();
    };

    // Setup clones
    const originalCards = Array.from(track.querySelectorAll<HTMLElement>(".sight-card"));
    originalSightCount = originalCards.length;

    track.replaceChildren();
    for (let setIndex = 0; setIndex < 3; setIndex++) {
      originalCards.forEach((card, cardIndex) => {
        const clone = card.cloneNode(true) as HTMLElement;
        clone.dataset.sightIndex = String(setIndex * originalSightCount + cardIndex);
        clone.addEventListener("click", () => selectSightCard(clone));
        clone.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectSightCard(clone);
          }
        });
        track.appendChild(clone);
      });
    }

    sightCards = Array.from(track.querySelectorAll<HTMLElement>(".sight-card"));
    activeSight = originalSightCount;
    track.addEventListener("transitionend", normalizeSightSlider);
    updateSightSlider();

    // Controls
    const prevBtn = sightsControls?.querySelector(".sight-prev");
    const nextBtn = sightsControls?.querySelector(".sight-next");
    const dockPrev = sightsControls?.querySelector(".dock-prev");
    const dockNext = sightsControls?.querySelector(".dock-next");
    const onPrev = () => moveSightSlider(-1);
    const onNext = () => moveSightSlider(1);

    if (prevBtn) prevBtn.addEventListener("click", onPrev);
    if (nextBtn) nextBtn.addEventListener("click", onNext);
    if (dockPrev) dockPrev.addEventListener("click", onPrev);
    if (dockNext) dockNext.addEventListener("click", onNext);

    const onScroll = () => {
      if (isSectionInView()) {
        requestTick();
      }
    };
    const onResize = () => {
      if (isSectionInView()) {
        updateSightSlider();
        requestTick();
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isSectionInView()) return;
      targetMouseX = e.clientX / window.innerWidth - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
      requestTick();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    requestTick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      if (prevBtn) prevBtn.removeEventListener("click", onPrev);
      if (nextBtn) nextBtn.removeEventListener("click", onNext);
      if (dockPrev) dockPrev.removeEventListener("click", onPrev);
      if (dockNext) dockNext.removeEventListener("click", onNext);
      track.removeEventListener("transitionend", normalizeSightSlider);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#040d1a] text-white">
      {/* Floating Ultra-Premium Capsule Navbar */}
      <Navbar
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
      />

      {/* =========================================================================
          SECTION 1: THE AWARD-WINNING CINEMATIC PARALLAX SCROLL STAGE
      ========================================================================= */}
      <main className="site-shell">
        <section
          ref={sectionRef}
          className="cinema-scroll"
          id="cinema"
          aria-label="Travel with Bhai Brothers cinematic scroll story"
        >
          <div className="stage">
            <div className="world">
              {/* Sky background: Sajek sea of clouds sunrise */}
              <img
                className="scene-img sky-img"
                src="/images/hero_sajek_sky.jpg"
                alt="Sajek sunrise over endless sea of clouds"
                decoding="async"
              />

              <div className="back-stack">
                <img
                  className="scene-img back-img back-four"
                  src="https://raft-blast-61784561.figma.site/_assets/v11/8a7f8af50e0ce92ec2e228e7b0b4112178c51cf1.png"
                  alt=""
                  decoding="async"
                />
                <img
                  className="scene-img back-img back-bazaar"
                  src="/images/bandarban.jpg"
                  alt="Bandarban mountain ridges"
                  decoding="async"
                />
              </div>

              {/* Sights Slider: High-End TRIPLIO Style Gallery Cards (z 15) */}
              <section className="sights-slider" aria-label="Brotherhood expedition gallery exhibition">
                <div ref={trackRef} className="sights-track">
                  {/* Card 1: Sajek Valley */}
                  <article
                    className="sight-card"
                    tabIndex={0}
                    role="button"
                    aria-label="Open Sajek Valley card"
                    onClick={() => setSelectedExpedition(expeditions.find((e) => e.id === "sajek-2024") || expeditions[0])}
                  >
                    <img className="sight-card-bg" src="/images/sajek.jpg" alt="Sajek Valley" loading="lazy" decoding="async" />
                    <div className="sight-card-overlay" />
                    <div className="card-arrow-badge" aria-hidden="true">
                      <ArrowUpRight className="w-5 h-5 text-[#061526]" />
                    </div>
                    <div className="sight-card-content">
                      <h3 className="sight-card-title">সাজেক ভ্যালি (Sajek)</h3>
                      <p className="sight-card-meta">মেঘের রাজ্য • ৪ দিন ৩ রাত • ৩,১৮০ ft</p>
                    </div>
                  </article>

                  {/* Card 2: Keokradong Peak */}
                  <article
                    className="sight-card"
                    tabIndex={0}
                    role="button"
                    aria-label="Open Keokradong Peak card"
                    onClick={() => setSelectedExpedition(expeditions.find((e) => e.id === "bandarban-2023") || expeditions[1])}
                  >
                    <img className="sight-card-bg" src="/images/bandarban.jpg" alt="Keokradong Peak" loading="lazy" decoding="async" />
                    <div className="sight-card-overlay" />
                    <div className="card-arrow-badge" aria-hidden="true">
                      <ArrowUpRight className="w-5 h-5 text-[#061526]" />
                    </div>
                    <div className="sight-card-content">
                      <h3 className="sight-card-title">কেওক্রাডং সামিট (Bandarban)</h3>
                      <p className="sight-card-meta">সামিট ও বগা লেক ট্রেক • ৩,১৭২ ft</p>
                    </div>
                  </article>

                  {/* Card 3: Inani Beach Camp */}
                  <article
                    className="sight-card"
                    tabIndex={0}
                    role="button"
                    aria-label="Open Inani Beach Camp card"
                    onClick={() => setSelectedExpedition(expeditions.find((e) => e.id === "coxs-bazar-2024") || expeditions[2])}
                  >
                    <img className="sight-card-bg" src="/images/coxsbazar.jpg" alt="Inani Beach Camp" loading="lazy" decoding="async" />
                    <div className="sight-card-overlay" />
                    <div className="card-arrow-badge" aria-hidden="true">
                      <ArrowUpRight className="w-5 h-5 text-[#061526]" />
                    </div>
                    <div className="sight-card-content">
                      <h3 className="sight-card-title">ইনানী বিচ ক্যাম্প (Cox&apos;s Bazar)</h3>
                      <p className="sight-card-meta">কোস্টাল বোনফায়ার ও তারার মেলা • Sea Level</p>
                    </div>
                  </article>

                  {/* Card 4: Tanguar Haor */}
                  <article
                    className="sight-card"
                    tabIndex={0}
                    role="button"
                    aria-label="Open Tanguar Haor card"
                    onClick={() => setSelectedExpedition(expeditions.find((e) => e.id === "tanguar-2023") || expeditions[3])}
                  >
                    <img className="sight-card-bg" src="/images/tanguar.jpg" alt="Tanguar Haor" loading="lazy" decoding="async" />
                    <div className="sight-card-overlay" />
                    <div className="card-arrow-badge" aria-hidden="true">
                      <ArrowUpRight className="w-5 h-5 text-[#061526]" />
                    </div>
                    <div className="sight-card-content">
                      <h3 className="sight-card-title">টাঙ্গুয়ার হাওড় (Sunamganj)</h3>
                      <p className="sight-card-meta">বর্ষার হাউসবোট ক্রুজ ও ওয়াচ টাওয়ার</p>
                    </div>
                  </article>

                  {/* Card 5: Sreemangal Trail */}
                  <article
                    className="sight-card"
                    tabIndex={0}
                    role="button"
                    aria-label="Open Lawachara Trail card"
                    onClick={() => setSelectedExpedition(expeditions[0])}
                  >
                    <img className="sight-card-bg" src="/images/sreemangal.jpg" alt="Lawachara Trail" loading="lazy" decoding="async" />
                    <div className="sight-card-overlay" />
                    <div className="card-arrow-badge" aria-hidden="true">
                      <ArrowUpRight className="w-5 h-5 text-[#061526]" />
                    </div>
                    <div className="sight-card-content">
                      <h3 className="sight-card-title">লাউয়াছড়া ট্রেইল (Sreemangal)</h3>
                      <p className="sight-card-meta">বৃষ্টিঅরণ্য ও চা বাগানের ক্যানোপি ট্রেক</p>
                    </div>
                  </article>
                </div>
              </section>

              {/* Sights Controls: Side Chevrons & Centered Bottom Dock (TRIPLIO Style) */}
              <div ref={sightsControlsRef} className="sights-controls" aria-label="Slider navigation controls">
                <button className="sight-nav sight-prev" aria-label="Previous expedition">
                  <ChevronLeft className="w-7 h-7 text-white" />
                </button>
                <button className="sight-nav sight-next" aria-label="Next expedition">
                  <ChevronRight className="w-7 h-7 text-white" />
                </button>
                <div className="gallery-dock">
                  <div className="dock-glass-pill">
                    <span className="dock-kicker inline-flex items-center gap-1.5"><HugeiconsIcon icon={SparklesIcon} size={11} className="text-[#38bdf8]" /> BHAI BROTHERS</span>
                    <span className="dock-separator">•</span>
                    <span className="dock-counter">01 / 05</span>
                    <span className="dock-separator">•</span>
                    <span className="dock-active-title">সাজেক ভ্যালি</span>
                    <div className="dock-nav-btns">
                      <button
                        type="button"
                        className="dock-btn dock-prev"
                        aria-label="Previous expedition"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#061526]" />
                      </button>
                      <button
                        type="button"
                        className="dock-btn dock-next"
                        aria-label="Next expedition"
                      >
                        <ChevronRight className="w-4 h-4 text-[#061526]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bold Cinematic Hero Title */}
              <h1 className="hero-title">BROTHERS</h1>

              {/* Symmetrical Splitframe Cliff Layers */}
              <img
                className="scene-img splitframe-img splitframe-left"
                src="https://raft-blast-61784561.figma.site/_assets/v11/7536d7b60a1fce482cf6edf3f0bffd3bad5d0f8a.png"
                alt=""
              />
              <img
                className="scene-img splitframe-img splitframe-right"
                src="https://raft-blast-61784561.figma.site/_assets/v11/392db6a6a6b98e868bd7f8d3f55bb719d51e5028.png"
                alt=""
              />

              {/* Mountain Ridge Foreground Pass */}
              <img
                className="scene-img bridge-img"
                src="https://raft-blast-61784561.figma.site/_assets/v11/c6a6d8ef49bca43f708aa852692942c45ec950d4.png"
                alt=""
              />

              {/* Frame Two: Brotherhood Campfire Gathering Close-up */}
              <img
                className="scene-img frame-two-img"
                src="/images/hero_campfire.jpg"
                alt="Brotherhood campfire night"
              />

              <div className="shade"></div>
            </div>

            {/* Intro Copy */}
            <section className="intro-copy" aria-label="Brotherhood overview">
              <p>
                পাহাড়ের চূড়া, মাঝরাতের ক্যাম্পফায়ার আর দূরন্ত হাইওয়ে—আমাদের ভ্রাতৃত্ব কেবল কথায় নয়, প্রতিটি মাইলের পদচিহ্নে অমর।
              </p>
              <div className="hero-tags" aria-label="Expedition highlights">
                <span>১২+ সফল অভিযান</span>
                <span>সাজেক থেকে নীলাদ্রি</span>
                <span>লাইফটাইম মেমোরিজ</span>
              </div>
            </section>

            {/* Story Panel 1: Summit & Trail Brotherhood */}
            <section
              className="story-panel story-panel-bridge flex flex-col items-center justify-center text-center"
              id="expeditions-story"
              aria-label="Summit and mountain trail details"
            >
              <h2 className="text-center">পাথুরে ট্রেইল আমাদের ভ্রাতৃত্ব গড়ে তোলে।</h2>
              <p className="text-center mx-auto">
                কেওক্রাডংয়ের খাড়া ঢাল থেকে বগা লেকের নির্জন রাত—প্রতিটি কষ্ট আমাদের ভালোবাসাকে আরও মজবুত করেছে।
              </p>
              <dl className="facts mx-auto">
                <div className="text-center">
                  <dt>২০১৮</dt>
                  <dd>প্রথম ভাই ব্রাদার্স ট্যুর</dd>
                </div>
                <div className="text-center">
                  <dt>১০০%</dt>
                  <dd>আনকাট মেমোরি সংরক্ষিত</dd>
                </div>
              </dl>
            </section>

            {/* Story Panel 2: Campfire & Late-Night Jam */}
            <section
              className="story-panel story-panel-bazaar flex flex-col items-center justify-center text-center"
              id="campfire-story"
              aria-label="Campfire and brotherhood night stories"
            >
              <h2 className="text-center">ক্যাম্পফায়ার আমাদের এক সুতোয় বাঁধে।</h2>
              <p className="text-center mx-auto">
                মাঝরাতে গিটারের টুংটাং, ধোঁয়া ওঠা বারবিকিউ, মনখোলা হাসি আর খোলা আকাশের নিচে হাজারো স্মৃতির মেলবন্ধন।
              </p>
              <a href="#expeditions" className="note-button mx-auto" aria-label="ট্যুর ডায়েরিগুলো দেখুন">
                <span aria-hidden="true">↗</span>
                <span>আমাদের সব ট্যুর ডায়েরি দেখুন</span>
              </a>
            </section>
          </div>
        </section>
      </main>

      {/* =========================================================================
          SECTION 2: THE EXPEDITIONS CHRONICLES (Bento Grid Showcase)
          Slides UP over Section 1 (#cinema) as a dramatic curtain from the bottom
      ========================================================================= */}
      <div className="relative z-30 w-full -mt-[100vh] bg-[#040d1a] border-t border-white/15 shadow-[0_-30px_90px_rgba(0,0,0,0.95)]">
        <section id="expeditions" className="relative py-36 sm:py-44 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="section-reveal text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284c7]/15 border border-[#38bdf8]/30 text-[#bae6fd] text-xs font-bold tracking-widest uppercase mb-4">
              <Compass className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>THE BROTHERHOOD CHRONICLES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 font-['Outfit']">
              আমাদের স্মরণীয় <span className="text-[#38bdf8]">ট্যুর ডায়েরি</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-['Hind_Siliguri']">
              প্রতিটি ট্যুরের পেছনে রয়েছে আমাদের রক্ত-ঘাম, রাতজাগা হাসি আর অটুট ভ্রাতৃত্বের এক একটি অনন্য অধ্যায়।
            </p>
          </div>

          {/* Bento Grid Layout - Featured Expeditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Bento Item 1: Hero Large Card (Col Span 2, Row Span 2) */}
            {initialExpeditions[0] && (
              <Link
                key={initialExpeditions[0].id}
                href={`/expeditions/${initialExpeditions[0].id}`}
                className="bento-item group relative lg:col-span-2 lg:row-span-2 min-h-[500px] lg:min-h-[630px] rounded-[32px] sm:rounded-[36px] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_65px_rgba(0,0,0,0.7)] cursor-pointer flex flex-col justify-between p-8 sm:p-10 block"
              >
              <Image
                src={initialExpeditions[0].coverImage}
                alt={initialExpeditions[0].bengaliTitle}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020a14] via-[#020a14]/40 via-60% to-transparent pointer-events-none z-[1]" />

              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-white/95 bg-black/50 backdrop-blur-md border border-white/20 shadow-sm">
                  {initialExpeditions[0].typeLabel} • ফ্ল্যাগশিপ মিশন
                </span>
                <div className="w-11 h-11 rounded-full bg-white/95 text-[#061526] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-[#38bdf8] group-hover:text-[#061526]">
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-white mb-2 group-hover:text-[#38bdf8] transition-colors font-['Outfit'] tracking-tight leading-tight">
                  {initialExpeditions[0].bengaliTitle}
                </h3>
                <p className="text-base sm:text-lg text-slate-300 font-['Hind_Siliguri']">
                  {initialExpeditions[0].location} • {initialExpeditions[0].date}
                </p>
              </div>
            </Link>
          )}

            {/* Bento Item 2: Medium Top Right */}
            {initialExpeditions[1] && (
              <Link
                key={initialExpeditions[1].id}
                href={`/expeditions/${initialExpeditions[1].id}`}
                className="bento-item group relative lg:col-span-1 min-h-[300px] rounded-[32px] sm:rounded-[36px] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col justify-between p-6 sm:p-7 block"
              >
              <Image
                src={initialExpeditions[1].coverImage}
                alt={initialExpeditions[1].bengaliTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020a14] via-[#020a14]/40 via-60% to-transparent pointer-events-none z-[1]" />

              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="px-3 py-1 rounded-full text-xs font-medium text-white/95 bg-black/40 backdrop-blur-md border border-white/15">
                  {initialExpeditions[1].typeLabel}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/90 text-[#061526] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-[#38bdf8]">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-[#38bdf8] transition-colors font-['Outfit'] tracking-tight">
                  {initialExpeditions[1].bengaliTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-['Hind_Siliguri']">
                  {initialExpeditions[1].location} • {initialExpeditions[1].date}
                </p>
              </div>
            </Link>
          )}

            {/* Bento Item 3: Medium Middle Right */}
            {initialExpeditions[2] && (
              <Link
                key={initialExpeditions[2].id}
                href={`/expeditions/${initialExpeditions[2].id}`}
                className="bento-item group relative lg:col-span-1 min-h-[300px] rounded-[32px] sm:rounded-[36px] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col justify-between p-6 sm:p-7 block"
              >
              <Image
                src={initialExpeditions[2].coverImage}
                alt={initialExpeditions[2].bengaliTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020a14] via-[#020a14]/40 via-60% to-transparent pointer-events-none z-[1]" />

              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="px-3 py-1 rounded-full text-xs font-medium text-white/95 bg-black/40 backdrop-blur-md border border-white/15">
                  {initialExpeditions[2].typeLabel}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/90 text-[#061526] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-[#38bdf8]">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-[#38bdf8] transition-colors font-['Outfit'] tracking-tight">
                  {initialExpeditions[2].bengaliTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-['Hind_Siliguri']">
                  {initialExpeditions[2].location} • {initialExpeditions[2].date}
                </p>
              </div>
            </Link>
          )}

            {/* Bento Item 4: Lower Left (Col Span 1) */}
            {initialExpeditions[3] && (
              <Link
                key={initialExpeditions[3].id}
                href={`/expeditions/${initialExpeditions[3].id}`}
                className="bento-item group relative lg:col-span-1 min-h-[320px] rounded-[32px] sm:rounded-[36px] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col justify-between p-6 sm:p-7 block"
              >
              <Image
                src={initialExpeditions[3].coverImage}
                alt={initialExpeditions[3].bengaliTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020a14] via-[#020a14]/40 via-60% to-transparent pointer-events-none z-[1]" />

              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="px-3 py-1 rounded-full text-xs font-medium text-white/95 bg-black/40 backdrop-blur-md border border-white/15">
                  {initialExpeditions[3].typeLabel}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/90 text-[#061526] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-[#38bdf8]">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-[#38bdf8] transition-colors font-['Outfit'] tracking-tight">
                  {initialExpeditions[3].bengaliTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-['Hind_Siliguri']">
                  {initialExpeditions[3].location} • {initialExpeditions[3].date}
                </p>
              </div>
            </Link>
          )}

            {/* Bento Item 5: Lower Right (Col Span 2) */}
            {initialExpeditions[4] && (
              <Link
                key={initialExpeditions[4].id}
                href={`/expeditions/${initialExpeditions[4].id}`}
                className="bento-item group relative lg:col-span-2 min-h-[320px] rounded-[32px] sm:rounded-[36px] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col justify-between p-7 sm:p-8 block"
              >
                <Image
                  src={initialExpeditions[4].coverImage}
                  alt={initialExpeditions[4].bengaliTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020a14] via-[#020a14]/40 via-60% to-transparent pointer-events-none z-[1]" />

                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/95 bg-black/40 backdrop-blur-md border border-white/15">
                    {initialExpeditions[4].typeLabel}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/95 text-[#061526] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-[#38bdf8]">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-[#38bdf8] transition-colors font-['Outfit'] tracking-tight">
                    {initialExpeditions[4].bengaliTitle}
                  </h3>
                  <p className="text-sm text-slate-300 font-['Hind_Siliguri']">
                    {initialExpeditions[4].location} • {initialExpeditions[4].date}
                  </p>
                </div>
              </Link>
            )}
          </div>

          {/* View All Expeditions Button Leading to Dedicated /expeditions Page */}
          <div className="mt-16 sm:mt-20 text-center">
            <Link
              href="/expeditions"
              className="group inline-flex items-center gap-3 px-9 py-4 rounded-full bg-white/[0.05] hover:bg-[#38bdf8] border border-white/15 hover:border-transparent text-white hover:text-[#040d1a] font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-[0_0_35px_rgba(56,189,248,0.4)]"
            >
              <span>সবগুলো ট্যুর দেখুন (১২+ স্মরণীয় অভিযান)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>

      {/* =========================================================================
          SECTION 3: THE BHAI BROTHERS CONSTELLATION & ORBITAL MATRIX
      ========================================================================= */}
      <SquadConstellation onSelectBrother={setSelectedBrother} />

      {/* =========================================================================
          SECTION: TRAVEL GADGETS & GEAR INVENTORY (OVERLAY CURTAIN SCROLL OVER SQUAD)
      ========================================================================= */}
      <div className="relative z-30 w-full -mt-[100vh]">
        <GadgetsSection />
      </div>

      {/* =========================================================================
          SECTION 4: THE GSAP SCROLL-DRIVEN PARALLAX MEMORY VAULT
      ========================================================================= */}
      <VaultParallaxReel />

      {/* =========================================================================
          SECTION 5: UPCOMING EXPEDITIONS & BUCKET LIST
      ========================================================================= */}
      <section id="bucketlist" className="relative py-36 sm:py-44 bg-[#040d1a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="section-reveal flex flex-col md:flex-row md:items-end justify-between mb-20 sm:mb-24 gap-8">
            <div>
              <div className="bucket-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284c7]/15 border border-[#38bdf8]/30 text-[#bae6fd] text-xs font-bold tracking-widest uppercase mb-4">
                <Heart className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>NEXT EXPEDITION BLUEPRINT</span>
              </div>
              <h2 className="bucket-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-['Outfit']">
                পরবর্তী মিশন ও <span className="bucket-accent text-[#38bdf8]">বাকেট লিস্ট</span>
              </h2>
              <p className="bucket-subtitle text-gray-300 text-sm sm:text-base mt-2 font-['Hind_Siliguri']">
                পরবর্তী সফর কোথায় হবে? ব্রাদারহুড ভোটে অংশ নিন এবং আমাদের পরবর্তী রোমাঞ্চকর গন্তব্য বেছে নিন।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {bucketList.map((item) => (
              <div
                key={item.id}
                className="bucket-card relative bg-[#07192f]/60 backdrop-blur-sm border border-white/10 hover:border-[#38bdf8]/50 rounded-[32px] sm:rounded-[36px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_55px_rgba(0,0,0,0.65)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bucket-tag px-3.5 py-1 rounded-full text-xs font-semibold bg-[#0284c7]/15 border border-[#38bdf8]/30 text-[#bae6fd]">
                      {item.tag}
                    </span>
                    <span className="bucket-season text-xs text-gray-400 font-mono">{item.targetSeason}</span>
                  </div>
                  <h3 className="bucket-card-title text-xl font-bold text-white mb-2 font-['Outfit']">{item.title}</h3>
                  <p className="bucket-location text-xs text-gray-400 flex items-center gap-1.5 mb-6">
                    <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>{item.location}</span>
                  </p>
                </div>

                <div className="bucket-card-footer pt-5 border-t border-white/10 flex items-center justify-between">
                  <div className="bucket-votes-wrap text-xs text-gray-300">
                    <span className="bucket-votes-num font-mono text-lg font-bold text-white mr-1.5">{item.votes}</span>
                    <span className="bucket-votes-label">সদস্যের ভোট</span>
                  </div>
                  <button
                    onClick={() => handleVote(item.id)}
                    className={`bucket-vote-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      item.voted
                        ? "bucket-voted bg-[#0284c7] text-white shadow-[0_0_16px_rgba(2,132,199,0.5)]"
                        : "bg-white/5 hover:bg-white/15 text-white border border-white/10"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.voted ? "fill-white" : ""}`} />
                    <span>{item.voted ? "ভোট দেওয়া হয়েছে" : "ভোট দিন"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: BROTHERHOOD MANIFESTO & GRAND FOOTER
      ========================================================================= */}
      <footer id="footer" className="relative py-36 sm:py-44 bg-[#040d1a] border-t border-white/8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 font-['Outfit'] tracking-tight">
              “যেখানে রাস্তা শেষ হয়, সেখান থেকেই আমাদের বন্ধুত্ব শুরু।”
            </h2>
            <p className="text-gray-400 text-sm sm:text-base font-['Hind_Siliguri'] leading-relaxed">
              স্থান হয়তো বদলে যায়, পাহাড় হয়তো পেছনের কুয়াশায় হারিয়ে যায়—কিন্তু ভাই ব্রাদারদের সাথে কাটানো প্রতিটি মুহূর্ত চিরদিনের জন্য সংরক্ষিত থাকে এই মেমোরি ভল্টে।
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto py-10 px-8 sm:px-12 rounded-[32px] sm:rounded-[36px] bg-white/[0.02] border border-white/5 mb-16">
            <div>
              <div className="text-3xl sm:text-5xl font-black text-[#38bdf8] font-['Outfit']">১২+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-2 font-['Hind_Siliguri']">সম্পূর্ণ অভিযান</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black text-sky-400 font-['Outfit']">৬৪,০০০+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-2 font-['Hind_Siliguri']">কিলোমিটার রোড জার্নি</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black text-blue-300 font-['Outfit']">৪,৫০০+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-2 font-['Hind_Siliguri']">সংরক্ষিত ছবি</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black text-cyan-300 font-['Outfit']">১</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-2 font-['Hind_Siliguri']">অটুট ভ্রাতৃত্ব</div>
            </div>
          </div>

          <p className="text-xs text-gray-500 font-mono">
            © {new Date().getFullYear()} Travel with Bhai Brothers • The Brotherhood Adventure Chronicles. All Memories Preserved.
          </p>
        </div>
      </footer>

      {/* =========================================================================
          MODALS & LIGHTBOXES
      ========================================================================= */}
      {/* 1. Trip Detail Modal */}
      <TripDetailModal
        expedition={selectedExpedition}
        onClose={() => setSelectedExpedition(null)}
      />



      {/* 3. Brother Profile Modal */}
      <BrotherProfileModal
        brother={selectedBrother}
        onClose={() => setSelectedBrother(null)}
      />
    </div>
  );
}
