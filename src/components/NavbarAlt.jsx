import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import styles from './NavbarAlt.module.css';

const NAV_LINKS = [
  { label: 'Home',     href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact' },
];

export default function NavbarAlt() {
  const [scrolled, setScrolled] = useState(false);
  const [onLight, setOnLight]   = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* Watch the Projects section — switch to opaque dark style whenever the
     navbar (fixed, ~60px tall) is overlapping the light-background section. */
  useEffect(() => {
    const NAV_HEIGHT = 80; // px — approximate bottom of the navbar
    const check = () => {
      const target = document.getElementById('projects');
      if (!target) return;
      const { top, bottom } = target.getBoundingClientRect();
      setOnLight(top < NAV_HEIGHT && bottom > 0);
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    // Delay first check until after page paint so getBoundingClientRect is accurate
    const raf = requestAnimationFrame(check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* SVG strategy: preserveAspectRatio="none" lets it stretch to any nav size.
     The polygon fills the background; polylines draw each border edge separately
     so we can omit the left edge and make the diagonal right edge the same
     weight/colour as top and bottom — no clip-path involved, nothing gets cut. */
  return (
    <Motion.nav
      className={[styles.nav, scrolled ? styles.scrolled : '', onLight ? styles.onLight : ''].filter(Boolean).join(' ')}
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* SVG background + border — sits behind content */}
      <svg
        className={styles.bg}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Fill — same colour as the nav glass */}
        <polygon
          points="0,0 100,0 78,100 0,100"
          className={styles.bgFill}
        />
        {/* Top edge */}
        <line x1="0" y1="0" x2="100" y2="0" className={styles.bgEdge} vectorEffect="non-scaling-stroke" />
        {/* Bottom edge */}
        <line x1="0" y1="100" x2="78" y2="100" className={styles.bgEdge} vectorEffect="non-scaling-stroke" />
        {/* Diagonal right edge */}
        <line x1="100" y1="0" x2="78" y2="100" className={styles.bgEdge} vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Nav content */}
      <span className={styles.logo}>LJ</span>
      <ul className={styles.links}>
        {NAV_LINKS.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className={styles.link}>{label}</a>
          </li>
        ))}
      </ul>
    </Motion.nav>
  );
}
