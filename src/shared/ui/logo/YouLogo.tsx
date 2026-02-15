/**
 * YOU Logo — 4 nature-inspired concept variants.
 *
 * 1) Human Y — person shape within the letter Y
 * 2) Sprout Y — stem with two leaves
 * 3) Hybrid Y — person-plant hybrid (seed head + leaf arms)
 * 4) Hug Y — soft embrace shape + small leaf
 *
 * All letters: rounded, organic, uniform stroke width (1.8).
 * O — organic drop/seed. U — cup/palm (care).
 */
import React from "react";
import Svg, { Path, Circle, G, Ellipse } from "react-native-svg";
import { View, Text } from "react-native";

interface LogoProps {
  /** Which Y concept to use */
  variant?: 1 | 2 | 3 | 4;
  /** Overall width of "YOU" logotype */
  width?: number;
  /** Primary color */
  color?: string;
  /** Accent color for leaf/nature details */
  accentColor?: string;
  /** Show tagline underneath */
  tagline?: string;
  /** Tagline color */
  taglineColor?: string;
}

// ─── Shared letter components ────────────────────────────

/** O — organic drop/seed shape (slightly asymmetric circle) */
function LetterO({
  x,
  size,
  color,
  sw,
}: {
  x: number;
  size: number;
  color: string;
  sw: number;
}) {
  // Organic O — slightly egg-shaped, wider at bottom
  const cy = size * 0.52;
  const rx = size * 0.32;
  const ry = size * 0.36;
  return (
    <G>
      <Ellipse
        cx={x + size * 0.5}
        cy={cy}
        rx={rx}
        ry={ry}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  );
}

