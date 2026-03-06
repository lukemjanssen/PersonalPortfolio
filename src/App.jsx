import './index.css';
import Navbar         from './components/Navbar';
import Hero           from './components/Hero';
import SectionDivider from './components/SectionDivider';
import Projects       from './components/Projects';
import Footer         from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        {/* Dark hero with animated clouds and pointillism stars */}
        <Hero />

        {/* Angled SVG wedge: dark → light */}
        <SectionDivider />

        {/* Light GitHub portfolio section with dark dot pattern */}
        <Projects />
      </main>
      <Footer />
    </>
  );
}
