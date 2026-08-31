import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { CustomBounce } from 'gsap/CustomBounce';
import { prefersReducedMotion } from '../gsapSetup';

const characters = [
  {
    name: 'Rover',
    role: 'Protagonist',
    element: 'Spectro/Havoc',
    img: '/assets/images/Rover.jpg'
  },
  {
    name: 'Changli',
    role: '5-Star Resonator',
    element: 'Fusion',
    img: '/assets/images/Changli Splash.jpg'
  },
  {
    name: 'Brant',
    role: '5-Star Resonator',
    element: 'Havoc',
    img: '/assets/images/Brant Splash.jpg'
  },
  {
    name: 'Cantarella',
    role: '5-Star Resonator',
    element: 'Spectro',
    img: '/assets/images/Cantarella Splash.jpg'
  },
  {
    name: 'Chisa',
    role: '5-Star Resonator',
    element: 'Electro',
    img: '/assets/images/Chisa Splash.jpg'
  },
  {
    name: 'Cartethyia',
    role: '5-Star Resonator',
    element: 'Aero',
    img: '/assets/images/Cartethyia Splash.jpg'
  }
];

// SVG shapes for morphing
const shapes = [
  'M100,10 L40,198 L190,78 L10,78 L160,198 Z',
  'M100,10 C145,10 180,45 180,90 C180,135 145,170 100,170 C55,170 20,135 20,90 C20,45 55,10 100,10 Z',
  'M100,10 L190,50 L190,130 L100,170 L10,130 L10,50 Z',
  'M50,10 L150,10 L190,90 L150,170 L50,170 L10,90 Z',
  'M100,10 C155,10 190,55 190,100 C190,145 155,190 100,190 C45,190 10,145 10,100 C10,55 45,10 100,10 Z',
  'M100,20 L180,60 L160,160 L40,160 L20,60 Z'
];

export default function CharacterSpotlight() {
  const sectionRef = useRef(null);
  const morphRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.cs-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      // Character cards entrance with CustomBounce
      document.querySelectorAll('.character-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          },
          y: 100,
          opacity: 0,
          duration: 1,
          delay: i * 0.1,
          ease: 'bounce.out'
        });
      });

      // MotionPath for decorative particles
      if (!prefersReducedMotion) {
        gsap.to('.motion-particle', {
          motionPath: {
            path: '.motion-path',
            align: '.motion-path',
            alignOrigin: [0.5, 0.5],
            autoRotate: true
          },
          duration: 5,
          repeat: -1,
          ease: 'none'
        });
      }

      // MorphSVG shape cycling
      if (morphRef.current && !prefersReducedMotion) {
        let shapeIndex = 0;
        const morphTl = gsap.timeline({ repeat: -1 });
        shapes.forEach((shape, i) => {
          if (i < shapes.length - 1) {
            morphTl.to(morphRef.current, {
              morphSVG: shapes[(i + 1) % shapes.length],
              duration: 2,
              ease: 'power2.inOut'
            });
          }
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper cs-section" id="characters">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <path ref={morphRef} id="morph-shape" d={shapes[0]} fill="none" />
      </svg>

      <div className="container">
        <p className="section-label">Character Spotlight</p>
        <h2 className="section-title cs-title">Meet the<br />Resonators</h2>
        <p className="section-desc">
          Setiap karakter memiliki abilities unik, backstory mendalam, dan gaya combat tersendiri.
        </p>

        <div className="characters-grid">
          {characters.map((char, i) => (
            <div key={char.name} className="character-card">
              <div className="character-img-wrapper">
                <img src={char.img} alt={char.name} loading="lazy" />
                <div className="character-element-badge">{char.element}</div>
              </div>
              <div className="character-info">
                <h3 className="character-name">{char.name}</h3>
                <p className="character-role">{char.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative morph shape */}
        <div className="morph-deco">
          <svg viewBox="0 0 200 200" width="120" height="120">
            <use href="#morph-shape" stroke="var(--accent-cyan)" strokeWidth="1" opacity="0.2" fill="none" />
          </svg>
        </div>
      </div>

      <style>{`
        .cs-section {
          padding: var(--section-padding) 0;
          background: var(--bg-secondary);
          position: relative;
        }
        .characters-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--gap-lg);
          margin-top: var(--gap-xl);
        }
        @media (max-width: 900px) {
          .characters-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 500px) {
          .characters-grid {
            grid-template-columns: 1fr;
          }
        }
        .character-card {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-card);
          transition: border-color var(--duration-normal), box-shadow var(--duration-normal), transform var(--duration-normal);
          cursor: pointer;
        }
        .character-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--glow-cyan-strong);
          transform: translateY(-6px);
        }
        .character-img-wrapper {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
        }
        .character-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--duration-slow);
        }
        .character-card:hover .character-img-wrapper img {
          transform: scale(1.05);
        }
        .character-element-badge {
          position: absolute;
          top: var(--gap-sm);
          right: var(--gap-sm);
          padding: 4px 10px;
          background: rgba(10, 11, 16, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: 100px;
          font-family: var(--font-heading);
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent-cyan);
        }
        .character-info {
          padding: var(--gap-md);
        }
        .character-name {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .character-role {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .morph-deco {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          opacity: 0.3;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
