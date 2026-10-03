# Travel with Bhai Brothers — System Requirements & Feature Specifications

**Document Version:** 2.0.0  
**Status:** Approved & Active  
**Author:** Engineering & Design Team  
**Last Updated:** September 2026  

---

## 1. Executive Summary & Vision

**Travel with Bhai Brothers** is a premier, cinematic adventure chronicle and brotherhood repository. Designed to celebrate lifelong friendships, spontaneous road trips, and wild trekking conquests across Bangladesh (from the clouds of Sajek to the highest peaks of Keokradong, remote wetlands of Tanguar Haor, and coastal beaches of Inani), the platform fuses high-end editorial aesthetics with interactive web technologies.

The application serves three primary purposes:
1. **Interactive Storytelling**: Deliver a world-class, theater-grade cinematic scroll narrative documenting expeditions with split-screen parallax and atmospheric ambient soundscapes.
2. **Squad & Brotherhood Archive**: Immortalize the 13 brothers through a celestial sacred geometry constellation, interactive dossiers, individual skill trees, signature equipment, and hilarious uncensored bloopers.
3. **Expedition & Logistics Intelligence**: Provide transparent breakdowns of itineraries, cost ledgers, GPS trail data, tested adventure gear, and community bucket list voting for future tours.

---

## 2. Core Architectural & Technology Stack

| Layer | Technology | Version / Specification | Rationale |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `16.3.6` (Turbopack engine) | Fast SSG/SSR, static route generation (`generateStaticParams`), SEO optimization |
| **Language** | TypeScript | `^5` (Strict Mode) | Strong type contracts across all tours, squad members, and gadget schemas |
| **Styling** | Vanilla CSS + Tailwind CSS | Tailwind v4 compat / custom design tokens | Complete layout control, high-performance transforms, zero CSS-in-JS runtime |
| **Animation Engine** | GSAP + ScrollTrigger | `^3.14.0` | 60 FPS scrub synchronization, theater-curtain hero split, constellation orbital physics |
| **Iconography** | Hugeicons React | `@hugeicons/react` + `@hugeicons/core-free-icons` | High-fidelity, scalable SVG iconography. **Zero raw emoji policy enforced** |
| **Supplemental Icons** | Lucide React | `^1.16.0` | Navigation chevrons, system utilities, and UI controls |
| **Audio Engine** | Web Audio API / HTML5 Audio | Native Browser API | Cinematic ambient outdoor soundscapes with volume ducking & mute memory |

---

## 3. Strict Iconography Standard: Zero Raw Emojis Policy

### 3.1 Universal Guideline
To maintain an Apple-grade, high-end editorial aesthetic, **no raw Unicode emojis are permitted anywhere in the user interface or source code**. All badges, indicators, emotion markers, and category kickers must be rendered using vector icons from `@hugeicons/react` or `lucide-react`.

### 3.2 Brother Badge Vector Icon Mapping
Each brother in the 13-member squad is paired with an authentic Hugeicon matching their personality and role:

