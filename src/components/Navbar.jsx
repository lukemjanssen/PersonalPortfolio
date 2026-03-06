import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

/* Appears on scroll; transparent at top */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <Motion.nav
      className={styles.nav}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Pill container — always visible, subtle white outline */}
      <div className={`${styles.pill} ${scrolled ? styles.scrolled : ''}`}>
        <span className={styles.logo}>YN</span>
        <ul className={styles.links}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className={styles.link}>{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </Motion.nav>
  );
}
