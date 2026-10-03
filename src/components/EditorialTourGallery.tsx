"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Camera,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { HugeiconsIcon, SparklesIcon } from "@/components/HugeIcon";

export interface EditorialPhoto {
  url: string;
  caption: string;
  album?: "all" | "landscape" | "brotherhood" | "night";
  photographer?: string;
  location?: string;
}

interface EditorialTourGalleryProps {
  tourTitle: string;
  tourBengaliTitle: string;
  location: string;
  date?: string;
  photos: EditorialPhoto[];
}

// Asymmetric mosaic grid layout preserving the editorial dynamics of the reference,
// while adhering to our luxury rounded border & glow aesthetics
const MOSAIC_GRID_PATTERNS = [
  // Row 1 (3 photos: Left 4:3, Center Wide Panoramic 16:10, Right Portrait 3:4)
  { colSpan: "col-span-12 sm:col-span-3 lg:col-span-3", aspect: "aspect-[4/3] sm:aspect-[4/3]" },
  { colSpan: "col-span-12 sm:col-span-6 lg:col-span-6", aspect: "aspect-[16/10] sm:aspect-[16/10]" },
  { colSpan: "col-span-12 sm:col-span-3 lg:col-span-3", aspect: "aspect-[3/4] sm:aspect-[3/4]" },

  // Row 2 (3 photos: balanced landscape & focus trio)
  { colSpan: "col-span-12 sm:col-span-4 lg:col-span-4", aspect: "aspect-[4/3]" },
  { colSpan: "col-span-12 sm:col-span-4 lg:col-span-4", aspect: "aspect-[4/3]" },
  { colSpan: "col-span-12 sm:col-span-4 lg:col-span-4", aspect: "aspect-[4/3]" },

  // Row 3 (2 photos: wide epic dual panoramic vistas)
  { colSpan: "col-span-12 sm:col-span-6 lg:col-span-6", aspect: "aspect-[16/9]" },
  { colSpan: "col-span-12 sm:col-span-6 lg:col-span-6", aspect: "aspect-[16/9]" },

  // Row 4 (3 photos: landscape, central square highlight, portrait)
  { colSpan: "col-span-12 sm:col-span-4 lg:col-span-4", aspect: "aspect-[4/3]" },
  { colSpan: "col-span-12 sm:col-span-4 lg:col-span-4", aspect: "aspect-[1/1]" },
  { colSpan: "col-span-12 sm:col-span-4 lg:col-span-4", aspect: "aspect-[3/4]" },

  // Row 5 (Bonus dynamic row on Load More)
  { colSpan: "col-span-12 sm:col-span-6 lg:col-span-6", aspect: "aspect-[16/9]" },
  { colSpan: "col-span-12 sm:col-span-6 lg:col-span-6", aspect: "aspect-[16/9]" },
  { colSpan: "col-span-12 sm:col-span-4 lg:col-span-4", aspect: "aspect-[4/3]" },
  { colSpan: "col-span-12 sm:col-span-4 lg:col-span-4", aspect: "aspect-[1/1]" },
  { colSpan: "col-span-12 sm:col-span-4 lg:col-span-4", aspect: "aspect-[3/4]" },
];

