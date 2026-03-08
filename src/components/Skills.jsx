import { useRef, useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import styles from './Skills.module.css';
import VectorSrc from '../assets/newvector.svg';
import PhotoSrc  from '../assets/EAB44A8B-1957-4C78-84A6-7572B5A972E2_1_201_a.jpeg';

const MotionSection = Motion.section;
const MotionDiv     = Motion.div;
const MotionSpan    = Motion.span;

const DESIGN_SKILLS = [
  { name: 'Figma',           detail: 'UI design, prototyping, auto-layout, variables' },
  { name: 'Design Systems',  detail: 'Component libraries, tokens, documentation' },
  { name: 'Wireframing',     detail: 'Low-fi to hi-fi, user flows, information architecture' },
  { name: 'Prototyping',     detail: 'Interactive flows, micro-interactions, handoff' },
  { name: 'User Research',   detail: 'Usability testing, interviews, heuristic evaluation' },
];

const DEV_SKILLS = [
  { name: 'React',           detail: 'Hooks, context, custom hooks, performance' },
  { name: 'TypeScript',      detail: 'Strict typing, generics, utility types' },
  { name: 'CSS / CSS Modules', detail: 'Flexbox, Grid, animations, custom properties' },
  { name: 'JavaScript',      detail: 'ES2024, async/await, DOM APIs, Web APIs' },
  { name: 'Vite',            detail: 'Build tooling, HMR, asset optimisation' },
  { name: 'Node.js',         detail: 'REST APIs, Express, serverless functions' },
  { name: 'Git',             detail: 'Version control, branching, code review' },
  { name: 'Framer Motion',   detail: 'Gesture-driven animation, scroll effects' },
];

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

/* ── Per-character sweep variants ───────────────────────────────────────
   sweepParent staggers each letter span. The `custom` prop passes the
   delayChildren value so Panel B can wait for Panel A to finish. */
const sweepParent = (delayChildren = 0) => ({
  visible: {
    transition: { staggerChildren: 0.03, delayChildren },
  },
  hidden: {
    transition: { staggerChildren: 0.02 },
  },
});

const sweepChar = {
  visible: { opacity: 1, y: 0, filter: 'blur(0px)',   transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
  hidden:  { opacity: 0, y: 0, filter: 'blur(0.4px)', transition: { duration: 0.16, ease: [0.4, 0, 0.6, 1] } },
};

/* Splits a string into individually animated letter spans.
   `animate` is forwarded so the parent can drive 'visible'/'hidden'. */
function SweepText({ text, className, animate, custom = 0 }) {
  return (
    <MotionDiv
      className={className}
      variants={sweepParent(custom)}
      animate={animate}
      style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'baseline' }}
    >
      {text.split('').map((char, i) => (
        <MotionSpan key={i} variants={sweepChar} style={{ display: 'inline-block' }}>
          {char === ' ' ? '\u00A0' : char}
        </MotionSpan>
      ))}
    </MotionDiv>
  );
}

function SkillPill({ name, detail }) {
  return (
    <MotionDiv className={styles.pill} variants={item}>
      <span className={styles.pillName}>{name}</span>
      <span className={styles.pillDetail}>{detail}</span>
    </MotionDiv>
  );
}

