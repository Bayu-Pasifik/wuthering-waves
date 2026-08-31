import { useEffect, useRef, useState } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { prefersReducedMotion } from '../gsapSetup';

const sections = [
  { id: 'hero', label: 'BERANDA', chapter: '01' },
  { id: 'about', label: 'TENTANG', chapter: '02' },
  { id: 'features', label: 'FITUR', chapter: '03' },
  { id: 'gallery', label: 'GALERI', chapter: '04' },
  { id: 'videos', label: 'VIDEO', chapter: '05' },
  { id: 'characters', label: 'KARAKTER', chapter: '06' },
  { id: 'archive', label: 'ARSIP', chapter: '07' },
  { id: 'cta', label: 'MULAI', chapter: '08' },
];

export default function Navigation() {
  const navRef = useRef(null);
  const progressBarRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleX: self.progress });
          }
        }
      });

      sections.forEach((section, i) => {
        const el = document.getElementById(section.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(i),
          onEnterBack: () => setActiveSection(i),
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <nav ref={navRef} className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => scrollTo('hero')}>
            <span className="nav-logo">WUTHERING WAVES</span>
          </div>

          <div className="nav-chapter">
            <span className="nav-chapter-label">BAB</span>
            <span className="nav-chapter-num">{sections[activeSection]?.chapter || '01'}</span>
            <span className="nav-chapter-divider">/</span>
            <span className="nav-chapter-total">{sections.length.toString().padStart(2, '0')}</span>
          </div>

          <div className="nav-links">
            {sections.map((s, i) => (
              <button
                key={s.id}
                className={`nav-link ${activeSection === i ? 'nav-link--active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            className={`nav-hamburger ${menuOpen ? 'nav-hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="nav-progress-track">
          <div ref={progressBarRef} className="nav-progress-bar" />
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div className={`nav-mobile-overlay ${menuOpen ? 'nav-mobile-overlay--open' : ''}`}>
        <div className="nav-mobile-content">
          {sections.map((s, i) => (
            <button
              key={s.id}
              className={`nav-mobile-link ${activeSection === i ? 'nav-mobile-link--active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              <span className="nav-mobile-chapter">{s.chapter}</span>
              <span className="nav-mobile-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(7, 9, 13, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--line);
          transition: background 0.3s, box-shadow 0.3s;
        }
        .nav--scrolled {
          background: rgba(7, 9, 13, 0.96);
          box-shadow: 0 1px 24px rgba(63, 224, 208, 0.04);
        }
        .nav-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 3vw, 2.5rem);
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        .nav-brand {
          cursor: pointer;
          flex-shrink: 0;
        }
        .nav-logo {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: var(--text-primary);
          white-space: nowrap;
        }
        .nav-chapter {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-display);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .nav-chapter-label {
          color: var(--text-muted);
          margin-right: 0.25rem;
        }
        .nav-chapter-num {
          color: var(--cyan);
          font-weight: 700;
          min-width: 1.2em;
          text-align: right;
        }
        .nav-chapter-divider {
          opacity: 0.3;
        }
        .nav-chapter-total {
          opacity: 0.5;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.15rem;
        }
        .nav-link {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-display);
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          padding: 0.45rem 0.7rem;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--text-secondary);
        }
        .nav-link--active {
          color: var(--cyan);
        }
        .nav-link--active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0.7rem;
          right: 0.7rem;
          height: 1px;
          background: var(--cyan);
        }
        .nav-progress-track {
          width: 100%;
          height: 1px;
          background: rgba(95, 242, 232, 0.06);
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .nav-progress-bar {
          height: 100%;
          background: var(--cyan);
          transform-origin: left;
          transform: scaleX(0);
          will-change: transform;
        }
        .nav-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          width: 32px;
          height: 32px;
          position: relative;
          z-index: 110;
          padding: 0;
        }
        .nav-hamburger span {
          display: block;
          width: 18px;
          height: 1px;
          background: var(--text-primary);
          position: absolute;
          left: 7px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-hamburger span:nth-child(1) { top: 10px; }
        .nav-hamburger span:nth-child(2) { top: 15px; }
        .nav-hamburger span:nth-child(3) { top: 20px; }
        .nav-hamburger--open span:nth-child(1) {
          top: 15px;
          transform: rotate(45deg);
        }
        .nav-hamburger--open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .nav-hamburger--open span:nth-child(3) {
          top: 15px;
          transform: rotate(-45deg);
        }

        /* Mobile overlay */
        .nav-mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: rgba(7, 9, 13, 0.97);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s, visibility 0.4s;
        }
        .nav-mobile-overlay--open {
          opacity: 1;
          visibility: visible;
        }
        .nav-mobile-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-mobile-link {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: baseline;
          gap: 1rem;
          padding: 0.6rem 2rem;
          transition: color 0.2s;
        }
        .nav-mobile-chapter {
          font-family: var(--font-display);
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }
        .nav-mobile-label {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--text-secondary);
          transition: color 0.2s;
        }
        .nav-mobile-link--active .nav-mobile-label {
          color: var(--cyan);
        }
        .nav-mobile-link--active .nav-mobile-chapter {
          color: var(--cyan);
        }
        .nav-mobile-link:hover .nav-mobile-label {
          color: var(--text-primary);
        }

        @media (max-width: 900px) {
          .nav-links { display: none; }
          .nav-chapter { display: none; }
          .nav-hamburger { display: block; }
        }
      `}</style>
    </>
  );
}
