"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface AmbientSoundProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function AmbientSound({ isPlaying, onToggle }: AmbientSoundProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const oceanGainRef = useRef<GainNode | null>(null);
  const activeSourcesRef = useRef<AudioNode[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentAmbience, setCurrentAmbience] = useState<"rain" | "balanced" | "ocean">("balanced");

  useEffect(() => {
    // Graceful Audio Teardown
    const stopAudio = () => {
      intervalsRef.current.forEach((id) => clearInterval(id));
      intervalsRef.current = [];

      if (masterGainRef.current && audioCtxRef.current) {
        try {
          const t = audioCtxRef.current.currentTime;
          masterGainRef.current.gain.cancelScheduledValues(t);
          masterGainRef.current.gain.setValueAtTime(0, t);
        } catch {
          // ignore
        }
      }

      activeSourcesRef.current.forEach((src) => {
        try {
          if ("stop" in src && typeof (src as AudioScheduledSourceNode).stop === "function") {
            (src as AudioScheduledSourceNode).stop();
          }
          src.disconnect();
        } catch {
          // ignore
        }
      });
      activeSourcesRef.current = [];

      if (audioCtxRef.current && audioCtxRef.current.state === "running") {
        audioCtxRef.current.suspend();
      }
    };

    if (!isPlaying) {
      stopAudio();
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Master output stage with smooth fade-in
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.38, now + 1.5);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // =========================================================================
      // 1. DUAL NOISE SYNTHESIS BUFFERS (Pink Noise for Rain, Brown for Ocean)
      // =========================================================================
      const sampleRate = ctx.sampleRate;
      const bufferLength = sampleRate * 5; // 5-second seamless loops

      // Stereo Pink Noise Buffer (Natural rain patter texture)
      const rainBuffer = ctx.createBuffer(2, bufferLength, sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const data = rainBuffer.getChannelData(channel);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferLength; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.085;
          b6 = white * 0.115926;
        }
      }

      // Stereo Brown Noise Buffer (Deep rolling oceanic swells & surf roar)
      const oceanBuffer = ctx.createBuffer(2, bufferLength, sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const data = oceanBuffer.getChannelData(channel);
        let lastOut = 0.0;
        for (let i = 0; i < bufferLength; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + (0.022 * white)) / 1.022;
          data[i] = lastOut * 2.1;
        }
      }

      // =========================================================================
      // 2. RAINFALL AUDIO ENGINE (Steady shower + organic droplet impacts)
      // =========================================================================
      const rainSource = ctx.createBufferSource();
      rainSource.buffer = rainBuffer;
      rainSource.loop = true;

      const rainLowpass = ctx.createBiquadFilter();
      rainLowpass.type = "lowpass";
      rainLowpass.frequency.setValueAtTime(2400, now);

      const rainHighpass = ctx.createBiquadFilter();
      rainHighpass.type = "highpass";
      rainHighpass.frequency.setValueAtTime(350, now);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.24, now);
      rainGainRef.current = rainGain;

      rainSource.connect(rainHighpass);
      rainHighpass.connect(rainLowpass);
      rainLowpass.connect(rainGain);
      rainGain.connect(masterGain);

      rainSource.start();
      activeSourcesRef.current.push(rainSource, rainHighpass, rainLowpass, rainGain);

      // Micro-droplet resonators (droplets falling on leaves/tent)
      const spawnDroplet = () => {
        if (!ctx || ctx.state !== "running" || !rainGainRef.current) return;
        const currentRainVol = rainGainRef.current.gain.value;
        if (currentRainVol < 0.05) return; // Silent when rain is minimal

        const dropSource = ctx.createBufferSource();
        dropSource.buffer = rainBuffer;

        const dropFilter = ctx.createBiquadFilter();
        dropFilter.type = "bandpass";
        dropFilter.frequency.setValueAtTime(2800 + Math.random() * 2500, ctx.currentTime);
        dropFilter.Q.setValueAtTime(10 + Math.random() * 8, ctx.currentTime);

        const dropGain = ctx.createGain();
        const dropStart = ctx.currentTime;
        const dropVol = (0.015 + Math.random() * 0.03) * currentRainVol;
        dropGain.gain.setValueAtTime(dropVol, dropStart);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, dropStart + 0.04 + Math.random() * 0.04);

        dropSource.connect(dropFilter);
        dropFilter.connect(dropGain);
        dropGain.connect(masterGain);

        dropSource.start(dropStart);
        dropSource.stop(dropStart + 0.09);
      };

      const dropletTimer = setInterval(() => {
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
          setTimeout(spawnDroplet, i * 70 + Math.random() * 50);
        }
      }, 400);
      intervalsRef.current.push(dropletTimer);

      // =========================================================================
      // 3. SEA BEACH WAVES & COASTAL WIND ENGINE
      // =========================================================================
      const oceanSource = ctx.createBufferSource();
      oceanSource.buffer = oceanBuffer;
      oceanSource.loop = true;

      // Resonant Lowpass Filter for Ocean Surf
      const oceanFilter = ctx.createBiquadFilter();
      oceanFilter.type = "lowpass";
      oceanFilter.frequency.setValueAtTime(220, now);
      oceanFilter.Q.setValueAtTime(2.4, now);

      const oceanGain = ctx.createGain();
      oceanGain.gain.setValueAtTime(0.24, now);
      oceanGainRef.current = oceanGain;

      // Coastal Sea Breeze Bandpass Filter
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = "bandpass";
      windFilter.frequency.setValueAtTime(420, now);
      windFilter.Q.setValueAtTime(1.6, now);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.06, now);

      oceanSource.connect(oceanFilter);
      oceanFilter.connect(oceanGain);
      oceanGain.connect(masterGain);

      oceanSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);

      oceanSource.start();
      activeSourcesRef.current.push(oceanSource, oceanFilter, oceanGain, windFilter, windGain);

      // Rhythmic Wave Crash & Retreat Cycle (7.5 - 9.5 seconds per wave)
      const triggerWave = () => {
        if (!ctx || ctx.state !== "running") return;
        const t = ctx.currentTime;
        const waveDuration = 7.5 + Math.random() * 2.0;
        const crestTime = waveDuration * 0.40;

        // Wave swell up to crashing foam
        oceanFilter.frequency.cancelScheduledValues(t);
        oceanFilter.frequency.setValueAtTime(200, t);
        oceanFilter.frequency.linearRampToValueAtTime(750 + Math.random() * 200, t + crestTime);
        oceanFilter.frequency.linearRampToValueAtTime(190, t + waveDuration);

        // Coastal breeze gust with wave surge
        windFilter.frequency.cancelScheduledValues(t);
        windFilter.frequency.setValueAtTime(360, t);
        windFilter.frequency.linearRampToValueAtTime(560, t + crestTime * 0.85);
        windFilter.frequency.linearRampToValueAtTime(350, t + waveDuration);
      };

      triggerWave();
      const waveTimer = setInterval(triggerWave, 8200);
      intervalsRef.current.push(waveTimer);

      // =========================================================================
      // 4. DYNAMIC ATMOSPHERIC MIX-UP (কখনো বৃষ্টি বেশি, কখনো সাগর পাড়ের বাতাস ও ঢেউ)
      // =========================================================================
      let blendStep = 0;
      const blendCycle = () => {
        if (!ctx || ctx.state !== "running" || !rainGainRef.current || !oceanGainRef.current) return;
        const t = ctx.currentTime;
        const transitionDuration = 7.0; // 7 seconds velvet-smooth crossfade

        blendStep = (blendStep + 1) % 3;

        if (blendStep === 1) {
          // Mode 1: Rain Dominant (ঝুম বৃষ্টি বেশি, হালকা সাগরের ঢেউ)
          setCurrentAmbience("rain");
          rainGainRef.current.gain.cancelScheduledValues(t);
          rainGainRef.current.gain.linearRampToValueAtTime(0.40, t + transitionDuration);

          oceanGainRef.current.gain.cancelScheduledValues(t);
          oceanGainRef.current.gain.linearRampToValueAtTime(0.10, t + transitionDuration);
        } else if (blendStep === 2) {
          // Mode 2: Ocean Beach Waves & Wind Dominant (সাগর পাড়ের বাতাস ও ঢেউ বেশি, গুঁড়ি গুঁড়ি বৃষ্টি)
          setCurrentAmbience("ocean");
          rainGainRef.current.gain.cancelScheduledValues(t);
          rainGainRef.current.gain.linearRampToValueAtTime(0.08, t + transitionDuration);

          oceanGainRef.current.gain.cancelScheduledValues(t);
          oceanGainRef.current.gain.linearRampToValueAtTime(0.44, t + transitionDuration);
        } else {
          // Mode 0: Balanced Harmony (বৃষ্টি ও সাগরের ঢেউয়ের সমতা)
          setCurrentAmbience("balanced");
          rainGainRef.current.gain.cancelScheduledValues(t);
          rainGainRef.current.gain.linearRampToValueAtTime(0.25, t + transitionDuration);

          oceanGainRef.current.gain.cancelScheduledValues(t);
          oceanGainRef.current.gain.linearRampToValueAtTime(0.26, t + transitionDuration);
        }
      };

      const blendTimer = setInterval(blendCycle, 15000); // Shift atmospheric balance every 15s
      intervalsRef.current.push(blendTimer);

      return () => {
        stopAudio();
      };
    } catch {
      // AudioContext policy
    }
  }, [isPlaying]);

  const getAmbienceLabel = () => {
    if (!isPlaying) return "বৃষ্টি ও সাগর পাড়ের প্রাকৃতিক সাউন্ড অন করুন";
    if (currentAmbience === "rain") return "প্রাকৃতিক সাউন্ড: ঝুম বৃষ্টি প্রাধান্য (সাগরের ব্যাকগ্রাউন্ড)";
    if (currentAmbience === "ocean") return "প্রাকৃতিক সাউন্ড: সাগর পাড়ের বাতাস ও ঢেউ প্রাধান্য";
    return "প্রাকৃতিক সাউন্ড: বৃষ্টি ও সাগরের ঢেউয়ের সমাহার";
  };

  return (
    <button
      onClick={() => {
        setHasInteracted(true);
        onToggle();
      }}
      className={`group relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 border cursor-pointer active:scale-95 ${
        isPlaying
          ? isLight
            ? "bg-sky-100 hover:bg-sky-200/80 border-sky-300 text-sky-600 shadow-[0_0_15px_rgba(2,132,199,0.25)]"
            : "bg-sky-500/20 hover:bg-sky-500/30 border-sky-400/60 text-[#38bdf8] shadow-[0_0_18px_rgba(56,189,248,0.4)]"
          : isLight
            ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-sky-600 shadow-sm"
            : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
      }`}
      aria-label={isPlaying ? "সাউন্ড বন্ধ করুন" : "বৃষ্টি ও সাগরের প্রাকৃতিক অ্যাম্বিয়েন্ট সাউন্ড অন করুন"}
      title={getAmbienceLabel()}
    >
      {isPlaying ? (
        <div className="flex items-center justify-center relative">
          <Volume2 className={`w-4 h-4 animate-pulse ${isLight ? "text-sky-600" : "text-[#38bdf8]"}`} />
          {/* Subtle micro nature indicator */}
          <span className="absolute -bottom-1 -right-1 flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isLight ? "bg-sky-600" : "bg-[#38bdf8]"}`}></span>
          </span>
        </div>
      ) : (
        <VolumeX className={`w-4 h-4 transition-colors ${isLight ? "text-slate-500 group-hover:text-sky-600" : "text-slate-400 group-hover:text-[#38bdf8]"}`} />
      )}

      {!hasInteracted && !isPlaying && (
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
      )}
    </button>
  );
}