export default function Skills() {
  const sectionRef  = useRef(null);
  const [isInView, setIsInView] = useState(false);
  // 'entering' → plays the banner slide-in + Panel A sweep on mount.
  // Flips to 'idle' after a short delay so subsequent scroll events
  // only toggle between 'visible' / 'hidden' without re-triggering the entrance.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Let one frame pass so the initial render commits, then mark mounted
    // so Panel A's animate switches from 'hidden' → 'visible' (the sweep-in).
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setIsInView(rect.top < window.innerHeight * 0.25);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <MotionSection id="skills" ref={sectionRef} className={styles.section}>

      {/* Top wave — 180° flip of the hero SVG, anchored to section top.
          On desktop: section = wave height, so top-anchored = bottom-anchored (same result).
          On mobile: section taller than one wave; wave stays pinned to the top
          so the Hero→Skills seam is always intact. */}
      <div className={styles.wingWrap} aria-hidden="true">
        <div className={styles.wingMask}>
          <img src={VectorSrc} className={styles.wingImg} alt="" />
        </div>
      </div>

      {/* Bottom wave — mobile only. Natural SVG orientation (no transform),
          dark filter, bottom-anchored — identical to how Hero's wave sits at
          its bottom. Dense end is at bottom-right, meeting Projects' top wave
          which uses scale(-1,-1) so its dense end is at top-left. Together
          they form the same corner-to-corner join as the Hero→Skills seam. */}
      <div className={styles.wingWrapBottom} aria-hidden="true">
        <div className={styles.wingMaskBottom}>
          <img src={VectorSrc} className={styles.wingImgBottom} alt="" />
        </div>
      </div>

      {/* ── Heading area — two panels stacked in the same position.
          Panel A: "Scroll to explore" — visible on load, fades out when section enters view.
          Panel B: "Skills & Tools"   — hidden on load, fades in when section enters view.
          Both share .heading (position:absolute top:8rem right:0). ── */}

      {/* Single banner — slides in from the right on mount, then layout-animates width.
          initial x:60 + opacity:0 → the "pop out from the right" entrance. */}
      <MotionDiv
        className={styles.heading}
        layout
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      >
        <svg className={styles.headingBg} viewBox="0 0 1120 70" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="220,0 1120,0 1120,70 0,70" className={styles.headingFill} />
          <line x1="220" y1="0"  x2="1120" y2="0"  className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
          <line x1="0"   y1="70" x2="1120" y2="70" className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
          <line x1="220" y1="0"  x2="0"    y2="70" className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
        </svg>

        <div className={styles.headingContent}>

          {/* Ghost sizer — invisible but in flow, drives width */}
          <div className={styles.headingGhost} aria-hidden="true">
            {isInView
              ? <><h2 className={styles.title}>Skills &amp; Tools</h2><p className={styles.sub}>Design + engineering, end to end</p></>
              : <><h2 className={styles.title}>Scroll to explore</h2><p className={styles.sub}>Skills &amp; Tools below</p></>
            }
          </div>

          {/* Panel A — starts hidden on first render (before mount frame),
              sweeps in once mounted, sweeps out when isInView. */}
          <div
            className={styles.headingTextSlot}
            aria-hidden={isInView}
            style={{ pointerEvents: isInView ? 'none' : 'auto' }}
          >
            <SweepText
              text="Scroll to explore"
              className={styles.title}
              animate={isInView ? 'hidden' : (mounted ? 'visible' : 'hidden')}
              custom={mounted && !isInView ? 0.3 : 0}
            />
            <SweepText
              text="Skills & Tools below"
              className={styles.sub}
              animate={isInView ? 'hidden' : (mounted ? 'visible' : 'hidden')}
              custom={mounted && !isInView ? 0.38 : 0}
            />
          </div>

          {/* Panel B — always starts and stays hidden until isInView */}
          <div
            className={styles.headingTextSlot}
            aria-hidden={!isInView}
            style={{ pointerEvents: isInView ? 'auto' : 'none' }}
          >
            <SweepText text="Skills & Tools"                   className={styles.title} animate={isInView ? 'visible' : 'hidden'} custom={isInView ? 0.18 : 0} />
            <SweepText text="Design + engineering, end to end" className={styles.sub}   animate={isInView ? 'visible' : 'hidden'} custom={isInView ? 0.23 : 0} />
          </div>
        </div>

        {/* Arrow — centred below the banner, fades out when isInView */}
        <MotionDiv
          className={styles.scrollArrowWrap}
          animate={{ opacity: isInView ? 0 : 1, y: isInView ? 3 : 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: isInView ? 0 : 0.7 }}
          aria-hidden={isInView}
        >
          <span className={styles.scrollArrow} aria-hidden="true">
            <svg viewBox="0 0 10 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Long thin stem */}
              <line x1="5" y1="0" x2="5" y2="22" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
              {/* Shallow, wide chevron — elegant arrowhead */}
              <polyline points="1,18 5,23 9,18" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </span>
        </MotionDiv>
      </MotionDiv>

      <div className={styles.container}>

        {/* Design column */}
        <div className={styles.column}>
          <MotionDiv
            className={styles.columnHeader}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 16 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className={styles.columnIcon}>✦</span>
            <h3 className={styles.columnTitle}>Design</h3>
          </MotionDiv>

          <MotionDiv
            className={styles.pills}
            variants={container}
            animate={isInView ? 'show' : 'hidden'}
            initial="hidden"
          >
            {DESIGN_SKILLS.map(s => <SkillPill key={s.name} {...s} />)}
          </MotionDiv>
        </div>

        {/* Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Development column */}
        <div className={styles.column}>
          <MotionDiv
            className={styles.columnHeader}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 16 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            <span className={styles.columnIcon}>⟨/⟩</span>
            <h3 className={styles.columnTitle}>Development</h3>
          </MotionDiv>

          <MotionDiv
            className={styles.pills}
            variants={container}
            animate={isInView ? 'show' : 'hidden'}
            initial="hidden"
          >
            {DEV_SKILLS.map(s => <SkillPill key={s.name} {...s} />)}
          </MotionDiv>
        </div>

      </div>

      {/* Bio — sits in the wave's open bottom-left zone on desktop.
          Fades in alongside the skills list when the section enters view. */}
      <MotionDiv
        id="bio"
        className={styles.bio}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        {/* Text content */}
        <div className={styles.bioText_block}>
          <p className={styles.bioName}>About Me</p>
          <p className={styles.bioRole}>Full-stack Developer &amp; UI/UX Engineer</p>
          <p className={styles.bioText}>
            I design and build end-to-end — from Figma prototypes and design systems
            to production React applications. Currently at Too Much Info; open to new opportunities.
          </p>
          <p className={styles.bioMeta}>Chicago, IL · lj@morrisdesign.net</p>
        </div>

        {/* Angular photo — clipped to a skewed parallelogram matching the site's geometry */}
        <div className={styles.bioPhoto}>
          <img
            src={PhotoSrc}
            alt="Luke Janssen"
            className={styles.bioPhotoImg}
          />
        </div>
      </MotionDiv>

    </MotionSection>
  );
}
