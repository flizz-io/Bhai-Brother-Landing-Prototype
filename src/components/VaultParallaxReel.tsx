"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import gsap from "gsap";
import { HugeiconsIcon, Cancel01Icon } from "@/components/HugeIcon";

// Curated 32 Brotherhood expedition and adventure captures
const BROTHERHOOD_MEMORIES = [
  {
    spot: "Konglak Peak, Sajek",
    title: "সাজেক ভ্যালি — মেঘের রাজ্য",
    caption: "কটেজের কিনারায় দাঁড়িয়ে মনে হয়েছিল আমরা আকাশের কোনো ভাসমান দ্বীপে আছি।",
    thumb: "/images/sajek.jpg",
    full: "/images/sajek.jpg",
  },
  {
    spot: "Keokradong Summit",
    title: "ক্যাম্পফায়ার নাইট — ভাইদের আড্ডা",
    caption: "পাহাড়ে রাত যত গভীর হয়, ভাইদের সুর ও গান তত উজ্জ্বল হয়।",
    thumb: "/images/hero_campfire.jpg",
    full: "/images/hero_campfire.jpg",
  },
  {
    spot: "Nilgiri, Bandarban",
    title: "বান্দরবান — কুয়াশাচ্ছন্ন ভোর",
    caption: "শরীরে ক্লান্তি ছিল, কিন্তু চোখে ছিল চূড়া ছোঁয়ার অগাধ আনন্দ।",
    thumb: "/images/bandarban.jpg",
    full: "/images/bandarban.jpg",
  },
  {
    spot: "Tanguar Haor, Sunamganj",
    title: "টাঙ্গুয়ার হাওড় — জোছনার রাত",
    caption: "হাওড়ের শান্ত জলে মেঘালয়ের নীল পাহাড়ের প্রতিচ্ছবি ভেসে ওঠে।",
    thumb: "/images/tanguar.jpg",
    full: "/images/tanguar.jpg",
  },
  {
    spot: "Inani Beach, Cox's Bazar",
    title: "ইনানী সৈকত — সমুদ্রের গর্জন",
    caption: "ইনানী সৈকতে পূর্ণিমা আর ঢেউয়ের ছন্দের মাঝে ভাইদের গান।",
    thumb: "/images/coxsbazar.jpg",
    full: "/images/coxsbazar.jpg",
  },
  {
    spot: "Lawachara, Sreemangal",
    title: "শ্রীমঙ্গল — সবুজ চায়ের দেশে",
    caption: "সবুজ বনে ভোরের কুয়াশায় হারিয়ে যাওয়ার মতো অনুভূতি।",
    thumb: "/images/sreemangal.jpg",
    full: "/images/sreemangal.jpg",
  },
  {
    spot: "Amiakhum Falls, Thanchi",
    title: "আমিয়াখুম — পাথুরে বুনো ট্রেইল",
    caption: "পাথরের পিচ্ছিল ট্রেইল আর পানির গর্জন—রোমাঞ্চের চরম প্রকাশ।",
    thumb: "/images/amiakhum.jpg",
    full: "/images/amiakhum.jpg",
  },
  {
    spot: "Chera Dwip, Saint Martin",
    title: "সেন্টমার্টিন — ছেঁড়াদ্বীপের প্রবাল",
    caption: "ছেঁড়া দ্বীপের কোরাল রিফে ভাটার সময় নীল সমুদ্রের নিঃশব্দ বিস্তার।",
    thumb: "/images/saintmartin.jpg",
    full: "/images/saintmartin.jpg",
  },
  {
    spot: "Kaptai Lake, Rangamati",
    title: "কাপ্তাই লেক — কায়াকিং অ্যাডভেঞ্চার",
    caption: "শান্ত লেকের বুকে কায়াকিং করতে করতে সূর্যাস্ত দেখার মুহূর্ত।",
    thumb: "/images/kaptai.jpg",
    full: "/images/kaptai.jpg",
  },
  {
    spot: "Kuakata Sea Beach",
    title: "কুয়াকাটা — সাগরকন্যা",
    caption: "একই সৈকত থেকে সূর্যাস্ত ও সূর্যোদয় উপভোগের বিরল অভিজ্ঞতা।",
    thumb: "/images/kuakata.jpg",
    full: "/images/kuakata.jpg",
  },
  {
    spot: "Boga Lake, Ruma",
    title: "বগালেক — পৌরাণিক গভীরতা",
    caption: "পাহাড়ের চূড়ায় প্রাকৃতিক মিঠাপানির হ্রদ, রহস্য ও সৌন্দর্যের মেলবন্ধন।",
    thumb: "/images/bogalake.jpg",
    full: "/images/bogalake.jpg",
  },
  {
    spot: "Remakri Falls, Bandarban",
    title: "রেমাক্রি — নাফাখুমের পথ",
    caption: "সাঙ্গু নদীর বুক চিরে নাফাখুম ও রেমাক্রির রোমাঞ্চকর বোট রাইড।",
    thumb: "/images/remakri.jpg",
    full: "/images/remakri.jpg",
  },
  {
    spot: "Ruilui Para, Sajek",
    title: "মেঘের দেশে রোদবৃষ্টির খেলা",
    caption: "পাহাড়ের ভাঁজে ভাঁজে সাদা মেঘের ভেলা আর রঙিন সূর্যাস্ত।",
    thumb: "/images/hero_sajek_sky.jpg",
    full: "/images/hero_sajek_sky.jpg",
  },
  // Additional 19 high-resolution adventure captures
  ...[
    { id: "1506905925346-21bda4d32df4", title: "হিমালয়ান আলপাইন ট্রেইল", spot: "High Altitude Alpine Pass" },
    { id: "1469474968028-56623f02e42e", title: "সবুজ উপত্যকা ও কুয়াশা", spot: "Mountain Mist Sanctuary" },
    { id: "1518837695005-2083093ee35b", title: "সমুদ্রের নীল ঢেউ", spot: "Emerald Ocean Coast" },
    { id: "1441974231531-c6227db76b6e", title: "রোমাঞ্চকর বুনো জঙ্গল", spot: "Deep Rainforest Wilderness" },
    { id: "1470071459604-3b5ec3a7fe05", title: "পাহাড়চূড়ার সূর্যাস্ত", spot: "Sunset Mountain Crest" },
    { id: "1447752875215-b2761acb3c5d", title: "বুনো নদী ও ক্যানিয়ন", spot: "Rapid River Canyon" },
    { id: "1500964757637-c85e8a162699", title: "বরফে ঢাকা পাহাড়চূড়া", spot: "Snowcapped Glacial Summit" },
    { id: "1454496522488-7a8e488e8606", title: "অরণ্যের পথ ধরে হাঁটা", spot: "Pine Forest Explorer" },
    { id: "1501785888041-af3ef285b470", title: "শান্ত হ্রদের স্নিগ্ধ সকাল", spot: "Alpine Mirror Lake" },
    { id: "1444080748397-f442aa95c3e5", title: "আকাশ ও মেঘের মেলা", spot: "Skyline Overlook" },
    { id: "1431794062232-2a99a5431c6c", title: "মরুর বুক চিরে যাত্রা", spot: "Canyon Trail Crossing" },
    { id: "1426604966848-d7adac402bff", title: "পাহাড়ি গিরিখাত", spot: "Granite Gorge Valley" },
    { id: "1490604001847-b712b0c2f967", title: "রোমাঞ্চকর হাইকিং রুট", spot: "Ridge Walk Horizon" },
    { id: "1497436072909-60f360e1d4b1", title: "লেক সাইড ক্যাম্পিং", spot: "Lakeside Campfire" },
    { id: "1505144808419-1957a94ca61e", title: "কোস্টাল ওয়েভ প্যারাডাইজ", spot: "Wild Surf Coast" },
    { id: "1505765050516-f72dcac9c60e", title: "রাতের তারার মেলা", spot: "Milky Way Galaxy View" },
    { id: "1542273917363-3b1817f69a2d", title: "সবুজ বৃক্ষের ছায়া", spot: "Ancient Forest Path" },
    { id: "1418065460487-3e41a6c84dc5", title: "কুয়াশাঘেরা গিরিপথ", spot: "Misty Mountain Pass" },
    { id: "1502082553048-f009c37129b9", title: "সোনারঙা সূর্যালোক", spot: "Golden Hour Peaks" },
  ].map((item) => ({
    spot: item.spot,
    title: item.title,
    caption: "ভাইদের অ্যাডভেঞ্চার ও রোমাঞ্চের স্মৃতিতে অমলিন প্রতিটি মুহূর্ত।",
    thumb: `https://images.unsplash.com/photo-${item.id}?w=420&h=560&fit=crop&q=70&auto=format`,
    full: `https://images.unsplash.com/photo-${item.id}?w=1000&h=1333&fit=crop&q=80&auto=format`,
  })),
];

