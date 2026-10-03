"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  X,
  MapPin,
  Shield,
  Award,
  Zap,
  Coffee,
  Briefcase,
  AlertCircle,
  Quote,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { SquadMember } from "../data/toursData";

interface BrotherProfileModalProps {
  brother: SquadMember | null;
  onClose: () => void;
}

export default function BrotherProfileModal({
  brother,
  onClose,
}: BrotherProfileModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (brother) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [brother, onClose]);

  if (!brother) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#07192f] border border-[#38bdf8]/35 rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-[0_0_80px_rgba(56,189,248,0.3)] my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scroll Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Header Banner with Real Image */}
          <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-slate-900">
            <Image
              src={brother.image}
              alt={brother.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover object-top"
            />
            {/* Cinematic Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07192f] via-[#07192f]/50 via-55% to-black/30 pointer-events-none" />

            {/* Floating Top Badge */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-black/50 backdrop-blur-md border border-[#38bdf8]/40 text-[#38bdf8] flex items-center gap-1.5 shadow-md">
                <Shield className="w-3.5 h-3.5" />
                <span>{brother.badge}</span>
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[#0284c7] text-white shadow">
                {brother.tripsCount}টি ট্যুর সম্পন্ন
              </span>
            </div>

            {/* Bottom Floating Info Over Image */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs font-mono text-[#38bdf8] mb-1 font-semibold flex items-center gap-2">
                <span>{brother.role}</span>
                <span className="text-white/30">•</span>
                <span className="text-amber-300 font-bold">{brother.nickname}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
                {brother.name}
              </h2>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 sm:p-8 space-y-7">
            {/* Quick Passport / ID Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/8 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">রক্তের গ্রুপ</span>
                <span className="font-bold text-rose-400 font-mono text-sm">{brother.bloodGroup}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">হোম ডিস্ট্রিক্ট</span>
                <span className="font-semibold text-white">{brother.homeDistrict}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">ট্যুর অভিজ্ঞতা</span>
                <span className="font-bold text-[#38bdf8] font-mono text-sm">{brother.tripsCount}টি পূর্ণ অভিযান</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">প্রিয় স্পট</span>
                <span className="font-semibold text-emerald-300 truncate block">{brother.favoriteSpot}</span>
              </div>
            </div>

            {/* Quote */}
            <div className="relative p-5 rounded-2xl bg-[#0b2545]/60 border-l-4 border-[#38bdf8] shadow-sm">
              <Quote className="w-5 h-5 text-[#38bdf8]/60 mb-1" />
              <p className="text-sm sm:text-base text-gray-200 italic font-['Hind_Siliguri'] leading-relaxed">
                “{brother.quote}”
              </p>
            </div>

            {/* Bio & Origin */}
            <div>
              <h4 className="text-xs font-bold text-[#38bdf8] tracking-widest uppercase mb-2 flex items-center gap-1.5 font-mono">
                <Briefcase className="w-4 h-4" />
                <span>ব্রাদারহুড পরিচিতি ও ব্যাকগ্রাউন্ড</span>
              </h4>
              <p className="text-sm text-gray-300 font-['Hind_Siliguri'] leading-relaxed">
                {brother.bio}
              </p>
            </div>

            {/* Superpower & Weakness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1.5">
                  <Zap className="w-4 h-4" />
                  <span>সুপারপাওয়ার (Superpower)</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-['Hind_Siliguri']">
                  {brother.superpower}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/25">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-1.5">
                  <Coffee className="w-4 h-4" />
                  <span>মিষ্টি দুর্বলতা (Funny Weakness)</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-['Hind_Siliguri']">
                  {brother.weakness}
                </p>
              </div>
            </div>

            {/* Signature Gear & Gadgets */}
            <div>
              <h4 className="text-xs font-bold text-[#38bdf8] tracking-widest uppercase mb-3 flex items-center gap-1.5 font-mono">
                <Shield className="w-4 h-4" />
                <span>সিগনেচার ট্রাভেল গিয়ার ও অস্ত্র</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {brother.signatureGear.map((gear, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.05] border border-white/12 text-slate-200 flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>{gear}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Tours Attended */}
            <div>
              <h4 className="text-xs font-bold text-[#38bdf8] tracking-widest uppercase mb-3 flex items-center gap-1.5 font-mono">
                <Compass className="w-4 h-4" />
                <span>যেসব অভিযানে উপস্থিত ছিলেন</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {brother.completedTrips.map((trip, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1 rounded-full text-xs font-medium bg-[#0284c7]/20 border border-[#38bdf8]/35 text-[#bae6fd] flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-[#38bdf8]" />
                    <span>{trip}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Progress */}
            <div>
              <h4 className="text-xs font-bold text-[#38bdf8] tracking-widest uppercase mb-3 flex items-center gap-1.5 font-mono">
                <Award className="w-4 h-4" />
                <span>দক্ষতা ও অ্যাট্রিবিউটস</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {brother.skills.map((skill, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between text-xs text-gray-300 mb-1.5">
                      <span>{skill.label}</span>
                      <span className="font-mono font-bold text-[#38bdf8]">{skill.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] rounded-full transition-all duration-1000"
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hilarious Blooper */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-amber-300 uppercase mb-1">স্মরণীয় ট্যুর ব্লুপার (Funny Moment)</h5>
                <p className="text-xs sm:text-sm text-gray-300 font-['Hind_Siliguri'] leading-relaxed">
                  {brother.funnyBlooper}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
