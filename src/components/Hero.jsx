import { useRef, useEffect, useState, useCallback } from 'react';
import { motion as Motion, useScroll, useMotionValue } from 'framer-motion';
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
function computeWaveMR(elRef, waveRef, gap = 64) {
  const el   = elRef?.current;
  const wave = waveRef?.current;
  if (!el || !wave) return null;

  const wR = wave.getBoundingClientRect();
  if (wR.height === 0 || wR.width === 0) return null; // wave not laid out yet

  // Use offsetTop/offsetHeight (layout position, unaffected by CSS transforms
  // like Framer Motion's y:30 initial state) to get the true vertical midpoint.
  const elMidY = el.offsetTop + el.offsetHeight / 2;
  // offsetTop is relative to offsetParent — convert to screen coords via wave's rect
  const heroRect = wave.parentElement?.getBoundingClientRect() ?? wR;
  const elMidYScreen = heroRect.top + elMidY;
  const t = (elMidYScreen - wR.top) / wR.height;

  // Absolute screen X of the wave left edge at that height
  const edgeFrac = waveEdgeFraction(t);
  const waveAbsX = wR.left + edgeFrac * wR.width;

  return Math.max(0, window.innerWidth - waveAbsX + gap);
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

export default function Hero({ navRef }) {
  const heroRef  = useRef(null);
  const waveRef  = useRef(null);

  const lukRef   = useRef(null);
  const janRef   = useRef(null);
  const tagRef   = useRef(null);
  const ctaRef   = useRef(null);

  const [mr, setMr]               = useState(null);
  const [docked, setDocked]       = useState(null);
  const [ctaNatural, setCtaNatural] = useState(null);

  // Motion values initialised to off-screen; set to correct position in recalc
  // before ctaNatural is set, so by the time the CTA renders the values are right.
  const mvX = useMotionValue(-9999);
  const mvY = useMotionValue(-9999);
  const mvW = useMotionValue(0);

  const recalcRef = useRef(null);

  const recalc = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const luk = computeWaveMR(lukRef,  waveRef, 224);
        const jan = computeWaveMR(janRef,  waveRef, 200);
        const tag = computeWaveMR(tagRef,  waveRef, 256);
        const cta = computeWaveMR(ctaRef,  waveRef, 500);

        if (luk === null || jan === null) {
          requestAnimationFrame(() => recalcRef.current?.());
          return;
        }

        setMr({ luk, jan, tag: tag ?? 0, cta: cta ?? 0 });

        const ctaEl = ctaRef?.current;
        const nav   = navRef?.current;
        if (nav && ctaEl) {
          const navR = nav.getBoundingClientRect();
          const ctaR = ctaEl.getBoundingClientRect();
          if (ctaR.width > 0) {
            const naturalX = ctaR.left - 20;
            const naturalY = ctaR.top - 12;
            const naturalW = ctaR.width + 150;   // spacer's CSS-clamped width
            const dockedW  = naturalW;   // full navbar width when docked
            const dockedX  = navR.left + navR.width * (1750 / 2100);
            const dockedY  = navR.top;

            // Set motion values BEFORE setting ctaNatural so the CTA renders
            // at exactly the right position with no spring-from-zero flash.
            mvX.set(naturalX);
            mvY.set(naturalY);
            mvW.set(naturalW);

            setDocked({ x: dockedX, y: dockedY, w: dockedW });
            setCtaNatural({ x: naturalX, y: naturalY, w: naturalW });
          }
        }
      });
    });
  }, [navRef, mvX, mvY, mvW]);

  useEffect(() => { recalcRef.current = recalc; }, [recalc]);

  useEffect(() => {
    const wave = waveRef.current;
    if (!wave) return;
    if (wave.complete && wave.naturalWidth > 0) {
      recalc();
    } else {
      wave.addEventListener('load', recalc, { once: true });
    }
    document.fonts.ready.then(recalc);
    const ro = new ResizeObserver(recalc);
    ro.observe(document.documentElement);
    ro.observe(wave);
    return () => ro.disconnect();
  }, [recalc]);

  // Scroll-driven animation
  const { scrollY } = useScroll();
  const [heroHeight, setHeroHeight] = useState(500);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const m = () => setHeroHeight(el.offsetHeight);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scrollEnd = heroHeight * 0.75;

  // On every scroll tick, update mvX/mvY/mvW directly — no useTransform/useSpring
  // race condition because we always lerp from the known ctaNatural position.
  useEffect(() => {
    if (!ctaNatural || !docked) return;
    const unsubscribe = scrollY.on('change', (sy) => {
      const t = Math.max(0, Math.min(1, sy / scrollEnd));
      mvX.set(ctaNatural.x + (docked.x - ctaNatural.x) * t);
      mvY.set(ctaNatural.y + (docked.y - ctaNatural.y) * t);
      mvW.set(ctaNatural.w + (docked.w - ctaNatural.w) * t);
    });
    // Reset to natural position when deps change (e.g. resize)
    mvX.set(ctaNatural.x);
    mvY.set(ctaNatural.y);
    mvW.set(ctaNatural.w);
    return unsubscribe;
  }, [ctaNatural, docked, scrollY, scrollEnd, mvX, mvY, mvW]);

  return (
    <section id="hero" ref={heroRef} className={styles.hero}>

      <img
        ref={waveRef}
        src={VectorSrc}
        className={styles.darkWing}
        onLoad={recalc}
        alt=""
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <Motion.div
          className={styles.text}
          variants={container}
          initial="hidden"
          animate={mr ? "show" : "hidden"}
          style={{ opacity: mr ? undefined : 0 }}
        >
          <WaveName word="Luke"    rowOffset={0} marginRight={mr?.luk ?? 0} forwardRef={lukRef} />
          <WaveName word="Janssen" rowOffset={4} marginRight={mr?.jan ?? 0} forwardRef={janRef} />

          <Motion.p
            ref={tagRef}
            className={styles.tagline}
            style={{ marginRight: mr?.tag ?? 0 }}
            variants={item}
          >
            UX/UI Engineer
          </Motion.p>

          {/* Invisible spacer — holds the layout gap for the fixed CTA */}
          <Motion.div
            ref={ctaRef}
            className={styles.ctaSpacer}
            style={{ marginRight: mr?.cta ?? 0 }}
            variants={item}
            aria-hidden="true"
          />

        </Motion.div>
      </div>

      {/* CTA lives OUTSIDE Motion.div.text so Framer Motion's transform on
          that container can't trap this position:fixed element. */}
      {mr && !ctaNatural && (
        <a href="#projects" className={styles.ctaStatic} aria-hidden="true" tabIndex={-1}>
          <svg className={styles.ctaBg} viewBox="0 0 2100 44" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <clipPath id="cta-clip-static" clipPathUnits="objectBoundingBox">
                <polygon points="0.2381,0 1,0 0.7619,1 0,1" />
              </clipPath>
            </defs>
            <polygon points="500,0 2100,0 1600,44 0,44" className={styles.ctaFill} />
            <line x1="500"  y1="0"  x2="2100" y2="0"  className={styles.ctaEdge} vectorEffect="non-scaling-stroke" />
            <line x1="0"    y1="44" x2="1600" y2="44" className={styles.ctaEdge} vectorEffect="non-scaling-stroke" />
            <line x1="500"  y1="0"  x2="0"    y2="44" className={styles.ctaEdge} vectorEffect="non-scaling-stroke" />
            <line x1="2100" y1="0"  x2="1600" y2="44" className={styles.ctaEdge} vectorEffect="non-scaling-stroke" />
          </svg>
          <span className={styles.ctaLabel}>View My Work</span>
        </a>
      )}

      {ctaNatural && (
        <Motion.a
          href="#projects"
          className={styles.cta}
          style={{ x: mvX, y: mvY, width: mvW }}
          whileTap={{ scale: 0.97 }}
        >
          <svg className={styles.ctaBg} viewBox="0 0 2100 44" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <clipPath id="cta-clip" clipPathUnits="objectBoundingBox">
                <polygon points="0.2381,0 1,0 0.76000,1 0,1" />
              </clipPath>
            </defs>
            <polygon points="500,0 2100,0 1600,44 0,44" className={styles.ctaFill} />
            <line x1="500"  y1="0"  x2="2100" y2="0"  className={styles.ctaEdge} vectorEffect="non-scaling-stroke" />
            <line x1="0"    y1="44" x2="1600" y2="44" className={styles.ctaEdge} vectorEffect="non-scaling-stroke" />
            <line x1="500"  y1="0"  x2="0"    y2="44" className={styles.ctaEdge} vectorEffect="non-scaling-stroke" />
            <line x1="2100" y1="0"  x2="1600" y2="44" className={styles.ctaEdge} vectorEffect="non-scaling-stroke" />
          </svg>
          <span className={styles.ctaLabel}>View My Work</span>
        </Motion.a>
      )}

    </section>
  );
}
