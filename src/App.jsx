import { useRef } from 'react';
import './index.css';
import NavbarAlt from './components/NavbarAlt';
import Hero     from './components/Hero';
import Skills   from './components/Skills';
import Projects from './components/Projects';
import Contact  from './components/Contact';

export default function App() {
  const navRef = useRef(null);

  return (
    <>
      <NavbarAlt navRef={navRef} />
      <main>
        <Hero navRef={navRef} />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
