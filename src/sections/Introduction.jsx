import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { prefersReducedMotion } from '../gsapSetup';
import { lore } from '../data/lore';

const displayLore = lore.filter((item) =>
  ['rover', 'lament', 'tacet-discords', 'resonance', 'echoes', 'threnodians', 'black-shores'].includes(item.id)
);

export default function Introduction() {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  const toggleCard = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.intro-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.intro-desc', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
      });

      document.querySelectorAll('.lore-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
          y: 50,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.08,
          ease: 'power3.out',
        });
      });

      if (svgRef.current) {
        const lines = svgRef.current.querySelectorAll('.lore-line');
        lines.forEach((line) => {
          gsap.fromTo(
            line,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              scrollTrigger: {
                trigger: svgRef.current,
                start: 'top 80%',
                end: 'bottom 30%',
                scrub: 1.2,
              },
            }
          );
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper intro-section" id="introduction">
      <div className="container">
        <p className="section-label">Lore &amp; Concepts</p>
        <h2 className="section-title intro-title">
          WHAT IS<br />WUTHERING WAVES?
        </h2>
        <p className="section-desc intro-desc">
          An open-world action RPG developed by <strong>Kuro Games</strong>, set on the
          devastated planet <strong>Solaris-3</strong>. As the amnesiac <strong>Rover</strong>,
          you fight hostile <strong>Tacet Discords</strong>, wield the power of{' '}
          <strong>Resonance</strong>, and unravel the mysteries behind a civilization shattered by
          the <strong>Lament</strong>.
        </p>

        <div className="lore-grid">
          <svg ref={svgRef} className="lore-connectors" aria-hidden="true">
            <line className="lore-line" x1="10%" y1="20%" x2="35%" y2="15%" stroke="rgba(63,224,208,0.15)" strokeWidth="1" />
            <line className="lore-line" x1="35%" y1="15%" x2="60%" y2="22%" stroke="rgba(63,224,208,0.12)" strokeWidth="1" />
            <line className="lore-line" x1="60%" y1="22%" x2="85%" y2="18%" stroke="rgba(138,92,246,0.12)" strokeWidth="1" />
            <line className="lore-line" x1="10%" y1="55%" x2="35%" y2="60%" stroke="rgba(138,92,246,0.12)" strokeWidth="1" />
            <line className="lore-line" x1="35%" y1="60%" x2="60%" y2="52%" stroke="rgba(63,224,208,0.15)" strokeWidth="1" />
            <line className="lore-line" x1="60%" y1="52%" x2="85%" y2="58%" stroke="rgba(138,92,246,0.12)" strokeWidth="1" />
          </svg>

          {displayLore.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`lore-card ${isExpanded ? 'lore-card--expanded' : ''}`}
                onClick={() => toggleCard(item.id)}
                onKeyDown={(e) => e.key === 'Enter' && toggleCard(item.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <div className="lore-card-header">
                  <span className="lore-icon">{item.icon}</span>
                  <h3 className="lore-term">{item.term}</h3>
                  <span className={`lore-expand-arrow ${isExpanded ? 'lore-expand-arrow--open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <p className="lore-definition">{item.definition}</p>
                {isExpanded && (
                  <div className="lore-detail">
                    <p className="lore-detail-text">
                      {getExpandedDetail(item.id)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .intro-section {
          padding: var(--section-padding) 0;
          background: var(--bg-1, var(--bg-primary));
        }
        .lore-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--gap-lg);
          margin-top: var(--gap-xl);
          position: relative;
        }
        .lore-connectors {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        .lore-card {
          position: relative;
          z-index: 1;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          padding: var(--gap-lg);
          cursor: pointer;
          transition:
            border-color var(--duration-fast),
            box-shadow var(--duration-fast),
            transform var(--duration-normal);
        }
        .lore-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--glow-cyan);
          transform: translateY(-3px);
        }
        .lore-card--expanded {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 20px rgba(63, 224, 208, 0.15);
        }
        .lore-card-header {
          display: flex;
          align-items: center;
          gap: var(--gap-sm);
          margin-bottom: var(--gap-sm);
        }
        .lore-icon {
          font-size: 1.6rem;
          flex-shrink: 0;
        }
        .lore-term {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--accent-cyan);
          flex: 1;
          letter-spacing: 0.02em;
        }
        .lore-expand-arrow {
          color: var(--text-dim);
          transition: transform var(--duration-fast);
          flex-shrink: 0;
        }
        .lore-expand-arrow--open {
          transform: rotate(180deg);
        }
        .lore-definition {
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin: 0;
        }
        .lore-detail {
          margin-top: var(--gap-md);
          padding-top: var(--gap-md);
          border-top: 1px solid var(--border-subtle);
          animation: loreExpandIn 0.3s ease-out;
        }
        .lore-detail-text {
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 0.82rem;
          color: var(--text-dim);
          line-height: 1.6;
          margin: 0;
        }
        @keyframes loreExpandIn {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 200px; }
        }
        @media (max-width: 700px) {
          .lore-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

function getExpandedDetail(id) {
  const details = {
    rover:
      'The Rover awakens with fragmented memories and an inexplicable connection to the frequencies of Solaris-3. Their journey is one of self-discovery — each region they explore reveals a piece of the puzzle linking them to the Lament and the fate of the world.',
    lament:
      'The Lament was not a single event but a cascading failure of the world\'s frequency equilibrium. Entire continents were reshaped overnight, and the residual energy left scars on reality itself — zones where time, space, and matter behave unpredictably.',
    'tacet-discords':
      'Named for the "tacet" (silence) they leave in the world\'s frequencies, Tacet Discords are drawn to areas of high emotional distress. Some are mindless predators, while others display eerie intelligence and coordinated behavior.',
    resonance:
      'Resonance is the ability to perceive and manipulate the fundamental frequencies of matter. Only a fraction of the population are natural Resonators, and their powers vary widely — from healing and shields to destructive sonic blasts.',
    echoes:
      'When a Tacet Discord is defeated, its frequency signature lingers as an Echo. Skilled Resonators can attune to these Echoes, briefly wielding the creature\'s abilities. The strongest Echoes come from the most dangerous foes.',
    threnodians:
      'Threnodians are entities of immense power that predate the Lament. They exist between dimensions, and their motivations remain opaque — some appear destructive, while others seem to be testing humanity\'s worthiness to survive.',
    'black-shores':
      'The Black Shores operate on the fringes of known civilization. Their agents appear at critical junctures with knowledge that should be impossible to obtain, suggesting they have access to records or technology from before the Lament.',
  };
  return details[id] || '';
}
