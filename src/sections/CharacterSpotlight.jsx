import { useEffect, useRef, useCallback } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { CustomBounce } from 'gsap/CustomBounce';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { PhysicsPropsPlugin } from 'gsap/PhysicsPropsPlugin';
import { prefersReducedMotion } from '../gsapSetup';

const characters = [
  {
    name: 'Rover',
    region: 'Semua Wilayah',
    storyRole: 'Protagonist — seorang Resonator misterius yang terbangun dengan ingatan yang terfragmentasi, melakukan perjalanan melintasi Solaris-3 untuk merebut kembali masa lalu dan menghadapi ancaman Tacet Discord.',
    gameplayRole: 'Spectro / Havoc — DPS utama serbaguna dengan mekanisme pergantian posisi, beradaptasi dengan komposisi tim apa pun.',
    memorable: 'Jangkar pemain dalam dunia yang retak — setiap ketukan cerita utama berputar di sekitar tekad mereka.',
    img: '/assets/images/Changli Splash.jpg',
    element: 'Spectro / Havoc',
    accent: '#3FE0D0',
  },
  {
    name: 'Jinhsi',
    region: 'Huanglong — Jinzhou',
    storyRole: 'Magistrate Jinzhou — pemimpin tenang yang memikul tanggung jawab melindungi kotanya sambil menyembunyikan kebenaran Lament.',
    gameplayRole: 'Spectro — sub-DPS dan pendukung kuat yang menyalurkan energi matahari menjadi serangan burst dahsyat.',
    memorable: 'Tanggung jawabnya yang tak tergoyahan dan kerentanan tersembunyi menjadikannya salah satu pemimpin paling menarik dalam gim.',
    img: '/assets/images/Changli Splash.jpg',
    element: 'Spectro',
    accent: '#FFD700',
  },
  {
    name: 'Shorekeeper',
    region: 'Black Shores — Huanglong',
    storyRole: 'Penjaga Black Shores — sosok misterius yang terhubung dengan misteri terdalam masa lalu Solaris.',
    gameplayRole: 'Spectro — DPS burst berdampak tinggi dengan mekanisme resonansi unik yang memberikan penghargaan atas waktu yang tepat.',
    memorable: 'Koneksi mereka dengan sejarah terlupakan dunia menambah lapisan intriga dalam setiap interaksi.',
    img: '/assets/images/Cantarella Splash.jpg',
    element: 'Spectro',
    accent: '#A78BFA',
  },
  {
    name: 'Carlotta',
    region: 'Rinascita',
    storyRole: 'Figur kunci dalam alur cerita Rinascita — menavigasi ketegangan budaya dan rahasia kuno wilayah tersebut.',
    gameplayRole: 'Fusion — DPS gesit dengan rantai combo cepat dan kemampuan crowd-control.',
    memorable: 'Kecerdasan tajam dan keteguhan tanpa henti mereka memotong kekacauan pertempuran.',
    img: '/assets/images/Brant Splash.jpg',
    element: 'Fusion',
    accent: '#F97316',
  },
  {
    name: 'Chisa',
    region: 'Lahai-Roi / Mengzhou',
    storyRole: 'Resonator dari wilayah pesisir Lahai-Roi, terhubung dengan pasang surut dan misteri di bawah ombak.',
    gameplayRole: 'Havoc — spesialis AoE dahsyat dengan penolakan area dan burst damage yang kuat.',
    memorable: 'Dwifungsi sikap tenang dan kekuatan ledakan mereka menciptakan momen pertempuran yang tak terlupakan.',
    img: '/assets/images/Chisa Summer Skin Splash.jpg',
    element: 'Havoc',
    accent: '#E11D48',
  },
  {
    name: 'Sigrika',
    region: 'Lahai-Roi',
    storyRole: 'Figur penjaga dari Lahai-Roi, menggunakan kekuatan kedalaman untuk melindungi tanah airnya.',
    gameplayRole: 'Glacio — DPS berorientasi kontrol dengan mekanisme pembekuan dan damage berkelanjutan dari waktu ke waktu.',
    memorable: 'Kehadiran tenang dan presisi dingin mereka mendapatkan rasa hormat baik di dalam maupun di luar pertempuran.',
    img: '/assets/images/Cartethyia Splash.jpg',
    element: 'Glacio',
    accent: '#38BDF8',
  },
  {
    name: 'Augusta',
    region: 'Rinascita',
    storyRole: 'Ksatria mulia dari Rinascita, menyeimbangkan kehormatan dan pragmatisme di dunia yang berada di ambang kehancuran.',
    gameplayRole: 'Electro — DPS serangan cepat dengan petir berantai dan single-target damage tinggi.',
    memorable: 'Perpaduan keanggunan dan keganasan mereka membuat setiap pertarungan terasa seperti pertunjukan.',
    img: '/assets/images/Augusta Splash.jpg',
    element: 'Electro',
    accent: '#C084FC',
  },
  {
    name: 'Aemeath',
    region: 'Lahai-Roi',
    storyRole: 'Sosok misterius dari kedalaman Lahai-Roi, terhubung dengan kekuatan kuno yang sudah lama dianggap tidur.',
    gameplayRole: 'Aero — pendukung dan DPS serbaguna dengan crowd control berbasis angin dan mobilitas.',
    memorable: 'Kehadiran etereal dan koneksi dengan kekuatan alam yang murni membuat mereka menonjol.',
    img: '/assets/images/Aemeath Splash.jpg',
    element: 'Aero',
    accent: '#4ADE80',
  },
];

