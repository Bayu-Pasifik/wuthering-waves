import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { prefersReducedMotion } from '../gsapSetup';

const sectionNames = [
  'DUNIA TERBANGUN',
  'RESONANSI',
  'FITUR',
  'GALERI',
  'GAMEPLAY',
  'KARAKTER',
  'LINIMASA',
  'ARSIP',
];

export default function ScrollProgress() {
  const containerRef = useRef(null);
  const barRef = useRef(null);
  const labelRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    if (!barRef.current || prefersReducedMotion) return;

    const sections = document.querySelectorAll('.section-wrapper');
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });

      sections.forEach((section, i) => {
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => updateSection(i),
          onEnterBack: () => updateSection(i),
        });
      });
    });

    function updateSection(i) {
      if (labelRef.current && sectionNames[i]) {
        gsap.to(labelRef.current, {
          opacity: 0,
          y: -5,
          duration: 0.15,
          onComplete: () => {
            labelRef.current.textContent = sectionNames[i];
            gsap.to(labelRef.current, { opacity: 1, y: 0, duration: 0.25 });
          },
        });
      }
      dotsRef.current.forEach((dot, j) => {
        if (dot) {
          dot.style.background = j === i ? 'var(--cyan)' : 'rgba(95, 242, 232, 0.2)';
          dot.style.boxShadow = j === i ? '0 0 6px rgba(63, 224, 208, 0.5)' : 'none';
        }
      });
    }

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="scroll-progress">
      <div className="scroll-progress-track">
        <div ref={barRef} className="scroll-progress-fill" />
        {sectionNames.map((_, i) => (
          <div
            key={i}
            ref={el => (dotsRef.current[i] = el)}
            className="scroll-progress-dot"
            style={{ top: `${(i / (sectionNames.length - 1)) * 100}%` }}
          />
        ))}
      </div>
      <div ref={labelRef} className="scroll-progress-label">
        {sectionNames[0]}
      </div>

      <style>{`
        .scroll-progress {
          position: fixed;
          right: clamp(12px, 2vw, 24px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .scroll-progress-track {
          width: 2px;
          height: 140px;
          background: rgba(95, 242, 232, 0.08);
          border-radius: 1px;
          position: relative;
          overflow: visible;
        }
        .scroll-progress-fill {
          width: 100%;
          height: 100%;
          background: var(--cyan);
          transform-origin: top;
          transform: scaleY(0);
          border-radius: 1px;
          will-change: transform;
        }
        .scroll-progress-dot {
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(95, 242, 232, 0.2);
          transition: background 0.3s, box-shadow 0.3s;
        }
        .scroll-progress-label {
          font-family: var(--font-display);
          font-size: 0.5rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cyan);
          writing-mode: vertical-lr;
          text-orientation: mixed;
          white-space: nowrap;
          opacity: 0.8;
        }
        @media (max-width: 768px) {
          .scroll-progress {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
