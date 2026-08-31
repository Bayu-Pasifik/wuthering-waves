import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import { EasePack } from 'gsap/EasePack';
import { prefersReducedMotion } from '../gsapSetup';
import { versions, chapters } from '../data/versions';

CustomEase.create('archiveReveal', 'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create('archiveSlide', 'M0,0 C0.33,1 0.68,1 1,1');
CustomEase.create('archiveScrub', 'M0,0 C0.25,0.1 0.35,0.9 0.55,0.95 0.75,1 0.9,0.95 1,0');

function ChapterIntroCard({ chapter, isActive }) {
  return (
    <div
      className="chapter-intro-card"
      style={{
        position: 'relative',
        padding: 'clamp(3rem, 8vh, 6rem) clamp(1.5rem, 4vw, 3rem)',
        marginBottom: 'clamp(2rem, 4vh, 4rem)',
        border: `1px solid ${chapter.color}22`,
        borderRadius: '2px',
        background: `linear-gradient(135deg, ${chapter.color}08 0%, transparent 60%)`,
        overflow: 'hidden',
        opacity: isActive ? 1 : 0.5,
        transform: isActive ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '3px',
          height: '100%',
          background: `linear-gradient(to bottom, ${chapter.color}, transparent)`,
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-display, "Inter", sans-serif)',
          fontSize: 'clamp(0.5rem, 0.9vw, 0.65rem)',
          fontWeight: 600,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: chapter.color,
          marginBottom: '0.75rem',
        }}
        className="chapter-label-scramble"
      >
        {chapter.name}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display, "Inter", sans-serif)',
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          color: '#E8E9ED',
          marginBottom: '0.5rem',
        }}
      >
        {chapter.region}
      </div>
      <div
        style={{
          fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
          color: '#888',
          lineHeight: 1.6,
          maxWidth: '500px',
        }}
      >
        {chapter.versions.length} version{chapter.versions.length !== 1 ? 's' : ''} in this chapter
      </div>
    </div>
  );
}

