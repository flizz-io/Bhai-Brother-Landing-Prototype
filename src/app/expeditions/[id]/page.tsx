import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Compass,
  Users,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Shield,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { initialExpeditions, initialSquad } from "@/data/toursData";
import { HugeiconsIcon, Location01Icon, LaughingIcon } from "@/components/HugeIcon";
import InteractiveTourRoad from "@/components/InteractiveTourRoad";
import EditorialTourGallery, { EditorialPhoto } from "@/components/EditorialTourGallery";

export function generateStaticParams() {
  return initialExpeditions.map((tour) => ({
    id: tour.id,
  }));
}

export default async function ExpeditionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const tour = initialExpeditions.find((t) => t.id === resolvedParams.id);

  if (!tour) {
    notFound();
  }

  // Find squad members who went on this tour
  const tourSquad = initialSquad.filter((brother) =>
    tour.squadMembers.some((name) => brother.name.includes(name) || name.includes(brother.name.split(" ")[0]))
  );

  // Assemble curated editorial gallery photos matching the portfolio reference layout
  const editorialPhotos: EditorialPhoto[] = [];
  const seenUrls = new Set<string>();

  // 1. Primary curated expedition gallery photos (Landscape)
  if (tour.gallery && tour.gallery.length > 0) {
    tour.gallery.forEach((g) => {
      if (!seenUrls.has(g.url)) {
        seenUrls.add(g.url);
        editorialPhotos.push({
          url: g.url,
          caption: g.caption,
          album: "landscape",
          location: tour.location,
        });
      }
    });
  }

  // 2. Journey steps captures (Landscapes & Action)
  if (tour.journeySteps && tour.journeySteps.length > 0) {
    tour.journeySteps.forEach((step) => {
      if (step.image && !seenUrls.has(step.image)) {
        seenUrls.add(step.image);
        editorialPhotos.push({
          url: step.image,
          caption: `${step.title}: ${step.narrative.slice(0, 80)}...`,
          album: step.timeOrPhase.includes("রাত") ? "night" : "landscape",
          location: step.location,
        });
      }
    });
  }

  // 3. Campfire & night atmosphere
  if (!seenUrls.has("/images/hero_campfire.jpg")) {
    seenUrls.add("/images/hero_campfire.jpg");
    editorialPhotos.push({
      url: "/images/hero_campfire.jpg",
      caption: "ক্যাম্পসাইটে মধ্যরাতের আগুনের উত্তাপ, গিটারের সুর ও ভাইদের গল্প",
      album: "night",
      location: `${tour.location} Night Camp`,
    });
  }

  // 4. Squad members portraits on this expedition (Brothers in action)
  tourSquad.forEach((brother) => {
    if (brother.image && !seenUrls.has(brother.image)) {
      seenUrls.add(brother.image);
      editorialPhotos.push({
        url: brother.image,
        caption: `${brother.nickname} (${brother.name}) — ${brother.role}`,
        album: "brotherhood",
        location: tour.location,
      });
    }
  });

  // 5. Regional & scenic covers
  if (!seenUrls.has(tour.coverImage)) {
    seenUrls.add(tour.coverImage);
    editorialPhotos.push({
      url: tour.coverImage,
      caption: `${tour.bengaliTitle} — প্রাকৃতিক ল্যান্ডস্কেপ ও দৃশ্য`,
      album: "landscape",
      location: tour.location,
    });
  }

  return (
    <div id="expedition-detail" className="min-h-screen bg-[#040d1a] text-white selection:bg-[#38bdf8] selection:text-[#040d1a]">
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
            <span className="hidden sm:inline">সকল ট্যুর ডায়েরিতে ফিরে যান</span>
            <span className="sm:hidden">ট্যুর ডায়েরি</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-[#38bdf8] font-bold">{tour.bengaliTitle}</span>
            <span>•</span>
            <span className="text-slate-400">{tour.date}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#0284c7]/20 border border-[#38bdf8]/40 text-[#38bdf8] shadow">
              বাজেট: {tour.approxCostPerHead}
            </span>
            <Link
              href="/"
              className="px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              হোম
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] overflow-hidden">
        <Image
          src={tour.coverImage}
          alt={tour.bengaliTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Cinematic Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a] via-[#040d1a]/55 via-50% to-black/35 pointer-events-none" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 w-full">
            <div className="max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md border border-[#38bdf8]/40 text-[#38bdf8]">
                  {tour.typeLabel}
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-200 bg-white/10 backdrop-blur-md border border-white/15">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-[#38bdf8]" />
                  {tour.duration}
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-mono text-slate-200 bg-white/10 backdrop-blur-md border border-white/15">
                  <Compass className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                  {tour.elevationOrDistance}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 font-['Outfit'] drop-shadow-lg leading-tight">
                {tour.bengaliTitle}
              </h1>

              {/* Location & Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-mono mb-6">
                <span className="flex items-center gap-1.5 text-[#38bdf8]">
                  <MapPin className="w-4 h-4" />
                  {tour.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {tour.date}
                </span>
                <span>•</span>
                <span className="text-slate-400">{tour.coordinates}</span>
              </div>

              {/* Summary */}
              <p className="text-sm sm:text-base text-slate-200 font-['Hind_Siliguri'] leading-relaxed drop-shadow">
                {tour.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 space-y-24">
        {/* Highlights Row */}
        <section className="p-8 sm:p-10 rounded-[32px] sm:rounded-[36px] bg-[#07192f]/60 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#38bdf8] uppercase font-mono mb-6">
            <Sparkles className="w-4 h-4" />
            <span>ট্যুর হাইলাইটস ও মূল আকর্ষণ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tour.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/6 hover:border-[#38bdf8]/40 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-sm text-slate-200 font-['Hind_Siliguri'] leading-relaxed">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* INTERACTIVE HIGHWAY ROAD TRIP EXPERIENCE (Horizontal Car Drive & Day-by-Day Chronicle) - 100% Full Screen Width */}
      <section id="tour-road" className="relative w-full overflow-hidden my-4">
        <InteractiveTourRoad tour={tour} />
      </section>

      {/* Main Container - Squad, Gallery, Navigation */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 space-y-24">
        {/* SQUAD MEMBERS ROSTER */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284c7]/15 border border-[#38bdf8]/30 text-[#bae6fd] text-xs font-bold tracking-widest uppercase mb-3">
                <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>EXPEDITION SQUAD MEMBERS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
                এই অভিযানে ছিলেন <span className="text-[#38bdf8]">যেসব ভাই</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourSquad.map((brother) => (
              <div
                key={brother.id}
                className="group p-5 rounded-[28px] sm:rounded-[32px] bg-[#07192f]/60 backdrop-blur-md border border-white/10 hover:border-[#38bdf8]/50 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/15">
                  <Image
                    src={brother.image}
                    alt={brother.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white font-['Outfit'] truncate">
                      {brother.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[#38bdf8] font-mono">{brother.role}</p>
                  <p className="text-[11px] text-slate-400 mt-1 truncate font-['Hind_Siliguri'] flex items-center gap-1">
                    <HugeiconsIcon icon={Location01Icon} size={12} className="text-[#38bdf8] shrink-0" />
                    <span>প্রিয় স্পট: {brother.favoriteSpot}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ITEMIZED EXPENSE & BUDGET LEDGER */}
        {tour.costBreakdown && tour.costBreakdown.length > 0 && (
          <section className="p-8 sm:p-12 rounded-[32px] sm:rounded-[36px] bg-[#07192f]/60 backdrop-blur-md border border-white/10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-widest uppercase mb-3">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>TRANSPARENT EXPENSE LEDGER</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
                  ট্যুরের <span className="text-emerald-400">নিখুঁত খরচের হিসাব</span>
                </h2>
                <p className="text-slate-300 text-sm mt-1 font-['Hind_Siliguri']">
                  আমাদের ট্রেজারার মাহিম রেজার খতিয়ান অনুযায়ী জনপ্রতি গড় খরচের সম্পূর্ণ স্বচ্ছ বিবরণ।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-right">
                <span className="text-xs text-slate-400 block font-mono">মোট জনপ্রতি খরচ</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#38bdf8] font-mono">
                  {tour.approxCostPerHead}
                </span>
              </div>
            </div>

            <div className="divide-y divide-white/8">
              {tour.costBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <h5 className="text-sm font-semibold text-white font-['Hind_Siliguri']">
                      {item.category}
                    </h5>
                    <p className="text-xs text-slate-400 font-mono">{item.note}</p>
                  </div>
                  <span className="text-base font-bold text-emerald-300 font-mono">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GEAR USED & PACKING CHECKLIST */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tour.gearUsed && (
            <div className="p-8 rounded-[32px] sm:rounded-[36px] bg-[#07192f]/60 backdrop-blur-md border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#38bdf8] uppercase tracking-wider font-mono">
                <Shield className="w-4 h-4" />
                <span>এই অভিযানে ব্যবহৃত প্রধান গ্যাজেট</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {tour.gearUsed.map((gear, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/10 text-slate-200 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>{gear}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {tour.packingChecklist && (
            <div className="p-8 rounded-[32px] sm:rounded-[36px] bg-[#07192f]/60 backdrop-blur-md border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                <Lightbulb className="w-4 h-4" />
                <span>নতুনদের জন্য প্যাকিং চেকলিস্ট</span>
              </div>
              <div className="space-y-2">
                {tour.packingChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-['Hind_Siliguri']">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* UNFILTERED BLOOPER */}
        {tour.bloopers && (
          <section className="p-8 rounded-[32px] sm:rounded-[36px] bg-gradient-to-r from-purple-950/30 to-sky-950/30 border border-purple-500/25 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-300">
              <HugeiconsIcon icon={LaughingIcon} size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-1 font-mono">
                ভাইদের আনকাট ব্লুপার ও হাসির কাণ্ড
              </h4>
              <p className="text-sm text-slate-200 font-['Hind_Siliguri'] leading-relaxed">
                {tour.bloopers}
              </p>
            </div>
          </section>
        )}

        {/* EDITORIAL PHOTO VAULT GALLERY (Matches reference asymmetric bento style) */}
        <EditorialTourGallery
          tourTitle={tour.title}
          tourBengaliTitle={tour.bengaliTitle}
          location={tour.location}
          date={tour.date}
          photos={editorialPhotos}
        />

        {/* Navigation to Other Expeditions */}
        <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/#expeditions"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সকল ট্যুর ডায়েরিতে ফিরে যান</span>
          </Link>

          <Link
            href="/#bucketlist"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm shadow-[0_10px_25px_rgba(2,132,199,0.35)] transition-all hover:scale-105"
          >
            <span>পরবর্তী মিশনের বাকেট লিস্ট দেখুন</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
