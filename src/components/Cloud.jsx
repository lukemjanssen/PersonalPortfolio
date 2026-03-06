import { motion } from 'framer-motion';
import styles from './Cloud.module.css';

const MotionDiv = motion.div;

/**
 * Animated SVG cloud that floats on a sine-like y-axis path.
 * `overlay` mode = semi-transparent mask cloud placed over the image container.
 */
export default function Cloud({
  className = '',
  delay = 0,
  duration = 20,
  amplitude = 20,
  flip = false,
  overlay = false,
}) {
  const floatAnim = {
    y: [0, -amplitude, 0, amplitude, 0],
    transition: { duration, ease: 'easeInOut', repeat: Infinity, delay },
  };

  return (
    <MotionDiv
      className={`${styles.cloud} ${overlay ? styles.overlay : ''} ${className}`}
      style={{ scaleX: flip ? -1 : 1 }}
      animate={floatAnim}
    >
      {/* Layered ellipses build a soft minimalist cloud silhouette */}
      <svg
        viewBox="0 0 320 120"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        aria-hidden="true"
      >
        <ellipse cx="160" cy="90"  rx="155" ry="38" />
        <ellipse cx="110" cy="72"  rx="85"  ry="52" />
        <ellipse cx="200" cy="68"  rx="75"  ry="48" />
        <ellipse cx="155" cy="58"  rx="65"  ry="42" />
        <ellipse cx="245" cy="80"  rx="60"  ry="35" />
        <ellipse cx="70"  cy="82"  rx="55"  ry="32" />
      </svg>
    </MotionDiv>
  );
}
