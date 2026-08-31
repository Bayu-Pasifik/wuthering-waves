import { useEffect } from 'react';
import gsap, { ScrollTrigger, prefersReducedMotion } from './gsapSetup';
import Navigation from './components/Navigation';
import ScrollProgress from './components/ScrollProgress';
import Hero from './sections/Hero';
import Introduction from './sections/Introduction';
import SolarisWorld from './sections/SolarisWorld';
import WhyInteresting from './sections/WhyInteresting';
import Gallery from './sections/Gallery';
import VideoShowcase from './sections/VideoShowcase';
import VersionArchive from './sections/VersionArchive';
import CharacterSpotlight from './sections/CharacterSpotlight';
import CTA from './sections/CTA';

function App() {
  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <Navigation />
      <ScrollProgress />
      <main>
        <Hero />
        <Introduction />
        <SolarisWorld />
        <WhyInteresting />
        <Gallery />
        <VideoShowcase />
        <VersionArchive />
        <CharacterSpotlight />
        <CTA />
      </main>
    </>
  );
}

export default App;