// Quadruple to form 128 infinite loop cards
const REEL_CARDS = Array.from({ length: 4 * BROTHERHOOD_MEMORIES.length }, (_, i) => ({
  ...BROTHERHOOD_MEMORIES[i % BROTHERHOOD_MEMORIES.length],
  id: i,
}));

const TOTAL_CARDS = REEL_CARDS.length;
const TOTAL_CYCLE_WIDTH = 52 * TOTAL_CARDS;

// Bengali Grapheme Cluster Segmenter to avoid breaking conjuncts and vowel marks (matras)
function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const SegmenterConstructor = (Intl as unknown as {
      Segmenter: new (locale: string, options: { granularity: string }) => {
        segment: (input: string) => Iterable<{ segment: string }>;
      };
    }).Segmenter;
    const segmenter = new SegmenterConstructor("bn", {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(text)).map((s) => s.segment);
  }
  return text.split(" ");
}

// Pseudorandom noise function
function noise(e: number) {
  const t = 43758.5453 * Math.sin(12.9898 * e + 78.233);
  return t - Math.floor(t);
}

// Low-discrepancy Halton sequence generator for organic chaos distribution
function halton(index: number, base: number) {
  let r = 1;
  let n = 0;
  let a = index + 1;
  while (a > 0) {
    r /= base;
    n += (a % base) * r;
    a = Math.floor(a / base);
  }
  return n;
}

