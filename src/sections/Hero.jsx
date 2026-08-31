import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { prefersReducedMotion } from '../gsapSetup';

CustomEase.create('heroReveal', 'M0,0 C0.16,1 0.3,1 1,1');

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Title SplitText entrance
      if (!prefersReducedMotion) {
        const splitTitle = new SplitText(titleRef.current, {
          type: 'chars, words',
          charsClass: 'char',
          wordsClass: 'word'
        });

        tl.from(splitTitle.chars, {
          opacity: 0,
          y: 40,
          rotateX: -90,
          stagger: 0.03,
          duration: 1,
          ease: 'heroReveal'
        }, 0);
      } else {
        tl.from(titleRef.current, { opacity: 0, duration: 0.5 }, 0);
      }

      // Subtitle
      tl.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      }, 0.6);

      // ScrambleText effect on subtitle
      if (!prefersReducedMotion) {
        gsap.to(subtitleRef.current, {
          scrambleText: {
            text: 'Explore Solaris-3',
            chars: '!<>-_\\/[]{}—=+*^?#________',
            speed: 0.5,
            delimiter: ''
          },
          duration: 1.2,
          delay: 1
        });
      }

      // Scroll-triggered parallax
      gsap.to(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: -100,
        opacity: 0
      });

      // Particles
      if (particlesRef.current && !prefersReducedMotion) {
        const canvas = particlesRef.current;
        const ctx2d = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const count = 80;

        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: -Math.random() * 0.3 - 0.1,
            opacity: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.7 ? '#3FE0D0' : '#8A5CF6'
          });
        }

        let animFrame;
        function animate() {
          ctx2d.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
            ctx2d.beginPath();
            ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx2d.fillStyle = p.color;
            ctx2d.globalAlpha = p.opacity;
            ctx2d.fill();
          });
          ctx2d.globalAlpha = 1;
          animFrame = requestAnimationFrame(animate);
        }
        animate();

        const handleResize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => {
          cancelAnimationFrame(animFrame);
          window.removeEventListener('resize', handleResize);
        };
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper hero-section">
      <canvas ref={particlesRef} className="hero-particles" />
      <div className="hero-bg">
        <img
          src="/assets/images/3.6.jpg"
          alt="Wuthering Waves cinematic"
          loading="eager"
        />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content container">
        <p className="section-label">Kuro Games • Action RPG</p>
        <h1 ref={titleRef} className="hero-title">
          Wuthering<br />Waves
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          Explore Solaris-3
        </p>
        <div className="hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 100vh;
          background: var(--bg-primary);
        }
        .hero-particles {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.3) saturate(0.7);
          transform: scale(1.1);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(10, 11, 16, 0.3) 0%,
            rgba(10, 11, 16, 0.1) 40%,
            rgba(10, 11, 16, 0.6) 80%,
            rgba(10, 11, 16, 1) 100%
          );
        }
        .hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
        }
        .hero-title {
          font-family: var(--font-heading);
          font-size: clamp(3rem, 10vw, 7rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: var(--gap-lg);
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-cyan) 50%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          perspective: 1000px;
        }
        .hero-subtitle {
          font-family: var(--font-heading);
          font-size: clamp(0.9rem, 2vw, 1.3rem);
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-bottom: var(--gap-xl);
        }
        .hero-scroll-hint {
          position: absolute;
          bottom: -6rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--gap-sm);
          color: var(--text-dim);
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .scroll-arrow {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .char {
          display: inline-block;
        }
      `}</style>
    </section>
  );
}
