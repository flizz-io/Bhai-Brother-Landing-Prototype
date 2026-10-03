import React from "react";
import Link from "next/link";
import { Compass, Flame, Heart, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#040d1a] border-t border-white/8 text-gray-400 py-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-[#0284c7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/[0.06]">
          {/* Logo & Manifesto */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-3 mb-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#07192f] border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] group-hover:border-[#38bdf8] transition-colors">
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
              </div>
              <span className="text-xl font-black text-white tracking-wider font-['Outfit']">
                TRAVEL WITH BHAI BROTHERS
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed font-['Hind_Siliguri']">
              বন্ধুত্বের পদচিহ্ন যেখানে যেখানে পড়েছে, সেই স্মৃতিগুলো চিরকাল অক্ষত রাখার ডিজিটাল মেমোরি ভল্ট।
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-sm font-['Hind_Siliguri']">
            <Link href="/about" className="hover:text-[#38bdf8] transition-colors">
              আমাদের গল্প
            </Link>
            <Link href="/expeditions" className="hover:text-[#38bdf8] transition-colors">
              সকল অভিযান
            </Link>
            <Link href="/#expeditions" className="hover:text-[#38bdf8] transition-colors">
              ট্যুর ডায়েরি
            </Link>
            <Link href="/#vault" className="hover:text-[#38bdf8] transition-colors">
              স্মৃতি ভল্ট
            </Link>
            <Link href="/#squad" className="hover:text-[#38bdf8] transition-colors">
              দ্য স্কোয়াড
            </Link>
            <Link href="/#bucketlist" className="hover:text-[#38bdf8] transition-colors">
              বাকেট লিস্ট
            </Link>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-[#0284c7]/20 hover:text-white border border-white/10 hover:border-[#38bdf8]/40 transition-all text-xs cursor-pointer"
          >
            <span>উপরে ফিরুন</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#38bdf8]" />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>BROTHERHOOD SINCE 2019 // NEXT EXPEDITION IN PROGRESS</span>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <span>ক্যাম্পফায়ারের আলো আর ভ্রাতৃত্বের ভালোবাসায় তৈরি</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