function SpoilerToggle({ level, onToggle }) {
  const labels = {
    light: 'LIGHT SPOILER',
    moderate: 'MODERATE SPOILER',
    heavy: 'FULL SPOILER',
  };
  const colors = {
    light: '#3FE0D0',
    moderate: '#D4A843',
    heavy: '#C0392B',
  };

  return (
    <button
      onClick={onToggle}
      className="spoiler-toggle-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 1rem',
        border: `1px solid ${colors[level]}44`,
        borderRadius: '2px',
        background: `${colors[level]}10`,
        color: colors[level],
        fontFamily: 'var(--font-display, "Inter", sans-serif)',
        fontSize: '0.55rem',
        fontWeight: 600,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${colors[level]}25`;
        e.currentTarget.style.borderColor = `${colors[level]}88`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `${colors[level]}10`;
        e.currentTarget.style.borderColor = `${colors[level]}44`;
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: colors[level],
          boxShadow: `0 0 8px ${colors[level]}88`,
        }}
      />
      SPOILER: {labels[level]}
    </button>
  );
}

function CharacterTag({ name }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.7rem',
        border: '1px solid #3FE0D033',
        borderRadius: '1px',
        fontFamily: 'var(--font-display, "Inter", sans-serif)',
        fontSize: '0.6rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: '#3FE0D0',
        background: '#3FE0D00A',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {name}
    </span>
  );
}

function LocationTag({ name }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.7rem',
        border: '1px solid #D4A84333',
        borderRadius: '1px',
        fontFamily: 'var(--font-display, "Inter", sans-serif)',
        fontSize: '0.6rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: '#D4A843',
        background: '#D4A8430A',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      {name}
    </span>
  );
}

function VersionEntry({ data, chapterColor, index, spoilerLevel }) {
  const entryRef = useRef(null);
  const titleRef = useRef(null);
  const narrativeRef = useRef(null);
  const metaRef = useRef(null);
  const posterRef = useRef(null);
  const tagsRef = useRef(null);

  useEffect(() => {
    if (!entryRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const entry = entryRef.current;
      if (!entry) return;

      if (titleRef.current) {
        const splitTitle = new SplitText(titleRef.current, {
          type: 'chars, words',
          charsClass: 'va-title-char',
          wordsClass: 'va-title-word',
        });

        gsap.from(splitTitle.chars, {
          scrollTrigger: {
            trigger: entry,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 40,
          rotateX: -60,
          transformOrigin: 'bottom center',
          stagger: 0.02,
          duration: 1,
          ease: 'archiveReveal',
        });
      }

      if (metaRef.current) {
        const metaLabels = metaRef.current.querySelectorAll('.meta-label');
        metaLabels.forEach((label) => {
          const original = label.textContent;
          gsap.to(label, {
            scrollTrigger: {
              trigger: entry,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
            scrambleText: {
              text: original,
              chars: '!<>-_\\/[]{}—=+*^?#________',
              speed: 0.5,
              delimiter: '',
            },
            duration: 1.2,
            delay: 0.3,
          });
        });
      }

      if (narrativeRef.current) {
        const paragraphs = narrativeRef.current.querySelectorAll('.narrative-p');
        gsap.from(paragraphs, {
          scrollTrigger: {
            trigger: narrativeRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
        });
      }

      if (posterRef.current) {
        gsap.from(posterRef.current, {
          scrollTrigger: {
            trigger: posterRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          scale: 0.95,
          duration: 1.2,
          ease: 'archiveSlide',
        });
      }

      if (tagsRef.current) {
        const tags = tagsRef.current.querySelectorAll('span');
        gsap.from(tags, {
          scrollTrigger: {
            trigger: tagsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 10,
          stagger: 0.06,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    }, entryRef);

    return () => ctx.revert();
  }, []);

  const filteredNarrative = useMemo(() => {
    if (spoilerLevel === 'heavy') return data.narrative;
    if (spoilerLevel === 'moderate') return data.narrative.slice(0, Math.ceil(data.narrative.length * 0.7));
    return data.narrative.slice(0, Math.max(2, Math.ceil(data.narrative.length * 0.5)));
  }, [data.narrative, spoilerLevel]);

  return (
    <div
      ref={entryRef}
      className="version-entry"
      data-version={data.version}
      style={{
        position: 'relative',
        padding: 'clamp(4rem, 10vh, 8rem) 0',
        borderBottom: '1px solid #ffffff08',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'start',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        {/* LEFT: Version number + meta (sticky on desktop) */}
        <div
          className="va-left-panel"
          style={{
            position: 'sticky',
            top: '15vh',
            alignSelf: 'start',
          }}
        >
          <div
            className="meta-label"
            style={{
              fontFamily: 'var(--font-display, "Inter", sans-serif)',
              fontSize: 'clamp(0.5rem, 0.8vw, 0.6rem)',
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: chapterColor,
              marginBottom: '0.5rem',
            }}
          >
            {data.chapter}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display, "Inter", sans-serif)',
              fontSize: 'clamp(0.5rem, 0.8vw, 0.6rem)',
              fontWeight: 600,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#666',
              marginBottom: '1rem',
            }}
          >
            <span className="meta-label">{data.region}</span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display, "Inter", sans-serif)',
              fontSize: 'clamp(4rem, 12vw, 12rem)',
              fontWeight: 900,
              lineHeight: 0.85,
              color: '#E8E9ED',
              letterSpacing: '-0.03em',
              position: 'relative',
              marginBottom: '1.5rem',
            }}
          >
            <span style={{ fontSize: '0.4em', fontWeight: 600, verticalAlign: 'super', color: chapterColor, letterSpacing: '0.05em' }}>v</span>
            {data.version}
            <div
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                width: '60%',
                height: '3px',
                background: `linear-gradient(to right, ${chapterColor}, transparent)`,
              }}
            />
          </div>

          {/* Progress dot */}
          <div
            className="va-progress-dot"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: chapterColor,
              boxShadow: `0 0 12px ${chapterColor}66`,
              marginBottom: '1rem',
            }}
          />
        </div>

        {/* RIGHT: Content */}
        <div
          className="va-right-panel"
          style={{ paddingTop: 'clamp(1rem, 2vh, 2rem)' }}
        >
          {/* Version title */}
          <h3
            ref={titleRef}
            style={{
              fontFamily: 'var(--font-display, "Inter", sans-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#E8E9ED',
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            {data.title}
          </h3>

          {/* Poster image */}
          {data.media?.poster && (
            <div
              ref={posterRef}
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '2rem',
                position: 'relative',
                border: '1px solid #ffffff0a',
              }}
            >
              <img
                src={data.media.poster}
                alt={`${data.title} poster`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.7) saturate(1.1)',
                  transition: 'filter 0.5s ease, transform 0.5s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(0.85) saturate(1.2)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(0.7) saturate(1.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40%',
                  background: 'linear-gradient(to top, #0a0c10ee, transparent)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          )}

          {/* Narrative paragraphs */}
          <div ref={narrativeRef} style={{ marginBottom: '2rem' }}>
            {filteredNarrative.map((para, i) => (
              <p
                key={i}
                className="narrative-p"
                style={{
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                  lineHeight: 1.85,
                  color: '#aaa',
                  marginBottom: '1.2rem',
                  maxWidth: '65ch',
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Why It Matters */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderLeft: `3px solid ${chapterColor}44`,
              background: `${chapterColor}06`,
              marginBottom: '2rem',
              borderRadius: '0 2px 2px 0',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display, "Inter", sans-serif)',
                fontSize: '0.55rem',
                fontWeight: 700,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: chapterColor,
                marginBottom: '0.5rem',
              }}
            >
              WHY IT MATTERS
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: 'clamp(0.8rem, 1vw, 0.95rem)',
                lineHeight: 1.75,
                color: '#999',
                margin: 0,
              }}
            >
              {data.whyItMatters}
            </p>
          </div>

          {/* Tags */}
          <div ref={tagsRef}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.4rem',
                marginBottom: '0.75rem',
              }}
            >
              {data.characters.map((char) => (
                <CharacterTag key={char} name={char} />
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.4rem',
              }}
            >
              {data.locations.map((loc) => (
                <LocationTag key={loc} name={loc} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VersionArchive() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const progressLineRef = useRef(null);
  const progressContainerRef = useRef(null);
  const [spoilerLevel, setSpoilerLevel] = useState('light');
  const [activeChapter, setActiveChapter] = useState(chapters[0]?.id || '');
  const [isMobile, setIsMobile] = useState(false);

  const cycleSpoiler = useCallback(() => {
    setSpoilerLevel((prev) => {
      if (prev === 'light') return 'moderate';
      if (prev === 'moderate') return 'heavy';
      return 'light';
    });
  }, []);

  const chapterVersionMap = useMemo(() => {
    const map = {};
    chapters.forEach((ch) => {
      ch.versions.forEach((v) => {
        map[v] = ch;
      });
    });
    return map;
  }, []);

  const chapterGroups = useMemo(() => {
    return chapters.map((ch) => ({
      ...ch,
      versionData: ch.versions
        .map((v) => versions.find((ver) => ver.version === v))
        .filter(Boolean),
    }));
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        if (!prefersReducedMotion) {
          const titleSplit = new SplitText(headerRef.current.querySelector('.va-main-title'), {
            type: 'chars, words',
            charsClass: 'va-header-char',
          });
          gsap.from(titleSplit.chars, {
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 50,
            rotateX: -70,
            transformOrigin: 'bottom center',
            stagger: 0.025,
            duration: 1.2,
            ease: 'archiveReveal',
          });

          const subtitleEl = headerRef.current.querySelector('.va-subtitle');
          if (subtitleEl) {
            gsap.from(subtitleEl, {
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
              opacity: 0,
              y: 20,
              duration: 0.8,
              delay: 0.5,
              ease: 'power3.out',
            });
          }

          const labelEl = headerRef.current.querySelector('.va-section-label');
          if (labelEl) {
            gsap.to(labelEl, {
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
              scrambleText: {
                text: 'VERSION ARCHIVE',
                chars: '!<>-_\\/[]{}—=+*^?#________',
                speed: 0.6,
                delimiter: '',
              },
              duration: 1.5,
              delay: 0.2,
            });
          }
        } else {
          gsap.set(headerRef.current.querySelectorAll('*'), { opacity: 1 });
        }
      }

      if (progressLineRef.current && !prefersReducedMotion && !isMobile) {
        gsap.fromTo(
          progressLineRef.current,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 20%',
              end: 'bottom 80%',
              scrub: 1.5,
            },
          }
        );
      }

      const entries = sectionRef.current.querySelectorAll('.version-entry');
      entries.forEach((entry) => {
        ScrollTrigger.create({
          trigger: entry,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => {
            const ver = entry.getAttribute('data-version');
            if (ver && chapterVersionMap[ver]) {
              setActiveChapter(chapterVersionMap[ver].id);
            }
          },
          onEnterBack: () => {
            const ver = entry.getAttribute('data-version');
            if (ver && chapterVersionMap[ver]) {
              setActiveChapter(chapterVersionMap[ver].id);
            }
          },
        });
      });

      if (!prefersReducedMotion) {
        const chapterCards = sectionRef.current.querySelectorAll('.chapter-intro-card');
        chapterCards.forEach((card) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: 'power3.out',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, chapterVersionMap]);

  return (
    <section
      ref={sectionRef}
      id="version-archive"
      style={{
        position: 'relative',
        background: '#0a0c10',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient per active chapter */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          background: `radial-gradient(ellipse at 20% 30%, ${
            chapters.find((c) => c.id === activeChapter)?.color || '#4A90D9'
          }08 0%, transparent 60%)`,
          pointerEvents: 'none',
          transition: 'background 1.5s ease',
          zIndex: 0,
        }}
      />

      {/* Noise overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          mixBlendMode: 'screen',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Vertical progress line (desktop) */}
      {!isMobile && (
        <div
          ref={progressContainerRef}
          style={{
            position: 'fixed',
            left: 'clamp(1rem, 3vw, 3rem)',
            top: '15vh',
            bottom: '15vh',
            width: '2px',
            background: '#ffffff08',
            zIndex: 50,
            pointerEvents: 'none',
          }}
        >
          <svg
            width="2"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <line
              ref={progressLineRef}
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke="#3FE0D0"
              strokeWidth="2"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              style={{ filter: 'drop-shadow(0 0 6px #3FE0D066)' }}
            />
          </svg>
          {/* Chapter dots on progress line */}
          {chapters.map((ch, i) => (
            <div
              key={ch.id}
              className={`progress-dot ${activeChapter === ch.id ? 'active' : ''}`}
              style={{
                position: 'absolute',
                left: '-4px',
                top: `${(i / (chapters.length - 1 || 1)) * 100}%`,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: `2px solid ${activeChapter === ch.id ? ch.color : '#333'}`,
                background: activeChapter === ch.id ? ch.color : '#0a0c10',
                transition: 'all 0.5s ease',
                boxShadow: activeChapter === ch.id ? `0 0 10px ${ch.color}66` : 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* Section header */}
      <div
        ref={headerRef}
        style={{
          position: 'relative',
          zIndex: 10,
          padding: 'clamp(6rem, 15vh, 12rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 8vh, 6rem)',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <div
          className="va-section-label"
          style={{
            fontFamily: 'var(--font-display, "Inter", sans-serif)',
            fontSize: 'clamp(0.5rem, 0.9vw, 0.65rem)',
            fontWeight: 600,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#3FE0D0',
            marginBottom: '1.5rem',
          }}
        >
          VERSION ARCHIVE
        </div>
        <h2
          className="va-main-title"
          style={{
            fontFamily: 'var(--font-display, "Inter", sans-serif)',
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: '#E8E9ED',
            margin: 0,
            marginBottom: '1rem',
          }}
        >
          THE JOURNEY OF
          <br />
          ROVER THROUGH
          <br />
          <span style={{ color: '#3FE0D0' }}>SOLARIS-3</span>
        </h2>
        <p
          className="va-subtitle"
          style={{
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
            lineHeight: 1.7,
            color: '#666',
            maxWidth: '50ch',
          }}
        >
          Every version is a chapter in an unfolding story. Scroll through the archive to relive the
          journey from awakening to the present.
        </p>

        <div style={{ marginTop: '2rem' }}>
          <SpoilerToggle level={spoilerLevel} onToggle={cycleSpoiler} />
        </div>
      </div>

      {/* Version entries grouped by chapter */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          paddingBottom: 'clamp(6rem, 15vh, 12rem)',
        }}
      >
        {chapterGroups.map((group) => (
          <div key={group.id} data-chapter={group.id}>
            {/* Chapter intro card */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
              <ChapterIntroCard chapter={group} isActive={activeChapter === group.id} />
            </div>

            {/* Version entries for this chapter */}
            {group.versionData.map((ver, idx) => (
              <VersionEntry
                key={ver.version}
                data={ver}
                chapterColor={group.color}
                index={idx}
                spoilerLevel={spoilerLevel}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Navigation: Previous / Next */}
      <VersionNav chapters={chapters} versions={versions} />

      <style>{`
        .va-title-char {
          display: inline-block;
          will-change: transform, opacity;
        }
        .va-header-char {
          display: inline-block;
          will-change: transform, opacity;
        }
        .chapter-label-scramble {
          will-change: opacity;
        }
        .spoiler-toggle-btn:focus-visible {
          outline: 2px solid #3FE0D0;
          outline-offset: 2px;
        }

        @media (max-width: 768px) {
          .version-entry > div {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .va-left-panel {
            position: relative !important;
            top: auto !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .va-title-char,
          .va-header-char {
            opacity: 1 !important;
            transform: none !important;
          }
          .progress-dot {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function VersionNav({ chapters, versions }) {
  const [hovered, setHovered] = useState(null);

  const allVersions = useMemo(() => {
    return chapters.flatMap((ch) =>
      ch.versions.map((v) => ({
        version: v,
        data: versions.find((ver) => ver.version === v),
        chapter: ch,
      }))
    );
  }, [chapters, versions]);

  const currentIndex = 0;
  const prev = currentIndex > 0 ? allVersions[currentIndex - 1] : null;
  const next = currentIndex < allVersions.length - 1 ? allVersions[currentIndex + 1] : null;

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid #ffffff08',
        padding: 'clamp(2rem, 5vh, 4rem) clamp(1.5rem, 5vw, 4rem)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {prev ? (
          <button
            onMouseEnter={() => setHovered('prev')}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.3rem',
              padding: '1rem 1.5rem',
              border: '1px solid #ffffff10',
              borderRadius: '2px',
              background: hovered === 'prev' ? '#ffffff08' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              outline: 'none',
              textAlign: 'left',
              minWidth: '200px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display, "Inter", sans-serif)',
                fontSize: '0.5rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: '#666',
                textTransform: 'uppercase',
              }}
            >
              &larr; PREVIOUS
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display, "Inter", sans-serif)',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#E8E9ED',
              }}
            >
              v{prev.version} &middot; {prev.data?.title}
            </span>
          </button>
        ) : (
          <div />
        )}

        {next ? (
          <button
            onMouseEnter={() => setHovered('next')}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.3rem',
              padding: '1rem 1.5rem',
              border: '1px solid #ffffff10',
              borderRadius: '2px',
              background: hovered === 'next' ? '#ffffff08' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              outline: 'none',
              textAlign: 'right',
              minWidth: '200px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display, "Inter", sans-serif)',
                fontSize: '0.5rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: '#666',
                textTransform: 'uppercase',
              }}
            >
              NEXT &rarr;
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display, "Inter", sans-serif)',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#E8E9ED',
              }}
            >
              v{next.version} &middot; {next.data?.title}
            </span>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
