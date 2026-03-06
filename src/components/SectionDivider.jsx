import styles from './SectionDivider.module.css';

/**
 * SVG wedge divider — dark-to-light or light-to-dark.
 * `invert` flips the fill colors for the reverse transition.
 */
export default function SectionDivider({ invert = false }) {
  return (
    <div className={`${styles.divider} ${invert ? styles.invert : ''}`}>
      <svg
        viewBox="0 0 1440 90"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Angled polygon covering the transition */}
        <polygon points="0,90 1440,0 1440,90" />
      </svg>
    </div>
  );
}
