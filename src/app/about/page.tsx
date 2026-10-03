"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BrotherProfileModal from "@/components/BrotherProfileModal";
import { initialSquad, SquadMember } from "@/data/toursData";
import {
  HugeiconsIcon,
  Compass01Icon,
  Coins01Icon,
  LaughingIcon,
  SparklesIcon,
  HeartIcon,
  BROTHER_HUGEICONS,
} from "@/components/HugeIcon";
import {
  ArrowUpRight,
  Compass,
  Shield,
  HeartHandshake,
  Mountain,
  Flame,
  Coffee,
  Users,
  Quote,
  ArrowRight,
  ArrowUp,
  History,
  Check,
} from "lucide-react";

// Categorization helper for the 13 brothers
const SQUAD_CATEGORIES = [
  { id: "all", label: "সকল ভাই", count: 13 },
  { id: "leadership", label: "নেভিগেশন ও লিডারশিপ", count: 3 },
  { id: "culinary", label: "শেফ ও ক্যাম্পফায়ার", count: 2 },
  { id: "creative", label: "সিনেমা ও আর্টস", count: 4 },
  { id: "logistics", label: "লজিস্টিকস ও টেক", count: 4 },
];

const MEMBER_CATEGORY_MAP: Record<string, string> = {
  rakib: "leadership",
  ahnaf: "leadership",
  riyad: "leadership",
  tanvir: "culinary",
  zubair: "culinary",
  shakil: "creative",
  fahim: "creative",
  asif: "creative",
  ariyan: "creative",
  mahim: "logistics",
  imtiaz: "logistics",
  nabil: "logistics",
  sourav: "logistics",
};

