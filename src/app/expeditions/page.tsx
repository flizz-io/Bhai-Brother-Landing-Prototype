"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Compass,
  Search,
} from "lucide-react";
import { initialExpeditions } from "@/data/toursData";

export default function AllExpeditionsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "সকল ট্যুর ডায়েরি", count: initialExpeditions.length },
    { id: "Hills", label: "পাহাড় ও সামিট", count: initialExpeditions.filter((t) => t.type === "Hills").length },
    { id: "Beach", label: "সমুদ্র ও সৈকত", count: initialExpeditions.filter((t) => t.type === "Beach").length },
    { id: "Wetland", label: "লেক ও হাওড়", count: initialExpeditions.filter((t) => t.type === "Wetland").length },
  ];

  const filteredExpeditions = initialExpeditions.filter((tour) => {
    const matchesCategory = activeCategory === "all" || tour.type === activeCategory;
    const matchesSearch =
      tour.bengaliTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="expeditions-directory" className="min-h-screen bg-[#040d1a] text-white selection:bg-[#38bdf8] selection:text-[#040d1a]">
      {/* Floating Ultra-Premium Capsule Header */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl transition-all duration-300">
        <div className="relative rounded-full bg-[#040e1f]/85 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.18)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#38bdf8]/60 to-transparent pointer-events-none rounded-full" />
          <Link
            href="/#expeditions"
            className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors group shrink-0"
          >
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#0284c7] transition-all">
              <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
            </span>
            <span className="hidden sm:inline">হোমপেজে ফিরে যান</span>
            <span className="sm:hidden">হোম</span>
          </Link>

          <Link href="/" className="font-['Outfit'] font-black text-base sm:text-lg text-white hover:text-[#38bdf8] tracking-tight transition-colors">
            Bhai Brothers
          </Link>

          <div className="text-xs font-mono text-[#38bdf8] px-3.5 py-1 rounded-full bg-[#0284c7]/20 border border-[#38bdf8]/40 shadow">
            ১২টি পূর্ণ সফর
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284c7]/15 border border-[#38bdf8]/30 text-[#bae6fd] text-xs font-bold tracking-widest uppercase mb-4">
          <Compass className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>ALL BROTHERHOOD EXPEDITIONS ARCHIVE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 font-['Outfit']">
          আমাদের স্মরণীয় <span className="text-[#38bdf8]">সকল ট্যুর ডায়েরি</span>
        </h1>
        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto font-['Hind_Siliguri'] leading-relaxed">
          ২০২১ থেকে শুরু করে ২০২৪—বাংলাদেশের প্রতিটি পাহাড়ি ট্রেইল, সমুদ্রের নির্জন সৈকত এবং বিস্তীর্ণ হাওড়ে ভাইদের অবিস্মরণীয় পদচিহ্ন ও যৌথ ইতিহাস।
        </p>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-10 p-5 rounded-[28px] bg-white/[0.02] border border-white/8">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#38bdf8] font-['Outfit']">১২+</div>
            <div className="text-[11px] text-gray-400 font-['Hind_Siliguri'] mt-0.5">সম্পন্ন অভিযান</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-['Outfit']">৬৪,০০০+</div>
            <div className="text-[11px] text-gray-400 font-['Hind_Siliguri'] mt-0.5">কিলোমিটার রোড জার্নি</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-300 font-['Outfit']">১৩ জন</div>
            <div className="text-[11px] text-gray-400 font-['Hind_Siliguri'] mt-0.5">অটুট ভাই ব্রাদার্স</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-['Outfit']">১০০%</div>
            <div className="text-[11px] text-gray-400 font-['Hind_Siliguri'] mt-0.5">স্মরণীয় মেমোরিজ</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-12 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#0284c7] text-white shadow-[0_0_20px_rgba(2,132,199,0.5)] scale-105"
                      : "bg-white/5 text-gray-300 border border-white/10 hover:border-[#38bdf8]/40 hover:text-white"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="ml-1.5 opacity-70 text-[10px] font-mono">({cat.count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ট্যুর বা লোকেশন খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* All Tours Grid - Pure Minimal Apple Style */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-36">
        {filteredExpeditions.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <Compass className="w-12 h-12 mx-auto text-slate-500 mb-3 opacity-40 animate-pulse" />
            <p className="text-sm font-['Hind_Siliguri']">কোনো ট্যুর ডায়েরি খুঁজে পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredExpeditions.map((item) => (
              <Link
                key={item.id}
                href={`/expeditions/${item.id}`}
                className="group relative min-h-[480px] sm:min-h-[520px] rounded-[32px] sm:rounded-[36px] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_65px_rgba(0,0,0,0.7)] cursor-pointer flex flex-col justify-between p-7 sm:p-8 block"
              >
                {/* Full Bleed Background Image */}
                <Image
                  src={item.coverImage}
                  alt={item.bengaliTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0"
                />

                {/* Vignette & Contrast Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020a14] via-[#020a14]/40 via-60% to-transparent pointer-events-none z-[1]" />

                {/* Top Row: Category Tag & Circular Arrow */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/95 bg-black/40 backdrop-blur-md border border-white/15 shadow-sm">
                    {item.typeLabel}
                  </span>

                  <div className="w-10 h-10 rounded-full bg-white/95 text-[#061526] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-[#38bdf8] group-hover:text-[#061526]">
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Bottom: Title & Subtitle Only */}
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-[26px] font-bold text-white mb-2 group-hover:text-[#38bdf8] transition-colors font-['Outfit'] tracking-tight leading-snug">
                    {item.bengaliTitle}
                  </h3>
                  <p className="text-sm text-slate-300 font-['Hind_Siliguri']">
                    {item.location} • {item.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-xs text-gray-500 font-mono">
        © {new Date().getFullYear()} Travel with Bhai Brothers • All 12+ Expeditions Preserved
      </footer>
    </div>
  );
}
