import { useEffect, useRef } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { prefersReducedMotion } from '../gsapSetup';

export default function SolarisWorld() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.sw-title', {
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

      gsap.from('.sw-subtitle', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: 'power3.out',
      });

      gsap.from('.sw-body', {
        scrollTrigger: {
          trigger: '.sw-body',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.sw-tag', {
        scrollTrigger: {
          trigger: '.sw-tags',
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power3.out',
      });

      if (imgRef.current) {
        gsap.to(imgRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
          y: -80,
          ease: 'none',
        });
      }

      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
          opacity: 0.85,
          ease: 'none',
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper sw-section" id="solaris">
      <div className="sw-bg">
        <img
          ref={imgRef}
          src="/assets/images/3.5.jpg"
          alt="Lanskap dunia Solaris-3"
          loading="lazy"
        />
        <div ref={overlayRef} className="sw-overlay" />
      </div>
      <div className="container sw-content">
        <p className="section-label">Dunia</p>
        <h2 className="section-title sw-title">SOLARIS-3</h2>
        <p className="section-sub sw-subtitle">
          Dunia yang hancur di mana gaung masa lalu membentuk pertempuran hari ini
        </p>

        <div className="sw-body">
          <p className="sw-text">
            Solaris-3 dulunya adalah dunia yang makmur dengan peradaban yang saling terhubung — hingga
            Lament merobek frekuensinya, menghancurkan seluruh benua menjadi puing-puing. Kini,
            kantong-kantong umat manusia bertahan hidup di lanskap yang ditumbuhi pepohonan kota yang
            terbengkalai, gurun yang terbakar, dan medan yang mustahil yang berubah oleh energi sisa.
          </p>
          <p className="sw-text" style={{ marginTop: '1rem' }}>
            Dunia ini penuh dengan bahaya. Tacet Discord berkeliaran di alam liar, tertarik pada
            disonansi yang ditinggalkan oleh bencana tersebut. Namun di dalam kekacauan terdapat
            peluang — energi yang sama yang menghancurkan peradaban telah melahirkan Resonator,
            individu yang dapat memanfaatkan frekuensi dunia sebagai senjata. Setiap puing menyimpan
            rahasia, setiap perbatasan menuntut keberanian, dan kebenaran di balik Lament menunggu
            di ujung yang tidak diketahui.
          </p>
        </div>

        <div className="sw-tags">
          <span className="sw-tag">Pasca-Apokaliptik</span>
          <span className="sw-tag">Berbasis Frekuensi</span>
          <span className="sw-tag">Dunia Terbuka</span>
          <span className="sw-tag">Ekosistem Dinamis</span>
          <span className="sw-tag">Puing-Puing yang Hidup</span>
        </div>
      </div>

      <style>{`
        .sw-section {
          position: relative;
          padding: var(--section-padding) 0;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: var(--bg-1, var(--bg-primary));
        }
        .sw-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .sw-bg img {
          width: 100%;
          height: 120%;
          object-fit: cover;
          object-position: center 30%;
          filter: brightness(0.25) saturate(0.6);
        }
        .sw-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(10, 11, 16, 0.92) 0%,
            rgba(10, 11, 16, 0.6) 40%,
            rgba(10, 11, 16, 0.75) 70%,
            rgba(10, 11, 16, 0.95) 100%
          );
        }
        .sw-content {
          position: relative;
          z-index: 1;
          max-width: 760px;
        }
        .sw-subtitle {
          font-family: var(--font-heading);
          font-size: clamp(0.95rem, 2vw, 1.2rem);
          font-weight: 400;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
          margin-top: var(--gap-sm);
          margin-bottom: var(--gap-xl);
        }
        .sw-body {
          margin-bottom: var(--gap-xl);
        }
        .sw-text {
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.8;
          margin: 0;
        }
        .sw-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--gap-sm);
        }
        .sw-tag {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent-cyan);
          background: rgba(63, 224, 208, 0.08);
          border: 1px solid rgba(63, 224, 208, 0.2);
          border-radius: 100px;
          padding: 6px 16px;
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .sw-section {
            min-height: auto;
            padding: var(--section-padding) 0;
          }
          .sw-bg img {
            height: 100%;
          }
        }
      `}</style>
    </section>
  );
}
