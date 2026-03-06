import styles from './SectionDivider.module.css';
import vectorSrc from '../assets/Vector.svg';

/**
 * Zero-height anchor on the Hero/Projects boundary.
 * Dark wing: white pills, bottom-anchored → grows up into Hero.
 * Light wing: a wrapper div is top-anchored and flipped (scale -1,-1) so it
 *   extends downward; the img inside renders naturally, producing a correct
 *   180° mirror without transform-origin confusion on absolutely-positioned elements.
 */
export default function SectionDivider() {
  return (
    <div className={styles.seam} aria-hidden="true">
      {/* White pills — grows up into dark Hero */}
      <img src={vectorSrc} className={styles.imgDark} alt="" />

      {/* Dark pills — wrapper flips the coordinate space, img fills it top-down */}
      <div className={styles.lightWrap}>
        <img src={vectorSrc} className={styles.imgLight} alt="" />
      </div>
    </div>
  );
}


