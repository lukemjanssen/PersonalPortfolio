import './index.css';
import NavbarAlt from './components/NavbarAlt';
import Hero     from './components/Hero';
import Skills   from './components/Skills';
import Projects from './components/Projects';
import Footer   from './components/Footer';

export default function App() {
  return (
    <>
      <NavbarAlt />
      <main>
        {/* Dark hero — white pill pattern grows up from the bottom edge */}
        <Hero />

        {/* Skills — light section, immediately below hero fold */}
        <Skills />

        {/* GitHub projects — light section with card grid */}
        <Projects />
      </main>
      <Footer />
    </>
  );
}