const morphShapes = [
  'M50,5 L95,25 L95,75 L50,95 L5,75 L5,25 Z',
  'M50,5 C75,5 95,25 95,50 C95,75 75,95 50,95 C25,95 5,75 5,50 C5,25 25,5 50,5 Z',
  'M50,5 L90,30 L90,70 L50,95 L10,70 L10,30 Z',
  'M50,5 C80,5 95,30 95,55 C95,80 75,95 50,95 C25,95 5,75 5,50 C5,25 20,5 50,5 Z',
  'M50,10 L85,25 L90,65 L65,90 L35,90 L10,65 L15,25 Z',
  'M50,5 L95,40 L80,90 L20,90 L5,40 Z',
  'M50,5 C70,5 90,20 95,45 C100,70 85,95 55,95 C25,95 5,75 5,50 C5,25 30,5 50,5 Z',
  'M50,5 L90,20 L95,60 L70,90 L30,90 L5,60 L10,20 Z',
];

const floatingPaths = [
  'M0,0 C30,-40 70,40 100,0 C130,-40 170,40 200,0',
  'M0,20 Q50,-20 100,20 Q150,60 200,20',
  'M0,0 C40,30 60,-30 100,0 C140,30 160,-30 200,0',
];

export default function CharacterSpotlight() {
  const sectionRef = useRef(null);
  const morphRef = useRef(null);
  const cardsRef = useRef([]);

  const handlePointerMove = useCallback((e) => {
    if (prefersReducedMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    gsap.to(card, {
      physicsProps: {
        rotationY: { velocity: x * 15, friction: 0.8 },
        rotationX: { velocity: -y * 10, friction: 0.8 },
      },
      duration: 0.6,
      ease: 'power2.out',
    });
  }, []);

  const handlePointerLeave = useCallback((e) => {
    if (prefersReducedMotion) return;
    gsap.to(e.currentTarget, {
      physicsProps: {
        rotationY: { velocity: 0, friction: 0.6 },
        rotationX: { velocity: 0, friction: 0.6 },
      },
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    });
  }, []);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.cs-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.cs-desc', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
      });

      const bounceEase = CustomBounce.create('charBounce', {
        strength: 0.6,
        endAtStart: true,
        squash: 1,
        bounceCount: 3,
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
          },
          y: 120,
          scaleY: 0.7,
          scaleX: 1.05,
          opacity: 0,
          duration: 1.2,
          delay: i * 0.08,
          ease: bounceEase,
        });
      });

      cardsRef.current.forEach((card) => {
        if (!card) return;
        card.addEventListener('mouseenter', () => {
          gsap.to(card.querySelector('.cs-card-icon'), {
            wiggle: {
              type: 'random',
              strength: 4,
              amplitudeX: 2,
              amplitudeY: 2,
              frequency: 8,
            },
            duration: 0.5,
          });
        });
      });

      const floatingEls = sectionRef.current.querySelectorAll('.cs-float-particle');
      floatingEls.forEach((el, i) => {
        gsap.to(el, {
          motionPath: {
            path: floatingPaths[i % floatingPaths.length],
            align: floatingPaths[i % floatingPaths.length],
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          duration: 12 + i * 3,
          repeat: -1,
          ease: 'none',
        });
        gsap.to(el, {
          opacity: 0.15 + Math.random() * 0.2,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      if (morphRef.current) {
        let shapeIdx = 0;
        const morphTl = gsap.timeline({ repeat: -1 });
        morphShapes.forEach((shape, i) => {
          if (i < morphShapes.length - 1) {
            morphTl.to(morphRef.current, {
              morphSVG: morphShapes[(i + 1) % morphShapes.length],
              duration: 3,
              ease: 'power2.inOut',
            });
          }
        });
        morphTl.to({}, { duration: 0 });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper cs-section" id="characters">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <path ref={morphRef} id="cs-morph-shape" d={morphShapes[0]} fill="none" />
      </svg>

      {!prefersReducedMotion &&
        [...Array(6)].map((_, i) => (
          <div
            key={i}
            className="cs-float-particle"
            style={{
              position: 'absolute',
              width: `${6 + i * 2}px`,
              height: `${6 + i * 2}px`,
              borderRadius: '50%',
              background: i % 2 === 0 ? 'var(--cyan)' : 'var(--violet)',
              opacity: 0,
              top: `${15 + i * 12}%`,
              left: `${5 + i * 15}%`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        ))}

      <div className="container">
        <p className="section-label">Spotlight Karakter</p>
        <h2 className="section-title cs-title">
          Kenali<br />Resonator
        </h2>
        <p className="section-desc cs-desc">
          Delapan ksatria yang terikat oleh takdir, masing-masing menggunakan kekuatan unik yang terbentuk dari
          ikatan mereka dengan Solaris-3. Kisah mereka berhubungan dengan misteri terdalam
          dunia.
        </p>

        <div className="cs-grid">
          {characters.map((char, i) => (
            <div
              key={char.name}
              className="cs-card"
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseMove={handlePointerMove}
              onMouseLeave={handlePointerLeave}
              style={{ perspective: '800px' }}
            >
              <div className="cs-card-img">
                <img src={char.img} alt={char.name} loading="lazy" />
                <div
                  className="cs-card-accent"
                  style={{
                    background: `linear-gradient(135deg, ${char.accent}22, ${char.accent}08)`,
                  }}
                />
                <div className="cs-card-element">{char.element}</div>
                <svg
                  className="cs-card-icon"
                  viewBox="0 0 100 100"
                  width="32"
                  height="32"
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    opacity: 0.25,
                  }}
                >
                  <use
                    href="#cs-morph-shape"
                    stroke={char.accent}
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="cs-card-body">
                <div className="cs-card-header">
                  <h3 className="cs-card-name">{char.name}</h3>
                  <span className="cs-card-region">{char.region}</span>
                </div>
                <div className="cs-card-details">
                  <div className="cs-card-detail">
                    <span className="cs-card-label">Cerita</span>
                    <p className="cs-card-text">{char.storyRole}</p>
                  </div>
                  <div className="cs-card-detail">
                    <span className="cs-card-label">Gameplay</span>
                    <p className="cs-card-text">{char.gameplayRole}</p>
                  </div>
                  <div className="cs-card-detail">
                    <span className="cs-card-label">Mengapa Berkesan</span>
                    <p className="cs-card-text">{char.memorable}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cs-morph-deco">
          <svg viewBox="0 0 100 100" width="100" height="100">
            <use
              href="#cs-morph-shape"
              stroke="var(--cyan)"
              strokeWidth="0.8"
              opacity="0.15"
              fill="none"
            />
          </svg>
        </div>
      </div>

      <style>{`
        .cs-section {
          padding: var(--section-padding) 0;
          background: var(--bg-secondary);
          position: relative;
          overflow: hidden;
        }
        .cs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--gap-md);
          margin-top: var(--gap-xl);
          perspective: 1200px;
        }
        @media (max-width: 1100px) {
          .cs-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 800px) {
          .cs-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 500px) {
          .cs-grid { grid-template-columns: 1fr; max-width: 400px; margin-left: auto; margin-right: auto; }
        }
        .cs-card {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-card);
          cursor: pointer;
          transform-style: preserve-3d;
          will-change: transform;
          transition: border-color var(--duration-normal), box-shadow var(--duration-normal);
        }
        .cs-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 8px 32px rgba(63, 224, 208, 0.12), 0 0 0 1px rgba(63, 224, 208, 0.08);
        }
        .cs-card-img {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
        }
        .cs-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--duration-slow);
          filter: saturate(0.85);
        }
        .cs-card:hover .cs-card-img img {
          transform: scale(1.06);
          filter: saturate(1);
        }
        .cs-card-accent {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .cs-card-element {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 3px 10px;
          background: rgba(7, 9, 13, 0.82);
          border: 1px solid var(--border-subtle);
          border-radius: 100px;
          font-family: var(--font-display);
          font-size: 0.55rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-primary);
          backdrop-filter: blur(8px);
        }
        .cs-card-body {
          padding: var(--gap-md);
        }
        .cs-card-header {
          margin-bottom: var(--gap-sm);
        }
        .cs-card-name {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .cs-card-region {
          font-family: var(--font-display);
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--cyan);
        }
        .cs-card-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cs-card-detail {
          border-top: 1px solid rgba(63, 224, 208, 0.06);
          padding-top: 8px;
        }
        .cs-card-label {
          display: block;
          font-family: var(--font-display);
          font-size: 0.5rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 3px;
        }
        .cs-card-text {
          font-size: 0.75rem;
          line-height: 1.55;
          color: var(--text-secondary);
        }
        .cs-morph-deco {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          pointer-events: none;
          opacity: 0.4;
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-card { transform: none !important; }
          .cs-card-img img { transition: none !important; }
          .cs-float-particle { display: none !important; }
        }
      `}</style>
    </section>
  );
}
