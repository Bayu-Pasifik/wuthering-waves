import { useEffect, useRef, useState } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { TextPlugin } from 'gsap/TextPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { prefersReducedMotion } from '../gsapSetup';

const videos = [
  {
    id: 1,
    title: 'Combat Showcase',
    desc: 'Combo attack dan quick-switch combat yang memacu adrenalin.',
    poster: '/assets/images/3.3.jpg',
    src: '/assets/videos/3.3 Live2D.mp4'
  },
  {
    id: 2,
    title: 'Open World Exploration',
    desc: 'Jelajahi dunia Solaris-3 yang luas dan memukau.',
    poster: '/assets/images/3.5.jpg',
    src: '/assets/videos/3.5 Live2D.mp4'
  },
  {
    id: 3,
    title: 'Version 3.4 Highlights',
    desc: 'Update terbaru dengan konten dan karakter baru.',
    poster: '/assets/images/3.4.jpg',
    src: '/assets/videos/3.4 Live2D.mp4'
  }
];

export default function VideoShowcase() {
  const sectionRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.vs-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      document.querySelectorAll('.video-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          },
          y: 80,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out'
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const togglePlay = (idx) => {
    const video = videoRefs.current[idx];
    if (!video) return;
    if (video.paused) {
      video.play();
      setActiveVideo(idx);
    } else {
      video.pause();
      setActiveVideo(null);
    }
  };

  return (
    <section ref={sectionRef} className="section-wrapper vs-section" id="videos">
      <div className="container">
        <p className="section-label">Video Showcase</p>
        <h2 className="section-title vs-title">Gameplay<br />in Action</h2>
        <p className="section-desc">
          Screenshot hanya bisa bercerita sedikit — tonton gameplay asli untuk merasakan combat dan dunia Wuthering Waves.
        </p>
        <div className="video-grid">
          {videos.map((v, i) => (
            <div key={v.id} className="video-card">
              <div className="video-wrapper" onClick={() => togglePlay(i)}>
                <video
                  ref={el => videoRefs.current[i] = el}
                  src={v.src}
                  poster={v.poster}
                  preload="metadata"
                  loop
                  muted
                  playsInline
                />
                <div className={`video-play-btn ${activeVideo === i ? 'playing' : ''}`}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                    {activeVideo !== i && (
                      <path d="M20 16l12 8-12 8V16z" fill="currentColor" />
                    )}
                    {activeVideo === i && (
                      <>
                        <rect x="17" y="16" width="4" height="16" fill="currentColor" />
                        <rect x="27" y="16" width="4" height="16" fill="currentColor" />
                      </>
                    )}
                  </svg>
                </div>
                <div className="video-progress">
                  <div className="video-progress-bar" />
                </div>
              </div>
              <div className="video-info">
                <h3 className="video-title">{v.title}</h3>
                <p className="video-desc">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .vs-section {
          padding: var(--section-padding) 0;
          background: var(--bg-primary);
        }
        .video-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--gap-lg);
          margin-top: var(--gap-xl);
        }
        @media (max-width: 900px) {
          .video-grid {
            grid-template-columns: 1fr;
          }
        }
        .video-card {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-card);
          transition: border-color var(--duration-normal), box-shadow var(--duration-normal);
        }
        .video-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--glow-cyan);
        }
        .video-wrapper {
          position: relative;
          cursor: pointer;
          aspect-ratio: 16/9;
          overflow: hidden;
        }
        .video-wrapper video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .video-play-btn {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          opacity: 0.8;
          transition: opacity var(--duration-fast), transform var(--duration-fast);
        }
        .video-wrapper:hover .video-play-btn {
          opacity: 1;
          transform: scale(1.1);
        }
        .video-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,255,255,0.1);
        }
        .video-progress-bar {
          height: 100%;
          width: 0%;
          background: var(--accent-cyan);
          transition: width 0.1s;
        }
        .video-info {
          padding: var(--gap-md);
        }
        .video-title {
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .video-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
