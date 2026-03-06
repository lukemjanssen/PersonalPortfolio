import styles from './SectionDivider.module.css';
import vectorSrc from '../assets/Vector.svg';

/**
 * Uses the exported Figma SVG for both wings.
 * Dark wing  (white pills): original orientation, sits over the dark hero.
 * Light wing (dark pills):  same SVG rotated 180° + dark fill, over the light section.
 * Both images overlap into their adjacent section via negative margins on the wrapper.
 */
export default function SectionDivider() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      {/* Dark section wing — white pills sweep from top-right down */}
      <div className={styles.half}>
        <img src={vectorSrc} className={styles.imgDark} alt="" />
      </div>

      {/* Light section wing — same SVG rotated 180°, pills tinted dark */}
      <div className={styles.half}>
        <img src={vectorSrc} className={styles.imgLight} alt="" />
      </div>
    </div>
  );
}

