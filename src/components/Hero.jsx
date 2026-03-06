import { useRef, useEffect, useState, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import styles from './Hero.module.css';
import VectorSrc from '../assets/newvector.svg';

/*
 * Lookup table: normalised Y position within the wave image (t: 0=top, 1=bottom)
 * → normalised X of the wave's leftmost pill edge (fraction of image width).
 * Derived by scanning all path coordinates in newvector.svg (1067×727).
 */
const WAVE_EDGE = [
  [0.034, 0.945], [0.103, 0.931], [0.172, 0.893], [0.241, 0.870],
  [0.309, 0.830], [0.378, 0.813], [0.447, 0.761], [0.516, 0.754],
  [0.585, 0.670], [0.653, 0.642], [0.722, 0.554], [0.791, 0.494],
  [0.860, 0.337], [0.928, 0.215], [0.997, 0.023],
];

/** Interpolate the wave left-edge X fraction for a given t in [0,1]. */
function waveEdgeFraction(t) {
  const tc = Math.max(0, Math.min(1, t));
  if (tc <= WAVE_EDGE[0][0]) return WAVE_EDGE[0][1];
  if (tc >= WAVE_EDGE[WAVE_EDGE.length - 1][0]) return WAVE_EDGE[WAVE_EDGE.length - 1][1];
  for (let i = 0; i < WAVE_EDGE.length - 1; i++) {
    const [t0, x0] = WAVE_EDGE[i];
    const [t1, x1] = WAVE_EDGE[i + 1];
    if (tc >= t0 && tc <= t1) {
      const frac = (tc - t0) / (t1 - t0);
      return x0 + (x1 - x0) * frac;
    }
  }
  return WAVE_EDGE[WAVE_EDGE.length - 1][1];
}

/**
 * For a given element ref + wave image ref, compute the marginRight (px)
 * that places the element's right edge flush with the wave's left boundary
 * at the element's vertical midpoint. Returns 0 if refs aren't ready.
 */
function computeWaveMR(elRef, waveRef) {
  const el   = elRef?.current;
  const wave = waveRef?.current;
  if (!el || !wave) return 0;

  const wR = wave.getBoundingClientRect();
  const eR = el.getBoundingClientRect();
  if (wR.height === 0) return 0;

  // Vertical midpoint of the element, relative to the wave image top
  const elMidY   = eR.top + eR.height / 2;
  const t        = (elMidY - wR.top) / wR.height;

  // Absolute screen X of the wave left edge at that height
  const edgeFrac = waveEdgeFraction(t);
  const waveAbsX = wR.left + edgeFrac * wR.width;

  // marginRight = distance from the wave edge to the viewport right wall,
  // plus a gap so the text sits just clear of the pattern edge.
  const GAP = 128; // px — increase to move further left, decrease to tuck closer
  return Math.max(0, window.innerWidth - waveAbsX + GAP);
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

function WaveName({ word, rowOffset = 0, marginRight = 0, forwardRef = null }) {
  const letters = word.split('');
  return (
    <div ref={forwardRef} className={styles.nameRow} style={{ marginLeft: 'auto', marginRight }}>
      {letters.map((char, i) => (
        <Motion.span
          key={i}
          className={styles.nameLetter}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3 + (rowOffset + i) * 0.055,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char}
        </Motion.span>
      ))}
    </div>
  );
}

export default function Hero() {
  const waveRef  = useRef(null);
  const greetRef = useRef(null);
  const lukRef   = useRef(null);
  const janRef   = useRef(null);
  const tagRef   = useRef(null);
  const ctaRef   = useRef(null);

  const [mr, setMr] = useState({ greet: 0, luk: 0, jan: 0, tag: 0, cta: 0 });

  const recalc = useCallback(() => {
    // rAF ensures the browser has finished layout before we read rects
    requestAnimationFrame(() => {
      setMr({
        greet : computeWaveMR(greetRef, waveRef),
        luk   : computeWaveMR(lukRef,   waveRef),
        jan   : computeWaveMR(janRef,   waveRef),
        tag   : computeWaveMR(tagRef,   waveRef),
        cta   : computeWaveMR(ctaRef,   waveRef),
      });
    });
  }, []);

  useEffect(() => {
    const wave = waveRef.current;
    if (!wave) return;

    if (wave.complete && wave.naturalWidth > 0) {
      recalc();
    } else {
      wave.addEventListener('load', recalc, { once: true });
    }

    const ro = new ResizeObserver(recalc);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [recalc]);

  return (
    <section id="hero" className={styles.hero}>

      <img
        ref={waveRef}
        src={VectorSrc}
        className={styles.darkWing}
        alt=""
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <Motion.div
          className={styles.text}
          variants={container}
          initial="hidden"
          animate="show"
        >

          <Motion.p
            ref={greetRef}
            className={styles.greeting}
            style={{ marginRight: mr.greet }}
            variants={item}
          >
            Hello, I&apos;m
          </Motion.p>

          {/* Name rows are direct children of .text so margin-left:auto applies
              identically to greeting/tagline/CTA. marginRight from JS pins the
              right edge to the wave boundary at each row's vertical midpoint.  */}
          <WaveName word="LUKE"    rowOffset={0} marginRight={mr.luk} forwardRef={lukRef} />
          <WaveName word="JANSSEN" rowOffset={4} marginRight={mr.jan} forwardRef={janRef} />

          <Motion.p
            ref={tagRef}
            className={styles.tagline}
            style={{ marginRight: mr.tag }}
            variants={item}
          >
            UX/UI Engineer
          </Motion.p>

          <Motion.a
            ref={ctaRef}
            href="#projects"
            className={styles.cta}
            style={{ marginRight: mr.cta }}
            variants={item}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            View My Work
          </Motion.a>

        </Motion.div>
      </div>
    </section>
  );
}
