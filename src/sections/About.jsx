import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { prefersReducedMotion } from '../gsapSetup';

export default function About() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.about-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
      gsap.from('.about-desc', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
      });
      gsap.from('.about-stats .stat', {
        scrollTrigger: {
          trigger: '.about-stats',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power3.out'
      });
      gsap.from('.about-image-wrapper', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        },
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper about-section" id="about">
      <div className="container about-grid">
        <div ref={contentRef} className="about-content">
          <p className="section-label">About the Game</p>
          <h2 className="section-title about-title">
            Apa itu<br />Wuthering Waves?
          </h2>
          <p className="section-desc about-desc">
            <strong>Wuthering Waves</strong> adalah action RPG open-world yang dikembangkan oleh
            <strong> Kuro Games</strong>. Berlatar dunia <strong>Solaris-3</strong> — sebuah planet
            pasca-apokaliptik yang penuh dengan misteri dan energi "Resonance" — game ini menawarkan
            pertarungan cepat berbasis skill, eksplorasi dunia luas, dan cerita epik tentang
            perjuangan manusia melawan monster yang disebut Tacet Discords.
          </p>
          <p className="section-desc about-desc" style={{ marginTop: '1rem' }}>
            Berbeda dari game gacha pada umumnya, Wuthering Waves menghadirkan combat system yang
            lebih action-oriented — combo attack, dodge-perfect, switch character secara real-time,
            dan world traversal yang bebas. Setiap karakter unik dengan kit abilities-nya sendiri.
          </p>
          <div className="about-stats">
            <div className="stat">
              <span className="stat-value">Open World</span>
              <span className="stat-label">Genre</span>
            </div>
            <div className="stat">
              <span className="stat-value">Kuro Games</span>
              <span className="stat-label">Developer</span>
            </div>
            <div className="stat">
              <span className="stat-value">Solaris-3</span>
              <span className="stat-label">Setting</span>
            </div>
            <div className="stat">
              <span className="stat-value">Free to Play</span>
              <span className="stat-label">Price</span>
            </div>
          </div>
        </div>
        <div className="about-image-wrapper">
          <div className="about-image">
            <img
              src="/assets/images/3.4 Cyberpunk.jpg"
              alt="Wuthering Waves world"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <style>{`
        .about-section {
          display: flex;
          align-items: center;
          padding: var(--section-padding) 0;
          background: var(--bg-secondary);
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--gap-xl);
          align-items: center;
        }
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
        }
        .about-content {
          position: relative;
        }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--gap-md);
          margin-top: var(--gap-xl);
        }
        .stat {
          padding: var(--gap-md);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
        }
        .stat:hover {
          border-color: var(--border-hover);
          box-shadow: var(--glow-cyan);
        }
        .stat-value {
          display: block;
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          color: var(--accent-cyan);
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .about-image-wrapper {
          position: relative;
        }
        .about-image {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
        }
        .about-image img {
          width: 100%;
          height: auto;
          aspect-ratio: 4/3;
          object-fit: cover;
        }
        .about-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(63, 224, 208, 0.05), rgba(138, 92, 246, 0.05));
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
