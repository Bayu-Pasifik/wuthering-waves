import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { CustomBounce } from 'gsap/CustomBounce';
import { prefersReducedMotion } from '../gsapSetup';

const platforms = [
  {
    name: 'PC (Windows)',
    url: 'https://store.steampowered.com/app/2547860/Wuthering_Waves/',
    label: 'Download di Steam',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
  {
    name: 'iOS',
    url: 'https://apps.apple.com/app/wuthering-waves/id1640209073',
    label: 'Download di App Store',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="3" />
        <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'Android',
    url: 'https://play.google.com/store/apps/details?id=com.kurogame.wutheringwaves.global',
    label: 'Dapatkan di Google Play',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 16V8a7 7 0 0 1 14 0v8" />
        <path d="M3 16l2 4h14l2-4" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    name: 'PlayStation 5',
    url: 'https://store.playstation.com/en-us/concept/10008761',
    label: 'Tersedia di PS5',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 11h4l-2 6" />
        <path d="M14 11h4l-2 6" />
        <rect x="3" y="8" width="18" height="8" rx="4" />
        <circle cx="8" cy="12" r="1" fill="currentColor" />
        <circle cx="16" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export default function CTA() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const titleBounce = CustomBounce.create('ctaTitleBounce', {
        strength: 0.5,
        endAtStart: true,
        squash: 1.2,
        bounceCount: 2,
      });

      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 80,
        scaleY: 0.6,
        scaleX: 1.08,
        opacity: 0,
        duration: 1.4,
        ease: titleBounce,
      });

      gsap.from('.cta-subtitle', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      });

      const btnBounce = CustomBounce.create('ctaBtnBounce', {
        strength: 0.4,
        endAtStart: true,
        squash: 0.8,
        bounceCount: 2,
      });

      document.querySelectorAll('.cta-platform-btn').forEach((btn, i) => {
        gsap.from(btn, {
          scrollTrigger: {
            trigger: btn,
            start: 'top 88%',
          },
          y: 60,
          scaleY: 0.7,
          opacity: 0,
          duration: 1,
          delay: i * 0.1,
          ease: btnBounce,
        });
      });

      document.querySelectorAll('.cta-platform-btn').forEach((btn) => {
        btn.addEventListener('mouseenter', () => {
          if (!prefersReducedMotion) {
            gsap.to(btn, {
              wiggle: {
                type: 'random',
                strength: 3,
                amplitudeX: 1.5,
                amplitudeY: 1.5,
                frequency: 10,
              },
              duration: 0.4,
            });
          }
        });
      });

      gsap.from('.cta-official', {
        scrollTrigger: {
          trigger: '.cta-official',
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.5,
        ease: 'power3.out',
      });

      gsap.from('.cta-footer-content', {
        scrollTrigger: {
          trigger: '.cta-footer-content',
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
        ease: 'power3.out',
      });

      if (!prefersReducedMotion) {
        gsap.to('.cta-glow', {
          scale: 1.15,
          opacity: 0.5,
          duration: 5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper cta-section" id="cta">
      <div
        className="cta-glow"
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          height: '50vh',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(63, 224, 208, 0.06) 0%, rgba(63, 224, 208, 0.015) 45%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          zIndex: 0,
        }}
      />

      <div className="container cta-container">
        <p className="section-label">Mulai Perjalananmu</p>
        <h2 ref={titleRef} className="section-title cta-title">
          Siap Memulai<br />Perjalananmu?
        </h2>
        <p className="section-desc cta-subtitle">
          Wuthering Waves gratis dimainkan di semua platform. Download sekarang
          dan masuki dunia Solaris-3.
        </p>

        <div className="cta-platforms">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-platform-btn"
            >
              <span className="cta-btn-icon">{p.icon}</span>
              <span className="cta-btn-content">
                <span className="cta-btn-label">{p.label}</span>
                <span className="cta-btn-platform">{p.name}</span>
              </span>
              <span className="cta-btn-arrow">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </a>
          ))}
        </div>

        <div className="cta-official">
          <a
            href="https://wutheringwaves.kurogames.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-official-link"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Kunjungi Situs Resmi
          </a>
        </div>

        <div className="cta-divider" />

        <div className="cta-footer-content">
          <p className="cta-disclaimer">
            Ini adalah proyek buatan penggemar yang tidak resmi dibuat untuk tujuan
            edukasi, portofolio, dan apresiasi. Wuthering Waves dan
            kekayaan intelektual terkait dimiliki oleh Kuro Games.
          </p>
          <p className="cta-credit">
            Screenshot dan cuplikan gameplay oleh Bayu. Gim oleh Kuro Games.
          </p>
        </div>
      </div>

      <style>{`
        .cta-section {
          padding: var(--section-padding) 0;
          background: var(--bg-secondary);
          min-height: 80vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .cta-container {
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .cta-title {
          color: var(--text-primary);
        }
        .cta-platforms {
          display: flex;
          flex-wrap: wrap;
          gap: var(--gap-md);
          justify-content: center;
          margin-top: var(--gap-xl);
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }
        .cta-platform-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.75rem 1.4rem;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          color: var(--text-primary);
          font-family: var(--font-display);
          text-decoration: none;
          transition: all var(--duration-normal);
          cursor: pointer;
          flex: 1 1 auto;
          min-width: 220px;
          max-width: 320px;
        }
        .cta-platform-btn:hover {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 20px rgba(63, 224, 208, 0.15), 0 0 0 1px rgba(63, 224, 208, 0.1);
          transform: translateY(-2px);
        }
        .cta-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(63, 224, 208, 0.08);
          color: var(--cyan);
          flex-shrink: 0;
        }
        .cta-btn-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
          flex: 1;
        }
        .cta-btn-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--text-primary);
        }
        .cta-btn-platform {
          font-size: 0.55rem;
          font-weight: 400;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .cta-btn-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity var(--duration-fast), transform var(--duration-fast);
          color: var(--cyan);
          flex-shrink: 0;
        }
        .cta-platform-btn:hover .cta-btn-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .cta-official {
          margin-top: var(--gap-lg);
        }
        .cta-official-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 8px 20px;
          border: 1px solid var(--border-subtle);
          border-radius: 100px;
          transition: all var(--duration-normal);
        }
        .cta-official-link:hover {
          color: var(--cyan);
          border-color: var(--cyan);
          box-shadow: 0 0 16px rgba(63, 224, 208, 0.1);
        }
        .cta-divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          margin: var(--gap-xl) auto var(--gap-lg);
          opacity: 0.3;
        }
        .cta-footer-content {
          max-width: 560px;
          margin: 0 auto;
        }
        .cta-disclaimer {
          font-size: 0.7rem;
          color: var(--text-muted);
          line-height: 1.75;
          margin-bottom: var(--gap-sm);
        }
        .cta-credit {
          font-size: 0.65rem;
          color: var(--text-dim);
          letter-spacing: 0.02em;
        }
        @media (max-width: 600px) {
          .cta-platform-btn {
            min-width: 100%;
            max-width: 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-glow { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
