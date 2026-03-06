import { useMemo } from 'react';
import styles from './SectionDivider.module.css';

/* Seeded PRNG — keeps the scatter stable across renders */
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/**
 * Builds two mirrored wings of scatter dashes:
 *  – top-right wing: white dashes dissolving out of the dark section
 *  – bottom-left wing: dark dashes dissolving out of the light section
 */
function buildDashes(W, H, count = 560) {
  const rand = seededRand(42);
  const seam = H / 2;
  const dashes = [];

  for (let i = 0; i < count; i++) {
    const isTopRight = i < count / 2;
    /* Power curve → dense near seam, sparse further out */
    const dist = Math.pow(rand(), 1.7);

    const x = isTopRight
      ? W * (0.42 + rand() * 0.58) * (1 - dist * 0.55)
      : W * rand() * 0.58 * (1 - dist * 0.45);

    const y = isTopRight
      ? seam - dist * seam * 0.9 - rand() * 10
      : seam + dist * seam * 0.9 + rand() * 10;

    /* Dashes shrink and fade with distance from seam */
    const len     = Math.max(4, 90 * (1 - dist) * (0.25 + rand() * 0.75));
    const opacity = (1 - dist) * (0.3 + rand() * 0.7);

    dashes.push({ x, y, len, opacity, isTopRight });
  }

  return dashes;
}

export default function SectionDivider() {
  const W = 1440;
  const H = 280; // total height of the dissolve zone

  const dashes = useMemo(() => buildDashes(W, H), []);

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={styles.svg}
      >
        {/* Section background halves */}
        <rect x="0" y="0"     width={W} height={H / 2} fill="var(--clr-bg-dark)"  />
        <rect x="0" y={H / 2} width={W} height={H / 2} fill="var(--clr-bg-light)" />

        {/* Scatter dashes — white on dark side, dark on light side */}
        {dashes.map(({ x, y, len, opacity, isTopRight }, i) => (
          <line
            key={i}
            x1={x}       y1={y}
            x2={x + len} y2={y}
            stroke={isTopRight ? '#ffffff' : '#1a1a2e'}
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={opacity}
          />
        ))}
      </svg>
    </div>
  );
}
