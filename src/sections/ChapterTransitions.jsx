import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { prefersReducedMotion } from '../gsapSetup';

const chapters = [
  {
    id: 1,
    title: 'The World Wakes',
    subtitle: 'SOLARIS-3 / RESONANCE',
    description: 'A mysterious world stirs from slumber. Memories lost, echoes of the Lament whisper through ruined cities and overgrown wilds.',
    color: '#3FE0D0',
    symbolPath: 'M50,10 L90,35 L90,75 L50,95 L10,75 L10,35 Z',
    symbolMorph: 'M50,5 C75,5 95,25 95,50 C95,75 75,95 50,95 C25,95 5,75 5,50 C5,25 25,5 50,5 Z',
    bgFrom: 'rgba(63, 224, 208, 0.03)',
    bgTo: 'rgba(63, 224, 208, 0.08)',
  },
  {
    id: 2,
    title: 'Echoes of the Lament',
    subtitle: 'HUANGLONG / JINZHOU',
    description: 'The echoes grow louder. In the cities of Huanglong, the Tacet Discords close in, and old alliances are tested.',
    color: '#A78BFA',
    symbolPath: 'M50,5 L85,20 L95,60 L75,90 L25,90 L5,60 L15,20 Z',
    symbolMorph: 'M50,5 C80,5 95,30 95,55 C95,80 75,95 50,95 C25,95 5,75 5,50 C5,25 20,5 50,5 Z',
    bgFrom: 'rgba(167, 139, 250, 0.03)',
    bgTo: 'rgba(167, 139, 250, 0.08)',
  },
  {
    id: 3,
    title: 'Tides of Change',
    subtitle: 'RINASCITA / LAHAI-ROI',
    description: 'New horizons beckon. Beyond Huanglong, the regions of Rinascita and Lahai-Roi hold secrets that could reshape everything.',
    color: '#F97316',
    symbolPath: 'M50,10 L90,40 L75,90 L25,90 L10,40 Z',
    symbolMorph: 'M50,5 C70,5 90,20 95,45 C100,70 85,95 55,95 C25,95 5,75 5,50 C5,25 30,5 50,5 Z',
    bgFrom: 'rgba(249, 115, 22, 0.03)',
    bgTo: 'rgba(249, 115, 22, 0.08)',
  },
  {
    id: 4,
    title: 'The Final Resonance',
    subtitle: 'BEYOND / UNKNOWN',
    description: 'The journey converges. Past and future collide as the Resonators face the ultimate truth behind the Lament.',
    color: '#E11D48',
    symbolPath: 'M50,5 L95,40 L80,90 L20,90 L5,40 Z',
    symbolMorph: 'M50,5 C75,5 95,30 95,50 C95,75 75,95 50,95 C25,95 5,75 5,50 C5,25 25,5 50,5 Z',
    bgFrom: 'rgba(225, 29, 72, 0.03)',
    bgTo: 'rgba(225, 29, 72, 0.08)',
  },
];

export default function ChapterTransitions({ chapterIndex = 0 }) {
  const containerRef = useRef(null);
  const symbolRef = useRef(null);
  const lineRef = useRef(null);
  const chapter = chapters[chapterIndex] || chapters[0];

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      // Background color transition
      gsap.fromTo(
        containerRef.current,
        { background: chapter.bgFrom },
        {
          background: chapter.bgTo,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: true,
          },
        }
      );

      // Chapter symbol morph
      if (symbolRef.current) {
        gsap.fromTo(
          symbolRef.current,
          { morphSVG: chapter.symbolPath },
          {
            morphSVG: chapter.symbolMorph,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: 1,
            },
            duration: 1,
            ease: 'power2.inOut',
          }
        );
      }

      // DrawSVG for the connecting line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 70%',
              end: 'bottom 50%',
              scrub: true,
            },
          }
        );
      }

      // Title and text entrance
      gsap.from('.ch-title', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.ch-subtitle', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.ch-desc', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 55%',
        },
        y: 25,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, [chapterIndex]);

  return (
    <div
      ref={containerRef}
      className="ch-wrapper"
      style={{
        position: 'relative',
        padding: 'clamp(3rem, 8vh, 6rem) 0',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* Chapter symbol */}
        <div className="ch-symbol-wrapper">
          <svg
            viewBox="0 0 100 100"
            width="64"
            height="64"
            style={{ margin: '0 auto var(--gap-md)' }}
          >
            <path
              ref={symbolRef}
              d={chapter.symbolPath}
              fill="none"
              stroke={chapter.color}
              strokeWidth="1.5"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Chapter number badge */}
        <div
          className="ch-badge"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-display)',
            fontSize: '0.5rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: chapter.color,
            background: `${chapter.color}12`,
            border: `1px solid ${chapter.color}30`,
            borderRadius: '100px',
            padding: '4px 16px',
            marginBottom: 'var(--gap-md)',
          }}
        >
          Chapter {chapter.id}
        </div>

        {/* Subtitle */}
        <p
          className="ch-subtitle"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.55rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 'var(--gap-sm)',
          }}
        >
          {chapter.subtitle}
        </p>

        {/* Title */}
        <h2
          className="ch-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: 700,
            color: chapter.color,
            lineHeight: 1.1,
            marginBottom: 'var(--gap-sm)',
          }}
        >
          {chapter.title}
        </h2>

        {/* Description */}
        <p
          className="ch-desc"
          style={{
            fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
            color: 'var(--text-secondary)',
            maxWidth: '55ch',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          {chapter.description}
        </p>

        {/* Connecting line */}
        <div
          className="ch-line-wrapper"
          style={{
            margin: 'var(--gap-lg) auto 0',
            width: '1px',
            height: '60px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, ${chapter.color}, transparent)`,
              transformOrigin: 'top',
            }}
          />
        </div>
      </div>

      <style>{`
        .ch-wrapper {
          border-left: none;
          border-right: none;
        }
        .ch-symbol-wrapper {
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .ch-wrapper { background: transparent !important; }
        }
      `}</style>
    </div>
  );
}

export { chapters };