// Pre-computed card scatter offsets using Halton sequences
const CARD_SCATTERS = Array.from({ length: TOTAL_CARDS }, (_, t) => ({
  cx: 2 * halton(t, 2) - 1,
  cy: 2 * halton(t, 3) - 1,
  rot: (noise(3 * t + 3) - 0.5) * 26,
  scale: 2.4 + 1.9 * noise(5 * t + 4),
  yBias: (noise(7 * t + 9) - 0.5) * 18,
}));

interface VaultParallaxReelProps {
  className?: string;
}

export default function VaultParallaxReel({ className }: VaultParallaxReelProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const pointerStateRef = useRef({
    active: false,
    lastX: 0,
    lastT: 0,
    didMove: false,
  });
  const rafIdRef = useRef(0);
  const entranceProgressRef = useRef({ current: 0 });
  const bloomProgressRef = useRef({ current: 0 });

  const [windowDimensions, setWindowDimensions] = useState<{
    vw: number;
    vh: number;
  } | null>(null);

  useEffect(() => {
    const handleResize = () =>
      setWindowDimensions({
        vw: window.innerWidth,
        vh: window.innerHeight,
      });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animated lens distortion grid SVG
  const gridSvgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = gridSvgRef.current;
    if (!el) return;
    const applyMask = (p: number) => {
      const r = 132 * p;
      const n = Math.max(0, Math.min(100, r - 32));
      const a = Math.max(0, Math.min(100, r));
      const gradient = `linear-gradient(to right, black 0%, black ${n}%, transparent ${a}%, transparent 100%)`;
      el.style.maskImage = gradient;
      el.style.webkitMaskImage = gradient;
    };
    applyMask(0);
    const tweenObj = { p: 0 };
    const tween = gsap.to(tweenObj, {
      p: 1,
      duration: 1.8,
      delay: 0.1,
      ease: "power3.inOut",
      onUpdate: () => applyMask(tweenObj.p),
    });
    return () => {
      tween.kill();
    };
  }, [windowDimensions]);

  const bulgeMultiplier = 2.4;

  const gridGeometry = useMemo(() => {
    if (!windowDimensions) return null;
    const { vw, vh } = windowDimensions;
    const isMobile = vw < 768;
    const centerX = vw / 2;
    const centerY = isMobile ? 0.4 * vh : vh / 2;
    const maxRadius = isMobile ? 204 : 336;

    const warpPoint = (x: number, y: number): [number, number] => {
      const rx = x - centerX;
      const ry = y - centerY;
      const dist = Math.hypot(rx, ry);
      const bulge =
        dist >= maxRadius
          ? 1
          : 1 + (bulgeMultiplier - 1) * Math.pow(1 - dist / maxRadius, 2);
      return [centerX + rx * bulge, centerY + ry * bulge];
    };

    const polylines: string[] = [];
    for (let r = 0; r <= vw; r += 46) {
      const pts: string[] = [];
      for (let n = 0; n <= vh; n += 6) {
        const [px, py] = warpPoint(r, n);
        pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
      }
      polylines.push(pts.join(" "));
    }
    for (let r = 0; r <= vh; r += 61) {
      const pts: string[] = [];
      for (let n = 0; n <= vw; n += 6) {
        const [px, py] = warpPoint(n, r);
        pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
      }
      polylines.push(pts.join(" "));
    }
    return { lines: polylines, vw, vh };
  }, [windowDimensions, bulgeMultiplier]);

  // Editorial Copy GSAP Stagger Entrance
  const textRefs = useRef<{
    eyebrow: HTMLDivElement | null;
    title: HTMLHeadingElement | null;
    sub: HTMLParagraphElement | null;
    cta: HTMLDivElement | null;
    trust: HTMLDivElement | null;
  }>({
    eyebrow: null,
    title: null,
    sub: null,
    cta: null,
    trust: null,
  });

  useEffect(() => {
    const { eyebrow, title, sub, cta, trust } = textRefs.current;
    if (!title) return;
    const chars = title.querySelectorAll("[data-char]");

    gsap.set([eyebrow, sub, cta, trust].filter(Boolean), {
      opacity: 0,
      y: 22,
      filter: "blur(10px)",
    });
    gsap.set(chars, {
      opacity: 0,
      y: 28,
      scale: 0.7,
      filter: "blur(14px)",
    });

    const tl = gsap.timeline({ delay: 0.25 });
    tl.to(eyebrow, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.9,
      ease: "power3.out",
    })
      .to(
        chars,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.028,
        },
        "-=0.55"
      )
      .to(
        sub,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.6"
      )
      .to(
        cta,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.55"
      )
      .to(
        trust,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.55"
      );
  }, []);

  // Modal Lightbox & Playback State
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const activeModalIndexRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(true);
  const targetSeekOffsetRef = useRef<number | null>(null);
  const clickedOriginRectRef = useRef<DOMRect | null>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const modalOpenCountRef = useRef(0);
  const modalAdvanceAccumulatorRef = useRef(0);

  useEffect(() => {
    activeModalIndexRef.current = activeModalIndex;
  }, [activeModalIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const openModal = useCallback((cardIndex: number, originRect: DOMRect) => {
    clickedOriginRectRef.current = originRect;
    modalOpenCountRef.current++;
    modalAdvanceAccumulatorRef.current = 0;
    setIsPlaying(true);
    setActiveModalIndex(cardIndex);
    velocityRef.current = 0;
  }, []);

  const closeModal = useCallback(() => {
    clickedOriginRectRef.current = null;
    modalAdvanceAccumulatorRef.current = 0;
    setActiveModalIndex(null);
  }, []);

  const stepModal = useCallback((stepDirection: number) => {
    clickedOriginRectRef.current = null;
    modalAdvanceAccumulatorRef.current = 0;
    setActiveModalIndex((prev) =>
      prev === null ? null : (prev + stepDirection + TOTAL_CARDS) % TOTAL_CARDS
    );
    const cur = targetSeekOffsetRef.current ?? scrollOffsetRef.current;
    targetSeekOffsetRef.current = cur + 52 * stepDirection;
  }, []);

  // Step the continuous ribbon on button click
  const stepReel = useCallback((direction: number) => {
    const cur = targetSeekOffsetRef.current ?? scrollOffsetRef.current;
    targetSeekOffsetRef.current = cur + 130 * direction;
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // 3D Tilt and Cursor Sheen Handlers
  const handleCardPointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activeModalIndexRef.current !== null || window.innerWidth < 768) return;
    const tiltEl = e.currentTarget.querySelector<HTMLElement>("[data-tilt]");
    if (tiltEl) {
      tiltEl.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
    }
  }, []);

  const handleCardPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activeModalIndexRef.current !== null || window.innerWidth < 768) return;
    const cardEl = e.currentTarget;
    const rect = cardEl.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    const tiltEl = cardEl.querySelector<HTMLElement>("[data-tilt]");
    const sheenEl = cardEl.querySelector<HTMLElement>("[data-sheen]");

    if (tiltEl) {
      tiltEl.style.transition = "transform 0.08s linear";
      tiltEl.style.transform = `perspective(520px) rotateY(${32 * nx}deg) rotateX(${-(
        32 * ny
      )}deg) scale(1.12)`;
    }
    if (sheenEl) {
      sheenEl.style.opacity = "1";
      sheenEl.style.background = `radial-gradient(circle at ${(nx + 0.5) * 100}% ${(
        ny + 0.5
      ) * 100}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)`;
    }
  }, []);

  const handleCardPointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    const cardEl = e.currentTarget;
    const tiltEl = cardEl.querySelector<HTMLElement>("[data-tilt]");
    const sheenEl = cardEl.querySelector<HTMLElement>("[data-sheen]");

    if (tiltEl) {
      tiltEl.style.transition = "transform 0.7s cubic-bezier(0.16,1,0.3,1)";
      tiltEl.style.transform = "";
    }
    if (sheenEl) {
      sheenEl.style.opacity = "0";
    }
  }, []);

  // Modal FLIP entrance transition from clicked card position
  useEffect(() => {
    if (activeModalIndex === null) return;
    const originRect = clickedOriginRectRef.current;
    const modalEl = modalCardRef.current;
    if (!originRect || !modalEl) return;

    const targetRect = modalEl.getBoundingClientRect();
    const deltaX =
      originRect.left + originRect.width / 2 - (targetRect.left + targetRect.width / 2);
    const deltaY =
      originRect.top + originRect.height / 2 - (targetRect.top + targetRect.height / 2);
    const scaleRatio = originRect.width / targetRect.width;

    gsap.fromTo(
      modalEl,
      {
        x: deltaX,
        y: deltaY,
        scale: scaleRatio,
        opacity: 0.85,
        force3D: true,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: "expo.out",
      }
    );

    clickedOriginRectRef.current = null;
  }, [activeModalIndex]);

  // Main Physics & 3D Wave Motion Loop
  useEffect(() => {
    const container = sectionRef.current;
    const cardElements = cardElementsRef.current;
    if (!container) return;

    let vpWidth = window.innerWidth;
    let vpHeight = window.innerHeight;
    const onResize = () => {
      vpWidth = window.innerWidth;
      vpHeight = window.innerHeight;
    };

    // SOLVED SCROLL-TRAP / LOOP:
    // Only capture horizontal swipes (e.g. trackpad swipe left/right).
    // DO NOT preventDefault on vertical wheel scroll!
    // This allows the user to scroll up and down the page completely freely!
    const handleWheel = (e: WheelEvent) => {
      if (activeModalIndexRef.current !== null) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        velocityRef.current += 0.6 * e.deltaX;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (activeModalIndexRef.current === null) {
        pointerStateRef.current.active = true;
        pointerStateRef.current.lastX = e.clientX;
        pointerStateRef.current.lastT = performance.now();
        pointerStateRef.current.didMove = false;
        velocityRef.current = 0;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!pointerStateRef.current.active) return;
      const now = performance.now();
      const dx = e.clientX - pointerStateRef.current.lastX;
      const dt = Math.max(1, now - pointerStateRef.current.lastT);

      pointerStateRef.current.lastX = e.clientX;
      pointerStateRef.current.lastT = now;
      if (Math.abs(dx) > 1) {
        pointerStateRef.current.didMove = true;
      }

      const isMobile = window.innerWidth < 768;
      const dragFactor = isMobile ? 0.3 : 1.45;
      let moveDelta = -dx * dragFactor;
      if (isMobile) {
        moveDelta = Math.max(-9, Math.min(9, moveDelta));
      }
      scrollOffsetRef.current += moveDelta;

      let throwVel = -((dx / dt) * 16) * dragFactor;
      if (isMobile) {
        throwVel = Math.max(-7, Math.min(7, throwVel));
      }
      velocityRef.current = throwVel;
    };

    const handlePointerUp = () => {
      pointerStateRef.current.active = false;
    };

    window.addEventListener("resize", onResize);

    // Initial entrance animators
    entranceProgressRef.current.current = 0;
    bloomProgressRef.current.current = 0;

    gsap.to(entranceProgressRef.current, {
      current: 1,
      duration: 1.8,
      ease: "power3.inOut",
      delay: 0.4,
    });

    gsap.to(bloomProgressRef.current, {
      current: 1,
      duration: 1.6,
      ease: "power2.inOut",
      delay: 1.9,
    });

    let isVisible = false;

    const startLoop = () => {
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    const stopLoop = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };

    // High performance 60/120fps requestAnimationFrame physics tick (viewport-aware)
    const loop = () => {
      if (!isVisible) {
        rafIdRef.current = 0;
        return;
      }

      const isModalOpen = activeModalIndexRef.current !== null;
      const isEntering = entranceProgressRef.current.current < 1;

      if (targetSeekOffsetRef.current !== null) {
        const target = targetSeekOffsetRef.current;
        scrollOffsetRef.current += (target - scrollOffsetRef.current) * 0.18;
        if (Math.abs(target - scrollOffsetRef.current) < 0.3) {
          scrollOffsetRef.current = target;
          targetSeekOffsetRef.current = null;
          scrollOffsetRef.current =
            ((scrollOffsetRef.current % TOTAL_CYCLE_WIDTH) + TOTAL_CYCLE_WIDTH) %
            TOTAL_CYCLE_WIDTH;
        }
        velocityRef.current = 0;
      } else if (isModalOpen) {
        if (isPlayingRef.current) {
          const step = velocityRef.current + -0.32;
          scrollOffsetRef.current += step;
          velocityRef.current *= 0.94;
          modalAdvanceAccumulatorRef.current += step;
          scrollOffsetRef.current =
            ((scrollOffsetRef.current % TOTAL_CYCLE_WIDTH) + TOTAL_CYCLE_WIDTH) %
            TOTAL_CYCLE_WIDTH;

          if (Math.abs(modalAdvanceAccumulatorRef.current) >= 52) {
            const dir = modalAdvanceAccumulatorRef.current > 0 ? 1 : -1;
            modalAdvanceAccumulatorRef.current -= 52 * dir;
            setActiveModalIndex((prev) =>
              prev === null ? null : (prev + dir + TOTAL_CARDS) % TOTAL_CARDS
            );
          }
        }
      } else if (!pointerStateRef.current.active) {
        const isMobile = vpWidth < 768;
        if (isMobile) {
          if (velocityRef.current > 7) velocityRef.current = 7;
          else if (velocityRef.current < -7) velocityRef.current = -7;
        }
        // Continuous organic idle drift of -0.32 plus momentum
        scrollOffsetRef.current += velocityRef.current + -0.32;
        velocityRef.current *= isMobile ? 0.82 : 0.94;
        scrollOffsetRef.current =
          ((scrollOffsetRef.current % TOTAL_CYCLE_WIDTH) + TOTAL_CYCLE_WIDTH) %
          TOTAL_CYCLE_WIDTH;
      }

      const isMobile = vpWidth < 768;
      const centerY = isMobile ? 0.4 * vpHeight : vpHeight / 2;

      for (let i = 0; i < TOTAL_CARDS; i++) {
        const el = cardElements[i];
        if (!el) continue;

        let cardPos = 52 * i - scrollOffsetRef.current;
        cardPos =
          ((cardPos % TOTAL_CYCLE_WIDTH) + TOTAL_CYCLE_WIDTH) % TOTAL_CYCLE_WIDTH;
        if (cardPos > vpWidth + 52) {
          cardPos -= TOTAL_CYCLE_WIDTH;
        }

        const normX = (cardPos + 23) / vpWidth;
        let bloomFactor = 0;
        const bloomCurrent = bloomProgressRef.current.current;

        if (bloomCurrent > 0 && normX > 0.3 && normX < 0.8) {
          let s = Math.sin(((normX - 0.3) / 0.5) * Math.PI);
          s = s * s * (3 - 2 * s) * bloomCurrent;
          bloomFactor = s;
        }

        const scatter = CARD_SCATTERS[i];
        const spanX = vpWidth * (isMobile ? 0.24 : 0.22);
        const spanY = vpHeight * (isMobile ? 0.22 : 0.3);
        const offsetX = scatter.cx * spanX * bloomFactor;
        const offsetY = isMobile
          ? (0.6 * scatter.cy - 0.45) * spanY * bloomFactor
          : scatter.cy * spanY * bloomFactor;
        const rotDeg = scatter.rot * bloomFactor;
        const scaleVal = 0.2 * (1 + (scatter.scale - 1) * bloomFactor);

        let elevationLift = 0;
        if (normX < 0.55) {
          const inv = 1 - normX / 0.55;
          elevationLift = -(inv * inv * (3 - 2 * inv) * 220);
        }

        const posX = cardPos + 23 - 115 + offsetX;
        const posY = centerY - 152.5 + scatter.yBias + offsetY + elevationLift;

        el.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotDeg}deg) scale(${scaleVal})`;
        el.style.zIndex = String(1 + Math.round(30 * bloomFactor));

        if (isEntering) {
          const opacityVal = (entranceProgressRef.current.current - normX) * 7;
          el.style.opacity = String(Math.max(0, Math.min(1, opacityVal)));
        } else {
          el.style.opacity = "1";
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: "300px 0px 300px 0px" }
    );

    observer.observe(container);

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      observer.disconnect();
      stopLoop();
      window.removeEventListener("resize", onResize);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  // Keyboard navigation when modal is open
  useEffect(() => {
    if (activeModalIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowRight") {
        stepModal(1);
      } else if (e.key === "ArrowLeft") {
        stepModal(-1);
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalIndex, closeModal, stepModal, togglePlay]);

  return (
    <section
      id="vault"
      ref={sectionRef}
      className={`relative w-full h-screen overflow-hidden bg-[#05070e] text-white select-none touch-none cursor-grab active:cursor-grabbing isolate ${
        className ?? ""
      }`}
    >
      {/* 2D Perspective Grid with Center Lens Bulge Distortion */}
      {gridGeometry && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 82% at center, black 10%, transparent 92%)",
            maskImage:
              "radial-gradient(ellipse 78% 82% at center, black 10%, transparent 92%)",
          }}
        >
          <svg
            ref={gridSvgRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full text-white"
            viewBox={`0 0 ${gridGeometry.vw} ${gridGeometry.vh}`}
            preserveAspectRatio="none"
          >
            {gridGeometry.lines.map((linePoints, idx) => (
              <polyline
                key={idx}
                points={linePoints}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
      )}

      {/* Endless 3D Flowing Card Ribbon with Edge Fading */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        }}
      >
        {REEL_CARDS.map((card, idx) => (
          <div
            key={idx}
            ref={(el) => {
              cardElementsRef.current[idx] = el;
            }}
            onClick={(e) => {
              if (!pointerStateRef.current.didMove) {
                openModal(idx, e.currentTarget.getBoundingClientRect());
              }
            }}
            onPointerEnter={handleCardPointerEnter}
            onPointerMove={handleCardPointerMove}
            onPointerLeave={handleCardPointerLeave}
            className="group absolute top-0 left-0 will-change-transform overflow-hidden rounded-[10px] cursor-pointer shadow-2xl shadow-black/80"
            style={{
              width: 230,
              height: 305,
              transformOrigin: "center center",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div
              data-tilt
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <img
                src={card.thumb}
                alt={card.title}
                draggable={false}
                loading="lazy"
                className="w-full h-full object-cover pointer-events-none scale-[1.05]"
              />
              <div
                data-sheen
                className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay"
                style={{ transition: "opacity 0.4s ease-out" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Editorial Content on Left (Brotherhood Travel & Memory Vault) */}
      <div className="pointer-events-none absolute bottom-6 left-5 right-5 z-[40] max-w-xl text-white md:bottom-14 md:left-14 md:right-auto">
        <div
          ref={(el) => {
            textRefs.current.eyebrow = el;
          }}
          className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#38bdf8] font-mono"
        >
          <span className="h-px w-8 bg-[#38bdf8]/60" />
          স্মৃতির মহাফেজখানা · ২০১৪ — ২০২৬
        </div>

        <h1
          ref={(el) => {
            textRefs.current.title = el;
          }}
          className="font-['Hind_Siliguri',sans-serif] text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] tracking-tight text-white"
        >
          {splitGraphemes("প্রতিটি ফ্রেমে,").map((char, r) => (
            <span
              key={`a-${r}`}
              data-char
              className="inline-block whitespace-pre will-change-transform"
            >
              {char}
            </span>
          ))}
          <br />
          <span className="text-[#38bdf8] font-bold">
            {splitGraphemes("হাজারো স্মৃতি।").map((char, r) => (
              <span
                key={`b-${r}`}
                data-char
                className="inline-block whitespace-pre will-change-transform"
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        <p
          ref={(el) => {
            textRefs.current.sub = el;
          }}
          className="mt-5 hidden max-w-md text-[15px] leading-relaxed text-gray-300 md:block font-['Hind_Siliguri',sans-serif]"
        >
          ১২ বছরের পাহাড়ি ট্রেইল, সমুদ্রের নীল ঢেউ আর ক্যাম্পফায়ারের গল্প — এক অন্তহীন জীবন্ত রিল। মাউস দিয়ে ড্র্যাগ করে ঘুরে দেখুন, ক্লিক করে দেখুন ফুল ভিউ।
        </p>

        <div
          ref={(el) => {
            textRefs.current.cta = el;
          }}
          className="pointer-events-auto mt-5 flex items-center gap-3 md:mt-7 md:gap-4"
        >
          <a
            href="#expeditions"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95 shadow-lg shadow-black/40 font-['Hind_Siliguri']"
          >
            <span>ট্যুর ডায়েরি এক্সপ্লোর করুন</span>
            <span className="transition-transform group-hover:translate-x-0.5 font-sans">
              →
            </span>
          </a>
          <a
            href="#bucketlist"
            className="text-sm text-gray-300 underline-offset-4 hover:text-white hover:underline transition font-['Hind_Siliguri']"
          >
            পরবর্তী বাকেটলিস্ট
          </a>
        </div>

        <div
          ref={(el) => {
            textRefs.current.trust = el;
          }}
          className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-gray-300 md:mt-8 md:gap-4 font-['Hind_Siliguri']"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse" />
            <span className="font-bold text-white text-sm">১৫+</span>
            <span className="text-gray-300">অ্যাডভেঞ্চার মিশন</span>
          </div>
          <span className="h-3 w-px bg-white/20" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white text-sm">১২ জন</span>
            <span className="text-gray-300">ভাই ব্রাদার্স</span>
          </div>
          <span className="hidden h-3 w-px bg-white/20 sm:inline-block" />
          <span className="hidden sm:inline text-gray-400">
            সাজেক • বান্দরবান • টাঙ্গুয়ার হাওড় • সেন্টমার্টিন
          </span>
        </div>
      </div>

      {/* Floating Interactive Controls (Manual Step & Drag Hint) */}
      <div className="pointer-events-auto absolute bottom-6 right-5 z-[40] flex items-center gap-2 md:bottom-14 md:right-14">
        <button
          type="button"
          onClick={() => stepReel(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white/90 text-2xl backdrop-blur-md border border-white/15 transition hover:bg-white/20 hover:scale-105 active:scale-95 shadow-xl"
          aria-label="আগের ফ্রেম"
          title="আগের ফ্রেম"
        >
          ‹
        </button>
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs text-white/70 font-['Hind_Siliguri']">
          <span className="text-sm">↔</span>
          <span>ড্র্যাগ করে রিল ঘুরান</span>
        </div>
        <button
          type="button"
          onClick={() => stepReel(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white/90 text-2xl backdrop-blur-md border border-white/15 transition hover:bg-white/20 hover:scale-105 active:scale-95 shadow-xl"
          aria-label="পরের ফ্রেম"
          title="পরের ফ্রেম"
        >
          ›
        </button>
      </div>

      {/* Lightbox Modal with Auto-Drift & FLIP Zoom Transition */}
      {activeModalIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300"
          onClick={closeModal}
        >
          {/* Previous Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              stepModal(-1);
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/90 text-2xl backdrop-blur transition hover:bg-white/25 active:scale-95"
            aria-label="Previous"
          >
            ‹
          </button>

          {/* Modal Focus Card */}
          <div
            ref={modalCardRef}
            onClick={(e) => e.stopPropagation()}
            className="relative overflow-hidden rounded-xl will-change-transform shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/10"
            style={{
              width: "min(78vw, calc(82vh * 3 / 4))",
              height: "min(82vh, calc(78vw * 4 / 3))",
              transformOrigin: "center center",
            }}
          >
            <img
              src={REEL_CARDS[activeModalIndex].full}
              alt={REEL_CARDS[activeModalIndex].title}
              draggable={false}
              className="h-full w-full object-cover"
            />

            {/* Lightbox Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition hover:bg-black/80 hover:scale-105 active:scale-95 shadow-lg"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Bottom Vignette Caption with Brotherhood details */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col sm:flex-row sm:items-end justify-between gap-2 pointer-events-none">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#38bdf8] font-mono">
                  {REEL_CARDS[activeModalIndex].spot}
                </span>
                <p className="text-white text-base sm:text-lg font-semibold font-['Hind_Siliguri'] mt-0.5">
                  {REEL_CARDS[activeModalIndex].title}
                </p>
                <p className="text-gray-300 text-xs sm:text-sm font-['Hind_Siliguri'] line-clamp-1 mt-0.5">
                  {REEL_CARDS[activeModalIndex].caption}
                </p>
              </div>
              <span className="text-xs text-white/50 font-['Hind_Siliguri'] shrink-0">
                Space চাপুন {isPlaying ? "পজ" : "প্লে"} করতে
              </span>
            </div>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              stepModal(1);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/90 text-2xl backdrop-blur transition hover:bg-white/25 active:scale-95"
            aria-label="Next"
          >
            ›
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur transition hover:bg-white/25 hover:rotate-90 active:scale-95"
            aria-label="Close"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