| Brother ID | Name | Nickname & Role | Hugeicon Symbol | Semantic Meaning |
|---|---|---|---|---|
| `rakib` | রাকিব হাসান | ক্যাপ্টেন রাকিব (Master Navigator & Boss) | `Compass01Icon` | Exploration, route navigation & trail leadership |
| `tanvir` | তানভীর আহমেদ | শেফ তানভীর (Master Chef & BBQ King) | `ChefHatIcon` | Culinary mastery, barbecue embers & campfire meals |
| `shakil` | শাকিল চৌধুরী | সিনেমা শাকিল (Lens Master & Drone Pilot) | `Camera01Icon` | Photography, drone videography & cinematic reels |
| `asif` | আসিফ ইকবাল | চিল মাস্টার আসিফ (Sleep Champion & Chill Guy) | `Moon02Icon` | Relaxation, peaceful sleep in moving jeeps |
| `mahim` | মাহিম রেজা | ব্যাংকার মাহিম (Cashier & Budget Architect) | `Coins01Icon` | Financial transparency, budget ledgers & split accounts |
| `fahim` | ফাহিম জামান | রকস্টার ফাহিম (DJ & Ultimate Energy Booster) | `MusicNote03Icon` | Acoustic guitars, highway playlists & campfire vibes |
| `nabil` | নাবিল মোর্শেদ | গিয়ার হেড নাবিল (Tech & Gear Engineer) | `FlashIcon` | Tech backup, solar chargers, GPS gadgets & power |
| `riyad` | রিয়াদুল হাসান | ফার্স্ট এইড রিয়াদ (Medic & Safety Guardian) | `FirstAidKitIcon` | First aid kits, trauma safety, injury management |
| `imtiaz` | ইমতিয়াজ আহমেদ | হাইওয়ে কিং ইমতিয়াজ (Night Pilot & Off-Road Captain) | `Car01Icon` | Mountain 4x4 driving, night highway cruising |
| `sourav` | সৌরভ ভৌমিক | কমেডিয়ান সৌরভ (Comic Relief & Humor Spark) | `LaughingIcon` | Humor, morale boosting, belly-laughter storytelling |
| `ariyan` | আরিয়ান খান | স্টোরি টেলার আরিয়ান (Campfire Chronicler & Poet) | `BookOpen01Icon` | Campfire chronicles, adventure journals, folk legends |
| `zubair` | জুবায়ের মাহমুদ | চা খোর জুবায়ের (Tea Sommelier & Scout) | `TeaIcon` | Local tea culture, tea scouting, social connection |
| `ahnaf` | আহনাফ হাবিব | ডেয়ারডেভিল আহনাফ (Cliff Jumper & Thrill Hunter) | `MountainIcon` | Cliff jumping, waterfall ascents, fearless exploration |

---

## 4. Typography & Color Design Tokens

### 4.1 Typography Hierarchy
- **Display Serif (Cinema Hero)**: `Ogg Medium`, Georgia, serif — Used for grand cinematic scale and editorial drama.
- **Modern Display Headings**: `Outfit`, system-ui, sans-serif — Bold, punchy headings (`font-black`, `tracking-tight`).
- **Bengali Editorial Body**: `Hind Siliguri`, Kalpurush, sans-serif — Highly legible, warm, and poetic Bengali narrative font.
- **Technical & Metric Data**: `JetBrains Mono`, `ui-monospace`, monospace — Coordinates, expenses, durations, status badges.

### 4.2 Color Palette
```css
:root {
  --bg-space: #030914;        /* Deep space abyss */
  --bg-surface: #07192f;      /* Deep midnight blue surface */
  --bg-card: rgba(8, 28, 52, 0.75); /* Glassmorphic card surface */
  
  --sky-glow: #38bdf8;        /* Sky cyan glow (primary accent) */
  --sky-deep: #0284c7;        /* Azure ocean */
  --amber: #f59e0b;           /* Campfire gold */
  --emerald: #10b981;         /* Lush rainforest green */
  --rose: #f43f5e;            /* Adventure coral / heart */
  
  --text-primary: #f8fafc;    /* Crisp snow white */
  --text-secondary: #94a3b8;  /* Muted slate text */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(56, 189, 248, 0.35);
}
```

---

## 5. Functional Feature Specifications

### 5.1 Hero Cinema Curtain Scrub
- **Scroll Synchronization**: Uses GSAP `ScrollTrigger` pinned across a `2800px` scroll distance.
- **Splitframe Curtain Opening**: As user scrolls, the split foreground mountains (`.splitframe-left` and `.splitframe-right`) part outward to reveal the distant cloud kingdom of Sajek.
- **Interactive Expedition Dock**: Floating glass pill dock at the bottom displaying expedition counters (`01 / 05`), current active destination title, and responsive previous/next slide navigation.
- **Card Track Horizontal Scrub**: 5 core sight cards (Sajek Valley, Keokradong Peak, Inani Beach Camp, Tanguar Haor, Lawachara Trail) pan seamlessly across the depth layers.
- **Modal Drilldown**: Clicking any card triggers `TripDetailModal` with full day-by-day itinerary, highlights, and photo snapshots.

