import { useRef, useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import styles from './Skills.module.css';
import VectorSrc from '../assets/newvector.svg';

const MotionSection = Motion.section;
const MotionDiv     = Motion.div;

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

function SkillPill({ name, detail }) {
  return (
    <MotionDiv className={styles.pill} variants={item}>
      <span className={styles.pillName}>{name}</span>
      <span className={styles.pillDetail}>{detail}</span>
    </MotionDiv>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false); // ref so the listener always sees current value

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.25) {
        revealedRef.current = true;
        setRevealed(true);
      } else {
        revealedRef.current = false;
        setRevealed(false);
      }
    };

    // Intentionally NOT calling onScroll() here — we only want real scroll events.
    // On page load scrollY is 0 and the banner should show the scroll CTA.
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isInView = revealed;

  return (
    <MotionSection id="skills" ref={sectionRef} className={styles.section}>

      {/* Mirrored wave — same as Projects */}
      <div className={styles.wingWrap} aria-hidden="true">
        <div className={styles.wingMask}>
          <img src={VectorSrc} className={styles.wingImg} alt="" />
        </div>
      </div>

      {/* ── Heading area — two panels stacked in the same position.
          Panel A: "Scroll to explore" — visible on load, fades out when section enters view.
          Panel B: "Skills & Tools"   — hidden on load, fades in when section enters view.
          Both share .heading (position:absolute top:8rem right:0). ── */}

      {/* Panel A — scroll CTA */}
      <MotionDiv
        className={styles.heading}
        animate={{ opacity: isInView ? 0 : 1, x: isInView ? 40 : 0 }}
        initial={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        aria-hidden={isInView}
        style={{ pointerEvents: isInView ? 'none' : 'auto' }}
      >
        <svg className={styles.headingBg} viewBox="0 0 1120 70" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="220,0 1120,0 1120,70 0,70" className={styles.headingFill} />
          <line x1="220" y1="0"  x2="1120" y2="0"  className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
          <line x1="0"   y1="70" x2="1120" y2="70" className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
          <line x1="220" y1="0"  x2="0"    y2="70" className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
        </svg>
        <div className={styles.headingContent}>
          <div className={styles.scrollCueInner}>
            <h2 className={styles.title}>Scroll to explore</h2>
            <span className={styles.scrollArrow} aria-hidden="true">
              <svg viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="7" y1="0" x2="7" y2="16" stroke="currentColor" strokeWidth="1.4"/>
                <polyline points="1,10 7,16 13,10" stroke="currentColor" strokeWidth="1.4" fill="none"/>
              </svg>
            </span>
          </div>
          <p className={styles.sub}>Skills &amp; Tools below</p>
        </div>
      </MotionDiv>

      {/* Panel B — real Skills & Tools banner */}
      <MotionDiv
        className={styles.heading}
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 40 }}
        initial={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        aria-hidden={!isInView}
        style={{ pointerEvents: isInView ? 'auto' : 'none' }}
      >
        <svg className={styles.headingBg} viewBox="0 0 1120 70" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="220,0 1120,0 1120,70 0,70" className={styles.headingFill} />
          <line x1="220" y1="0"  x2="1120" y2="0"  className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
          <line x1="0"   y1="70" x2="1120" y2="70" className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
          <line x1="220" y1="0"  x2="0"    y2="70" className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
        </svg>
        <div className={styles.headingContent}>
          <h2 className={styles.title}>Skills &amp; Tools</h2>
          <p className={styles.sub}>Design + engineering, end to end</p>
        </div>
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
    </MotionSection>
  );
}
