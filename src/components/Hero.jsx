import { motion as Motion } from 'framer-motion';
import styles from './Hero.module.css';
// SVG must be uppercase-aliased to satisfy the no-unused-vars eslint rule
import VectorSrc from '../assets/Vector.svg';

/* Stagger config for text entrance */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>

      {/* Dark wing: white pill pattern anchored at bottom, grows upward */}
      <img src={VectorSrc} className={styles.darkWing} alt="" aria-hidden="true" />

      <div className={styles.inner}>
        {/* Profile image wrapped in clouds */}
        <div className={styles.imageWrap}>
          <img
            src="/profile.jpg"
            alt="Profile"
            className={styles.avatar}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Text content */}
        <Motion.div
          className={styles.text}
          variants={container}
          initial="hidden"
          animate="show"
        >
          <Motion.p className={styles.greeting} variants={item}>
            Hello, I&apos;m
          </Motion.p>
          <Motion.h1 className={styles.name} variants={item}>
            Your Name
          </Motion.h1>
          <Motion.p className={styles.tagline} variants={item}>
            Full-Stack Developer &amp; Creative Builder
          </Motion.p>
          <Motion.a
            href="#projects"
            className={styles.cta}
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
