"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { BrotherBadgeIcon } from "@/components/HugeIcon";
import {
  MapPin,
  Clock,
  Mountain,
  Navigation,
  Compass,
  Play,
  Pause,
  Maximize2,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Camera,
  X,
  Flag,
} from "lucide-react";
import { TourExpedition } from "@/data/toursData";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface NormalizedRoadStep {
  stepNumber: number;
  dayBadge: string;
  timeOrPhase: string;
  title: string;
  location: string;
  narrative: string;
  image: string;
  mediaType: "photo" | "video";
  mediaCaption?: string;
  brotherHighlight?: {
    id?: string;
    brother: string;
    avatar?: string;
    comment: string;
  };
  travelTip?: string;
  altitude: string;
  distanceKm: string;
}

interface PathSample {
  x: number;
  y: number;
  rotation: number;
}

interface InteractiveTourRoadProps {
  tour: TourExpedition;
}

export default function InteractiveTourRoad({ tour }: InteractiveTourRoadProps) {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const roadContainerRef = useRef<HTMLDivElement>(null);
  const carGroupRef = useRef<SVGGElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const speedometerTextRef = useRef<HTMLSpanElement>(null);
  const steeringTextRef = useRef<HTMLSpanElement>(null);
  const progressPercentRef = useRef<HTMLSpanElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Audio Context singleton (never re-created during scroll)
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Precomputed Path Lookup Table (1000 samples for instantaneous O(1) tracking)
  const pathLutRef = useRef<PathSample[]>([]);
  const milestoneNormDistances = useRef<number[]>([]);
  const cardContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeIndexRef = useRef<number>(0);

  const [isAutoCruising, setIsAutoCruising] = useState<boolean>(false);
  const autoCruiseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [expandedCaption, setExpandedCaption] = useState<string | null>(null);

  // High-performance reusable audio chime
  const playPingSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio not supported or user hasn't interacted yet
    }
  }, [soundEnabled]);

  // Normalize journey steps
  const steps: NormalizedRoadStep[] = useMemo(() => {
    if (tour.journeySteps && tour.journeySteps.length > 0) {
      return tour.journeySteps.map((step, idx) => ({
        stepNumber: step.stepNumber || idx + 1,
        dayBadge: `DAY 0${step.stepNumber || idx + 1}`,
        timeOrPhase: step.timeOrPhase,
        title: step.title,
        location: step.location,
        narrative: step.narrative,
        image: step.image || tour.coverImage,
        mediaType: (step.mediaType === "video" ? "video" : "photo") as "photo" | "video",
        mediaCaption: step.mediaCaption,
        brotherHighlight: step.brotherHighlight,
        travelTip: step.travelTip,
        altitude: `${1400 + idx * 310} FT`,
        distanceKm: `${idx * 45 + 15} KM`,
      }));
    }

    return tour.dayWiseItinerary.map((dayItem, idx) => {
      const galleryImg =
        tour.gallery && tour.gallery[idx % tour.gallery.length]
          ? tour.gallery[idx % tour.gallery.length].url
          : tour.coverImage;

      const randomBrother =
        tour.squadMembers[idx % tour.squadMembers.length] || "রাকিব হাসান";

      return {
        stepNumber: idx + 1,
        dayBadge: `DAY 0${idx + 1}`,
        timeOrPhase: `${dayItem.day} • ট্রেইল জার্নি`,
        title: dayItem.title,
        location: tour.location,
        narrative: dayItem.desc,
        image: galleryImg,
        mediaType: "photo",
        mediaCaption: dayItem.title,
        brotherHighlight: {
          brother: randomBrother,
          comment: `পাহাড়ে ${dayItem.day}-এর এই পথচলা ছিল আমাদের অন্যতম সেরা স্মৃতি!`,
        },
        travelTip:
          idx === 0
            ? "সফরের শুরুতে হালকা শুকনো খাবার ও পর্যাপ্ত পানি সাথে রাখুন।"
            : "পাহাড়ি রাস্তায় সাবধানে চলা এবং জুতো গ্রিপযুক্ত হওয়া দরকার।",
        altitude: `${1200 + (idx + 1) * 320} FT`,
        distanceKm: `${(idx + 1) * 38} KM`,
      };
    });
  }, [tour]);

  const totalSteps = steps.length;

  // Geometry parameters for the full-screen winding mountain highway
  const stepSpacing = 480;
  const paddingTop = 220;
  const paddingBottom = 240;
  const totalRoadHeight = paddingTop + Math.max(1, totalSteps - 1) * stepSpacing + paddingBottom;
  const centerX = 600;
  const curveAmplitude = 65; // Gentle, elegant mountain highway curve (amplitude 65px: ~20° to 22° gentle sway)

  // Milestone curve coordinates: Alternating Left and Right gentle highway curves
  const milestoneCoords = useMemo(() => {
    return steps.map((_, i) => {
      const isLeft = i % 2 === 0;
      const x = isLeft ? centerX - curveAmplitude : centerX + curveAmplitude;
      const y = paddingTop + i * stepSpacing;
      return { x, y, isLeft, index: i };
    });
  }, [steps, paddingTop, stepSpacing, curveAmplitude, centerX]);

  // Construct continuous, mathematically flawless gentle mountain curve
  // (Zero kinks, zero distortion, pure harmonic Hermite S-curves!)
  const roadPathD = useMemo(() => {
    if (milestoneCoords.length === 0) return "";

    let d = `M ${centerX} 60`;

    // Hermite tangent smoothing factor: 0.38 yields pure harmonic sine-like curves
    // with continuous curvature and zero inflection bulging / elbow kinks!
    const k = 0.38;

    // Lead-in from summit start to first milestone
    const first = milestoneCoords[0];
    const leadInDy = first.y - 60;
    d += ` C ${centerX} ${60 + leadInDy * k}, ${first.x} ${first.y - leadInDy * k}, ${first.x} ${first.y}`;

    // Gentle S-curves between consecutive milestones with smooth Hermite tangents
    for (let i = 0; i < milestoneCoords.length - 1; i++) {
      const cur = milestoneCoords[i];
      const nxt = milestoneCoords[i + 1];
      const dy = nxt.y - cur.y;

      const cp1x = cur.x;
      const cp1y = cur.y + dy * k;
      const cp2x = nxt.x;
      const cp2y = nxt.y - dy * k;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nxt.x} ${nxt.y}`;
    }

    // Lead-out to bottom summit finish line
    const last = milestoneCoords[milestoneCoords.length - 1];
    const endY = totalRoadHeight - 60;
    const leadOutDy = endY - last.y;
    d += ` C ${last.x} ${last.y + leadOutDy * k}, ${centerX} ${endY - leadOutDy * k}, ${centerX} ${endY}`;

    return d;
  }, [milestoneCoords, totalRoadHeight, centerX]);

  // =========================================================================
  // ONE-TIME PRECOMPUTED LOOKUP TABLE (1000 Samples = 0ms per frame lookup)
  // =========================================================================
  useEffect(() => {
    const path = pathRef.current;
    if (!path || milestoneCoords.length === 0) return;

    try {
      const totalLen = path.getTotalLength();
      const TOTAL_SAMPLES = 1000;
      const lut: PathSample[] = new Array(TOTAL_SAMPLES);

      for (let s = 0; s < TOTAL_SAMPLES; s++) {
        const curDist = (s / (TOTAL_SAMPLES - 1)) * totalLen;
        const pt = path.getPointAtLength(curDist);

        // High-precision central difference for smooth car orientation (Zero jitter)
        const lookAhead = Math.min(totalLen, curDist + 6);
        const lookBehind = Math.max(0, curDist - 6);
        const pAhead = path.getPointAtLength(lookAhead);
        const pBehind = path.getPointAtLength(lookBehind);
        const dx = pAhead.x - pBehind.x;
        const dy = pAhead.y - pBehind.y;
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = (angleRad * 180) / Math.PI;

        lut[s] = {
          x: pt.x,
          y: pt.y,
          rotation: angleDeg - 90, // Align car front (+Y) with road tangent
        };
      }
      pathLutRef.current = lut;

      // Milestone normalized distances
      const distances: number[] = [];
      for (let i = 0; i < milestoneCoords.length; i++) {
        const target = milestoneCoords[i];
        let bestDist = 0;
        let bestDiff = Infinity;

        for (let s = 0; s < TOTAL_SAMPLES; s++) {
          const pt = lut[s];
          const diff = Math.hypot(pt.x - target.x, pt.y - target.y);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestDist = s / (TOTAL_SAMPLES - 1);
          }
        }
        distances.push(bestDist);
      }
      milestoneNormDistances.current = distances;

      // Position car & road camera at start
      if (carGroupRef.current && lut[0]) {
        carGroupRef.current.setAttribute(
          "transform",
          `translate(${lut[0].x}, ${lut[0].y}) rotate(${lut[0].rotation})`
        );
      }
      if (roadContainerRef.current && lut[0]) {
        const containerW = roadContainerRef.current.clientWidth || 1200;
        const containerH = roadContainerRef.current.clientHeight || 700;
        const scale = containerW / 1200;
        const targetTranslateY = containerH * 0.45 - lut[0].y * scale;
        const minTranslateY = Math.min(0, containerH - totalRoadHeight * scale);
        const roadY = Math.max(minTranslateY, Math.min(0, targetTranslateY));
        gsap.set(roadContainerRef.current, { y: roadY, force3D: true });
      }
    } catch {
      // Fallback
    }
  }, [roadPathD, milestoneCoords, totalRoadHeight]);

  // Silky Smooth Milestone Card Transition (Zero Teleportation, Zero "Dham Dham")
  const transitionToMilestone = useCallback((newIdx: number, prevIdx: number) => {
    const prevCard = cardContainerRefs.current[prevIdx];
    const newCard = cardContainerRefs.current[newIdx];

    if (prevCard && prevCard !== newCard) {
      gsap.to(prevCard, {
        opacity: 0,
        scale: 0.95,
        y: -12,
        duration: 0.45,
        ease: "power2.out",
      });
    }

    if (newCard) {
      gsap.fromTo(
        newCard,
        { opacity: 0, scale: 0.95, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  // Jump to specific milestone step smoothly
  const jumpToStep = useCallback(
    (index: number) => {
      const normDists = milestoneNormDistances.current;
      const targetFraction =
        normDists && normDists[index] !== undefined
          ? normDists[index]
          : index / Math.max(1, totalSteps - 1);

      const prevIdx = activeIndexRef.current;
      activeIndexRef.current = index;
      setActiveIndex(index);
      transitionToMilestone(index, prevIdx);
      playPingSound();

      const trigger = scrollTriggerRef.current;
      if (trigger) {
        const targetY = trigger.start + targetFraction * (trigger.end - trigger.start);
        gsap.to(window, {
          scrollTo: { y: targetY, autoKill: false },
          duration: 0.85,
          ease: "power2.inOut",
        });
      }
    },
    [totalSteps, transitionToMilestone, playPingSound]
  );

  // Auto Cruise: Automatic smooth glide through all milestones
  const toggleAutoCruise = useCallback(() => {
    if (isAutoCruising) {
      if (autoCruiseTimerRef.current) clearInterval(autoCruiseTimerRef.current);
      setIsAutoCruising(false);
    } else {
      setIsAutoCruising(true);
      let nextStep = (activeIndexRef.current + 1) % totalSteps;
      jumpToStep(nextStep);

      autoCruiseTimerRef.current = setInterval(() => {
        nextStep = (activeIndexRef.current + 1) % totalSteps;
        jumpToStep(nextStep);
      }, 4500);
    }
  }, [isAutoCruising, totalSteps, jumpToStep]);

  // Clean up auto cruise timer
  useEffect(() => {
    return () => {
      if (autoCruiseTimerRef.current) clearInterval(autoCruiseTimerRef.current);
    };
  }, []);

  // =========================================================================
  // 120 FPS ZERO-JANK SCROLL ENGINE: True Tween Scrubbing + O(1) LUT Math
  // =========================================================================
  useEffect(() => {
    const pinEl = pinSectionRef.current;
    if (!pinEl) return;

    const ctx = gsap.context(() => {
      const progressProxy = { value: 0 };

      // Core GSAP Tween with Scrub provides true physics momentum smoothing (zero hitching!)
      const tween = gsap.to(progressProxy, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: () => `+=${Math.max(1600, totalSteps * 460)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8, // Fluid momentum damping eliminates mouse wheel stepping!
          anticipatePin: 1,
          fastScrollEnd: true,
        },
        onUpdate: () => {
          const p = progressProxy.value;

          // 1. Instant O(1) LUT point lookup (0ms CPU time)
          const lut = pathLutRef.current;
          if (lut.length > 0) {
            const idx = Math.max(0, Math.min(lut.length - 1, Math.round(p * (lut.length - 1))));
            const sample = lut[idx];

            if (sample) {
              // Direct GPU transform on car
              if (carGroupRef.current) {
                carGroupRef.current.setAttribute(
                  "transform",
                  `translate(${sample.x}, ${sample.y}) rotate(${sample.rotation})`
                );
              }

              // Direct GPU transform on road camera
              if (roadContainerRef.current) {
                const containerW = roadContainerRef.current.clientWidth || 1200;
                const containerH = roadContainerRef.current.clientHeight || 700;
                const scale = containerW / 1200;
                const renderedHeight = totalRoadHeight * scale;
                const targetTranslateY = containerH * 0.46 - sample.y * scale;
                const minTranslateY = Math.min(0, containerH - renderedHeight);
                const roadY = Math.max(minTranslateY, Math.min(0, targetTranslateY));
                gsap.set(roadContainerRef.current, { y: roadY, force3D: true });
              }

              // Direct DOM text updates (Zero React re-renders)
              if (speedometerTextRef.current) {
                const curveSharpness = Math.min(1, Math.abs(sample.rotation) / 45);
                const speed = Math.round(60 - curveSharpness * 18);
                speedometerTextRef.current.textContent = `${speed} কিমি/ঘণ্টা`;
              }
              if (steeringTextRef.current) {
                steeringTextRef.current.textContent = `${Math.round(sample.rotation)}°`;
              }
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${Math.max(4, p * 100)}%`;
              }
              if (progressPercentRef.current) {
                progressPercentRef.current.textContent = `রোড ট্রিপ প্রোগ্রেস: ${Math.round(
                  p * 100
                )}%`;
              }
            }
          }

          // 2. Active milestone detection with Hysteresis (prevents boundary flicker)
          const normDists = milestoneNormDistances.current;
          if (normDists && normDists.length === totalSteps) {
            const curIdx = activeIndexRef.current;
            let nextIdx = curIdx;

            // Check moving forward
            if (curIdx < totalSteps - 1) {
              const forwardThreshold =
                (normDists[curIdx] + normDists[curIdx + 1]) / 2 + 0.025;
              if (p > forwardThreshold) {
                nextIdx = curIdx + 1;
              }
            }

            // Check moving backward
            if (curIdx > 0) {
              const backwardThreshold =
                (normDists[curIdx - 1] + normDists[curIdx]) / 2 - 0.025;
              if (p < backwardThreshold) {
                nextIdx = curIdx - 1;
              }
            }

            if (nextIdx !== curIdx) {
              const prev = activeIndexRef.current;
              activeIndexRef.current = nextIdx;
              setActiveIndex(nextIdx);
              playPingSound();
              transitionToMilestone(nextIdx, prev);
            }
          }
        },
      });

      scrollTriggerRef.current = tween.scrollTrigger ?? null;
    }, pinEl);

    return () => {
      ctx.revert();
      scrollTriggerRef.current = null;
    };
  }, [totalSteps, playPingSound, transitionToMilestone, totalRoadHeight]);

  const currentStep = steps[activeIndex] || steps[0];

  // Reusable Milestone Card View renderer
  const renderCardContent = (step: NormalizedRoadStep) => (
    <div className="relative w-full rounded-3xl p-5 sm:p-7 bg-[#030e20]/95 border-2 border-cyan-400/60 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(56,189,248,0.22)] ring-1 ring-cyan-400/30">
      {/* Top Accent Shimmer Highlight */}
      <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* Header Strip: Day Badge, Time, Altitude, Distance */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="px-3 py-0.5 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            {step.dayBadge}
          </span>

          <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {step.timeOrPhase}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
            <Mountain className="w-3.5 h-3.5 text-cyan-400" />
            {step.altitude}
          </span>
          <span className="text-slate-400">{step.distanceKm}</span>
        </div>
      </div>

      {/* Split Media & Story Content */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Image Container with Zoom Trigger */}
        <div className="sm:col-span-5 relative aspect-[16/11] rounded-2xl overflow-hidden border border-white/10 group bg-slate-950">
          <Image
            src={step.image}
            alt={step.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 320px"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#020712] via-transparent to-transparent opacity-75" />

          {/* Lightbox Zoom Trigger */}
          <button
            type="button"
            onClick={() => {
              setExpandedImage(step.image);
              setExpandedCaption(`${step.dayBadge} • ${step.title}`);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer hover:scale-110"
            title="ছবি বড় করে দেখুন"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Photo Caption Strip */}
          {step.mediaCaption && (
            <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded-lg border border-white/10 truncate flex items-center gap-1">
              <Camera className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{step.mediaCaption}</span>
            </div>
          )}
        </div>

        {/* Story Narrative & Brother Highlights */}
        <div className="sm:col-span-7 flex flex-col justify-between">
          <div>
            {/* Location Pin */}
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono mb-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{step.location}</span>
            </div>

            {/* Story Title */}
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 font-sans leading-snug">
              {step.title}
            </h3>

            {/* Narrative Body */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-2.5 line-clamp-3">
              {step.narrative}
            </p>
          </div>

          {/* Brother Highlight Quote */}
          {step.brotherHighlight && (
            <div className="relative p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 mb-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 border border-white/20 shadow-md">
                  <BrotherBadgeIcon
                    brotherId={step.brotherHighlight.id || "rakib"}
                    size={13}
                    className="text-white"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-cyan-300">
                    {step.brotherHighlight.brother}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 italic font-sans leading-relaxed line-clamp-2">
                    &ldquo;{step.brotherHighlight.comment}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Brother Secret Travel Tip */}
          {step.travelTip && (
            <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2 text-[10px] text-amber-200/90 font-sans">
              <Lightbulb className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-mono mr-1">টিপ:</strong>
                {step.travelTip}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={pinSectionRef}
      className="relative w-full h-screen min-h-[720px] max-h-[1080px] bg-[#020713] text-slate-100 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* 1. CINEMATIC MOUNTAIN VALLEYS & ATMOSPHERIC HILL TOPOGRAPHY               */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Mountain Valley Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#010611] via-[#041427] to-[#010815]" />

        {/* Mountain Silhouette Ridges in Background */}
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full opacity-30"
          preserveAspectRatio="none"
        >
          {/* Far Mountain Ridge */}
          <path
            d="M 0 340 Q 240 220 480 320 T 960 260 T 1440 330 L 1440 900 L 0 900 Z"
            fill="#031628"
          />
          {/* Mid Mountain Ridge */}
          <path
            d="M 0 460 Q 320 380 640 480 T 1120 420 T 1440 470 L 1440 900 L 0 900 Z"
            fill="#041f38"
          />
          {/* Near Mountain Ridge */}
          <path
            d="M 0 620 Q 280 540 600 640 T 1200 580 T 1440 630 L 1440 900 L 0 900 Z"
            fill="#032b4d"
          />

          {/* Topographical Contour Lines */}
          <path
            d="M -100 240 Q 300 190 600 320 T 1300 260 T 1600 390"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            opacity="0.25"
          />
          <path
            d="M -100 420 Q 250 360 700 480 T 1200 400 T 1600 520"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            opacity="0.25"
          />
        </svg>

        {/* Soft Ambient Radial Lights (Zero Blur Filter Overhead) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 15% 30%, rgba(6,182,212,0.12) 0%, transparent 50%), radial-gradient(circle at 85% 70%, rgba(245,158,11,0.08) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP EXPEDITION COCKPIT HUD (Fixed at Top of Viewport)                   */}
      {/* ========================================================================= */}
      <div className="relative z-40 w-full max-w-[1700px] mx-auto px-4 sm:px-8 pt-16 sm:pt-20 pb-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#030d1d]/95 border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white font-sans tracking-tight">
                  আঁকাবাঁকা পাহাড়ি পথ ধরে{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-cyan-300">
                    পথচলা
                  </span>
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] uppercase">
                  পাহাড়ি কার্ভ ড্রাইভ
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans hidden sm:block">
                মাউস স্ক্রোল করুন — চাঁদের গাড়ি রোডের কার্ভ বেয়ে ছুটবে এবং প্রতিটি বাঁকে নতুন মাইলস্টোন কার্ড উন্মোচিত হবে
              </p>
            </div>
          </div>

          {/* Center Telemetry Readout */}
          <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
              <Mountain className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentStep.altitude}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentStep.distanceKm}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                মাইলস্টোন <strong className="text-amber-400">{activeIndex + 1}</strong> / {totalSteps}
              </span>
            </div>
          </div>

          {/* Right Controls: Sound, Prev/Next, Auto Cruise */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title={soundEnabled ? "সাউন্ড বন্ধ করুন" : "সাউন্ড চালু করুন"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => jumpToStep(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="পূর্ববর্তী মাইলস্টোন"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => jumpToStep(Math.min(totalSteps - 1, activeIndex + 1))}
              disabled={activeIndex === totalSteps - 1}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="পরবর্তী মাইলস্টোন"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleAutoCruise}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shadow-md ${
                isAutoCruising
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30 animate-pulse"
                  : "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:scale-105 text-white shadow-cyan-500/30"
              }`}
            >
              {isAutoCruising ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span className="hidden sm:inline">পজ করুন</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span className="hidden sm:inline">অটো ড্রাইভ</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Milestone Jump Chips */}
        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {steps.map((step, idx) => {
            const isCurrent = idx === activeIndex;
            const isPassed = idx < activeIndex;

            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => jumpToStep(idx)}
                style={
                  isCurrent
                    ? { backgroundColor: "#38bdf8", color: "#020617" }
                    : undefined
                }
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? "shadow-lg shadow-sky-500/50 scale-105 border border-white"
                    : isPassed
                    ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60"
                    : "bg-slate-900/80 border border-white/10 text-slate-300 hover:bg-white/15 hover:text-white"
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span>{idx + 1}.</span>
                )}
                <span>{step.dayBadge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CENTER WINDING MOUNTAIN ROAD CANVAS WITH STEERING 4x4 CAR & CARDS      */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 overflow-hidden flex items-center">
        {/* 3A. Winding Mountain Highway SVG (Camera tracks vertically on GPU) */}
        <div
          ref={roadContainerRef}
          className="absolute inset-0 pointer-events-auto will-change-transform"
        >
          <svg
            viewBox={`0 0 1200 ${totalRoadHeight}`}
            className="w-full h-auto"
            style={{ minHeight: `${totalRoadHeight}px` }}
          >
            <defs>
              {/* Road Asphalt Gradients */}
              <linearGradient id="asphaltGradDeep" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#253245" />
                <stop offset="25%" stopColor="#111927" />
                <stop offset="50%" stopColor="#0a121e" />
                <stop offset="75%" stopColor="#111927" />
                <stop offset="100%" stopColor="#253245" />
              </linearGradient>

              {/* Headlight volumetric beam gradient */}
              <linearGradient id="headlightVolumetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#fde047" stopOpacity="0.45" />
                <stop offset="75%" stopColor="#eab308" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
              </linearGradient>

              {/* Taillight Ruby Red Bloom */}
              <radialGradient id="taillightBloom" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#dc2626" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Hillside Organic Pine Trees along Mountain Slopes */}
            {[
              { x: 330, y: 150, s: 1.1 },
              { x: 370, y: 190, s: 0.8 },
              { x: 830, y: 390, s: 1.2 },
              { x: 870, y: 440, s: 0.9 },
              { x: 340, y: 730, s: 1.2 },
              { x: 380, y: 790, s: 0.8 },
              { x: 840, y: 960, s: 1.2 },
              { x: 880, y: 1010, s: 0.9 },
              { x: 330, y: 1300, s: 1.1 },
              { x: 850, y: 1560, s: 1.3 },
            ].map((tree, idx) => (
              <g
                key={`tree-${idx}`}
                transform={`translate(${tree.x}, ${tree.y}) scale(${tree.s})`}
                opacity="0.38"
              >
                <rect x="-3" y="14" width="6" height="12" fill="#02140e" rx="1" />
                <polygon points="0,-32 -16,-10 16,-10" fill="#042e1f" />
                <polygon points="0,-20 -20,4 20,4" fill="#032519" />
                <polygon points="0,-8 -24,16 24,16" fill="#021c13" />
              </g>
            ))}

            {/* Hidden Master Path used for getPointAtLength and car tracking */}
            <path
              ref={pathRef}
              d={roadPathD}
              fill="none"
              stroke="transparent"
              strokeWidth="1"
            />

            {/* ========================================================================= */}
            {/* ROADWAY LAYERS: AUTHENTIC 2-LANE HIGHWAY WITH PERFECT CRISP MARKINGS      */}
            {/* ========================================================================= */}
            {/* Layer 1: Mountain Road Dirt & Gravel Shoulder (88px wide) */}
            <path
              d={roadPathD}
              fill="none"
              stroke="#0f172a"
              strokeWidth="88"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Layer 2: Compacted Shoulder Road Bed (80px wide) */}
            <path
              d={roadPathD}
              fill="none"
              stroke="#1e293b"
              strokeWidth="80"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Layer 3: Solid White Outer Shoulder Edge Lines (72px outer) */}
            <path
              d={roadPathD}
              fill="none"
              stroke="#f8fafc"
              strokeWidth="72"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Layer 4: Deep Textured Asphalt Highway Pavement (66px wide) */}
            {/* Leaves exactly 3px of razor-sharp solid white edge lines on both sides! */}
            <path
              d={roadPathD}
              fill="none"
              stroke="url(#asphaltGradDeep)"
              strokeWidth="66"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Layer 5: Authentic Mountain Highway Double Yellow Lines (Solid No-Passing Zone) */}
            {/* Soft Ambient Amber Glow */}
            <path
              d={roadPathD}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeOpacity="0.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Outer Golden Amber Highway Stripes (5.5px wide) */}
            <path
              d={roadPathD}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dark Asphalt Center Divider Groove (1.8px wide) */}
            {/* Creates a genuine, perfect double yellow line with 1.85px parallel stripes! */}
            <path
              d={roadPathD}
              fill="none"
              stroke="#0a121e"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Roadside Safety Guardrails on the Outer Apex of Curves */}
            {milestoneCoords.map((coord, idx) => {
              const railX = coord.isLeft ? coord.x - 46 : coord.x + 46;
              const curveOffset = coord.isLeft ? -10 : 10;
              return (
                <g key={`guardrail-${idx}`} opacity="0.9">
                  {/* Curved Steel Rail Bar that wraps with the curve */}
                  <path
                    d={`M ${railX - curveOffset} ${coord.y - 44} Q ${railX} ${coord.y} ${railX - curveOffset} ${coord.y + 44}`}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Mounting Posts */}
                  <line x1={railX - curveOffset * 0.7} y1={coord.y - 32} x2={railX - curveOffset * 1.4} y2={coord.y - 32} stroke="#64748b" strokeWidth="2.5" />
                  <line x1={railX} y1={coord.y} x2={railX - curveOffset * 0.8} y2={coord.y} stroke="#64748b" strokeWidth="2.5" />
                  <line x1={railX - curveOffset * 0.7} y1={coord.y + 32} x2={railX - curveOffset * 1.4} y2={coord.y + 32} stroke="#64748b" strokeWidth="2.5" />
                  {/* Reflective Hazard Chevrons (Yellow / Red) */}
                  <circle cx={railX - curveOffset * 0.7} cy={coord.y - 32} r="3.5" fill="#eab308" />
                  <circle cx={railX} cy={coord.y} r="3.5" fill="#ef4444" />
                  <circle cx={railX - curveOffset * 0.7} cy={coord.y + 32} r="3.5" fill="#eab308" />
                </g>
              );
            })}

            {/* Milestone Waypoints & Viewpoint Stations on Road */}
            {milestoneCoords.map((coord, idx) => {
              const isCurrent = idx === activeIndex;
              const isPassed = idx < activeIndex;

              return (
                <g
                  key={`waypoint-${idx}`}
                  className="cursor-pointer group"
                  onClick={() => jumpToStep(idx)}
                >
                  {/* Wooden Scenic Viewpoint Overlook Platform beside Road */}
                  <ellipse
                    cx={coord.x}
                    cy={coord.y}
                    rx="48"
                    ry="24"
                    fill={isCurrent ? "rgba(56, 189, 248, 0.35)" : "rgba(15, 23, 42, 0.7)"}
                    stroke={isCurrent ? "#38bdf8" : "#334155"}
                    strokeWidth="2"
                  />

                  {/* Pulsing Active Ring */}
                  {isCurrent && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="36"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      className="animate-ping"
                      opacity="0.75"
                    />
                  )}

                  {/* Waypoint Base Pad */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="22"
                    fill={isCurrent ? "#0284c7" : isPassed ? "#064e3b" : "#0f172a"}
                    stroke={isCurrent ? "#bae6fd" : isPassed ? "#34d399" : "#475569"}
                    strokeWidth="3"
                    className="transition-transform group-hover:scale-110"
                  />

                  {/* Milestone Number */}
                  <text
                    x={coord.x}
                    y={coord.y + 5.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {idx + 1}
                  </text>

                  {/* Authentic Bangladesh Highway Kilometer Milestone Stone */}
                  <g
                    transform={`translate(${
                      coord.isLeft ? coord.x - 76 : coord.x + 52
                    }, ${coord.y - 22})`}
                  >
                    {/* Concrete Stone Body */}
                    <rect
                      x="0"
                      y="0"
                      width="26"
                      height="40"
                      rx="7"
                      fill="#f8fafc"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    {/* RHD Yellow Dome Top */}
                    <path
                      d="M 0 9 Q 13 0 26 9 L 26 0 L 0 0 Z"
                      fill="#f59e0b"
                    />
                    <text
                      x="13"
                      y="18"
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      D{idx + 1}
                    </text>
                    <text
                      x="13"
                      y="30"
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="7.5"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      KM
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Summit Pass Finish Banner at the Bottom */}
            <g transform={`translate(${centerX}, ${totalRoadHeight - 55})`}>
              <line x1="-60" y1="0" x2="60" y2="0" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 5" />
              <rect x="-50" y="-14" width="100" height="28" rx="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="monospace">
                SUMMIT FINISH
              </text>
            </g>

            {/* ========================================================================= */}
            {/* 4x4 EXPEDITION CHANDER GARI (Vibrant Safari Overland Cruiser)              */}
            {/* ========================================================================= */}
            <g
              ref={carGroupRef}
              transform={`translate(${milestoneCoords[0]?.x || 535}, ${
                milestoneCoords[0]?.y || 220
              }) rotate(0)`}
              className="pointer-events-none"
            >
              {/* Volumetric Headlight Beams projecting forward onto the road */}
              <polygon
                points="-20,38 -80,210 80,210 20,38"
                fill="url(#headlightVolumetric)"
                opacity="0.9"
              />

              {/* Vehicle Drop Shadow on Asphalt */}
              <ellipse
                cx="0"
                cy="10"
                rx="30"
                ry="52"
                fill="rgba(0,0,0,0.75)"
              />

              {/* 4 Chunky Mud Terrain All-Terrain Tires */}
              <rect
                x="-32"
                y="-38"
                width="12"
                height="24"
                rx="4"
                fill="#070b12"
                stroke="#475569"
                strokeWidth="2"
              />
              <rect
                x="20"
                y="-38"
                width="12"
                height="24"
                rx="4"
                fill="#070b12"
                stroke="#475569"
                strokeWidth="2"
              />
              <rect
                x="-32"
                y="16"
                width="12"
                height="24"
                rx="4"
                fill="#070b12"
                stroke="#475569"
                strokeWidth="2"
              />
              <rect
                x="20"
                y="16"
                width="12"
                height="24"
                rx="4"
                fill="#070b12"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* 4x4 Main Chassis: Vibrant Expedition Amber-Gold Body */}
              <rect
                x="-25"
                y="-42"
                width="50"
                height="84"
                rx="11"
                fill="#f59e0b"
                stroke="#fbbf24"
                strokeWidth="2.5"
              />

              {/* Front Hood with Ventilation Vents & Winch */}
              <rect x="-21" y="21" width="42" height="19" rx="5" fill="#d97706" />
              <line
                x1="-16"
                y1="36"
                x2="16"
                y2="36"
                stroke="#1e293b"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Tinted Cyan Windshield with Reflection */}
              <path
                d="M -20,18 L -15,3 L 15,3 L 20,18 Z"
                fill="#0284c7"
                opacity="0.95"
                stroke="#38bdf8"
                strokeWidth="1.2"
              />
              <line
                x1="-12"
                y1="14"
                x2="9"
                y2="6"
                stroke="#ffffff"
                strokeWidth="2.2"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Cabin Roof & Safari Expedition Roof Rack */}
              <rect x="-22" y="-38" width="44" height="38" rx="5" fill="#1e293b" />
              <rect
                x="-21"
                y="-36"
                width="42"
                height="34"
                rx="4"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <line x1="-21" y1="-24" x2="21" y2="-24" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="-21" y1="-12" x2="21" y2="-12" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Roof Cargo: Expedition Duffel Bags, Sleeping Roll, Jerrycans */}
              <rect x="-17" y="-33" width="16" height="11" rx="3" fill="#ea580c" />
              <rect x="2" y="-33" width="15" height="11" rx="3" fill="#0284c7" />
              <rect x="-16" y="-19" width="32" height="9" rx="4" fill="#10b981" />

              {/* Rear Spare Tire Mounted on Back Door */}
              <circle cx="0" cy="-44" r="11" fill="#070b12" stroke="#64748b" strokeWidth="2.2" />
              <circle cx="0" cy="-44" r="5" fill="#475569" />

              {/* Front LED Headlights (Bright Golden Yellow Glow) */}
              <circle cx="-19" cy="42" r="5" fill="#fef08a" />
              <circle cx="19" cy="42" r="5" fill="#fef08a" />

              {/* Rear Taillights (Glowing Red LEDs with Radial Halo) */}
              <circle cx="-21" cy="-41" r="9" fill="url(#taillightBloom)" />
              <circle cx="21" cy="-41" r="9" fill="url(#taillightBloom)" />
              <circle cx="-21" cy="-41" r="3.5" fill="#f87171" />
              <circle cx="21" cy="-41" r="3.5" fill="#f87171" />
            </g>
          </svg>
        </div>

        {/* 3B. Live Driving Speedometer HUD (Direct DOM text mutator) */}
        <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-[#030e20]/95 border border-cyan-500/40 shadow-2xl flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="font-mono text-xs">
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">
                চাঁদের গাড়ি গতিবেগ
              </span>
              <span
                ref={speedometerTextRef}
                className="text-amber-300 font-bold text-sm"
              >
                ৪৮ কিমি/ঘণ্টা
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="font-mono text-xs">
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">
                কার্ভ স্টিয়ারিং
              </span>
              <span
                ref={steeringTextRef}
                className="text-cyan-300 font-bold text-xs"
              >
                ০°
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3C. DEDICATED MILESTONE CARDS (Zero Content Snapping, 100% Silky Crossfade) */}
        {/* ========================================================================= */}
        {steps.map((step, idx) => {
          const isRightSide = idx % 2 === 0; // Even: Road curves left -> Card docked on RIGHT
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={`milestone-card-${idx}`}
              ref={(el) => {
                cardContainerRefs.current[idx] = el;
              }}
              className={`absolute z-30 w-full max-w-xl sm:max-w-2xl lg:max-w-[560px] ${
                isRightSide
                  ? "right-4 sm:right-8 lg:right-12"
                  : "left-4 sm:left-8 lg:left-12"
              } ${isCurrent ? "pointer-events-auto" : "pointer-events-none"}`}
              style={{
                opacity: isCurrent ? 1 : 0,
                transform: isCurrent ? "translateY(0) scale(1)" : "translateY(14px) scale(0.95)",
              }}
            >
              {renderCardContent(step)}
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM HIGHWAY PROGRESS TRACKER BAR                                    */}
      {/* ========================================================================= */}
      <div className="relative z-40 w-full max-w-[1700px] mx-auto px-4 sm:px-8 pb-3">
        <div className="relative w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 transition-all duration-75"
            style={{ width: "4%" }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>যাত্রার সূচনা: পাহাড়ি বেসক্যাম্প</span>
          <span
            ref={progressPercentRef}
            className="text-cyan-400 font-bold"
          >
            রোড ট্রিপ প্রোগ্রেস: ০%
          </span>
          <span className="flex items-center gap-1">
            <Flag className="w-3 h-3 text-amber-400" />
            <span>গন্তব্য: মেঘের দেশ ও সামিট পিক</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FULL-SCREEN LIGHTBOX ZOOM MODAL                                        */}
      {/* ========================================================================= */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[85vh] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[65vh] bg-slate-950">
              <Image
                src={expandedImage}
                alt="Expedition Milestone Zoom"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4 bg-[#051428] flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>{expandedCaption || "ভাই-ব্রাদার্স রোড ট্রিপ মোমেন্ট"}</span>
              <button
                type="button"
                onClick={() => setExpandedImage(null)}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <span>বন্ধ করুন</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
