import { motion } from 'framer-motion';
import { FiStar, FiGitBranch, FiExternalLink } from 'react-icons/fi';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import styles from './Projects.module.css';
import VectorSrc from '../assets/newvector.svg';

const MotionSection = motion.section;
const MotionDiv     = motion.div;
const MotionA       = motion.a;

/* Your GitHub username — update this */
const GITHUB_USERNAME = 'your-github-username';

/* Card entrance: fades up when scrolled into view */
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const gridVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

export default function Projects() {
  const { repos, loading, error } = useGitHubRepos(GITHUB_USERNAME);

  return (
    <MotionSection
      id="projects"
      className={styles.section}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Light wing: same SVG flipped 180° and darkened — anchored to the top of Projects */}
      <div className={styles.lightWingWrap} aria-hidden="true">
        <div className={styles.lightWingMask}>
          <img src={VectorSrc} className={styles.lightWingImg} alt="" />
        </div>
      </div>

      {/* Section heading — absolutely positioned top-right, diagonal cut on the left */}
      <MotionDiv
        className={styles.heading}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* SVG: fixed-pixel viewBox so diagonal is always a fixed width
             regardless of how wide the element stretches. Height ~70px, diagonal = 20px. */}
        <svg
          className={styles.headingBg}
          viewBox="0 0 1120 70"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="220,0 1120,0 1120,70 0,70" className={styles.headingFill} />
          <line x1="220" y1="0"  x2="1120" y2="0"  className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
          <line x1="0"   y1="70" x2="1120" y2="70" className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
          <line x1="220" y1="0"  x2="0"    y2="70" className={styles.headingEdge} vectorEffect="non-scaling-stroke" />
        </svg>

        <div className={styles.headingContent}>
          <h2 className={styles.title}>GitHub Projects</h2>
          <p className={styles.sub}>A selection of public repositories</p>
        </div>
      </MotionDiv>

      <div className={styles.container}>

        {/* Loading / error states */}
        {loading && <p className={styles.state}>Loading repos…</p>}
        {error   && <p className={styles.state}>Could not load repos — add your username.</p>}

        {/* Repository card grid */}
        <MotionDiv className={styles.grid} variants={gridVariants}>
          {repos.map((repo) => (
            <MotionA
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className={styles.card}
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(20,22,35,0.14)' }}
            >
              {/* Language badge */}
              {repo.language && (
                <span className={styles.lang}>{repo.language}</span>
              )}

              <h3 className={styles.repoName}>{repo.name}</h3>
              <p className={styles.desc}>
                {repo.description || 'No description provided.'}
              </p>

              {/* Stats row */}
              <div className={styles.stats}>
                <span><FiStar /> {repo.stargazers_count}</span>
                <span><FiGitBranch /> {repo.forks_count}</span>
                <FiExternalLink className={styles.extIcon} />
              </div>
            </MotionA>
          ))}
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
