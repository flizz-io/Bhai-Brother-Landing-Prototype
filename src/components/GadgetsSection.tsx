"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ArrowUpRight } from "lucide-react";
import { initialGadgets, TravelGadget } from "../data/gadgetsData";
import { HugeiconsIcon, SparklesIcon } from "@/components/HugeIcon";

export default function GadgetsSection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedGadget, setSelectedGadget] = useState<TravelGadget | null>(null);

  const filteredGadgets = initialGadgets.filter((g) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "owned") return g.status === "owned";
    if (activeFilter === "pending") return g.status === "pending";
    if (activeFilter === "Camera") return g.category === "Camera";
    if (activeFilter === "Camping") return g.category === "Camping";
    if (activeFilter === "Survival") return g.category === "Survival" || g.category === "Power";
    return true;
  });

  return (
    <section
      id="gadgets"
      className="relative z-30 w-full bg-[#030914] text-white py-28 sm:py-36 border-t border-white/10 shadow-[0_-30px_90px_rgba(0,0,0,0.95)]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Minimal Header */}
        <div className="section-reveal flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-8">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#38bdf8] uppercase font-semibold flex items-center gap-1.5 mb-3">
              <HugeiconsIcon icon={SparklesIcon} size={13} className="text-[#38bdf8]" /> EXPEDITION GEAR
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Outfit']">
              ট্রাভেল <span className="text-[#38bdf8]">গ্যাজেট হাব</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 font-['Hind_Siliguri'] max-w-xl">
              পাহাড় ও দুর্গম পথের জন্য আমাদের পরীক্ষিত সরঞ্জাম ও ভবিষ্যৎ বাকেট গিয়ার।
            </p>
          </div>

          {/* Minimal Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "সব" },
              { id: "owned", label: "স্কোয়াড গিয়ার" },
              { id: "pending", label: "টার্গেট ২০২৬" },
              { id: "Camera", label: "ক্যামেরা ও ড্রোন" },
              { id: "Camping", label: "ক্যাম্পিং" },
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-md"
                      : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ultra-Minimal Grid */}
        <div className="gadgets-minimal-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredGadgets.map((gadget) => {
            const isOwned = gadget.status === "owned";
            return (
              <div
                key={gadget.id}
                onClick={() => setSelectedGadget(gadget)}
                className="gadget-minimal-card group relative rounded-[32px] sm:rounded-[36px] bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] hover:border-white/20 transition-all duration-500 cursor-pointer p-6 sm:p-7 flex flex-col justify-between overflow-hidden"
              >
                {/* Minimal Image Container */}
                <div className="relative w-full aspect-[4/3] rounded-[24px] sm:rounded-[26px] overflow-hidden bg-black/40 mb-6">
                  <Image
                    src={gadget.image}
                    alt={gadget.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Action Arrow */}
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Minimal Card Details */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono tracking-wider text-gray-500 uppercase">
                      {gadget.brand} • {gadget.categoryLabel}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-medium font-mono ${
                        isOwned ? "text-emerald-400" : "text-sky-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOwned ? "bg-emerald-400" : "bg-sky-400"
                        }`}
                      />
                      <span>{isOwned ? "স্কোয়াডে আছে" : "টার্গেট"}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#38bdf8] transition-colors font-['Outfit'] tracking-tight mb-4">
                    {gadget.bengaliName}
                  </h3>
                </div>

                {/* Bottom Row: Price & Minimal Meta */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
                  <span className="font-['Hind_Siliguri']">{gadget.assignedTo}-র দায়িত্বে</span>
                  <span className="font-mono text-sm font-semibold text-white group-hover:text-[#38bdf8] transition-colors">
                    {gadget.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean Minimal Quick-View Sheet */}
      {selectedGadget && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedGadget(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#071628] border border-white/15 rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGadget(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-5 bg-black/40">
              <Image
                src={selectedGadget.image}
                alt={selectedGadget.name}
                fill
                className="object-cover"
              />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-wider text-[#38bdf8] block mb-1">
              {selectedGadget.brand} • {selectedGadget.categoryLabel}
            </span>
            <h3 className="text-2xl font-bold text-white font-['Outfit'] mb-1">
              {selectedGadget.bengaliName}
            </h3>
            <p className="text-xs font-mono text-gray-400 mb-4">{selectedGadget.name}</p>

            <p className="text-sm text-gray-300 font-['Hind_Siliguri'] leading-relaxed bg-white/[0.03] p-4 rounded-2xl border border-white/[0.06] mb-5">
              {selectedGadget.specs}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-gray-400 block font-['Hind_Siliguri']">দায়িত্বপ্রাপ্ত ভাই</span>
                <span className="text-white font-semibold font-['Hind_Siliguri']">
                  {selectedGadget.assignedTo}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block font-['Hind_Siliguri']">মূল্য / বাজেট</span>
                <span className="text-base font-bold text-[#38bdf8] font-mono">
                  {selectedGadget.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