/** U — cup/palm shape (care, holding) */
function LetterU({
  x,
  size,
  color,
  sw,
}: {
  x: number;
  size: number;
  color: string;
  sw: number;
}) {
  const top = size * 0.18;
  const bottom = size * 0.82;
  const left = x + size * 0.18;
  const right = x + size * 0.82;
  const mid = x + size * 0.5;
  return (
    <Path
      d={`M${left} ${top} L${left} ${size * 0.55} Q${left} ${bottom} ${mid} ${bottom} Q${right} ${bottom} ${right} ${size * 0.55} L${right} ${top}`}
      stroke={color}
      strokeWidth={sw}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

// ─── Y Variants ──────────────────────────────────────────

/** Variant 1: Y = Human — head circle + two arms up + body stem */
function YHuman({ size, color, sw }: { size: number; color: string; sw: number }) {
  const cx = size * 0.5;
  const headR = size * 0.08;
  const headY = size * 0.12;
  const forkY = size * 0.42;
  return (
    <G>
      {/* Head */}
      <Circle cx={cx} cy={headY} r={headR} fill={color} />
      {/* Left arm up */}
      <Path
        d={`M${size * 0.15} ${size * 0.05} Q${size * 0.25} ${size * 0.22} ${cx} ${forkY}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      {/* Right arm up */}
      <Path
        d={`M${size * 0.85} ${size * 0.05} Q${size * 0.75} ${size * 0.22} ${cx} ${forkY}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      {/* Body / stem */}
      <Path
        d={`M${cx} ${forkY} L${cx} ${size * 0.88}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

/** Variant 2: Y = Sprout — stem + two leaves + bud */
function YSprout({
  size,
  color,
  accentColor,
  sw,
}: {
  size: number;
  color: string;
  accentColor: string;
  sw: number;
}) {
  const cx = size * 0.5;
  const forkY = size * 0.4;
  return (
    <G>
      {/* Left leaf */}
      <Path
        d={`M${cx} ${forkY} Q${size * 0.15} ${size * 0.18} ${size * 0.12} ${size * 0.05}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      {/* Left leaf fill */}
      <Path
        d={`M${size * 0.12} ${size * 0.05} Q${size * 0.05} ${size * 0.2} ${size * 0.28} ${size * 0.28} Q${size * 0.22} ${size * 0.12} ${size * 0.12} ${size * 0.05} Z`}
        fill={accentColor}
        opacity={0.3}
      />
      {/* Right leaf */}
      <Path
        d={`M${cx} ${forkY} Q${size * 0.85} ${size * 0.18} ${size * 0.88} ${size * 0.05}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      {/* Right leaf fill */}
      <Path
        d={`M${size * 0.88} ${size * 0.05} Q${size * 0.95} ${size * 0.2} ${size * 0.72} ${size * 0.28} Q${size * 0.78} ${size * 0.12} ${size * 0.88} ${size * 0.05} Z`}
        fill={accentColor}
        opacity={0.3}
      />
      {/* Stem */}
      <Path
        d={`M${cx} ${forkY} L${cx} ${size * 0.88}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      {/* Bud at fork */}
      <Circle
        cx={cx}
        cy={forkY - size * 0.03}
        r={size * 0.04}
        fill={accentColor}
        opacity={0.6}
      />
    </G>
  );
}

/** Variant 3: Y = Hybrid — seed-head + leaf-arms + stem-body (most unique) */
function YHybrid({
  size,
  color,
  accentColor,
  sw,
}: {
  size: number;
  color: string;
  accentColor: string;
  sw: number;
}) {
  const cx = size * 0.5;
  const headY = size * 0.11;
  const forkY = size * 0.42;
  return (
    <G>
      {/* Seed head */}
      <Path
        d={`M${cx} ${headY - size * 0.09} Q${cx + size * 0.07} ${headY - size * 0.04} ${cx} ${headY + size * 0.02} Q${cx - size * 0.07} ${headY - size * 0.04} ${cx} ${headY - size * 0.09} Z`}
        fill={color}
      />
      {/* Left leaf-arm */}
      <Path
        d={`M${size * 0.12} ${size * 0.08} Q${size * 0.18} ${size * 0.25} ${cx} ${forkY}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      {/* Left leaf shape */}
      <Path
        d={`M${size * 0.12} ${size * 0.08} Q${size * 0.02} ${size * 0.18} ${size * 0.2} ${size * 0.26} Q${size * 0.12} ${size * 0.14} ${size * 0.12} ${size * 0.08} Z`}
        fill={accentColor}
        opacity={0.25}
      />
      {/* Right leaf-arm */}
      <Path
        d={`M${size * 0.88} ${size * 0.08} Q${size * 0.82} ${size * 0.25} ${cx} ${forkY}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      {/* Right leaf shape */}
      <Path
        d={`M${size * 0.88} ${size * 0.08} Q${size * 0.98} ${size * 0.18} ${size * 0.8} ${size * 0.26} Q${size * 0.88} ${size * 0.14} ${size * 0.88} ${size * 0.08} Z`}
        fill={accentColor}
        opacity={0.25}
      />
      {/* Stem body */}
      <Path
        d={`M${cx} ${forkY} L${cx} ${size * 0.88}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

/** Variant 4: Y = Hug — rounded, soft Y with a small leaf on one branch */
function YHug({
  size,
  color,
  accentColor,
  sw,
}: {
  size: number;
  color: string;
  accentColor: string;
  sw: number;
}) {
  const cx = size * 0.5;
  const forkY = size * 0.42;
  return (
    <G>
      {/* Left branch — slightly curved / hugging */}
      <Path
        d={`M${size * 0.1} ${size * 0.06} Q${size * 0.2} ${size * 0.3} ${cx} ${forkY}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      {/* Right branch — slightly curved / hugging */}
      <Path
        d={`M${size * 0.9} ${size * 0.06} Q${size * 0.8} ${size * 0.3} ${cx} ${forkY}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      {/* Small leaf on right branch tip */}
      <Path
        d={`M${size * 0.88} ${size * 0.06} Q${size * 0.96} ${size * 0.02} ${size * 0.94} ${size * 0.12} Q${size * 0.9} ${size * 0.1} ${size * 0.88} ${size * 0.06} Z`}
        fill={accentColor}
        opacity={0.5}
      />
      {/* Stem */}
      <Path
        d={`M${cx} ${forkY} L${cx} ${size * 0.88}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

// ─── Main Logo Component ─────────────────────────────────

export function YouLogo({
  variant = 3,
  width = 180,
  color = "#4A6741",
  accentColor = "#6B8C5E",
  tagline,
  taglineColor = "#8A8279",
}: LogoProps) {
  // Each letter takes ~1/3 of width, with small gaps
  const letterSize = width * 0.32;
  const gap = width * 0.02;
  const sw = 1.8;

  // All letters same size, aligned on same baseline
  const ySize = letterSize;

  const totalHeight = letterSize + 4;

  // X positions
  const yX = 0;
  const oX = letterSize + gap;
  const uX = (letterSize + gap) * 2;

  const YComponent = {
    1: YHuman,
    2: YSprout,
    3: YHybrid,
    4: YHug,
  }[variant];

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={width} height={totalHeight} viewBox={`0 0 ${width} ${totalHeight}`}>
        {/* Y — same level as O and U */}
        <G x={yX} y={0}>
          <YComponent size={ySize} color={color} accentColor={accentColor} sw={sw} />
        </G>

        {/* O — organic ellipse */}
        <LetterO x={oX} size={letterSize} color={color} sw={sw} />

        {/* U — cup/palm */}
        <LetterU x={uX} size={letterSize} color={color} sw={sw} />
      </Svg>
      {tagline ? (
        <Text
          style={{
            fontSize: width * 0.055,
            color: taglineColor,
            letterSpacing: width * 0.015,
            marginTop: 4,
            fontWeight: "300",
          }}
        >
          {tagline}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Logo showcase — displays all 4 variants with labels.
 * Useful for comparing concepts.
 */
export function YouLogoShowcase({ width = 160 }: { width?: number }) {
  const variants: { id: 1 | 2 | 3 | 4; name: string; desc: string }[] = [
    { id: 1, name: "Human Y", desc: "Y = person, arms raised up" },
    { id: 2, name: "Sprout Y", desc: "Y = sprout, leaves + bud" },
    { id: 3, name: "Hybrid Y", desc: "Y = person-plant (seed head + leaf arms)" },
    { id: 4, name: "Hug Y", desc: "Y = embrace + small leaf" },
  ];

  return (
    <View style={{ alignItems: "center", gap: 32, paddingVertical: 24 }}>
      {variants.map((v) => (
        <View key={v.id} style={{ alignItems: "center", gap: 8 }}>
          <YouLogo variant={v.id} width={width} tagline="grow naturally" />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#3B3226",
              marginTop: 8,
            }}
          >
            {v.id}. {v.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#8A8279",
              textAlign: "center",
              maxWidth: 220,
            }}
          >
            {v.desc}
          </Text>
        </View>
      ))}
    </View>
  );
}