export default function AboutUsPage() {
  const [selectedBrother, setSelectedBrother] = useState<SquadMember | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Filter squad list
  const filteredSquad = initialSquad.filter((member) => {
    if (activeCategory === "all") return true;
    return MEMBER_CATEGORY_MAP[member.id] === activeCategory;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#040d1a] text-white selection:bg-[#38bdf8] selection:text-[#040d1a]">
      {/* Top Floating Island Capsule Navbar */}
      <Navbar
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
      />

      {/* =========================================================================
          HERO SECTION: The Brotherhood Origin & Manifesto
      ========================================================================= */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden">
        {/* Background Atmosphere Image with High-End Cinematic Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_campfire.jpg"
            alt="Bhai Brothers Campfire Under Stars"
            fill
            priority
            className="object-cover object-center opacity-25 scale-105 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040d1a]/80 via-[#040d1a]/95 to-[#040d1a]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#0284c7]/20 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb Navigation Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md text-xs text-slate-300 mb-6">
            <Link href="/" className="hover:text-[#38bdf8] transition-colors flex items-center gap-1.5">
              <span>হোমপেজ</span>
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-[#38bdf8] font-medium">আমাদের গল্প ও ম্যানিফেস্টো</span>
          </div>

          {/* Glowing Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284c7]/20 border border-[#38bdf8]/40 shadow-[0_0_25px_rgba(56,189,248,0.25)]">
              <HugeiconsIcon icon={SparklesIcon} size={15} className="text-amber-400" />
              <span className="text-xs sm:text-sm font-semibold text-[#38bdf8] tracking-wide font-['Outfit']">
                JOULESLABS TO MOUNTAIN TRAILS • THE REAL STORY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Grand Bengali Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight leading-[1.18] max-w-4xl mx-auto mb-6">
            অফিসের কিউবিকল আর মিরপুর ১২-এর টং থেকে শুরু—{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-sky-200 to-teal-300">
              যেখানে কোডিং শেষ, সেখান থেকেই ভাইদের পাহাড়ি রোমাঞ্চের পদচিহ্ন শুরু।
            </span>
          </h1>

          {/* Emotional Storyteller Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-['Hind_Siliguri'] leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
            আমাদের শুরুটা কোনো সাধারণ ট্রাভেল এজেন্সির মতো নয়। আমরা সবাই <strong>JoulesLabs</strong>-এর সফটওয়্যার ইঞ্জিনিয়ার, আর সাথে দলের একমাত্র ক্রিয়েটিভ ডিজাইনার আমাদের প্রিয় <strong>মেহেদী</strong>। সারাদিন কোডিং আর বাগ ফিক্সিংয়ের পর মিরপুর ১২-এর চায়ের দোকানে গড়ে উঠেছিল আমাদের প্রাণবন্ত আড্ডা হাব। কিন্তু ভ্রমণের মূল সূচনাটা হয়েছিল ফাহাদ ভাইয়ের বাসার ছাদে এক রাতে ধোঁয়া ওঠা বারবিকিউ পার্টি থেকে—সেখান থেকেই ঘুরতে পাগল রিয়াদ ভাই আর নাঈম ভাইয়ের ট্রাভেল উন্মাদনায় শুরু হয় &apos;Travel with Bhai Brothers&apos;!
          </p>

          {/* Live High-Contrast Stat Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-12">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-[#38bdf8]/40 transition-all group">
              <div className="text-xl sm:text-2xl font-black text-[#38bdf8] font-['Outfit'] group-hover:scale-105 transition-transform">
                JoulesLabs
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-['Hind_Siliguri'] font-medium">
                যে অফিস থেকে বন্ধুত্বের সূচনা
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-[#38bdf8]/40 transition-all group">
              <div className="text-xl sm:text-2xl font-black text-sky-300 font-['Outfit'] group-hover:scale-105 transition-transform">
                মিরপুর ১২ টং
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-['Hind_Siliguri'] font-medium">
                প্রতিদিনের মূল আড্ডা হাব
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-[#38bdf8]/40 transition-all group">
              <div className="text-xl sm:text-2xl font-black text-teal-300 font-['Outfit'] group-hover:scale-105 transition-transform">
                ছাদের বারবিকিউ
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-['Hind_Siliguri'] font-medium">
                ফাহাদ ভাইয়ের ছাদে ট্যুর প্ল্যানের জন্ম
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-[#38bdf8]/40 transition-all group">
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-['Outfit'] group-hover:scale-105 transition-transform">
                রিয়াদ ও নাঈম ভাই
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-['Hind_Siliguri'] font-medium">
                ট্যুরের মূল অনুপ্রেরণা ও কাণ্ডারী
              </div>
            </div>
          </div>

          {/* Quick Jump Action Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-['Hind_Siliguri'] font-semibold">
            <a
              href="#timeline"
              className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#38bdf8]/50 text-slate-200 hover:text-white transition-all shadow-sm"
            >
              আসল শুরু ও মাইলফলক
            </a>
            <a
              href="#commandments"
              className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#38bdf8]/50 text-slate-200 hover:text-white transition-all shadow-sm"
            >
              ভ্রাতৃত্বের ৪ অলিখিত নীতি
            </a>
            <a
              href="#squad-roster"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white hover:brightness-110 transition-all shadow-[0_0_20px_rgba(56,189,248,0.35)]"
            >
              স্কোয়াড ভাইদের রোস্টার
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ORIGIN STORY & MILESTONE TIMELINE
      ========================================================================= */}
      <section id="timeline" className="py-20 sm:py-28 relative border-t border-white/5 bg-[#030914]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium mb-3">
              <History className="w-3.5 h-3.5" />
              <span>THE TRUE ORIGIN & TIMELINE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight mb-4">
              JoulesLabs ও মিরপুর ১২-এর টং থেকে পাহাড়ি সামিট
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-['Hind_Siliguri'] leading-relaxed">
              সফটওয়্যার ইঞ্জিনিয়ারদের কোডিং স্ক্রিন আর একাকী ডিজাইনারের খুনসুটি থেকে কীভাবে জন্ম নিলো অবিচ্ছেদ্য ভাই-ব্রাদার্স পরিবার।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Story Narrative Card */}
            <div className="timeline-story-card lg:col-span-5 rounded-[28px] bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#0284c7]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#0284c7]/20 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
                  <Flame className="w-6 h-6 text-[#38bdf8]" />
                </div>
                <div>
                  <h3 className="story-card-title text-lg font-bold text-white font-['Outfit']">JoulesLabs থেকে মিরপুর ১২-এর টং</h3>
                  <span className="story-card-subtitle text-xs text-slate-400 font-mono">The Untold True Story</span>
                </div>
              </div>

              <div className="story-card-body space-y-4 text-sm text-slate-300 font-['Hind_Siliguri'] leading-relaxed">
                <p>
                  আমাদের ভাই-ব্রাদার্সদের এই জার্নির শুরুটা কোনো পাহাড়ে বা স্টেশনে হয়নি; হয়েছিল একটা সফটওয়্যার কোম্পানির ৪ দেওয়ালের ভেতর—<strong>JoulesLabs</strong>-এ। আমরা প্রায় সবাই ছিলাম একঝাঁক কোড-পাগল সফটওয়্যার ইঞ্জিনিয়ার, আর আমাদের দলের একমাত্র ডিজাইনার ছিল <strong>মেহেদী</strong> (যাকে আমরা ডিজাইনের খুঁটিনাটি নিয়ে একাই পেয়ে সবসময় ট্রল করতাম আর অফুরন্ত ভালোবাসা দিতাম!)।
                </p>
                <p>
                  সারাদিন প্রজেক্ট ডেডলাইন আর পুল রিকোয়েস্টের ফাঁকে আমাদের আসল আড্ডা জমে উঠতো <strong>মিরপুর ১২</strong>-এর সেই চিরচেনা চায়ের দোকানে। সেখানে মাটির কাপের চায়ের চুমুকে ঝড় তুলতো কোডের আর্কিটেকচার, লাইফের গল্প আর অমলিন হাসি। মিরপুর ১২ হয়ে উঠলো আমাদের ভালোবাসার অভিন্ন হাব।
                </p>
                <p>
                  কিন্তু কোডিং স্ক্রিন ছেড়ে আমরা পাহাড়ে যাওয়ার প্ল্যানটা করলাম কীভাবে? সেই ঐতিহাসিক টার্নিং পয়েন্টটা ঘটেছিল <strong>ফাহাদ ভাইয়ের বাসার ছাদে</strong>! এক রাতে সবাই মিলে আয়োজন করেছিলাম জমজমাট বারবিকিউ পার্টি। কয়লার ধোঁয়া, রোস্টের সুবাস আর তুমুল আড্ডার মাঝেই <strong>রিয়াদ ভাই আর নাঈম ভাই</strong>—যাঁরা ঘুরতে ভীষণ ভালোবাসতেন—হুট করে ট্যুরের প্রস্তাব তুললেন। ব্যাস, ছাদের সেই রাতেই কোডাররা ঠিক করে ফেললো—এবার আর ল্যাপটপ নয়, গন্তব্য হবে পাহাড়ের চূড়া!
                </p>
              </div>

              {/* Quote Block */}
              <div className="story-quote-block mt-6 pt-6 border-t border-white/10 relative">
                <Quote className="story-quote-icon w-8 h-8 text-[#38bdf8]/30 absolute top-4 right-2" />
                <p className="story-quote-text text-xs sm:text-sm italic text-sky-200 font-['Hind_Siliguri'] leading-relaxed">
                  “সারাদিন কিবোর্ড চাপড়ে বাগ ফিক্স করা ইঞ্জিনিয়াররা যেদিন ফাহাদ ভাইয়ের ছাদে বারবিকিউ খেতে খেতে রিয়াদ ভাই আর নাঈম ভাইয়ের ডাকে ব্যাকপ্যাক গোছালো—সেদিনই জন্ম নিয়েছিল আমাদের ভাই-ব্রাদার্স ট্রাভেল কাফেলা!”
                </p>
                <div className="story-quote-author mt-3 text-xs font-semibold text-slate-400 font-['Outfit']">
                  — JoulesLabs ব্রাদারহুড মেমোরিজ
                </div>
              </div>
            </div>

            {/* Right Interactive Timeline Cards */}
            <div className="lg:col-span-7 space-y-6">
              {[
                {
                  year: "২০১৮",
                  tag: "অফিস ও টং আড্ডা",
                  title: "JoulesLabs ও মিরপুর ১২-এর চায়ের হাব",
                  desc: "সফটওয়্যার ইঞ্জিনিয়ারদের কোডিং জ্যাম আর একমাত্র ডিজাইনার মেহেদীর সাথে প্রতিদিনের খুনসুটি। অফিস শেষে মিরপুর ১২-এর টঙে ঘণ্টার পর ঘণ্টা আড্ডায় এক আত্মিক বন্ধনের সৃষ্টি।",
                  accent: "border-sky-500/40 text-sky-400",
                },
                {
                  year: "২০১৯",
                  tag: "টার্নিং পয়েন্ট",
                  title: "ফাহাদ ভাইয়ের ছাদের বারবিকিউ — ট্যুর প্ল্যানের জন্ম",
                  desc: "ফাহাদ ভাইয়ের বাসার ছাদে গভীর রাত পর্যন্ত স্পাইসি বারবিকিউ পার্টি। সেখানেই ঘুরতে পাগল রিয়াদ ভাই ও নাঈম ভাই প্রথম পাহাড়ি ট্যুরের প্রস্তাব সবার সামনে আনেন এবং দল রাজি হয়ে যায়।",
                  accent: "border-amber-500/40 text-amber-400",
                },
                {
                  year: "২০২০",
                  tag: "রিয়াদ ও নাঈমের কাণ্ডারী রূপ",
                  title: "কোড ছেড়ে ব্যাকপ্যাকে — প্রথম পাহাড়ি রোমাঞ্চ",
                  desc: "ঘুরতে দারুণ পছন্দ করা রিয়াদ ভাই ও নাঈম ভাইয়ের পরিচালনায় সফটওয়্যার ইঞ্জিনিয়াররা মনিটর ছেড়ে পাহাড়ি চাঁদের গাড়ির ছাদে উঠলো। খাগড়াছড়ি ও সাজেক মেঘের সাগরে প্রথম সফল পদচিহ্ন।",
                  accent: "border-emerald-500/40 text-emerald-400",
                },
                {
                  year: "২০২২ - ২০২৪",
                  tag: "অভিযানের বিস্তার",
                  title: "কেওক্রাডং, নাফাখুম ও হাইল্যান্ড হাইওয়ে",
                  desc: "জুতা ছিঁড়ে দড়ি বাঁধা, পাথুরে ঝিরিপথে নদী পার হওয়া আর এক বেলার ডাল-ভাত সবাই মিলে ভাগাভাগি। অফিস কলিগ থেকে ভাই-ব্রাদার্স এক অটুট আত্মিক পরিবারে রূপান্তর।",
                  accent: "border-cyan-500/40 text-cyan-400",
                },
                {
                  year: "২০২৬+",
                  tag: "আগামীর বাকেট লিস্ট",
                  title: "মিরপুর ১২ থেকে অন্নপূর্ণা ও কাঞ্চনজঙ্ঘা",
                  desc: "মিরপুর ১২-এর টং থেকে শুরু হওয়া দলটির অন্নপূর্ণা ও কাঞ্চনজঙ্ঘার আন্তর্জাতিক সামিট ছোঁয়ার স্বপ্ন। বন্ধুত্ব যখন সীমানা ছাড়িয়ে বৈশ্বিক রোমাঞ্চের পথে পা বাড়ায়।",
                  accent: "border-purple-500/40 text-purple-400",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="timeline-event-card group relative p-5 sm:p-6 rounded-2xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/10 hover:border-[#38bdf8]/40 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="timeline-year font-['Outfit'] font-black text-xl sm:text-2xl text-white">
                        {item.year}
                      </span>
                      <span className={`timeline-tag px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border bg-white/[0.02] ${item.accent}`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                  <h4 className="timeline-title text-base sm:text-lg font-bold text-white font-['Outfit'] mb-2 group-hover:text-[#38bdf8] transition-colors">
                    {item.title}
                  </h4>
                  <p className="timeline-desc text-xs sm:text-sm text-slate-300 font-['Hind_Siliguri'] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 4 SACRED COMMANDMENTS (BENTO GRID)
      ========================================================================= */}
      <section id="commandments" className="py-20 sm:py-28 relative border-t border-white/5 bg-[#040d1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284c7]/15 border border-[#38bdf8]/30 text-[#38bdf8] text-xs font-mono font-medium mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>THE 4 SACRED COMMANDMENTS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight mb-4">
              ভাই ব্রাদার্স ভ্রাতৃত্বের ৪টি অলিখিত পবিত্র নিয়ম
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-['Hind_Siliguri'] leading-relaxed">
              যে নীতিগুলো কোনো খাতায় লেখা নেই, কিন্তু প্রতিটি ভাইয়ের হৃদয়ে পাথরের মতো খোদাই করা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rule 1 */}
            <div className="commandment-card p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-emerald-400 tracking-wider uppercase mb-1">
                নিয়ম ১ • ১০০% সেফটি গ্যারান্টি
              </div>
              <h3 className="commandment-title text-xl font-bold text-white font-['Outfit'] mb-3">
                নো ব্রাদার লেফট বিহাইন্ড (No Brother Left Behind)
              </h3>
              <p className="commandment-desc text-sm text-slate-300 font-['Hind_Siliguri'] leading-relaxed mb-4">
                পাহাড়ের খাড়া চড়াইয়ে একজনও যদি ক্লান্তি বা ইনজুরিতে পিছিয়ে পড়ে, পুরো কাফেলা সেখানে বসে বিশ্রাম নেবে। একা সামিটে উঠে সেলফি তোলার চেয়ে সবাইকে সাথে নিয়ে নিরাপদে ফিরে আসা আমাদের সবচেয়ে বড় জয়।
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <Check className="w-3.5 h-3.5" />
                <span>ব্যক্তিগত অহংকারের ঊর্ধ্বে ভাইয়ের নিরাপত্তা</span>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="commandment-card p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-[#38bdf8]/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#0284c7]/20 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] mb-6 group-hover:scale-110 transition-transform">
                <HugeiconsIcon icon={Coins01Icon} size={24} />
              </div>
              <div className="text-xs font-mono text-[#38bdf8] tracking-wider uppercase mb-1">
                নিয়ম ২ • ভ্রাতৃত্বের স্বচ্ছতা
              </div>
              <h3 className="commandment-title text-xl font-bold text-white font-['Outfit'] mb-3">
                স্বচ্ছ হিসাব ও ভ্রাতৃত্বের হাত (Transparent Ledger)
              </h3>
              <p className="commandment-desc text-sm text-slate-300 font-['Hind_Siliguri'] leading-relaxed mb-4">
                টাকার টানাপোড়েনের কারণে আমাদের কোনো ভাই কখনো ট্যুর মিস করেনি, ভবিষ্যতেও করবে না। প্রতিটি পয়সার হিসাব যেমন প্রকাশ্য, তেমনি সামর্থ্যবান ভাইয়েরা সবসময় নিঃশব্দে ভালোবাসার চাদর হয়ে পাশে দাঁড়ায়।
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#38bdf8]">
                <Check className="w-3.5 h-3.5" />
                <span>জিরো সিক্রেট • ১০০% পারস্পরিক শ্রদ্ধা</span>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="commandment-card p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-teal-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <Mountain className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-teal-400 tracking-wider uppercase mb-1">
                নিয়ম ৩ • গ্রিন ট্রাভেল এথিকস
              </div>
              <h3 className="commandment-title text-xl font-bold text-white font-['Outfit'] mb-3">
                প্রকৃতির পবিত্রতা ও নিঃশব্দ পদচিহ্ন (Leave No Trace)
              </h3>
              <p className="commandment-desc text-sm text-slate-300 font-['Hind_Siliguri'] leading-relaxed mb-4">
                আমরা পাহাড়ে বা পাহাড়ি নদীতে শুধু আমাদের পায়ের ছাপ রেখে আসি, আর আমাদের আনা চিপসের প্যাকেট ও প্লাস্টিকের বোতল ব্যাগে ভরে শহরে ফিরিয়ে আনি। প্রকৃতির ক্ষতি করে কোনো ভ্রমণ কখনোই মহৎ হতে পারে না।
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-300">
                <Check className="w-3.5 h-3.5" />
                <span>জিরো প্লাস্টিক ট্রেইল পলিসি</span>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="commandment-card p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-amber-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <HugeiconsIcon icon={LaughingIcon} size={24} />
              </div>
              <div className="text-xs font-mono text-amber-400 tracking-wider uppercase mb-1">
                নিয়ম ৪ • অটুট পজিটিভিটি
              </div>
              <h3 className="commandment-title text-xl font-bold text-white font-['Outfit'] mb-3">
                সংকটেও হাসির ফোয়ারা (Camaraderie Over Crisis)
              </h3>
              <p className="commandment-desc text-sm text-slate-300 font-['Hind_Siliguri'] leading-relaxed mb-4">
                মাঝরাতে পাহাড়ি গাড়ির চাকা পাংচার হওয়া, তাঁবুতে বৃষ্টি ঢুকে ভিজে যাওয়া কিংবা খাবার ফুরিয়ে যাওয়া—যেকোনো বিপর্যয়ে আমরা মেজাজ না হারিয়ে হাসিমুখে একসাথে বসি এবং নতুন রোমাঞ্চের গল্প তৈরি করি।
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Check className="w-3.5 h-3.5" />
                <span>দুর্যোগেও অবিচল হাসিমুখ ও গান</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 13 BROTHERS — INTERACTIVE SQUAD ROSTER
      ========================================================================= */}
      <section id="squad-roster" className="py-20 sm:py-28 relative border-t border-white/5 bg-[#030914]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284c7]/15 border border-[#38bdf8]/30 text-[#38bdf8] text-xs font-mono font-medium mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>THE 13 BROTHERS ROSTER</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight mb-4">
              ১৩ জনের অটুট কাফেলা
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-['Hind_Siliguri'] leading-relaxed">
              কাউকে ছাড়া এই স্কোয়াড অসম্পূর্ণ। প্রতিটি ভাইয়ের আলাদা বৈশিষ্ট্য, দক্ষতা ও মেমোরি দেখতে কার্ডে ক্লিক করুন।
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {SQUAD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-['Hind_Siliguri'] font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#0284c7] text-white shadow-[0_0_20px_rgba(2,132,199,0.5)] border border-[#38bdf8]"
                    : "bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10"
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-black/40">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Squad Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSquad.map((member) => {
              const BrotherIcon = BROTHER_HUGEICONS[member.id] || Compass01Icon;

              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedBrother(member)}
                  className="squad-roster-card group relative rounded-3xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/10 hover:border-[#38bdf8]/50 transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(56,189,248,0.15)] hover:-translate-y-1"
                >
                  {/* Glowing Top Ambient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#0284c7]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#0284c7]/20 transition-all" />

                  {/* Photo & Badge */}
                  <div>
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 border border-white/10 bg-black/40">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                      {/* Floating Hugeicon Badge */}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#38bdf8] shadow-md">
                        <HugeiconsIcon icon={BrotherIcon} size={16} />
                      </div>

                      {/* Completed Trips Pill */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono text-sky-200">
                        {member.tripsCount}টি পূর্ণ সফর
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-medium text-[#38bdf8] tracking-wide">
                          {member.nickname}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-[11px] font-mono text-slate-400">{member.bloodGroup}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white font-['Outfit'] group-hover:text-[#38bdf8] transition-colors leading-tight">
                        {member.name}
                      </h3>

                      <p className="text-xs text-slate-400 font-mono mt-0.5">{member.role}</p>
                    </div>

                    {/* Quote Highlight */}
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 mb-4">
                      <p className="text-xs italic text-slate-300 font-['Hind_Siliguri'] line-clamp-2 leading-relaxed">
                        “{member.quote}”
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-[#38bdf8] transition-colors">
                    <span className="font-['Hind_Siliguri']">পূর্ণ বায়ো ও স্কিল দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          UNFILTERED BEHIND-THE-SCENES TRADITIONS
      ========================================================================= */}
      <section className="py-20 sm:py-28 relative border-t border-white/5 bg-[#040d1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>UNFILTERED BROTHERHOOD RITUALS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight mb-4">
              আমাদের কিছু অদ্ভুত ও মিষ্টি ট্র্যাডিশন
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-['Hind_Siliguri'] leading-relaxed">
              এই ছোট ছোট অভ্যাসগুলোই বছরের পর বছর আমাদের এই দলটাকে প্রাণবন্ত ও পরিবারের মতো এক সুতোয় বেঁধে রেখেছে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tradition 1 */}
            <div className="rounded-[28px] bg-white/[0.025] border border-white/10 p-6 flex flex-col justify-between hover:border-[#38bdf8]/40 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <Coffee className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                  মিরপুর ১২-এর টং চা ও আড্ডা
                </h3>
                <p className="text-xs text-amber-400 font-mono mb-3">আমাদের অফিসিয়াল ব্রাদারহুড হাব</p>
                <p className="text-sm text-slate-300 font-['Hind_Siliguri'] leading-relaxed">
                  JoulesLabs-এর অফিস শেষে ল্যাপটপ বন্ধ হলেই আমাদের মিলনমেলা বসতো মিরপুর ১২-এর চায়ের দোকানে। মাটির কাপে কড়া লাল চা আর লাইফ, কোড ও ফিউচার নিয়ে তুমুল আড্ডা—যা আজো আমাদের অটুট ঐতিহ্য।
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
                মিরপুর ১২ টং কালচার
              </div>
            </div>

            {/* Tradition 2 */}
            <div className="rounded-[28px] bg-white/[0.025] border border-white/10 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                  ফাহাদ ভাইয়ের ছাদের বারবিকিউ
                </h3>
                <p className="text-xs text-emerald-400 font-mono mb-3">যেখান থেকে সব ট্যুর প্ল্যানের জন্ম</p>
                <p className="text-sm text-slate-300 font-['Hind_Siliguri'] leading-relaxed">
                  ফাহাদ ভাইয়ের বাসার ছাদ মানেই আমাদের জন্য পবিত্র তীর্থস্থান! তারাভরা রাতে কয়লার ধোঁয়া, স্পাইসি বারবিকিউ আর বন্ধুদের চিৎকার—যেখান থেকে শুরু হয়েছিল ভাই-ব্রাদার্সদের প্রথম পাহাড় অভিযান।
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
                ছাদের সিগনেচার স্পার্ক
              </div>
            </div>

            {/* Tradition 3 */}
            <div className="rounded-[28px] bg-white/[0.025] border border-white/10 p-6 flex flex-col justify-between hover:border-[#38bdf8]/40 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0284c7]/20 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] mb-6 group-hover:scale-110 transition-transform">
                  <HugeiconsIcon icon={Compass01Icon} size={24} />
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                  রিয়াদ ও নাঈম ভাইয়ের ট্রাভেল ডাক
                </h3>
                <p className="text-xs text-[#38bdf8] font-mono mb-3">ঘুরতে পাগল দুই অগ্রদূত</p>
                <p className="text-sm text-slate-300 font-['Hind_Siliguri'] leading-relaxed">
                  রিয়াদ ভাই আর নাঈম ভাই যখনই কোনো অচেনা ট্রেইলের প্রস্তাব তোলেন, পুরো কোডিং স্কোয়াড নিমেষেই কিবোর্ড ছেড়ে ব্যাকপ্যাক গুছিয়ে নেয়। তাঁদের অদম্য ট্রাভেল উন্মাদনায় ক্লান্তি সেকেন্ডে উবে যায়!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
                অভিযানের আসল কাণ্ডারী
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EMOTIONAL CLOSING MANIFESTO & CTA
      ========================================================================= */}
      <section className="py-20 sm:py-28 relative border-t border-white/5 bg-gradient-to-b from-[#030914] to-[#040d1a] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0284c7]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-300 mb-6">
            <HugeiconsIcon icon={HeartIcon} size={14} className="text-rose-400" />
            <span>THE BROTHERHOOD PLEDGE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight mb-6 leading-tight">
            “আমরা হয়তো রক্তে এক নই, তবে আমরা হৃদয়ে এক।”
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-['Hind_Siliguri'] leading-relaxed max-w-2xl mx-auto mb-10">
            JoulesLabs-এর কোডিং কিউবিকলে যার সূচনা, মিরপুর ১২-এর টং আর ফাহাদ ভাইয়ের ছাদের বারবিকিউতে যার বিস্তার—পাহাড়ে পাহাড়ে ভাই-ব্রাদার্সদের সেই অবিস্মরণীয় পদচিহ্ন চিরকাল অম্লান থাকবে প্রতিটি শ্বাসে।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/expeditions"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white font-['Hind_Siliguri'] font-bold text-sm sm:text-base hover:brightness-110 transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)]"
            >
              <span>১২টি ট্যুর ডায়েরি পড়ুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/#vault"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-200 hover:text-white font-['Hind_Siliguri'] font-semibold text-sm sm:text-base transition-all"
            >
              <span>স্মৃতি ভল্ট এক্সপ্লোর করুন</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
      ========================================================================= */}
      <footer className="relative py-16 border-t border-white/10 bg-[#02070f] text-slate-400 text-xs font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0284c7]/20 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-['Outfit'] font-bold text-white text-sm">Travel with Bhai Brothers</div>
              <div className="text-[11px] text-slate-500 font-['Hind_Siliguri']">ভ্রাতৃত্বের চিরন্তন পদচিহ্ন ও মেমোরি ভল্ট</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs font-['Hind_Siliguri']">
            <Link href="/" className="hover:text-white transition-colors">হোমপেজ</Link>
            <Link href="/expeditions" className="hover:text-white transition-colors">ট্যুর ডায়েরি</Link>
            <Link href="/about" className="text-[#38bdf8] font-bold">আমাদের গল্প</Link>
            <Link href="/#vault" className="hover:text-white transition-colors">মেমোরি ভল্ট</Link>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer text-xs"
          >
            <span>উপরে ফিরুন</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#38bdf8]" />
          </button>
        </div>

        <div className="text-center text-slate-600 text-[11px] mt-8">
          © {new Date().getFullYear()} Travel with Bhai Brothers. All Memories Preserved With Brotherhood.
        </div>
      </footer>

      {/* Profile Lightbox Modal */}
      <BrotherProfileModal
        brother={selectedBrother}
        onClose={() => setSelectedBrother(null)}
      />
    </div>
  );
}
