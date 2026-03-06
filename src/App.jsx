import './index.css';
import NavbarAlt from './components/NavbarAlt';
import Hero     from './components/Hero';
import Projects from './components/Projects';
import Footer   from './components/Footer';

export default function App() {
  return (
    <>
      <NavbarAlt />
      <main>
        {/* Dark hero — white pill pattern grows up from the bottom edge */}
        <Hero />

        {/* Light GitHub portfolio section — dark pill pattern descends from the top edge */}
        <Projects />
      </main>
      <Footer />
    </>
  );
}
