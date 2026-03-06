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
  return (
    <MotionSection id="skills" className={styles.section}>

      {/* Mirrored wave — same as Projects */}
      <div className={styles.wingWrap} aria-hidden="true">
        <img src={VectorSrc} className={styles.wingImg} alt="" />
      </div>

      {/* Heading banner — top-right, same style as Projects */}
      <MotionDiv
        className={styles.heading}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
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
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className={styles.columnIcon}>✦</span>
            <h3 className={styles.columnTitle}>Design</h3>
          </MotionDiv>

          <MotionDiv
            className={styles.pills}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
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
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            <span className={styles.columnIcon}>⟨/⟩</span>
            <h3 className={styles.columnTitle}>Development</h3>
          </MotionDiv>

          <MotionDiv
            className={styles.pills}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {DEV_SKILLS.map(s => <SkillPill key={s.name} {...s} />)}
          </MotionDiv>
        </div>

      </div>
    </MotionSection>
  );
}