### 5.2 Interactive Highway Road & Dynamic Detail Route (`/expeditions/[id]`)
- **Static Generation (`SSG`)**: All 12 expedition routes pre-rendered via `generateStaticParams()`.
- **Hero Banner**: Full-bleed backdrop image with cinematic gradient scrim and location coordinates.
- **Key Metric HUD**: 4-card HUD showing Elevation/Distance, Duration, Average Per-Head Cost, and Weather/Season.
- **Interactive Highway Road Chronicle (`InteractiveTourRoad`)**:
  - Replaces traditional vertical timelines with a horizontally progressing, pinned scroll-scrubbed expedition highway.
  - Realistic asphalt road surface with glowing dashed lane dividers, distance markers, and milestone checkpoints.
  - Animated 4x4 Expedition Vehicle (Chander Gari / Cruiser) with radiant headlights and motion feedback that glides along the road from milestone to milestone.
  - **Dynamic Card Stages**:
    - **Active Card**: Center spotlight with scenic photo, Day/Phase badge, narrative, highlighted brother quote with Hugeicon, and pro traveler tip.
    - **Upcoming Card**: Positioned to the right down the highway as an approachable milestone preview (`পরবর্তী গন্তব্য`).
    - **Previous Card**: Positioned to the left as an archived, conquered milestone with green checkmark (`অর্জিত`).
  - **Pinned Scroll-Scrub**: Uses GSAP ScrollTrigger to pin the section while scrolling drives the car through Day 1 $\to$ Day 2 $\to$ Day 3... Once all milestones are reached, the pin smoothly unpins and continues to the squad roster and cost ledger.
  - **Interactive Shifter Controls**: Direct milestone navigation, Prev/Next day shifter buttons, keyboard arrow controls, and automated Cruise Mode.
- **Transparent Expense Ledger**: Detailed cost breakdown (bus transport, 4x4 moon car rental, wooden cloud cottage, bamboo chicken feasts, government tolls).
- **Tested Gear Checklist**: Specific field equipment used on the trip with ownership status.
- **Squad Roster**: Grid of squad members who attended this specific tour.
- **Uncensored Bloopers Section**: Hilarious uncut mishaps, wrong turns, and brotherly jokes with Hugeicons LaughingIcon badge.

### 5.3 Brotherhood Constellation (`#squad`)
- **Sacred Geometry Canvas**: 1200px orbital layout with central Brotherhood crest, dual concentric orbit rings (`r=240px` and `r=440px`), and 20 shimmering radial rays.
- **13 Celestial Brother Nodes**: Mathematically placed using trigonometric coordinates `(x = cos(θ) * r, y = sin(θ) * r)`.
- **Centering Reliability**: Node positions animated strictly with `xPercent: -50, yPercent: -50` in GSAP to prevent offset shifts.
- **Interactive Hover Dossier**: Hovering over any brother node renders a floating cyberpunk HUD showing nickname, role, completed trip count, and superpower preview.
- **Deep Profile Modal (`BrotherProfileModal`)**: Clicking any brother opens their complete passport:
  - Real high-resolution portrait photograph
  - Official Brotherhood role & nickname
  - Blood group, home district, total completed trips, favorite destination
  - Inspirational travel quote
  - Full origin biography
  - Superpower & funny weakness
  - Signature travel equipment & EDC gear
  - Visual attribute radar/skill bars
  - Hilarious memorable tour blooper

### 5.4 Minimal Expedition Gadgets Hub (`#gadgets`)
- **Clean Editorial Design**: Minimalist layout replacing cluttered management features.
- **Categorical Filtering**: Quick filters for "All", "Owned", "Wishlist", "Camera Gear", "Camping", and "Survival / Power".
- **Product Cards**: Displaying crisp gadget photography, brand, model, weight, essential field use, and ownership badge.
- **Quick-View Modal**: Shows battery life, waterproof rating, field review note, and brother assigned as gear guardian.

### 5.5 Parallax Memory Vault (`#vault`)
- **Multi-Row Horizontal Stream**: 32 curated high-resolution brotherhood photographs drifting at differential speeds on scroll.
- **Interactive Hover Magnification**: Subtle scale and lighting shift on hover.
- **Full-Screen Lightbox**: Clicking any photo opens an edge-to-edge modal with photographer credit, location tag, and story caption.

### 5.6 Interactive Bucket List Voting (`#bucketlist`)
- **Dynamic Leaderboard**: Community and brother voting on upcoming expedition dreams (e.g., Amiakhum Trail, Saint Martin Coral Reef, Dim Pahar Highway, Sundarbans Tiger Reserve).
- **Real-Time Heart Increment**: Instant vote feedback with persistent `localStorage` synchronization.
- **Suggest Destination Modal**: Allows visitors or brothers to submit new destination pitches with target budget and season.

