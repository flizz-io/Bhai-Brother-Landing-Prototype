"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { initialSquad, SquadMember } from "@/data/toursData";
import { Users } from "lucide-react";
import { BrotherBadgeIcon } from "@/components/HugeIcon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SquadConstellationProps {
  onSelectBrother: (brother: SquadMember) => void;
}

// 13 Brotherhood Orbital Node Positions (1 Center + 4 Inner + 8 Outer)
const BROTHER_NODES = [
  // ==========================================
  // 1. CENTER COMMANDER (ক্যাপ্টেন রাকিব)
  // ==========================================
  {
    index: 0,
    brotherId: "rakib",
    tier: "center",
    name: "রাকিব হাসান",
    nickname: "ক্যাপ্টেন রাকিব",
    role: "The Master Navigator",
    badge: "ক্যাপ্টেন",
    color: "from-emerald-400 via-teal-400 to-cyan-500",
    borderGlow: "border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.7)]",
    left: "50%",
    top: "50%",
    exitX: 0,
    exitY: 0,
    sizeClass: "w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22",
    tooltipPlacement: "top-right",
  },

  // ==========================================
  // 2. INNER ORBIT DIAMOND (4 CORE BROTHERS)
  // ==========================================
  {
    index: 1,
    brotherId: "tanvir",
    tier: "inner",
    name: "তানভীর আহমেদ",
    nickname: "শেফ তানভীর",
    role: "The Master Chef & BBQ",
    badge: "ট্যুর শেফ",
    color: "from-amber-400 to-orange-500",
    borderGlow: "border-amber-400 shadow-[0_0_22px_rgba(251,191,36,0.6)]",
    left: "50%",
    top: "28%",
    exitX: 0,
    exitY: -100,
    sizeClass: "w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18",
    tooltipPlacement: "bottom",
  },
  {
    index: 2,
    brotherId: "shakil",
    tier: "inner",
    name: "শাকিল চৌধুরী",
    nickname: "সিনেমা শাকিল",
    role: "The Lens Master & Drone",
    badge: "ফটোগ্রাফার",
    color: "from-sky-400 to-blue-500",
    borderGlow: "border-sky-400 shadow-[0_0_22px_rgba(56,189,248,0.6)]",
    left: "72%",
    top: "50%",
    exitX: 100,
    exitY: 0,
    sizeClass: "w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18",
    tooltipPlacement: "left",
  },
  {
    index: 3,
    brotherId: "fahim",
    tier: "inner",
    name: "ফাহিম জামান",
    nickname: "রকস্টার ফাহিম",
    role: "The DJ & Campfire Guitarist",
    badge: "ভাইব মাস্টার",
    color: "from-pink-400 to-rose-500",
    borderGlow: "border-pink-400 shadow-[0_0_22px_rgba(244,114,182,0.6)]",
    left: "50%",
    top: "72%",
    exitX: 0,
    exitY: 100,
    sizeClass: "w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18",
    tooltipPlacement: "top",
  },
  {
    index: 4,
    brotherId: "mahim",
    tier: "inner",
    name: "মাহিম রেজা",
    nickname: "ব্যাংকার মাহিম",
    role: "The Cashier & Budget",
    badge: "হিসাবরক্ষক",
    color: "from-emerald-300 to-green-500",
    borderGlow: "border-green-400 shadow-[0_0_22px_rgba(74,222,128,0.6)]",
    left: "28%",
    top: "50%",
    exitX: -100,
    exitY: 0,
    sizeClass: "w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18",
    tooltipPlacement: "right",
  },

  // ==========================================
  // 3. OUTER ORBIT PERIMETER (8 EXPLORER BROTHERS)
  // ==========================================
  {
    index: 5,
    brotherId: "asif",
    tier: "outer",
    name: "আসিফ ইকবাল",
    nickname: "চিল মাস্টার আসিফ",
    role: "The Sleep Champion",
    badge: "ঘুমের রাজা",
    color: "from-purple-400 to-indigo-500",
    borderGlow: "border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.5)]",
    left: "50%",
    top: "8%",
    exitX: 0,
    exitY: -160,
    sizeClass: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    tooltipPlacement: "bottom",
  },
  {
    index: 6,
    brotherId: "nabil",
    tier: "outer",
    name: "নাবিল মোর্শেদ",
    nickname: "গিয়ার হেড নাবিল",
    role: "The Tech & Gear Engineer",
    badge: "গিয়ার মাস্টার",
    color: "from-blue-400 to-cyan-500",
    borderGlow: "border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]",
    left: "79.7%",
    top: "20.3%",
    exitX: 130,
    exitY: -130,
    sizeClass: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    tooltipPlacement: "left",
  },
  {
    index: 7,
    brotherId: "riyad",
    tier: "outer",
    name: "রিয়াদুল হাসান",
    nickname: "ফার্স্ট এইড রিয়াদ",
    role: "The Medic & Safety",
    badge: "মেডিক ভাই",
    color: "from-red-400 to-rose-500",
    borderGlow: "border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.5)]",
    left: "92%",
    top: "50%",
    exitX: 160,
    exitY: 0,
    sizeClass: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    tooltipPlacement: "left",
  },
  {
    index: 8,
    brotherId: "imtiaz",
    tier: "outer",
    name: "ইমতিয়াজ আহমেদ",
    nickname: "হাইওয়ে কিং ইমতিয়াজ",
    role: "The Night Pilot",
    badge: "ড্রাইভ মাস্টার",
    color: "from-orange-400 to-amber-500",
    borderGlow: "border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.5)]",
    left: "79.7%",
    top: "79.7%",
    exitX: 130,
    exitY: 130,
    sizeClass: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    tooltipPlacement: "left",
  },
  {
    index: 9,
    brotherId: "sourav",
    tier: "outer",
    name: "সৌরভ ভৌমিক",
    nickname: "কমিডিয়ান সৌরভ",
    role: "The Comic Relief",
    badge: "হাসির রাজা",
    color: "from-yellow-400 to-amber-500",
    borderGlow: "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]",
    left: "50%",
    top: "92%",
    exitX: 0,
    exitY: 160,
    sizeClass: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    tooltipPlacement: "top",
  },
  {
    index: 10,
    brotherId: "ariyan",
    tier: "outer",
    name: "আরিয়ান খান",
    nickname: "স্টোরি টেলার আরিয়ান",
    role: "The Campfire Chronicler",
    badge: "গল্পকার",
    color: "from-indigo-400 to-violet-500",
    borderGlow: "border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.5)]",
    left: "20.3%",
    top: "79.7%",
    exitX: -130,
    exitY: 130,
    sizeClass: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    tooltipPlacement: "right",
  },
  {
    index: 11,
    brotherId: "zubair",
    tier: "outer",
    name: "জুবায়ের মাহমুদ",
    nickname: "চা খোর জুবায়ের",
    role: "The Tea Sommelier",
    badge: "চা এক্সপার্ট",
    color: "from-amber-500 to-yellow-600",
    borderGlow: "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]",
    left: "8%",
    top: "50%",
    exitX: -160,
    exitY: 0,
    sizeClass: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    tooltipPlacement: "right",
  },
  {
    index: 12,
    brotherId: "ahnaf",
    tier: "outer",
    name: "আহনাফ হাবিব",
    nickname: "ডেয়ারডেভিল আহনাফ",
    role: "The Cliff Jumper",
    badge: "অ্যাডভেঞ্চারার",
    color: "from-teal-400 to-emerald-500",
    borderGlow: "border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.5)]",
    left: "20.3%",
    top: "20.3%",
    exitX: -130,
    exitY: -130,
    sizeClass: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    tooltipPlacement: "right",
  },
];

