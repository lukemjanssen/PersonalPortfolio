import { motion as Motion } from 'framer-motion';
import Cloud from './Cloud';
import styles from './Hero.module.css';

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

      {/* Animated clouds — left cluster */}
      <Cloud className={styles.cloudLeft1} delay={0} duration={18} amplitude={22} />
      <Cloud className={styles.cloudLeft2} delay={3} duration={24} amplitude={14} />

      {/* Animated clouds — right cluster */}
      <Cloud className={styles.cloudRight1} delay={1.5} duration={20} amplitude={18} flip />
      <Cloud className={styles.cloudRight2} delay={5}  duration={26} amplitude={12} flip />

      <div className={styles.inner}>
        {/* Profile image wrapped in clouds */}
        <div className={styles.imageWrap}>
          <img
            src="/profile.jpg"
            alt="Profile"
            className={styles.avatar}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {/* Cloud overlay that partially masks the image */}
          <Cloud className={styles.cloudMaskBottom} delay={0.5} duration={22} amplitude={10} overlay />
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
