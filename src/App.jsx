import './index.css';
import NavbarAlt from './components/NavbarAlt';
import Hero     from './components/Hero';
import Skills   from './components/Skills';
import Projects from './components/Projects';
import Contact  from './components/Contact';

export default function App() {
  return (
    <>
      <NavbarAlt />
      <main>
        {/* Dark hero — white pill pattern grows up from the bottom edge */}
        <Hero />

        {/* Skills — light section, immediately below hero fold */}
        <Skills />

        {/* GitHub projects — dark section with card grid */}
        <Projects />

        {/* Contact — light section, continues the alternating pattern */}
        <Contact />
      </main>
    </>
  );
}
