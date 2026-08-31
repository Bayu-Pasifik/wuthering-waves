import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { prefersReducedMotion } from '../gsapSetup';
import { features } from '../data/lore';

const featureVisuals = {
  combat: {
    img: '/assets/images/3.3.jpg',
    explanation: 'Setiap serangan memiliki timing yang presisi. Perfect dodge memberikan opening untuk counter-attack, quick-switch memungkinkan combo antar karakter, dan Resonance Liberation menjadi finisher yang memukau. Skill ceiling yang tinggi membuat setiap pertarungan terasa rewarding.',
  },
  movement: {
    img: '/assets/images/3.5.jpg',
    explanation: 'Dari wall-run di tebing curam, grapple across chasms, hingga glide melintasi jurang — traversal di Wuthering Waves dirancang untuk terasa fluid. Tidak ada loading screen antar wilayah, dan setiap sudut dunia bisa diakses dengan bebas.',
  },
  'open-world': {
    img: '/assets/images/3.6.jpg',
    explanation: 'Solaris-3 bukan sekadar peta besar — setiap region memiliki identitas unik. Dari kota futuristik Jinzhou, hutan misterius Whining Aix\'s Mire, hingga padang pasir Desorock Highland. Hidden dungeons, environmental puzzles, dan secrets tersebar di seluruh peta.',
  },
  'echo-system': {
    img: '/assets/images/2.8.jpg',
    explanation: 'Sistem Echo memungkinkanmu menyerap kemampuan musuh yang telah dikalahkan. Setiap Tacet Discord meninggalkan Echo yang bisa digunakan sebagai skill — dari serangan elemental hingga transformasi. Kombinasikan berbagai Echo untuk membangun playstyle yang unik.',
  },
  characters: {
    img: '/assets/images/Chisa Splash.jpg',
    explanation: 'Setiap Resonator bukan hanya sekadar karakter — mereka memiliki cerita mendalam, kepribadian yang khas, dan combat mechanics yang berbeda. Dari Changli yang agresif hingga Cantarella yang strategis, setiap karakter menawarkan pengalaman bermain yang berbeda.',
  },
  music: {
    img: '/assets/images/3.4.jpg',
    explanation: 'Soundtrack Wuthering Waves berubah dinamis berdasarkan konteks. Eksplorasi tenang dengan melodi orkestra, combat meningkat dengan节奏 cepat dan synth, boss fight menghadirkan komposisi epik yang memacu adrenalin. Musik bukan sekadar background — ia menjadi bagian dari pengalaman.',
  },
  story: {
    img: '/assets/images/3.0.jpg',
    explanation: 'Cerita dibangun per chapter dengan cinematics berkualitas tinggi. Rover\'s journey mengungkap misteri Lament, asal-usul Resonators, dan ancaman Threnodians. Character-driven storytelling membuat investasi emosional terhadap dunia dan penghuninya terasa nyata.',
  },
};

export default function WhyInteresting() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.wi-header', {
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

      document.querySelectorAll('.feature-row').forEach((row, i) => {
        const img = row.querySelector('.feature-visual');
        const textEls = row.querySelectorAll('.feature-text > *');

        gsap.from(img, {
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          x: i % 2 === 0 ? -80 : 80,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });

        gsap.from(textEls, {
          scrollTrigger: {
            trigger: row,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out'
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper wi-section" id="features">
      <div className="container">
        <div className="wi-header">
          <p className="section-label">Mengapa Game Ini Menarik</p>
          <h2 className="section-title wi-title">Kenapa Wuthering Waves<br />Begitu Menarik?</h2>
          <p className="section-desc wi-subtitle">
            Bukan sekadar action RPG biasa — berikut alasan mengapa game ini layak dimainkan.
          </p>
        </div>

        <div className="features-editorial">
          {features.map((feature, i) => {
            const visual = featureVisuals[feature.id];
            const isReversed = i % 2 !== 0;
            return (
              <div key={feature.id} className={`feature-row ${isReversed ? 'reversed' : ''}`}>
                <div className="feature-visual">
                  <div className="feature-img-wrapper">
                    <img src={visual.img} alt={feature.title} loading="lazy" />
                    <div className="feature-img-overlay" />
                  </div>
                  <div className="feature-icon-badge">{feature.icon}</div>
                </div>
                <div className="feature-text">
                  <span className="feature-number">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="feature-heading">{feature.title}</h3>
                  <p className="feature-desc">{feature.description}</p>
                  <p className="feature-explanation">{visual.explanation}</p>
                  <div className="feature-line" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .wi-section {
          padding: var(--section-padding) 0;
          background: var(--bg-2);
          overflow: hidden;
        }
        .wi-header {
          text-align: center;
          margin-bottom: var(--gap-2xl);
        }
        .wi-title {
          margin-top: var(--gap-md);
        }
        .wi-subtitle {
          margin: var(--gap-md) auto 0;
        }
        .features-editorial {
          display: flex;
          flex-direction: column;
          gap: clamp(4rem, 8vh, 8rem);
        }
        .feature-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 4vw, 4rem);
          align-items: center;
        }
        .feature-row.reversed {
          direction: rtl;
        }
        .feature-row.reversed > * {
          direction: ltr;
        }
        .feature-visual {
          position: relative;
        }
        .feature-img-wrapper {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
          aspect-ratio: 16/10;
        }
        .feature-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--duration-slow);
        }
        .feature-row:hover .feature-img-wrapper img {
          transform: scale(1.04);
        }
        .feature-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(63, 224, 208, 0.04), rgba(138, 92, 246, 0.04));
          pointer-events: none;
        }
        .feature-icon-badge {
          position: absolute;
          top: -12px;
          right: -12px;
          width: 48px;
          height: 48px;
          background: var(--bg-0);
          border: 1px solid var(--border-subtle);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          z-index: 2;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .feature-row.reversed .feature-icon-badge {
          right: auto;
          left: -12px;
        }
        .feature-text {
          display: flex;
          flex-direction: column;
          gap: var(--gap-sm);
        }
        .feature-number {
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cyan);
          opacity: 0.6;
        }
        .feature-heading {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .feature-desc {
          font-size: clamp(0.9rem, 1.1vw, 1rem);
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .feature-explanation {
          font-size: clamp(0.85rem, 1vw, 0.95rem);
          color: var(--text-muted);
          line-height: 1.8;
          margin-top: var(--gap-xs);
        }
        .feature-line {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, var(--cyan), transparent);
          margin-top: var(--gap-sm);
        }
        .feature-row.reversed .feature-line {
          background: linear-gradient(270deg, var(--cyan), transparent);
          margin-left: auto;
        }

        @media (max-width: 900px) {
          .feature-row,
          .feature-row.reversed {
            grid-template-columns: 1fr;
            direction: ltr;
            gap: var(--gap-lg);
          }
          .feature-icon-badge {
            top: -8px;
            right: -8px;
          }
          .feature-row.reversed .feature-icon-badge {
            left: auto;
            right: -8px;
          }
        }
      `}</style>
    </section>
  );
}
