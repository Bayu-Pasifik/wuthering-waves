import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { Observer } from 'gsap/Observer';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { prefersReducedMotion } from '../gsapSetup';

CustomEase.create('heroReveal', 'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create('heroFadeUp', 'M0,0 C0.33,1 0.68,1 1,1');

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const archiveRef = useRef(null);
  const gridRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // --- BACKGROUND PARALLAX ---
      if (bgRef.current && !prefersReducedMotion) {
        gsap.to(bgRef.current, {
          y: 120,
          scale: 1.05,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // --- GRID LINES ANIMATION ---
      if (gridRef.current && !prefersReducedMotion) {
        const gridLines = gridRef.current.querySelectorAll('line');
        tl.fromTo(
          gridLines,
          { strokeDashoffset: 2000 },
          {
            strokeDashoffset: 0,
            duration: 2.5,
            stagger: 0.04,
            ease: 'power2.inOut',
          },
          0.3
        );
      }

      // --- ATMOSPHERIC GLOW PULSE ---
      if (!prefersReducedMotion) {
        tl.fromTo(
          '.hero-glow',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
          0.5
        );
        gsap.to('.hero-glow', {
          scale: 1.1,
          opacity: 0.7,
          duration: 4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      // --- TITLE: SplitText entrance ---
      if (titleRef.current) {
        if (!prefersReducedMotion) {
          const splitTitle = new SplitText(titleRef.current, {
            type: 'chars, words',
            charsClass: 'hero-char',
            wordsClass: 'hero-word',
          });

          tl.from(
            splitTitle.chars,
            {
              opacity: 0,
              y: 60,
              rotateX: -80,
              transformOrigin: 'bottom center',
              stagger: 0.025,
              duration: 1.2,
              ease: 'heroReveal',
            },
            0.4
          );
        } else {
          tl.from(titleRef.current, { opacity: 0, duration: 0.5 }, 0.4);
        }
      }

      // --- SUBTITLE ---
      if (subtitleRef.current) {
        tl.from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 25,
            duration: 0.9,
            ease: 'heroFadeUp',
          },
          1.0
        );
      }

      // --- ARCHIVE CLASSIFICATION: ScrambleText ---
      if (archiveRef.current) {
        tl.from(
          archiveRef.current,
          { opacity: 0, duration: 0.4 },
          1.2
        );

        if (!prefersReducedMotion) {
          gsap.to(archiveRef.current, {
            scrambleText: {
              text: 'SOLARIS-3 / RESONANCE ARCHIVE',
              chars: '!<>-_\\/[]{}—=+*^?#________',
              speed: 0.6,
              delimiter: '',
            },
            duration: 1.8,
            delay: 1.4,
          });
        }
      }

      // --- SCROLL INDICATOR ---
      if (!prefersReducedMotion) {
        tl.fromTo(
          '.hero-scroll-indicator',
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          2.0
        );
        gsap.to('.hero-scroll-arrow', {
          y: 6,
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      // --- SCROLL-TRIGGERED FADE/SHIFT ---
      if (!prefersReducedMotion) {
        gsap.to(titleRef.current, {
          y: -80,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '60% top',
            scrub: true,
          },
        });
        gsap.to(subtitleRef.current, {
          y: -50,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '50% top',
            scrub: true,
          },
        });
      }

      // --- PARTICLES: Physics2DPlugin ---
      if (canvasRef.current && !prefersReducedMotion) {
        const canvas = canvasRef.current;
        const ctx2d = canvas.getContext('2d');
        let animFrame;
        const particles = [];
        const PARTICLE_COUNT = 60;

        const resize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.8 + 0.3,
            vx: 0,
            vy: 0,
            opacity: Math.random() * 0.4 + 0.08,
            hue: Math.random() > 0.65 ? 170 : 265,
            life: Math.random() * 100,
          });
        }

        // Physics2D drift for each particle
        particles.forEach((p) => {
          gsap.to(p, {
            physics2D: {
              velocity: Math.random() * 15 + 5,
              angle: Math.random() * 360,
              gravity: -8,
              friction: 0.98,
            },
            duration: Math.random() * 12 + 8,
            repeat: -1,
            yoyo: true,
            ease: 'none',
            overwrite: false,
          });
        });

        function draw() {
          ctx2d.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach((p) => {
            p.life += 0.3;
            const wobble = Math.sin(p.life * 0.02) * 0.3;
            ctx2d.beginPath();
            ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx2d.fillStyle =
              p.hue === 170
                ? `rgba(63, 224, 208, ${p.opacity + wobble * 0.1})`
                : `rgba(138, 92, 246, ${p.opacity + wobble * 0.1})`;
            ctx2d.fill();
          });
          animFrame = requestAnimationFrame(draw);
        }
        draw();

        // Cleanup inside context so revert handles it
        gsap.context(() => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            onLeave: () => cancelAnimationFrame(animFrame),
            onEnterBack: () => draw(),
          });
        });
      }

      // Observer for scroll direction detection on hero
      if (!prefersReducedMotion) {
        const scrollIndicator = sectionRef.current?.querySelector('.hero-scroll-indicator');
        Observer.create({
          target: window,
          type: 'wheel,touch',
          onDown: () => {
            if (scrollIndicator) {
              gsap.to(scrollIndicator, { opacity: 0, y: -10, duration: 0.3 });
            }
          },
          onUp: () => {
            if (scrollIndicator) {
              gsap.to(scrollIndicator, { opacity: 1, y: 0, duration: 0.3 });
            }
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-wrapper hero-section"
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#07090D',
      }}
    >
      {/* LAYER 0: Dark base */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, #0e1218 0%, #07090D 70%)',
          zIndex: 0,
        }}
      />

      {/* LAYER 1: Background image */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 1,
          willChange: 'transform',
        }}
      >
        <img
          src="/assets/images/3.6.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.28) saturate(0.65) contrast(1.1)',
          }}
        />
      </div>

      {/* LAYER 2: Noise texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          opacity: 0.035,
          mixBlendMode: 'screen',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          pointerEvents: 'none',
        }}
      />

      {/* LAYER 3: Cyan atmospheric glow */}
      <div
        className="hero-glow"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '60vh',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(63, 224, 208, 0.08) 0%, rgba(63, 224, 208, 0.02) 40%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 3,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* LAYER 4: Technical grid lines */}
      <svg
        ref={gridRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 4,
          pointerEvents: 'none',
          opacity: 0.12,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horizontal lines */}
        {[...Array(12)].map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={`${(i + 1) * (100 / 13)}%`}
            x2="100%"
            y2={`${(i + 1) * (100 / 13)}%`}
            stroke="var(--cyan)"
            strokeWidth="0.5"
            strokeDasharray="2000"
            strokeDashoffset="2000"
          />
        ))}
        {/* Vertical lines */}
        {[...Array(18)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={`${(i + 1) * (100 / 19)}%`}
            y1="0"
            x2={`${(i + 1) * (100 / 19)}%`}
            y2="100%"
            stroke="var(--cyan)"
            strokeWidth="0.5"
            strokeDasharray="2000"
            strokeDashoffset="2000"
          />
        ))}
      </svg>

      {/* LAYER 5: Particles canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* LAYER 6: Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(7, 9, 13, 0.7) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* LAYER 7: Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '1200px',
        }}
      >
        {/* Archive classification above title */}
        <div
          ref={archiveRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.55rem, 1vw, 0.7rem)',
            fontWeight: 600,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--cyan)',
            marginBottom: 'clamp(1.5rem, 4vh, 3rem)',
            opacity: 0.85,
          }}
        >
          SOLARIS-3 / RESONANCE ARCHIVE
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 9vw, 9rem)',
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.01em',
            margin: 0,
            background:
              'linear-gradient(135deg, #E8E9ED 0%, #E8E9ED 40%, var(--cyan) 75%, var(--violet) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            perspective: '800px',
          }}
        >
          WUTHERING
          <br />
          WAVES
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.65rem, 1.3vw, 1rem)',
            fontWeight: 400,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginTop: 'clamp(1.5rem, 4vh, 3rem)',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.7,
          }}
        >
          PERJALANAN MELALUI MEMORI, RESONANCE, DAN YANG TIDAK DIKETAHUI
        </p>

        {/* Chapter marker */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.55rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
            marginTop: 'clamp(2rem, 5vh, 4rem)',
            opacity: 0.6,
          }}
        >
          <span style={{ color: 'var(--cyan)', marginRight: '0.5rem' }}>01</span>
          DUNIA TERBANGUN
        </div>
      </div>

      {/* LAYER 8: Scroll indicator */}
      <div
        className="hero-scroll-indicator"
        style={{
          position: 'absolute',
          bottom: 'clamp(2rem, 5vh, 3.5rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
          opacity: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.5rem',
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          GULIR
        </span>
        <div
          className="hero-scroll-arrow"
          style={{ willChange: 'transform' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.6 }}
          >
            <path d="M12 5v14" />
            <path d="M5 12l7 7 7-7" />
          </svg>
        </div>
        {/* Scroll line */}
        <div
          style={{
            width: '1px',
            height: '30px',
            background: 'linear-gradient(to bottom, var(--cyan), transparent)',
            opacity: 0.3,
          }}
        />
      </div>

      <style>{`
        .hero-section {
          border-bottom: 1px solid var(--line);
        }
        .hero-char {
          display: inline-block;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-glow { animation: none !important; }
          .hero-scroll-arrow { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
