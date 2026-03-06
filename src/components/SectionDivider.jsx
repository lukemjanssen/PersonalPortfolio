import styles from './SectionDivider.module.css';
import vectorSrc from '../assets/Vector.svg';

/**
 * Zero-height seam between Hero and Projects.
 * The dark wing (white pills) is anchored to the bottom of this seam,
 * growing upward into the Hero section.
 * The light wing (dark pills) is anchored to the top of this seam,
 * growing downward into the Projects section.
 * Because both are absolutely positioned from y=0 (the exact section boundary),
 * the midpoint of the mirrored pattern always sits flush on the seam.
 */
export default function SectionDivider() {
  return (
    <div className={styles.seam} aria-hidden="true">
      {/* White pills growing up into the dark Hero */}
      <img src={vectorSrc} className={styles.imgDark} alt="" />

      {/* Dark pills growing down into the light Projects — rotated 180° */}
      <img src={vectorSrc} className={styles.imgLight} alt="" />
    </div>
  );
}

