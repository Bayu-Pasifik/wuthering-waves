import { useEffect } from 'react';
import gsap from './gsapSetup';
import { ScrollTrigger } from './gsapSetup';
import { Observer } from 'gsap/Observer';
import { prefersReducedMotion } from './gsapSetup';
import ScrollProgress from './components/ScrollProgress';
import Hero from './sections/Hero';
import About from './sections/About';
import WhyInteresting from './sections/WhyInteresting';
import Gallery from './sections/Gallery';
import VideoShowcase from './sections/VideoShowcase';
import CharacterSpotlight from './sections/CharacterSpotlight';
import Timeline from './sections/Timeline';
import CTA from './sections/CTA';

function App() {
  useEffect(() => {
    ScrollTrigger.refresh();

    // Observer for custom scroll detection (progress indicator)
    if (!prefersReducedMotion) {
      Observer.create({
        type: 'wheel,touch',
        onUpdate: (self) => {
          // Can be used for custom scroll behaviors
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <ScrollProgress />
      <main>
        <Hero />
        <About />
        <WhyInteresting />
        <Gallery />
        <VideoShowcase />
        <CharacterSpotlight />
        <Timeline />
        <CTA />
      </main>
    </>
  );
}

export default App;
