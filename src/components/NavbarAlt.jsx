import { useState, useEffect, useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import styles from './NavbarAlt.module.css';

const NAV_LINKS = [
  { label: 'Home',     href: '#hero' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Bio',      href: '#bio' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact' },
];

export default function NavbarAlt() {
  const [scrolled, setScrolled]   = useState(false);
  const [onLight, setOnLight]     = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const linkRefs = useRef([]);
  const ulRef    = useRef(null);
  const [bracketStyle, setBracketStyle] = useState({ left: 0, width: 0 });

  const PAD = 10;

  const measureBracket = (idx) => {
    const el = linkRefs.current[idx];
    const ul = ulRef.current;
    if (!el || !ul) return;
    const ulRect   = ul.getBoundingClientRect();
    const linkRect = el.getBoundingClientRect();
    setBracketStyle({
      left:  linkRect.left - ulRect.left - PAD,
      width: linkRect.width + PAD * 2,
    });
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* Switch to opaque dark style when navbar overlaps a light section */
  useEffect(() => {
    const NAV_HEIGHT = 80;
    const check = () => {
      const sections = ['skills', 'contact'].map(id => document.getElementById(id));
      const isOverLight = sections.some(el => {
        if (!el) return false;
        const { top, bottom } = el.getBoundingClientRect();
        return top < NAV_HEIGHT && bottom > 0;
      });
      setOnLight(isOverLight);
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    const raf = requestAnimationFrame(check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Scroll-position active tracking — on every scroll event, find which section's
     top is closest to (but still above) 40% of the viewport height.
     This is purely positional — no observer events, no timing hacks. */
  useEffect(() => {
    const sectionIds = NAV_LINKS.map(l => l.href.replace('#', ''));
    const TRIGGER = window.innerHeight * 0.4;

    const onScroll = () => {
      let bestIdx = 0;
      sectionIds.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        // Section counts as active once its top has crossed the trigger line
        if (top <= TRIGGER) bestIdx = i;
      });
      setActiveIdx(bestIdx);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount to set the correct initial state
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Re-measure bracket whenever active index changes */
  useEffect(() => { measureBracket(activeIdx); }, [activeIdx]);

  /* Re-measure on resize */
  useEffect(() => {
    const onResize = () => measureBracket(activeIdx);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [activeIdx]);

  return (
    <Motion.nav
      className={[styles.nav, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}
      data-on-light={onLight ? 'true' : undefined}
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <svg className={styles.bg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,0 100,0 83,100 0,100" className={styles.bgFill} />
        <line x1="0" y1="0" x2="100" y2="0" className={styles.bgEdge} vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="100" x2="83" y2="100" className={styles.bgEdge} vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="83" y2="100" className={styles.bgEdge} vectorEffect="non-scaling-stroke" />
      </svg>

      <span className={styles.logo}>LJ</span>

      <ul className={styles.links} ref={ulRef}>
        {NAV_LINKS.map(({ label, href }, i) => (
          <li key={label} style={{ position: 'relative' }}>
            <a
              href={href}
              className={[styles.link, i === activeIdx ? styles.linkActive : ''].filter(Boolean).join(' ')}
              ref={el => linkRefs.current[i] = el}
            >
              {label}
            </a>
          </li>
        ))}

        <Motion.li
          className={styles.bracket}
          animate={{ left: bracketStyle.left, width: bracketStyle.width }}
          transition={{ type: 'spring', stiffness: 400, damping: 38 }}
          aria-hidden="true"
        >
          <svg className={styles.bracketSvg} viewBox="0 0 100 50" preserveAspectRatio="none">
            <line x1="10" y1="0"  x2="100" y2="0"  className={styles.bracketEdge} vectorEffect="non-scaling-stroke" />
            <line x1="0"  y1="50" x2="90"  y2="50" className={styles.bracketEdge} vectorEffect="non-scaling-stroke" />
            <line x1="10" y1="0"  x2="0"   y2="50" className={styles.bracketEdge} vectorEffect="non-scaling-stroke" />
            <line x1="100" y1="0" x2="90"  y2="50" className={styles.bracketEdge} vectorEffect="non-scaling-stroke" />
          </svg>
        </Motion.li>
      </ul>
    </Motion.nav>
  );
}