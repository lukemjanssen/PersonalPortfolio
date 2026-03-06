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
 * Reproduces the Figma scatter pattern analytically.
 *
 * The Figma SVG (viewBox 1066×728) has a single diagonal sweep boundary:
 *   top-right corner → bottom-left corner (a straight diagonal).
 * Pills ONLY appear to the RIGHT of this boundary line.
 *
 * We replicate both wings inside one unified viewBox:
 *   - Dark wing  (white pills): occupies the RIGHT of the diagonal in the top half
 *   - Light wing (dark pills):  180° rotation — occupies LEFT of diagonal in bottom half
 *
 * The "wave" that climbs halfway up the section comes from placing the
 * viewBox so it overlaps into both the Hero and Projects sections.
 */
function buildPills(VW, VH) {
  const rand  = seededRand(77);
  const pills = [];
  const TOTAL = 700; // match Figma's ~713 pills

  for (let wing = 0; wing < 2; wing++) {
    const isDark = wing === 0; // dark wing = white pills

    for (let i = 0; i < TOTAL / 2; i++) {
      // Raw coords in 0..1 space, then we'll filter by the diagonal boundary
      const rx = rand();
      const ry = rand();

      // Diagonal boundary: at ry=0 (top) the boundary x = 1.0 (far right)
      //                    at ry=1 (bottom) the boundary x = 0.0 (far left)
      // Pills only exist to the RIGHT of the line: rx > (1 - ry)
      const boundary = 1 - ry;
      if (rx < boundary) { rand(); rand(); continue; } // skip — consume extra randoms for stability

      // Distance from the diagonal boundary (0 = on edge, 1 = far right)
      const dist = (rx - boundary) / ry; // normalised

      // Pill size: larger near the boundary, tiny far away
      const rx2    = Math.max(2, 28 * (1 - dist * 0.7) * (0.3 + rand() * 0.7));
      const ry2    = rx2 * (0.18 + rand() * 0.14); // pill height ~18-32% of width
      const opacity = (1 - dist * 0.8) * (0.4 + rand() * 0.6);

      if (isDark) {
        // Wing 1: white pills in the TOP half of the viewBox (dark bg)
        pills.push({ cx: rx * VW, cy: ry * (VH / 2), rx: rx2, ry: ry2, opacity, isDark });
      } else {
        // Wing 2: dark pills in BOTTOM half — 180° rotation of the dark wing
        pills.push({
          cx: (1 - rx) * VW,
          cy: VH / 2 + (1 - ry) * (VH / 2),
          rx: rx2, ry: ry2, opacity,
          isDark,
        });
      }
    }
  }

  return pills;
}

export default function SectionDivider() {
  const VW = 1440;
  const VH = 900; // tall so the sweep climbs well into both sections

  const pills = useMemo(() => buildPills(VW, VH), []);

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={styles.svg}
      >
        {/* Solid section backgrounds */}
        <rect x="0" y="0"      width={VW} height={VH / 2} fill="var(--clr-bg-dark)"  />
        <rect x="0" y={VH / 2} width={VW} height={VH / 2} fill="var(--clr-bg-light)" />

        {/* Pill-shaped scatter dashes */}
        {pills.map(({ cx, cy, rx, ry, opacity, isDark }, i) => (
          <ellipse
            key={i}
            cx={cx} cy={cy}
            rx={rx} ry={ry}
            fill={isDark ? '#ffffff' : '#1a1a2e'}
            opacity={opacity}
          />
        ))}
      </svg>
    </div>
  );
}