// Constellation Satellite Cosmic Particles (Positioned precisely on orbital tracks)
const SATELLITE_PARTICLES = [
  // 8 particles on outer circle r=252 at 22.5° intervals:
  { cx: "88.8%", cy: "33.9%", r: 5, color: "#ec4899" },
  { cx: "66.1%", cy: "11.2%", r: 5, color: "#f59e0b" },
  { cx: "33.9%", cy: "11.2%", r: 5, color: "#fb7185" },
  { cx: "11.2%", cy: "33.9%", r: 5, color: "#c084fc" },
  { cx: "11.2%", cy: "66.1%", r: 5, color: "#38bdf8" },
  { cx: "33.9%", cy: "88.8%", r: 5, color: "#f97316" },
  { cx: "66.1%", cy: "88.8%", r: 5, color: "#10b981" },
  { cx: "88.8%", cy: "66.1%", r: 5, color: "#a855f7" },
  // 4 particles on inner circle r=132 at 45° intervals:
  { cx: "65.6%", cy: "34.4%", r: 4, color: "#facc15" },
  { cx: "34.4%", cy: "34.4%", r: 4, color: "#38bdf8" },
  { cx: "34.4%", cy: "65.6%", r: 4, color: "#34d399" },
  { cx: "65.6%", cy: "65.6%", r: 4, color: "#a855f7" },
];

