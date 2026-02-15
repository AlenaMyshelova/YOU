/**
 * Custom organic SVG icons for the YOU app.
 * Nature-inspired: leaf, hill, seed, stone, water, fire, wind.
 */
import React from "react";
import Svg, { Path, Circle, G } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

/**
 * Home icon — hill with sun rising behind it.
 * Evokes natural landscape, warmth, grounded feeling.
 */
export function IconHome({ size = 24, color = "#4A6741", focused }: IconProps) {
  const fillOpacity = focused ? 1 : 0.5;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Sun */}
      <Circle cx={17} cy={8} r={3} fill="#D4A853" opacity={fillOpacity} />
      {/* Sun rays */}
      <Path
        d="M17 3.5V4.5M21 8H20M17 11.5V12.5M14 8H13M20 5L19.3 5.7M20 11L19.3 10.3M14 5L14.7 5.7M14 11L14.7 10.3"
        stroke="#D4A853"
        strokeWidth={0.8}
        strokeLinecap="round"
        opacity={fillOpacity * 0.6}
      />
      {/* Hill / Mountain */}
      <Path
        d="M2 20C2 20 5 11 9 11C12 11 13 14 15 14C17.5 14 20 10 22 10V20H2Z"
        fill={color}
        opacity={fillOpacity}
      />
      {/* Ground line */}
      <Path
        d="M1 20H23"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={fillOpacity}
      />
    </Svg>
  );
}

/**
 * Search icon — magnifying glass with a leaf detail inside.
 */
export function IconSearch({ size = 24, color = "#4A6741", focused }: IconProps) {
  const fillOpacity = focused ? 1 : 0.5;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={11}
        cy={11}
        r={7}
        stroke={color}
        strokeWidth={1.8}
        opacity={fillOpacity}
      />
      {/* Small leaf inside the lens */}
      <Path
        d="M9 13C9 13 10 9 14 8C14 8 12.5 12 9 13Z"
        fill={color}
        opacity={fillOpacity * 0.7}
      />
      <Path
        d="M9.5 12.5L12 9.5"
        stroke={color}
        strokeWidth={0.6}
        strokeLinecap="round"
        opacity={fillOpacity * 0.5}
      />
      {/* Handle */}
      <Path
        d="M16 16L21 21"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={fillOpacity}
      />
    </Svg>
  );
}

/**
 * Create/Add icon — a seed sprouting from soil.
 * Represents creation, new beginning, growth.
 */
export function IconCreate({ size = 24, color = "#4A6741", focused }: IconProps) {
  const fillOpacity = focused ? 1 : 0.5;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Sprout */}
      <Path
        d="M12 18V10"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={fillOpacity}
      />
      {/* Left leaf */}
      <Path
        d="M12 13C12 13 8 12 7 8C7 8 11 8 12 13Z"
        fill={color}
        opacity={fillOpacity * 0.8}
      />
      {/* Right leaf */}
      <Path
        d="M12 10C12 10 16 9 17 5C17 5 13 5 12 10Z"
        fill={color}
        opacity={fillOpacity}
      />
      {/* Soil / ground */}
      <Path
        d="M6 18C6 18 8 16.5 12 16.5C16 16.5 18 18 18 18"
        stroke="#8B7355"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={fillOpacity * 0.7}
      />
      {/* Soil dots */}
      <Circle cx={9} cy={19.5} r={0.8} fill="#8B7355" opacity={fillOpacity * 0.5} />
      <Circle cx={12} cy={20} r={0.8} fill="#8B7355" opacity={fillOpacity * 0.5} />
      <Circle cx={15} cy={19.5} r={0.8} fill="#8B7355" opacity={fillOpacity * 0.5} />
    </Svg>
  );
}

/**
 * Heart-Leaf icon — a heart shape made of two leaves.
 * For notifications/activity tab.
 */