export default function EditorialTourGallery({
  tourTitle: _tourTitle,
  tourBengaliTitle,
  location,
  date: _date,
  photos,
}: EditorialTourGalleryProps) {
  const [activeAlbum, setActiveAlbum] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(11);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const albumTabs = [
    { id: "all", label: "সকল স্মৃতি অ্যালবাম", count: photos.length },
    { id: "landscape", label: "প্রকৃতি ও ট্রেইল", count: photos.filter((p) => p.album === "landscape").length },
    { id: "brotherhood", label: "ভাইদের অ্যাকশন", count: photos.filter((p) => p.album === "brotherhood").length },
    { id: "night", label: "ক্যাম্পফায়ার ও রাত", count: photos.filter((p) => p.album === "night").length },
  ];

  // Filter photos by selected album
  const filteredPhotos = photos.filter((photo) => {
    if (activeAlbum === "all") return true;
    return photo.album === activeAlbum;
  });

  const displayedPhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, filteredPhotos.length));
  };

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev === 0 ? displayedPhotos.length - 1 : prev - 1) : null
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev === displayedPhotos.length - 1 ? 0 : prev + 1) : null
        );
      }
    },
    [lightboxIndex, displayedPhotos.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [handleKeyDown, lightboxIndex]);

  const currentPhoto = lightboxIndex !== null ? displayedPhotos[lightboxIndex] : null;

  return (
    <section className="relative w-full py-6 sm:py-8 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#0284c7]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* =========================================================================
          SECTION HEADER (Aligned with site's design tokens and typography)
      ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
        <div>
          {/* Glowing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284c7]/15 border border-[#38bdf8]/30 text-[#bae6fd] text-xs font-bold tracking-widest uppercase mb-3 font-mono">
            <Camera className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>EXPEDITION PHOTO VAULT & ARCHIVE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Outfit'] leading-tight">
            ট্যুরের{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-sky-200 to-teal-300">
              ফ্রেমবন্দী মুহূর্ত ও স্মৃতি
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-['Hind_Siliguri'] mt-2.5 max-w-2xl leading-relaxed">
            ক্যামেরার লেন্স আর ড্রোনের চোখে ধরা পড়া {tourBengaliTitle}-এর প্রতিটি স্মরণীয় দৃশ্য। প্রকৃতির অপরূপ বৈচিত্র্য আর ভাইদের নিখাদ বন্ধুত্বের জীবন্ত অ্যালবাম।
          </p>
        </div>

        {/* Capsule Filter Tabs (Matches site's capsule navbar architecture) */}
        <div className="p-1.5 rounded-full bg-[#07192f]/80 backdrop-blur-xl border border-white/15 flex flex-wrap items-center gap-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)] shrink-0">
          {albumTabs.map((tab) => {
            const isActive = activeAlbum === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveAlbum(tab.id);
                  setVisibleCount(11);
                }}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold font-['Hind_Siliguri'] transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white shadow-[0_0_18px_rgba(56,189,248,0.4)] font-bold"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? "bg-black/30 text-white" : "bg-white/10 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          ASYMMETRIC MOSAIC BENTO GRID
          (Maintains the editorial asymmetric rhythm while adopting luxury rounded styling)
      ========================================================================= */}
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {displayedPhotos.map((photo, idx) => {
          const layout = MOSAIC_GRID_PATTERNS[idx % MOSAIC_GRID_PATTERNS.length];

          // Determine category label
          const categoryTag =
            photo.album === "brotherhood"
              ? "ভাইদের মুহূর্ত"
              : photo.album === "night"
              ? "ক্যাম্পফায়ার"
              : "প্রকৃতি ও ট্রেইল";

          return (
            <div
              key={idx}
              onClick={() => setLightboxIndex(idx)}
              className={`group relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#07192f]/70 border border-white/12 hover:border-[#38bdf8]/60 cursor-pointer transition-all duration-500 hover:shadow-[0_15px_40px_rgba(56,189,248,0.22)] hover:-translate-y-1 ${layout.colSpan} ${layout.aspect}`}
            >
              {/* Photo Image */}
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority={idx < 4}
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

              {/* Top Floating Glass Badge & Zoom Button */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-sky-200">
                  {categoryTag}
                </span>

                <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#38bdf8] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0284c7] group-hover:text-white transition-all shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom Caption & Location Scrim */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 pointer-events-none">
                <p className="text-xs sm:text-sm font-semibold text-white font-['Hind_Siliguri'] leading-snug drop-shadow-md line-clamp-2 group-hover:text-sky-200 transition-colors">
                  {photo.caption}
                </p>

                <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-slate-300">
                  <span className="flex items-center gap-1 text-[#38bdf8]">
                    <MapPin className="w-3 h-3" />
                    <span>{photo.location || location}</span>
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="text-slate-400">ফ্রেম #{String(idx + 1).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          LUXURY LOAD MORE BUTTON (Aligned with site's glowing capsule buttons)
      ========================================================================= */}
      {hasMore && (
        <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center gap-3">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-full bg-[#07192f] hover:bg-[#0c2444] text-white text-xs sm:text-sm font-semibold border border-[#38bdf8]/40 hover:border-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.18)] hover:shadow-[0_0_35px_rgba(56,189,248,0.35)] transition-all cursor-pointer group active:scale-95"
          >
            <HugeiconsIcon icon={SparklesIcon} size={15} className="text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-['Hind_Siliguri'] font-bold tracking-wide">
              আরো ছবি ও ফ্রেম দেখুন ({filteredPhotos.length - displayedPhotos.length}টি বাকি)
            </span>
            <ArrowRight className="w-4 h-4 text-[#38bdf8] group-hover:translate-x-1 transition-transform" />
          </button>

          <span className="text-xs font-mono text-slate-400">
            মোট {filteredPhotos.length}টি ছবির মধ্যে {displayedPhotos.length}টি প্রদর্শিত
          </span>
        </div>
      )}

      {/* =========================================================================
          FULL-SCREEN CINEMATIC LIGHTBOX
          (Styled identically to BrotherProfileModal and TripDetailModal)
      ========================================================================= */}
      {currentPhoto && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-300"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Capsule Control Bar */}
          <div
            className="max-w-5xl mx-auto w-full flex items-center justify-between z-20 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#07192f]/90 border border-white/15 backdrop-blur-md">
              <span className="text-xs font-mono font-bold text-[#38bdf8]">
                {lightboxIndex + 1} / {displayedPhotos.length}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-mono text-slate-300">
                {tourBengaliTitle}
              </span>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 rounded-full bg-[#07192f]/90 hover:bg-[#0284c7] text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Stage & Image */}
          <div
            className="relative flex-1 flex items-center justify-center my-3 max-h-[78vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-5xl rounded-3xl overflow-hidden border border-[#38bdf8]/35 shadow-[0_0_80px_rgba(56,189,248,0.25)] flex items-center justify-center bg-black/50">
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Prev Shifter Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  lightboxIndex === 0 ? displayedPhotos.length - 1 : lightboxIndex - 1
                );
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#07192f]/85 hover:bg-[#0284c7] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Shifter Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  lightboxIndex === displayedPhotos.length - 1 ? 0 : lightboxIndex + 1
                );
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#07192f]/85 hover:bg-[#0284c7] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Narrative Glass Card */}
          <div
            className="max-w-3xl mx-auto w-full text-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 rounded-2xl bg-[#07192f]/90 border border-white/15 backdrop-blur-md shadow-xl">
              <p className="text-sm sm:text-base font-['Hind_Siliguri'] text-slate-200 leading-relaxed font-semibold">
                {currentPhoto.caption}
              </p>
              <div className="flex items-center justify-center gap-3 mt-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1 text-[#38bdf8]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{currentPhoto.location || location}</span>
                </span>
                <span>•</span>
                <span>Bhai Brothers Expedition Chronicles</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
