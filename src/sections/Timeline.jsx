import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { prefersReducedMotion } from '../gsapSetup';

const timelineData = [
  { version: '1.0', date: 'May 2024', title: 'Wuthering Waves Launch', desc: 'Game resmi dirilis di PC, iOS, dan Android. Pemain memulai petualangan di Solaris-3.' },
  { version: '1.1', date: 'June 2024', title: 'In the Turquoise Moonglade', desc: 'Update pertama dengan konten baru, karakter, dan cerita lanjutan.' },
  { version: '1.2', date: 'Aug 2024', title: 'Thousand Faces of the Moon', desc: 'Moon Chasing Festival dan event spesial pertama.' },
  { version: '1.3', date: 'Oct 2024', title: 'To the Fullest', desc: 'Shorekeeper dan cerita mendalam tentang dunia Solaris-3.' },
  { version: '2.0', date: 'Jan 2025', title: 'Rinascita', desc: 'Map baru Rinascita — petualangan di wilayah baru dengan cerita segar.' },
  { version: '2.3', date: 'Apr 2025', title: 'Through Tide and Tempest', desc: 'Tides and Stars event dengan konten cerita dan karakter baru.' },
  { version: '3.0', date: 'Jul 2025', title: 'New Chapter', desc: 'Babak baru cerita dengan area, mekanik, dan karakter baru.' },
  { version: '3.6', date: 'Aug 2026', title: 'Latest Update', desc: 'Update terkini dengan konten terbaru dan peningkatan gameplay.' }
];

export default function Timeline() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.tl-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      // DrawSVG for timeline line
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            scrollTrigger: {
              trigger: '.timeline-line',
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: true
            }
          }
        );
      }

      // Reveal timeline items
      document.querySelectorAll('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          x: i % 2 === 0 ? -40 : 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out'
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper tl-section" id="timeline">
      <div className="container">
        <p className="section-label">Timeline</p>
        <h2 className="section-title tl-title">Perjalanan<br />Solaris-3</h2>
        <p className="section-desc">
          Perkembangan cerita dan update Wuthering Waves dari peluncuran hingga sekarang.
        </p>

        <div className="timeline-wrapper">
          <div className="timeline-line">
            <div ref={lineRef} className="timeline-line-fill" />
          </div>
          <div className="timeline-items">
            {timelineData.map((item, i) => (
              <div key={item.version} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <span className="timeline-version">v{item.version}</span>
                  <span className="timeline-date">{item.date}</span>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .tl-section {
          padding: var(--section-padding) 0;
          background: var(--bg-primary);
        }
        .timeline-wrapper {
          position: relative;
          margin-top: var(--gap-xl);
          padding: var(--gap-lg) 0;
        }
        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--border-subtle);
          transform: translateX(-50%);
        }
        .timeline-line-fill {
          width: 100%;
          height: 100%;
          background: var(--gradient-accent);
          transform-origin: top;
        }
        .timeline-items {
          display: flex;
          flex-direction: column;
          gap: var(--gap-xl);
          position: relative;
        }
        .timeline-item {
          display: flex;
          align-items: flex-start;
          position: relative;
          width: 50%;
        }
        .timeline-item.left {
          align-self: flex-start;
          padding-right: var(--gap-xl);
          text-align: right;
        }
        .timeline-item.right {
          align-self: flex-end;
          padding-left: var(--gap-xl);
          margin-left: 50%;
        }
        .timeline-dot {
          position: absolute;
          width: 14px;
          height: 14px;
          background: var(--accent-cyan);
          border: 3px solid var(--bg-primary);
          border-radius: 50%;
          box-shadow: var(--glow-cyan);
          z-index: 2;
        }
        .timeline-item.left .timeline-dot {
          right: -7px;
        }
        .timeline-item.right .timeline-dot {
          left: -7px;
        }
        .timeline-card {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: var(--gap-md);
          background: var(--bg-card);
          max-width: 360px;
          transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
        }
        .timeline-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--glow-cyan);
        }
        .timeline-version {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent-cyan);
          background: rgba(63, 224, 208, 0.1);
          padding: 2px 8px;
          border-radius: 100px;
          margin-bottom: var(--gap-sm);
        }
        .timeline-date {
          display: block;
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-bottom: var(--gap-sm);
        }
        .timeline-title {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .timeline-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .timeline-line {
            left: 20px;
          }
          .timeline-item {
            width: 100%;
            padding-left: 50px !important;
            padding-right: 0 !important;
            text-align: left !important;
            margin-left: 0 !important;
          }
          .timeline-dot {
            left: 13px !important;
            right: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
