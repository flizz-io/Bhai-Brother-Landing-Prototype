<!-- BEGIN:nextjs-agent-rules -->
@AGENTS.md
<!-- END:nextjs-agent-rules -->

# Travel with Bhai Brothers — Engineering & Agent Development Guide

Welcome to the **Travel with Bhai Brothers** repository. This document defines project conventions, developer workflows, architectural rules, and coding standards.

---

## 1. Project Overview & Tech Stack

- **Framework**: Next.js 16.3.6 (Turbopack engine, App Router)
- **Language**: TypeScript 5+ (Strict Mode)
- **Animation**: GSAP 3.14 + ScrollTrigger
- **Iconography**: Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`) and Lucide Icons (`lucide-react`)
- **Styling**: Vanilla CSS (`cinema.css`) + Tailwind CSS (`globals.css`)
- **Audio Engine**: Web Audio API ambient soundscape

---

## 2. Essential Commands

```bash
# Run local development server (Turbopack)
npm run dev

# Run full production build & static generation check
npm run build

# Run linting checks
npm run lint

# Start production server
npm run start
```

---

## 3. Strict Development Rules

### Rule 1: Zero Raw Emojis Policy (CRITICAL)
- **Never insert raw Unicode emojis** (e.g., 🧭, 📸, 🍖, 😂, ✨, ✦) anywhere in TypeScript, TSX, CSS, or data files.
- **Always use Hugeicons**:
  - For brother badges: Use `<BrotherBadgeIcon brotherId={brother.id} size={...} />` from `@/components/HugeIcon`.
  - For general icons: Use `<HugeiconsIcon icon={IconName} size={...} className={...} />`.
  - Import icon definitions exclusively from `@hugeicons/core-free-icons`.

### Rule 2: Next.js 16 App Router Conventions
- Dynamic route `params` are asynchronous Promises in Next.js 15+:
  ```tsx
  // Correct Next.js 16 signature:
  export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const resolvedParams = await params;
    // ...
  }
  ```
- Always export `generateStaticParams()` on dynamic routes for full SSG optimization.

### Rule 3: GSAP Animation & Centering Guidelines
- **No CSS Transition Conflicts**: Never apply `transition: all` or CSS transition properties to elements animated by GSAP. This creates rendering conflicts and causes jitter.
- **Accurate Centering**: When positioning or rotating orbital nodes (e.g., in `SquadConstellation.tsx`), always include:
  ```js
  gsap.set(element, { xPercent: -50, yPercent: -50 });
  ```
  Do not use CSS classes like `-translate-x-1/2 -translate-y-1/2` alongside GSAP transform animations, as GSAP overwrites the `transform` matrix.
- **ScrollTrigger Lifecycle**: Always encapsulate animations in `gsap.context()` inside `useEffect` and invoke `ctx.revert()` in the cleanup callback:
  ```tsx
  useEffect(() => {
    const ctx = gsap.context(() => {
      // scroll triggers and timelines
    });
    return () => ctx.revert();
  }, []);
  ```

### Rule 4: Typography & Styling Tokens
- **Cinema Display Serif**: `Ogg Medium` (`font-serif`) for epic hero headlines.
- **Modern Display**: `Outfit` (`font-['Outfit']`, `font-black`, `tracking-tight`) for major section titles.
- **Bengali Editorial Body**: `Hind Siliguri` (`font-['Hind_Siliguri']`) for all Bengali narrative text and tips.
- **Data & Metrics**: `JetBrains Mono` (`font-mono`) for coordinates, prices, and status indicators.

### Rule 5: Data Modifications & Schemas
- To add or modify expeditions: Edit `initialExpeditions` in `src/data/toursData.ts`.
- To add or modify brothers: Edit `initialSquad` in `src/data/toursData.ts`. Ensure `avatar` contains a semantic string identifier (e.g., `"compass"`, `"chef"`, `"camera"`), NOT a raw emoji.
- To add or modify gear: Edit `initialGadgets` in `src/data/gadgetsData.ts`.

### Rule 6: Interactive Highway Road & Floating Navbar Conventions
- **Horizontal Road Trips**: When rendering day-by-day itineraries, use `<InteractiveTourRoad tour={tour} />`. It normalizes either `journeySteps` or `dayWiseItinerary` into a pinned horizontal highway experience with an animated 4x4 expedition car.
- **Floating Island Capsule Navbars**: All navigation headers should follow the luxury floating glass capsule pattern (`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl rounded-full bg-[#040e1f]/85 backdrop-blur-2xl border border-white/15`).
- **Dedicated About Us Route (`/about`)**: Houses the brotherhood origin story, historical milestone timeline, 4 sacred commandments, 13 brothers interactive roster with category filters, and authentic traditions. Accessible via the navbar's "আমাদের গল্প" link.

---

## 4. Documentation References

- [REQUIREMENTS.md](file:///Users/ideeza/Downloads/travel-with-bhai-brothers/REQUIREMENTS.md): Full system requirements, feature specs, and brother badge mappings.
- [FILE_STRUCTURE.md](file:///Users/ideeza/Downloads/travel-with-bhai-brothers/FILE_STRUCTURE.md): Detailed architectural file tree, component breakdown, and data flow diagrams.
