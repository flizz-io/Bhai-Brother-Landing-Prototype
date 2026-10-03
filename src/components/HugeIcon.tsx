"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Compass01Icon,
  ChefHatIcon,
  Camera01Icon,
  Moon02Icon,
  Coins01Icon,
  MusicNote03Icon,
  FlashIcon,
  FirstAidKitIcon,
  Car01Icon,
  LaughingIcon,
  BookOpen01Icon,
  TeaIcon,
  MountainIcon,
  Location01Icon,
  Calendar01Icon,
  SparklesIcon,
  CameraIcon,
  SmileIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  HeartIcon,
  Clock01Icon,
  UserGroupIcon,
  ArrowRight01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

export type HugeIconType = Parameters<typeof HugeiconsIcon>[0]["icon"];

// Map each brother to an authentic, premium Hugeicon
export const BROTHER_HUGEICONS: Record<string, HugeIconType> = {
  rakib: Compass01Icon,
  tanvir: ChefHatIcon,
  shakil: Camera01Icon,
  asif: Moon02Icon,
  mahim: Coins01Icon,
  fahim: MusicNote03Icon,
  nabil: FlashIcon,
  riyad: FirstAidKitIcon,
  imtiaz: Car01Icon,
  sourav: LaughingIcon,
  ariyan: BookOpen01Icon,
  zubair: TeaIcon,
  ahnaf: MountainIcon,
};

export function BrotherBadgeIcon({
  brotherId,
  size = 14,
  className = "",
  color = "currentColor",
}: {
  brotherId?: string;
  size?: number;
  className?: string;
  color?: string;
}) {
  const icon = (brotherId && BROTHER_HUGEICONS[brotherId]) || Compass01Icon;
  return <HugeiconsIcon icon={icon} size={size} color={color} className={className} />;
}

export {
  HugeiconsIcon,
  Compass01Icon,
  ChefHatIcon,
  Camera01Icon,
  Moon02Icon,
  Coins01Icon,
  MusicNote03Icon,
  FlashIcon,
  FirstAidKitIcon,
  Car01Icon,
  LaughingIcon,
  BookOpen01Icon,
  TeaIcon,
  MountainIcon,
  Location01Icon,
  Calendar01Icon,
  SparklesIcon,
  CameraIcon,
  SmileIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  HeartIcon,
  Clock01Icon,
  UserGroupIcon,
  ArrowRight01Icon,
  Cancel01Icon,
  Menu01Icon,
};
