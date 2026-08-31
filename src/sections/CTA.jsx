import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { CustomBounce } from 'gsap/CustomBounce';
import { prefersReducedMotion } from '../gsapSetup';

const platforms = [
  { name: 'PC (Windows)', url: 'https://store.steampowered.com/app/2547860/Wuthering_Waves/', icon: '🖥️' },
  { name: 'iOS App Store', url: 'https://apps.apple.com/app/wuthering-waves/id1640209073', icon: '📱' },
  { name: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.kurogame.wutheringwaves.global', icon: '🤖' },
  { name: 'PlayStation 5', url: 'https://store.playstation.com/en-us/concept/10008761', icon: '🎮' }
];

export default function CTA() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.cta-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.cta-subtitle', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
      });

      document.querySelectorAll('.platform-btn').forEach((btn, i) => {
        gsap.from(btn, {
          scrollTrigger: {
            trigger: btn,
            start: 'top 85%'
          },
          y: 50,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'bounce.out'
        });
      });

      // Wiggle on hover for platform buttons
      document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          if (!prefersReducedMotion) {
            gsap.to(btn, {
              wiggle: { type: 'easeOut', strength: 3, duration: 0.4 },
              duration: 0.4
            });
          }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper cta-section" id="cta">
      <div className="container cta-container">
        <p className="section-label">Get Started</p>
        <h2 className="section-title cta-title">Siap Petualangan<br />di Solaris-3?</h2>
        <p className="section-desc cta-subtitle">
          Wuthering Waves gratis dimainkan di berbagai platform. Download sekarang dan mulai petualanganmu.
        </p>

        <div className="platforms">
          {platforms.map((p, i) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-btn"
            >
              <span className="platform-icon">{p.icon}</span>
              <span className="platform-name">{p.name}</span>
              <span className="platform-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </a>
          ))}
        </div>

        <div className="cta-footer">
          <div className="deco-line" />
          <p className="cta-credit">
            Wuthering Waves &copy; Kuro Games. Fan-made introduction site — bukan situs resmi.<br />
            Screenshot & video milik pribadi (Bayu). Dibuat untuk tujuan portofolio & eksplorasi GSAP.
          </p>
        </div>
      </div>

      <style>{`
        .cta-section {
          padding: var(--section-padding) 0;
          background: var(--bg-secondary);
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        .cta-container {
          text-align: center;
        }
        .platforms {
          display: flex;
          flex-wrap: wrap;
          gap: var(--gap-md);
          justify-content: center;
          margin-top: var(--gap-xl);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        .platform-btn {
          display: flex;
          align-items: center;
          gap: var(--gap-sm);
          padding: 0.8rem 1.5rem;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          color: var(--text-primary);
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: all var(--duration-normal);
          cursor: pointer;
        }
        .platform-btn:hover {
          border-color: var(--accent-cyan);
          box-shadow: var(--glow-cyan);
          transform: translateY(-2px);
          color: var(--accent-cyan);
        }
        .platform-icon {
          font-size: 1.2rem;
        }
        .platform-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity var(--duration-fast), transform var(--duration-fast);
        }
        .platform-btn:hover .platform-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .cta-footer {
          margin-top: var(--gap-xl);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .cta-credit {
          font-size: 0.75rem;
          color: var(--text-dim);
          line-height: 1.8;
        }
      `}</style>
    </section>
  );
}
