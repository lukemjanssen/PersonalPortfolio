import { useMemo } from 'react';
import styles from './SectionDivider.module.css';

/* Seeded PRNG — stable pattern on every render */
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/**
 * The Figma design has two diagonal sweep wings that are 180° mirrors:
 *
 *  Dark wing  (white dashes): occupies bottom-right of the dark half —
 *    rows sweep from bottom-left → top-right, shrinking/fading as they rise.
 *
 *  Light wing (dark dashes):  occupies top-left of the light half —
 *    exact 180° rotation, rows sweep from top-right → bottom-left.
 *
 * Both wings live in the same viewBox, stacked so the seam sits at H/2.
 * The "sweep" shape: for each row band the dashes only occupy the
 * right portion of that band (dark) or left portion (light), and that
 * occupied width shrinks linearly as the row moves away from the seam.
 */
function buildDashes(W, H) {
  const rand     = seededRand(99);
  const seam     = H / 2;
  const dashes   = [];

  /* How many row bands in each half */
  const ROWS     = 22;
  /* Dashes per row (more near seam, fewer further away) */
  const MAX_DASH = 18;

  for (let wing = 0; wing < 2; wing++) {
    const isDark = wing === 0; // dark-side wing = white dashes

    for (let row = 0; row < ROWS; row++) {
      /* t: 0 = right at seam, 1 = furthest from seam */
      const t = row / (ROWS - 1);

      /* Row y-centre inside its half */
      const rowH  = (seam / ROWS) * (1 + t * 0.6); // rows get taller further out
      const yBase = isDark
        ? seam - rowH * (row + 0.5)                // above seam (dark half)
        : seam + rowH * (row + 0.5);               // below seam (light half)

      if (yBase < 0 || yBase > H) continue;

      /* The sweep shape: available x-width narrows as we move away from seam.
         Dark wing → right portion only (start shifts right with t).
         Light wing → left portion only (end shifts left with t). */
      const availW    = W * (1 - t * 0.78);   // shrinks to ~22% of width at far end
      const xOffset   = isDark ? W - availW : 0; // dark=right side, light=left side

      const count = Math.max(2, Math.round(MAX_DASH * (1 - t * 0.82)));

      for (let d = 0; d < count; d++) {
        /* Spread dashes within the available width band */
        const xPos     = xOffset + rand() * availW;
        const yJitter  = (rand() - 0.5) * rowH * 1.2;

        /* Longer dashes near the seam, shorter further out */
        const maxLen   = 70 * (1 - t * 0.65);
        const len      = Math.max(3, maxLen * (0.3 + rand() * 0.7));
        const opacity  = (1 - t) * (0.45 + rand() * 0.55);

        dashes.push({
          x: xPos,
          y: yBase + yJitter,
          len,
          opacity,
          isDark,
        });
      }
    }
  }

  return dashes;
}

export default function SectionDivider() {
  const W = 1440;
  const H = 500; // tall viewBox gives the sweeping diagonal room to breathe

  const dashes = useMemo(() => buildDashes(W, H), []);

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={styles.svg}
      >
        {/* Solid section backgrounds */}
        <rect x="0" y="0"     width={W} height={H / 2} fill="var(--clr-bg-dark)"  />
        <rect x="0" y={H / 2} width={W} height={H / 2} fill="var(--clr-bg-light)" />

        {/* Scatter dashes: white on dark side, near-black on light side */}
        {dashes.map(({ x, y, len, opacity, isDark }, i) => (
          <line
            key={i}
            x1={x}       y1={y}
            x2={x + len} y2={y}
            stroke={isDark ? '#ffffff' : '#1a1a2e'}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={opacity}
          />
        ))}
      </svg>
    </div>
  );
}