### 5.7 Ambient Soundscape Audio Engine
- **Audio Atmosphere**: Rich, atmospheric outdoor ambient sound (campfire crackle, gentle mountain breeze, crickets).
- **Persistent Header Toggle**: Floating ambient sound button in the top navigation bar with volume level indicator.
- **Graceful Web Audio Autoplay Policy**: Audio initializes on first user interaction with smooth fade-in.

### 5.8 Ultra-Premium Floating Island Capsule Navbar (`Navbar.tsx`)
- **Floating Island Architecture**: Centered capsule header (`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl`) replacing generic full-width bars.
- **Multi-layered Frosted Glass**: `bg-[#040e1f]/85 backdrop-blur-2xl border border-white/15` with specular top glow and ambient cyan shadow.
- **Brand Signature**: Dual-tone glowing compass badge with Outfit bold typography.
- **Scrollspy Navigation**: Real-time section detection highlighting active anchors with a luminous cyan pill and indicator dot.
- **Integrated Audio Visualizer**: Integrated sound toggle with animated jumping EQ bars.
- **Responsive Mobile Drawer**: Frosted glass slide-down drawer with quick category shortcuts and expedition count badges.

### 5.9 Dedicated Brotherhood Origin & Manifesto Page (`/about`)
- **Cinematic Hero Header**: Atmospheric campfire backdrop (`/images/hero_campfire.jpg`) with gradient scrim, glowing tag pill, Outfit typography, and 4 high-contrast live stat counters (8+ years, 13 brothers, 32+ tours, 100% authentic memories).
- **The Origin & Historical Milestones Timeline**:
  - Two-column layout: Storytelling narrative card with historical quotes on the left.
  - Interactive milestone cards on the right (2018 Sayedabad Bus $\to$ 2020 Keokradong Summit $\to$ 2022 Amiakhum/Nafakhum $\to$ 2024 Highland Highway $\to$ 2026 Annapurna/Kanchenjunga Bucketlist).
- **4 Sacred Commandments (Bento Grid)**: 4 glassmorphic Bento cards with Hugeicons & glowing accents:
  1. No Brother Left Behind (১০০% সেফটি ও অহংকারহীন ট্রেইল)
  2. Transparent Ledger & Shared Heart (স্বচ্ছ হিসাব ও নিঃশব্দ ভরসা)
  3. Leave No Trace (জিরো প্লাস্টিক ও প্রকৃতির পবিত্রতা)
  4. Camaraderie Over Crisis (দুর্যোগেও পজিটিভিটি ও অটুট হাসি)
- **13 Brothers Interactive Roster**:
  - Filterable by 5 categories: "সকল ভাই (13)", "নেভিগেশন ও লিডারশিপ (3)", "শেফ ও ক্যাম্পফায়ার (2)", "সিনেমা ও আর্টস (4)", "লজিস্টিকস ও টেক (4)".
  - Dynamic brother cards with portrait, Hugeicon badge, nickname, role, signature quote, district, and trips count.
  - Clicking any brother triggers the full `BrotherProfileModal`.
- **Unfiltered Traditions & Rituals**: 3 authentic cards showcasing real squad culture (Highway Paratha at 3 AM, Midnight Screen-Free Campfire, Backbench Bus Chorus).
- **Brotherhood Pledge & Dual Action CTA**: Emotional pledge banner with direct links to `/expeditions` and `/#vault`.

---

## 6. Non-Functional Requirements & Performance Standards

1. **Zero Emojis Enforced**: CI/CD and lint checks ensure no unicode astral emojis are present in production code.
2. **Smooth 60 FPS Scrolling**: All GSAP transformations utilize hardware-accelerated CSS properties (`transform: translate3d`, `opacity`, `scale`).
3. **Responsive Breakpoints**: Seamless responsive adaptation from mobile screens (360px) to ultra-wide 4K monitors (2560px).
4. **Accessible Semantics**: Semantic HTML5 elements (`<main>`, `<section>`, `<article>`, `<header>`, `<nav>`) with comprehensive ARIA labels.
5. **Static Performance**: 100% pre-rendered SSG pages with sub-second time-to-interactive.