export default function SquadConstellation({ onSelectBrother }: SquadConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const constellationRef = useRef<HTMLDivElement>(null);
  const statusLabelRef = useRef<HTMLSpanElement>(null);
  const [activeBrotherId, setActiveBrotherId] = useState<string | null>(null);

  const squadMap = React.useMemo(() => {
    const map = new Map<string, SquadMember>();
    initialSquad.forEach((b) => map.set(b.id, b));
    return map;
  }, []);

  // GSAP ScrollTrigger Sequence for 13 Brothers:
  // Phase 1 (0 -> 0.65): 13 brothers arrive one by one as user scrolls
  // Phase 2 (0.65 -> 1.00): Full 13-node assembled constellation window, active & glowing
  // Over Phase: Pinned at top while the next section (Gadgets) slides up over it
  useGSAP(
    () => {
      const container = containerRef.current;
      const constellation = constellationRef.current;
      if (!container || !constellation) return;

      const nodeWrappers = gsap.utils.toArray<HTMLElement>(".brother-node-wrapper");
      const lines = gsap.utils.toArray<SVGElement>(".constellation-line");
      const particles = gsap.utils.toArray<SVGElement>(".constellation-particle");
      const orbits = constellation.querySelector(".orbital-group");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=2600",
          pin: false,
          scrub: 1.1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!statusLabelRef.current) return;
            const p = self.progress;
            if (p < 0.65) {
              const count = Math.min(13, Math.floor(p * 20));
              statusLabelRef.current.textContent = `[ ভাইদের আগমন চলছে... ${count} / ১৩ ]`;
            } else {
              statusLabelRef.current.textContent = "১৩ জন ভাই সম্পূর্ণ সংযুক্ত • প্রোফাইল দেখতে যেকোনো অবতারে ক্লিক করুন";
            }
          },
        },
      });

      // Initial state: hidden with exact center alignment (xPercent: -50, yPercent: -50)
      gsap.set(nodeWrappers, { scale: 0, opacity: 0, xPercent: -50, yPercent: -50 });
      gsap.set(lines, { opacity: 0, strokeDashoffset: 400 });
      gsap.set(particles, { scale: 0, opacity: 0 });
      if (orbits) gsap.set(orbits, { scale: 0.8, opacity: 0 });

      // Step 1: Orbits & particles fade in (perfect zero-rotation lock)
      tl.to(
        orbits,
        {
          scale: 1,
          opacity: 0.85,
          duration: 0.08,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        particles,
        {
          scale: 1,
          opacity: 1,
          stagger: 0.015,
          duration: 0.06,
          ease: "power1.out",
        },
        0.03
      );

      // Step 2: 13 Brothers arrive ONE BY ONE with scroll
      // Index 0: Center Commander (0.06)
      // Index 1-4: Inner Orbit Diamond (0.10, 0.15, 0.20, 0.25)
      // Index 5-12: Outer Orbit Perimeter (0.30 -> 0.62)
      nodeWrappers.forEach((node, i) => {
        const arrivalTime = 0.06 + i * 0.045;

        tl.to(
          node,
          {
            scale: 1,
            opacity: 1,
            xPercent: -50,
            yPercent: -50,
            duration: 0.06,
            ease: "back.out(2)",
          },
          arrivalTime
        );
      });

      // Constellation lines draw in seamlessly matching the brother nodes arrival
      tl.to(
        lines,
        {
          opacity: 0.75,
          strokeDashoffset: 0,
          stagger: 0.02,
          duration: 0.08,
          ease: "power2.out",
        },
        0.08
      );

      // Step 3: Fully Assembled Constellation Window (0.65 -> 1.0)
      // The 13 brothers remain fully assembled with 100% locked alignment (zero rotation skew)

      // Subtle depth effect as next section scrolls over
      const tlOver = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "+=2600 top",
          end: "+=1000",
          scrub: true,
        },
      });

      tlOver.to(constellation, {
        scale: 0.94,
        opacity: 0.55,
        ease: "none",
      });
      tlOver.to(
        ".constellation-header",
        {
          y: -25,
          opacity: 0.55,
          ease: "none",
        },
        0
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      id="squad"
      ref={containerRef}
      className="relative w-full"
      style={{ height: "calc(100vh + 2600px + 100vh)" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen bg-[#030914] text-white overflow-hidden flex flex-col justify-between select-none z-10"
      >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#0284c7]/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#8b5cf6]/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,18,36,0.35),rgba(3,9,20,0.95))] pointer-events-none -z-10" />

      {/* =========================================================================
          TOP HEADER AREA
      ========================================================================= */}
      <div className="constellation-header pt-20 sm:pt-22 px-6 sm:px-12 z-20 w-full max-w-5xl mx-auto text-center will-change-transform">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284c7]/15 border border-[#38bdf8]/30 text-[#bae6fd] text-xs font-bold tracking-widest uppercase mb-2.5">
          <Users className="w-3.5 h-3.5 text-[#38bdf8] animate-pulse" />
          <span>THE BROTHERHOOD 13-NODE CONSTELLATION • GSAP ORBIT</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Outfit']">
          আমাদের <span className="text-[#38bdf8]">১৩ ভাই-ব্রাদার্স অরবিট</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 font-['Hind_Siliguri'] max-w-xl mx-auto">
          স্ক্রল করার সাথে সাথে ভাইদের ১৩ জনের অরবিটাল কন্সটেলেশন উন্মোচিত হবে। যেকোনো ভাইয়ের উপর হোভার করুন ও ক্লিক করে পূর্ণাঙ্গ ডসিয়ার জানুন।
        </p>
      </div>

      {/* =========================================================================
          CENTER CONSTELLATION STAGE (EXACT 13-NODE ORBITAL GEOMETRY)
      ========================================================================= */}
      <div className="relative flex-1 w-full max-w-4xl lg:max-w-5xl max-h-[600px] sm:max-h-[670px] mx-auto flex items-center justify-center px-4 z-10">
        <div
          ref={constellationRef}
          className="relative w-full aspect-square max-w-[560px] sm:max-w-[640px] max-h-[560px] sm:max-h-[640px] flex items-center justify-center"
        >
          {/* SVG Orbital Paths & Constellation Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
            viewBox="0 0 600 600"
          >
            <defs>
              <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#fb923c" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#facc15" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Orbital Ellipses Group - Mathematically locked to avatar centers */}
            <g className="orbital-group will-change-transform" style={{ transformOrigin: "300px 300px" }}>
              {/* Outer Intersecting Dashed Ellipse 1 (Horizontal: Passes through Zubair, Riyad, Tanvir, Fahim) */}
              <ellipse
                cx="300"
                cy="300"
                rx="252"
                ry="132"
                fill="none"
                stroke="url(#orbitGrad1)"
                strokeWidth="1.5"
                strokeDasharray="5 7"
                className="opacity-75"
              />

              {/* Intersecting Dashed Ellipse 2 (Rotated 45 deg: Passes through Ahnaf, Imtiaz) */}
              <ellipse
                cx="300"
                cy="300"
                rx="252"
                ry="132"
                transform="rotate(45 300 300)"
                fill="none"
                stroke="url(#orbitGrad2)"
                strokeWidth="1.5"
                strokeDasharray="5 7"
                className="opacity-75"
              />

              {/* Intersecting Dashed Ellipse 3 (Rotated -45 deg: Passes through Nabil, Ariyan) */}
              <ellipse
                cx="300"
                cy="300"
                rx="252"
                ry="132"
                transform="rotate(-45 300 300)"
                fill="none"
                stroke="url(#orbitGrad1)"
                strokeWidth="1.5"
                strokeDasharray="5 7"
                className="opacity-75"
              />

              {/* Inner Diamond/Circle Orbit (Passes through all 4 inner brothers) */}
              <circle
                cx="300"
                cy="300"
                r="132"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.3"
                strokeDasharray="4 6"
                className="opacity-55"
              />

              {/* Outer Boundary Circle (Passes through all 8 outer brothers) */}
              <circle
                cx="300"
                cy="300"
                r="252"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.2"
                strokeDasharray="6 8"
                className="opacity-45"
              />
            </g>

            {/* Connecting Constellation Lines (Fully Symmetric 20-Spoke Network) */}
            <g className="constellation-spokes">
              {/* 1. Center (Rakib 300,300) to 4 Inner Core Nodes */}
              <line x1="300" y1="300" x2="300" y2="168" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="300" y1="300" x2="432" y2="300" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="300" y1="300" x2="300" y2="432" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="300" y1="300" x2="168" y2="300" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 6" className="constellation-line will-change-transform" />

              {/* 2. Inner Diamond Ring (Tanvir <-> Shakil <-> Fahim <-> Mahim <-> Tanvir) */}
              <line x1="300" y1="168" x2="432" y2="300" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="432" y1="300" x2="300" y2="432" stroke="#f472b6" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="300" y1="432" x2="168" y2="300" stroke="#fb923c" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="168" y1="300" x2="300" y2="168" stroke="#34d399" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />

              {/* 3. Cardinal Radial Lines (Inner Nodes to Outer Cardinal Brothers) */}
              <line x1="300" y1="168" x2="300" y2="48" stroke="#a855f7" strokeWidth="1.3" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="432" y1="300" x2="552" y2="300" stroke="#f472b6" strokeWidth="1.3" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="300" y1="432" x2="300" y2="552" stroke="#facc15" strokeWidth="1.3" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="168" y1="300" x2="48" y2="300" stroke="#34d399" strokeWidth="1.3" strokeDasharray="4 6" className="constellation-line will-change-transform" />

              {/* 4. Symmetric Diagonal Triangulation Lines (Inner Nodes to Corner Outer Brothers - Both Sides) */}
              {/* Tanvir (300,168) to Nabil & Ahnaf */}
              <line x1="300" y1="168" x2="478.2" y2="121.8" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="300" y1="168" x2="121.8" y2="121.8" stroke="#34d399" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              {/* Shakil (432,300) to Nabil & Imtiaz */}
              <line x1="432" y1="300" x2="478.2" y2="121.8" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="432" y1="300" x2="478.2" y2="478.2" stroke="#fb923c" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              {/* Fahim (300,432) to Imtiaz & Ariyan */}
              <line x1="300" y1="432" x2="478.2" y2="478.2" stroke="#fb923c" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="300" y1="432" x2="121.8" y2="478.2" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              {/* Mahim (168,300) to Ariyan & Ahnaf */}
              <line x1="168" y1="300" x2="121.8" y2="478.2" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
              <line x1="168" y1="300" x2="121.8" y2="121.8" stroke="#34d399" strokeWidth="1.2" strokeDasharray="4 6" className="constellation-line will-change-transform" />
            </g>

            {/* Orbiting Satellite Dots (Positioned precisely on orbital tracks) */}
            <g className="satellite-particles">
              {SATELLITE_PARTICLES.map((particle, idx) => (
                <circle
                  key={idx}
                  cx={particle.cx}
                  cy={particle.cy}
                  r={particle.r}
                  fill={particle.color}
                  className="constellation-particle shadow-sm will-change-transform"
                  style={{
                    filter: `drop-shadow(0 0 6px ${particle.color})`,
                  }}
                />
              ))}
            </g>
          </svg>

          {/* =====================================================================
              THE 13 BROTHER AVATAR NODES (Circular, Hover Glow, Click Modal)
          ===================================================================== */}
          {BROTHER_NODES.map((node) => {
            const brother = squadMap.get(node.brotherId);
            if (!brother) return null;

            const isAnyHovered = activeBrotherId !== null;
            const isHovered = activeBrotherId === brother.id;

            return (
              <div
                key={brother.id}
                className={`brother-node-wrapper absolute will-change-transform transition-opacity duration-300 ${
                  isHovered
                    ? "z-30 opacity-100"
                    : isAnyHovered
                    ? "z-20 opacity-40"
                    : "z-20 opacity-100"
                }`}
                style={{
                  left: node.left,
                  top: node.top,
                }}
              >
                {/* Node Interactive Container */}
                <div
                  className="brother-node-inner relative group cursor-pointer transition-transform duration-300 hover:scale-115"
                  onMouseEnter={() => setActiveBrotherId(brother.id)}
                  onMouseLeave={() => setActiveBrotherId(null)}
                  onClick={() => onSelectBrother(brother)}
                >
                  {/* Outer Pulsing Glow Ring */}
                  <div
                    className={`relative ${node.sizeClass} rounded-full p-0.5 sm:p-1 bg-gradient-to-tr ${node.color} ${node.borderGlow} transition-all duration-300 group-hover:scale-105`}
                  >
                    {/* Inner Circular Image Crop */}
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#040d1a] border border-white/20 group-hover:border-white/90 transition-colors">
                      <Image
                        src={brother.image}
                        alt={brother.name}
                        fill
                        sizes="(max-width: 768px) 60px, 80px"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        priority={node.tier === "center" || node.tier === "inner"}
                      />
                    </div>

                    {/* Hugeicon Badge on Avatar Rim */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/90 border border-white/20 flex items-center justify-center shadow-md">
                      <BrotherBadgeIcon brotherId={brother.id} size={12} className="text-[#38bdf8]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* =====================================================================
              FLOATING DOSSIER CARD (Rendered AFTER all 13 nodes at z-99999)
              Guarantees the card is 100% on top of all images and never behind!
          ===================================================================== */}
          {(() => {
            const activeNode = BROTHER_NODES.find((n) => n.brotherId === activeBrotherId);
            const activeBrother = activeBrotherId ? squadMap.get(activeBrotherId) : null;
            if (!activeNode || !activeBrother) return null;

            return (
              <div
                className="pointer-events-auto absolute z-[99999] transition-all duration-300"
                style={{
                  left: activeNode.left,
                  top: activeNode.top,
                  transform:
                    activeNode.tooltipPlacement === "top-right"
                      ? "translate(42px, -60%)"
                      : activeNode.tooltipPlacement === "top"
                      ? "translate(-50%, calc(-100% - 24px))"
                      : activeNode.tooltipPlacement === "bottom"
                      ? "translate(-50%, 24px)"
                      : activeNode.tooltipPlacement === "left"
                      ? "translate(calc(-100% - 24px), -50%)"
                      : "translate(24px, -50%)",
                }}
                onMouseEnter={() => setActiveBrotherId(activeBrother.id)}
                onMouseLeave={() => setActiveBrotherId(null)}
              >
                <div
                  onClick={() => onSelectBrother(activeBrother)}
                  className="cursor-pointer bg-[#050f1e] border border-[#38bdf8]/60 rounded-2xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.98)] min-w-[210px] max-w-[245px] text-left ring-1 ring-white/15 hover:border-[#38bdf8] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm sm:text-base font-bold text-white font-['Outfit']">
                      {activeBrother.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0284c7]/20 border border-[#38bdf8]/40 text-[#bae6fd]">
                      {activeBrother.badge}
                    </span>
                  </div>

                  <p className="text-xs text-[#38bdf8] font-['Hind_Siliguri'] font-semibold">
                    {activeBrother.nickname}
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">
                    {activeBrother.role}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                    <span className="text-[10px] text-[#38bdf8] font-semibold">
                      ক্লিক করে ডসিয়ার ↗
                    </span>
                    <span className="font-mono text-gray-400 text-[10px]">
                      {activeBrother.tripsCount} সফর
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* =========================================================================
          BOTTOM STATUS & SCROLL HELPER
      ========================================================================= */}
      <div className="pb-7 sm:pb-9 px-6 sm:px-12 z-20 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-400">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
          <span ref={statusLabelRef} className="text-white inline-flex items-center gap-1.5">
            [ ভাইদের আগমন চলছে... 0 / ১৩ ]
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-gray-400">
          <span>SCROLL DOWN TO ADVANCE • CLICK AVATAR FOR FULL PROFILE</span>
        </div>
      </div>
      </div>
    </div>
  );
}
