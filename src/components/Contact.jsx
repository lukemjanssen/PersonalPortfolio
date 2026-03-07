import { useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import { FiGithub, FiMail, FiLinkedin, FiArrowUpRight } from 'react-icons/fi';
import styles from './Contact.module.css';

const MotionSection = Motion.section;
const MotionDiv     = Motion.div;
const MotionA       = Motion.a;

const SOCIALS = [
  { icon: FiGithub,   label: 'GitHub',   href: 'https://github.com/your-github-username' },
  { icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/your-handle' },
  { icon: FiMail,     label: 'Email',    href: 'mailto:you@example.com' },
];

/* Stagger container for the right column items */
const colVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const rowVariant = {
  hidden: { opacity: 0, x: 24 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* Left column lines stagger in upward */
const leftCol = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const leftItem = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Contact() {
  const sectionRef = useRef(null);

  return (
    <MotionSection
      id="contact"
      ref={sectionRef}
      className={styles.section}
    >
      {/* Main content — two columns */}
      <div className={styles.container}>

        {/* Section label spanning both columns */}
        <MotionDiv
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span className={styles.sectionLabel}>Get in touch</span>
          <div className={styles.sectionRule} aria-hidden="true" />
        </MotionDiv>

        {/* ── Left column: the big CTA ── */}
        <MotionDiv
          className={styles.left}
          variants={leftCol}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Motion.p className={styles.eyebrow} variants={leftItem}>
            Available for freelance &amp; full-time roles
          </Motion.p>

          <Motion.h3 className={styles.cta} variants={leftItem}>
            Let&apos;s work<br />together.
          </Motion.h3>

          <Motion.p className={styles.blurb} variants={leftItem}>
            I design and build interfaces where clarity meets craft —
            from pixel-perfect components to performant, accessible web applications.
            If you have a problem worth solving, I&apos;d love to hear about it.
          </Motion.p>

          {/* Primary email CTA — parallelogram matching Hero style */}
          <Motion.a
            href="mailto:you@example.com"
            className={styles.emailBtn}
            variants={leftItem}
            whileHover={{}}
            whileTap={{ scale: 0.97 }}
          >
            <svg
              className={styles.btnBg}
              viewBox="0 0 1200 44"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="0,0 1100,0 1200,44 100,44" className={styles.btnFill} />
              <line x1="0"    y1="0"  x2="1100" y2="0"  className={styles.btnEdge} vectorEffect="non-scaling-stroke" />
              <line x1="100"  y1="44" x2="1200" y2="44" className={styles.btnEdge} vectorEffect="non-scaling-stroke" />
              <line x1="0"    y1="0"  x2="100"  y2="44" className={styles.btnEdge} vectorEffect="non-scaling-stroke" />
              <line x1="1100" y1="0"  x2="1200" y2="44" className={styles.btnEdge} vectorEffect="non-scaling-stroke" />
            </svg>
            <span className={styles.btnLabel}>you@example.com</span>
          </Motion.a>
        </MotionDiv>

        {/* ── Right column: social links ── */}
        <MotionDiv
          className={styles.right}
          variants={colVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Motion.p className={styles.linksLabel} variants={rowVariant}>
            Find me on
          </Motion.p>

          {SOCIALS.map((social) => (
            <MotionA
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className={styles.socialRow}
              variants={rowVariant}
              whileHover={{ x: 6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className={styles.socialIcon}>{<social.icon />}</span>
              <span className={styles.socialLabel}>{social.label}</span>
              <FiArrowUpRight className={styles.socialArrow} />
            </MotionA>
          ))}

          {/* Availability chip */}
          <Motion.div className={styles.availability} variants={rowVariant}>
            <span className={styles.dot} />
            Open to opportunities
          </Motion.div>
        </MotionDiv>

      </div>

      {/* Footer line */}
      <div className={styles.footerLine}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} Luke Janssen — Built with React &amp; Framer Motion
        </p>
      </div>

    </MotionSection>
  );
}
