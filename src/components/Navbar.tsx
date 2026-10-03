"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass01Icon,
  Menu01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  HugeiconsIcon,
} from "@/components/HugeIcon";
import { Sun, Moon } from "lucide-react";
import AmbientSound from "./AmbientSound";
import { useTheme } from "./ThemeProvider";

interface NavbarProps {
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
}

export default function Navbar({ isAudioPlaying = false, onToggleAudio }: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>("cinema");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isHomePage = pathname === "/";

  const navLinks = [
    { id: "cinema", label: "মেমোরিজ", href: "/#cinema" },
    { id: "expeditions", label: "ট্যুর ডায়েরি", href: "/#expeditions" },
    { id: "squad", label: "আমাদের স্কোয়াড", href: "/#squad" },
    { id: "about", label: "আমাদের গল্প", href: "/about" },
    { id: "gadgets", label: "ট্রাভেল গ্যাজেট", href: "/#gadgets" },
    { id: "vault", label: "ফটো ভল্ট", href: "/#vault" },
    { id: "bucketlist", label: "বাকেট লিস্ট", href: "/#bucketlist" },
  ];

  // Scrollspy & Glass blur elevation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      if (!isHomePage) return;

      // When at or near the top of the home page, always keep "cinema" (মেমোরিজ) active
      if (currentScrollY < 350) {
        setActiveSection("cinema");
        return;
      }

      // Valid on-page section IDs in vertical sequence
      const homeSections = [
        "cinema",
        "expeditions",
        "squad",
        "gadgets",
        "vault",
        "bucketlist",
      ];

      const scrollPos = currentScrollY + 280;
      let currentActive = "cinema";

      for (const sectionId of homeSections) {
        const sec = document.getElementById(sectionId);
        if (sec) {
          const docTop = sec.getBoundingClientRect().top + currentScrollY;
          if (docTop <= scrollPos) {
            currentActive = sectionId;
          }
        }
      }

      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const isLight = theme === "light";

  return (
    <>
      {/* Floating Island Capsule Navbar */}
      <header
        className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl transition-all duration-500 ${
          isScrolled ? "scale-[0.99] sm:scale-100" : ""
        }`}
        aria-label="Primary navigation"
      >
        <div
          className={`relative rounded-full transition-all duration-500 border ${
            isLight
              ? isScrolled
                ? "bg-white/90 backdrop-blur-2xl border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.08),0_0_20px_rgba(2,132,199,0.08)]"
                : "bg-white/80 backdrop-blur-xl border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              : isScrolled
                ? "bg-[#040e1f]/85 backdrop-blur-2xl border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.18)]"
                : "bg-[#051329]/75 backdrop-blur-xl border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(56,189,248,0.1)]"
          } px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4`}
        >
          {/* Subtle Top Specular Sheen */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#38bdf8]/60 to-transparent pointer-events-none rounded-full" />

          {/* Left Brand / Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 sm:gap-3 shrink-0 outline-none"
            aria-label="Bhai Brothers Home"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#0284c7] via-[#38bdf8] to-sky-200 p-[1px] shadow-[0_0_15px_rgba(56,189,248,0.4)] group-hover:shadow-[0_0_25px_rgba(56,189,248,0.7)] transition-all duration-300">
              <div className={`w-full h-full rounded-full flex items-center justify-center ${isLight ? "bg-white" : "bg-[#040e1f]"}`}>
                <HugeiconsIcon
                  icon={Compass01Icon}
                  size={18}
                  className="text-[#0284c7] group-hover:rotate-45 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`font-['Outfit'] font-black text-sm sm:text-base tracking-tight transition-colors leading-none flex items-center gap-1.5 ${
                isLight ? "text-slate-900 group-hover:text-sky-600" : "text-white group-hover:text-[#38bdf8]"
              }`}>
                Bhai Brothers
                <span className="hidden lg:inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
              <span className={`text-[10px] font-mono tracking-wider uppercase leading-tight font-medium hidden sm:inline-block ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}>
                Expedition Chronicles
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className={`hidden lg:flex items-center gap-0.5 xl:gap-1.5 p-1 rounded-full border ${
            isLight ? "bg-slate-100/90 border-slate-200/80" : "bg-black/25 border-white/5"
          }`}>
            {navLinks.map((link) => {
                const isActive = isHomePage
                  ? activeSection === link.id
                  : pathname === link.href || (link.href !== "/about" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold font-['Hind_Siliguri'] transition-all duration-300 ${
                    isActive
                      ? isLight
                        ? "text-white bg-gradient-to-r from-sky-500 to-cyan-500 border border-sky-400/40 shadow-[0_2px_10px_rgba(2,132,199,0.3)] font-bold"
                        : "text-white bg-gradient-to-r from-[#0284c7]/40 to-[#38bdf8]/20 border border-[#38bdf8]/40 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold"
                      : isLight
                        ? "text-slate-600 hover:text-sky-600 hover:bg-white/80"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">


            {/* Theme Toggle Button (Pure Icon Only) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all cursor-pointer flex items-center justify-center shadow-sm active:scale-95 shrink-0 ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border border-slate-200 text-sky-600"
                  : "bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-amber-300"
              }`}
              aria-label={isLight ? "ডার্ক মোডে পরিবর্তন করুন" : "লাইট মোডে পরিবর্তন করুন"}
              title={isLight ? "ডার্ক মোডে পরিবর্তন করুন" : "লাইট মোডে পরিবর্তন করুন"}
            >
              {isLight ? (
                <Moon className="w-4 h-4 text-sky-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </button>

            {/* Ambient Sound Engine Toggle */}
            {onToggleAudio && (
              <div className="shrink-0">
                <AmbientSound isPlaying={isAudioPlaying} onToggle={onToggleAudio} />
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full border transition-colors cursor-pointer ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                  : "bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10"
              }`}
              aria-label="Toggle navigation menu"
            >
              <HugeiconsIcon
                icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon}
                size={18}
                className={isLight ? "text-sky-600" : "text-[#38bdf8]"}
              />
            </button>
          </div>
        </div>

        {/* Mobile Frosted Glass Drawer */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden mt-2 p-4 rounded-3xl backdrop-blur-2xl border shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300 space-y-3 ${
            isLight
              ? "bg-white/98 border-slate-200 text-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
              : "bg-[#040e1f]/95 border-white/15 text-white shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
          }`}>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                  const isActive = isHomePage
                  ? activeSection === link.id
                  : pathname === link.href || (link.href !== "/about" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-semibold font-['Hind_Siliguri'] flex items-center justify-between transition-all ${
                      isActive
                        ? isLight
                          ? "bg-sky-50 border border-sky-300 text-sky-700 font-bold"
                          : "bg-[#0284c7]/20 border border-[#38bdf8]/40 text-[#38bdf8]"
                        : isLight
                          ? "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100"
                          : "bg-white/[0.03] text-slate-200 hover:bg-white/[0.08]"
                    }`}
                  >
                    <span>{link.label}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="opacity-60" />
                  </Link>
                );
              })}
            </div>

            {/* Mobile Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`w-full px-4 py-2.5 rounded-2xl border flex items-center justify-between text-xs font-['Hind_Siliguri'] transition-colors ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800"
                  : "bg-white/[0.04] border-white/10 text-slate-200"
              }`}
            >
              <span className="flex items-center gap-2">
                {isLight ? (
                  <Moon className="w-4 h-4 text-sky-600" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-300" />
                )}
                <span>থিম পরিবর্তন ({isLight ? "ডার্ক মোড" : "লাইট মোড"})</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                isLight ? "bg-sky-100 text-sky-700" : "bg-white/10 text-[#38bdf8]"
              }`}>
                {isLight ? "লাইট অন" : "ডার্ক অন"}
              </span>
            </button>

            <div className={`pt-2 border-t flex items-center justify-between text-xs ${
              isLight ? "border-slate-200" : "border-white/10"
            }`}>
              <Link
                href="/expeditions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#0284c7] font-mono flex items-center gap-1.5 font-bold"
              >
                <span>সবগুলো অভিযান দেখুন</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
              <span className={`text-[11px] font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>BHAI BROTHERS</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
