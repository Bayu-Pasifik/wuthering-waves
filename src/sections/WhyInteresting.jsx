import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { prefersReducedMotion } from '../gsapSetup';

const features = [
  {
    title: 'Fast-Paced Combat',
    desc: 'Combo attack, perfect dodge, quick-switch antar karakter — combat yang memacu adrenalin.',
    icon: '⚔️',
    img: '/assets/images/3.3.jpg'
  },
  {
    title: 'Open World Exploration',
    desc: 'Dunia luas Solaris-3 menunggu untuk dijelajahi — bukit, kota, laut, dan dungeon tersembunyi.',
    icon: '🌍',
    img: '/assets/images/3.5.jpg'
  },
  {
    title: 'Unique Characters',
    desc: 'Puluhan karakter dengan abilities unik, backstory mendalam, dan desain yang memukau.',
    icon: '✨',
    img: '/assets/images/Chisa Splash.jpg'
  }
];

export default function WhyInteresting() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.wi-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      document.querySelectorAll('.feature-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          },
          y: 80,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out'
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper wi-section" id="features">
      <div className="container">
        <p className="section-label">Why It Matters</p>
        <h2 className="section-title wi-title">Kenapa Wuthering Waves<br />Menarik?</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-img">
                <img src={f.img} alt={f.title} loading="lazy" />
                <div className="feature-img-overlay" />
              </div>
              <div className="feature-content">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .wi-section {
          padding: var(--section-padding) 0;
          background: var(--bg-primary);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--gap-lg);
          margin-top: var(--gap-xl);
        }
        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
        .feature-card {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-card);
          transition: border-color var(--duration-normal), box-shadow var(--duration-normal), transform var(--duration-normal);
        }
        .feature-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--glow-cyan);
          transform: translateY(-4px);
        }
        .feature-img {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .feature-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--duration-slow);
        }
        .feature-card:hover .feature-img img {
          transform: scale(1.05);
        }
        .feature-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, var(--bg-card) 100%);
        }
        .feature-content {
          padding: var(--gap-lg);
        }
        .feature-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: var(--gap-sm);
        }
        .feature-title {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--gap-sm);
        }
        .feature-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }
      `}</style>
    </section>
  );
}
