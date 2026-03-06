import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <p className={styles.copy}>
        © {new Date().getFullYear()} Your Name — Built with React &amp; Framer Motion
      </p>
      <div className={styles.links}>
        <a href="https://github.com/your-github-username" target="_blank" rel="noreferrer">GitHub</a>
        <a href="mailto:you@example.com">Email</a>
      </div>
    </footer>
  );
}
