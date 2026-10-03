"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TourExpedition } from "@/data/toursData";
import { X, Calendar, MapPin, DollarSign, Clock, Users, Sparkles, CheckCircle2, Laugh, ArrowRight } from "lucide-react";
import { HugeiconsIcon, Camera01Icon, Calendar01Icon, SparklesIcon } from "@/components/HugeIcon";

interface TripDetailModalProps {
  expedition: TourExpedition | null;
  onClose: () => void;
}

export default function TripDetailModal({ expedition, onClose }: TripDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!expedition) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#07192f] border border-[#38bdf8]/30 rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-[0_0_80px_rgba(56,189,248,0.25)] my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white border border-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Banner */}
        <div className="relative w-full h-64 sm:h-80">
          <Image
            src={expedition.coverImage}
            alt={expedition.bengaliTitle}
            fill
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07192f] via-[#07192f]/40 to-transparent" />

          {/* Banner Text Overlays */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0284c7] text-white shadow">
                {expedition.typeLabel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono text-gray-300 bg-black/60 backdrop-blur-md border border-white/10">
                {expedition.elevationOrDistance}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 font-['Outfit']">
              {expedition.bengaliTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300">
              <span className="flex items-center gap-1.5 text-[#38bdf8]">
                <MapPin className="w-4 h-4 text-[#38bdf8]" />
                {expedition.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-300" />
                {expedition.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                {expedition.duration}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#38bdf8] font-mono">
                <DollarSign className="w-4 h-4" />
                আনুমানিক খরচ: {expedition.approxCostPerHead}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          {/* Summary */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 font-['Outfit']">
              <Sparkles className="w-4 h-4 text-[#38bdf8]" />
              ট্যুরের স্মৃতি সংক্ষেপ
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-['Hind_Siliguri']">
              {expedition.summary}
            </p>
          </div>

          {/* Attended Squad */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2 font-['Outfit']">
              <Users className="w-4 h-4 text-[#38bdf8]" />
              এই অভিযানে উপস্থিত ভাই-ব্রাদার্স স্কোয়াড
            </h3>
            <div className="flex flex-wrap gap-2">
              {expedition.squadMembers.map((name, i) => (
                <div
                  key={i}
                  className="px-3.5 py-1.5 rounded-full bg-[#0b2545] border border-[#38bdf8]/30 text-[#bae6fd] text-xs font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day-Wise Itinerary */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 font-['Outfit'] flex items-center gap-2">
              <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-[#38bdf8]" />
              <span>দিনভিত্তিক রুট ও গল্প (Day-by-Day Journey)</span>
            </h3>
            <div className="space-y-4">
              {expedition.dayWiseItinerary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-[#38bdf8]/40 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#0284c7]/20 text-[#38bdf8] border border-[#38bdf8]/30">
                      {item.day}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-white font-['Outfit']">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed pl-1 font-['Hind_Siliguri']">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 font-['Outfit'] flex items-center gap-2">
              <HugeiconsIcon icon={SparklesIcon} size={18} className="text-amber-400" />
              <span>স্মরণীয় মুহূর্ত ও অর্জন</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {expedition.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 p-2.5 rounded-xl bg-white/[0.02]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="font-['Hind_Siliguri']">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Funny Bloopers Section */}
          <div className="p-5 rounded-2xl bg-sky-950/25 border border-[#38bdf8]/30">
            <h3 className="text-base font-bold text-[#38bdf8] mb-2 flex items-center gap-2 font-['Outfit']">
              <Laugh className="w-5 h-5 text-[#38bdf8]" />
              গোপন ব্লুপার্স ও মজার মুহূর্ত (Bloopers & Secrets)
            </h3>
            <p className="text-sm text-sky-100/90 leading-relaxed italic font-['Hind_Siliguri']">
              “{expedition.bloopers}”
            </p>
          </div>

          {/* Gallery Snapshots */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2 font-['Outfit']">
              <HugeiconsIcon icon={Camera01Icon} size={18} className="text-[#38bdf8]" />
              <span>ফটো স্ন্যাপশটস</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expedition.gallery.map((img, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden border border-white/10">
                  <div className="relative h-48 w-full">
                    <Image
                      src={img.url}
                      alt={img.caption}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2.5 bg-black/80 text-[11px] text-gray-300">
                    {img.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar: Deep Route Exploration */}
          <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-mono hidden sm:block">
              EXPEDITION // {expedition.id.toUpperCase()}
            </div>
            <Link
              href={`/expeditions/${expedition.id}`}
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-cyan-400 text-[#040d1a] font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] cursor-pointer"
            >
              <span>সম্পূর্ণ ইন্টারেক্টিভ রোড ট্রিপ ও বিস্তারিত ডায়েরি দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
