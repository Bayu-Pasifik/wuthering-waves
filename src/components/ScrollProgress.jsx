import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { prefersReducedMotion } from '../gsapSetup';

export default function ScrollProgress() {
  const barRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    if (!barRef.current || prefersReducedMotion) return;

    const sections = document.querySelectorAll('.section-wrapper');
    const labels = ['Home', 'About', 'Features', 'Gallery', 'Videos', 'Characters', 'Timeline', 'CTA'];

    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3
        }
      });

      // Section labels
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => updateLabel(i),
          onEnterBack: () => updateLabel(i)
        });
      });
    });

    function updateLabel(i) {
      if (indicatorRef.current && labels[i]) {
        indicatorRef.current.textContent = labels[i];
      }
    }

    return () => ctx.revert();
  }, []);

  return (
    <div className="scroll-progress-container">
      <div className="scroll-progress-track">
        <div ref={barRef} className="scroll-progress-bar" />
      </div>
      <div className="scroll-indicator" ref={indicatorRef}>Home</div>

      <style>{`
        .scroll-progress-container {
          position: fixed;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .scroll-progress-track {
          width: 2px;
          height: 120px;
          background: var(--border-subtle);
          border-radius: 1px;
          overflow: hidden;
        }
        .scroll-progress-bar {
          width: 100%;
          height: 100%;
          background: var(--accent-cyan);
          transform: scaleY(0);
          transform-origin: top;
          border-radius: 1px;
        }
        .scroll-indicator {
          font-family: var(--font-heading);
          font-size: 0.55rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent-cyan);
          writing-mode: vertical-lr;
          text-orientation: mixed;
          margin-top: 8px;
        }
        @media (max-width: 768px) {
          .scroll-progress-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