export function IconHeartLeaf({ size = 24, color = "#4A6741", focused }: IconProps) {
  const fillOpacity = focused ? 1 : 0.5;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Heart made of leaves */}
      <Path
        d="M12 21C12 21 4 15 4 9.5C4 6.5 6.5 4 9 4C10.5 4 11.5 4.7 12 5.5C12.5 4.7 13.5 4 15 4C17.5 4 20 6.5 20 9.5C20 15 12 21 12 21Z"
        fill={focused ? color : "none"}
        stroke={color}
        strokeWidth={1.8}
        opacity={fillOpacity}
      />
      {/* Leaf vein on left */}
      <Path
        d="M8 10C9 11 11 13 12 16"
        stroke={focused ? "#F5F0E8" : color}
        strokeWidth={0.8}
        strokeLinecap="round"
        opacity={fillOpacity * 0.5}
      />
      {/* Leaf vein on right */}
      <Path
        d="M16 10C15 11 13 13 12 16"
        stroke={focused ? "#F5F0E8" : color}
        strokeWidth={0.8}
        strokeLinecap="round"
        opacity={fillOpacity * 0.5}
      />
    </Svg>
  );
}

/**
 * Profile icon — tree ring / cross-section of wood.
 * Natural, organic, "identity rings" like trees have.
 */
export function IconProfile({ size = 24, color = "#4A6741", focused }: IconProps) {
  const fillOpacity = focused ? 1 : 0.5;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer ring */}
      <Circle
        cx={12}
        cy={12}
        r={9.5}
        stroke={color}
        strokeWidth={1.5}
        opacity={fillOpacity}
      />
      {/* Middle ring */}
      <Circle
        cx={12}
        cy={12}
        r={6.5}
        stroke={color}
        strokeWidth={1}
        opacity={fillOpacity * 0.7}
      />
      {/* Inner ring */}
      <Circle
        cx={12}
        cy={12}
        r={3.5}
        stroke={color}
        strokeWidth={0.8}
        opacity={fillOpacity * 0.5}
      />
      {/* Center dot — heartwood */}
      <Circle cx={12} cy={12} r={1.5} fill={color} opacity={fillOpacity} />
    </Svg>
  );
}

/**
 * Seed in wind — unique share icon.
 * A dandelion seed floating on a breeze.
 */
export function IconSeedWind({ size = 24, color = "#4A6741", focused }: IconProps) {
  const fillOpacity = focused ? 1 : 0.5;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Seed body */}
      <Path
        d="M8 16L12 8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={fillOpacity}
      />
      {/* Seed fluff — parachute */}
      <G opacity={fillOpacity}>
        <Path d="M12 8L10 4" stroke={color} strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M12 8L14 4" stroke={color} strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M12 8L12 3" stroke={color} strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M12 8L9 5" stroke={color} strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M12 8L15 5" stroke={color} strokeWidth={0.8} strokeLinecap="round" />
      </G>
      {/* Wind lines */}
      <Path
        d="M4 10C6 9.5 8 10.5 10 10M14 6C16 5.5 18 6 20 5.5M5 14C7 13 9 14 11 13.5"
        stroke={color}
        strokeWidth={0.6}
        strokeLinecap="round"
        opacity={fillOpacity * 0.4}
      />
    </Svg>
  );
}

// ─── Element Icons (for reactions / categories) ──────────────

/** Earth — leaf on stone */
export function IconEarth({ size = 20, color = "#6B7B3A" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 16C10 16 4 12 4 7C4 3 8 2 10 6C12 2 16 3 16 7C16 12 10 16 10 16Z"
        fill={color}
        opacity={0.8}
      />
      <Path d="M10 15V7" stroke="#F5F0E8" strokeWidth={0.6} strokeLinecap="round" />
    </Svg>
  );
}

/** Water — drop */
export function IconWater({ size = 20, color = "#5B8FA8" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 3C10 3 4 10 4 13C4 16.3 6.7 18 10 18C13.3 18 16 16.3 16 13C16 10 10 3 10 3Z"
        fill={color}
        opacity={0.7}
      />
    </Svg>
  );
}

/** Air — soft vortex lines */
export function IconAir({ size = 20, color = "#9BAFAD" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M3 8C5 6 8 6 10 8C12 10 15 10 17 8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M4 12C6 10 9 10 11 12C13 14 16 14 18 12"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />
    </Svg>
  );
}

/** Fire — soft candle flame */
export function IconFire({ size = 20, color = "#C67A3C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 2C10 2 5 8 5 12C5 15.3 7.2 18 10 18C12.8 18 15 15.3 15 12C15 8 10 2 10 2Z"
        fill={color}
        opacity={0.8}
      />
      <Path
        d="M10 8C10 8 8 11 8 13C8 14.7 8.9 16 10 16C11.1 16 12 14.7 12 13C12 11 10 8 10 8Z"
        fill="#E8C97A"
        opacity={0.9}
      />
    </Svg>
  );
}
