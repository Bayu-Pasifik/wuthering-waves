import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { TextPlugin } from 'gsap/TextPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { prefersReducedMotion } from '../gsapSetup';

const videos = [
  {
    id: 1,
    title: 'Version 3.6',
    desc: 'Update terkini dengan konten dan peningkatan gameplay terbaru.',
    poster: '/assets/images/3.6.jpg',
    src: '/assets/videos/3.6 Live2D.mp4',
  },
  {
    id: 2,
    title: 'Version 3.5',
    desc: 'Whining Aix\'s Mire — petualangan di wilayah baru yang misterius.',
    poster: '/assets/images/3.5.jpg',
    src: '/assets/videos/3.5 Live2D.mp4',
  },
  {
    id: 3,
    title: 'Version 3.4',
    desc: 'Port City of Guixu — kota futuristik dengan cerita mendalam.',
    poster: '/assets/images/3.4.jpg',
    src: '/assets/videos/3.4 Live2D.mp4',
  },
  {
    id: 4,
    title: 'Version 3.3',
    desc: 'Combat showcase — combo attack dan quick-switch yang memacu adrenalin.',
    poster: '/assets/images/3.3.jpg',
    src: '/assets/videos/3.3 Live2D.mp4',
  },
  {
    id: 5,
    title: 'Version 3.2',
    desc: 'Sea of Flames — eksplorasi wilayah berbahaya yang penuh tantangan.',
    poster: '/assets/images/3.2.jpg',
    src: '/assets/videos/3.2 Live2D.mp4',
  },
];

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VideoPlayer({ video, isActive }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const progressFillRef = useRef(null);
  const volumeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
    setCurrentTime(formatTime(v.currentTime));
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(formatTime(v.duration));
    setIsLoaded(true);
  }, []);

  const handleProgressClick = useCallback((e) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * v.duration;
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isMuted) {
      v.muted = false;
      setIsMuted(false);
      setVolume(v.volume || 0.7);
    } else {
      v.muted = true;
      setIsMuted(true);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      v.requestFullscreen?.();
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="vs-player"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        preload="metadata"
        loop
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />

      {!isPlaying && (
        <button className="vs-play-overlay" onClick={togglePlay} aria-label="Putar video">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <path d="M26 20l18 12-18 12V20z" fill="currentColor" />
          </svg>
        </button>
      )}

      <div className={`vs-controls ${showControls ? 'visible' : ''}`}>
        <div
          className="vs-progress"
          ref={progressRef}
          onClick={handleProgressClick}
          role="slider"
          aria-label="Progres video"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          tabIndex={0}
        >
          <div className="vs-progress-bg" />
          <div className="vs-progress-fill" ref={progressFillRef} style={{ width: `${progress}%` }} />
          <div className="vs-progress-thumb" style={{ left: `${progress}%` }} />
        </div>

        <div className="vs-controls-row">
          <div className="vs-controls-left">
            <button className="vs-btn" onClick={togglePlay} aria-label={isPlaying ? 'Jeda' : 'Putar'}>
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <span className="vs-time">{currentTime} / {duration}</span>
          </div>

          <div className="vs-controls-right">
            <div className="vs-volume-group">
              <button className="vs-btn" onClick={toggleMute} aria-label={isMuted ? 'Aktifkan suara' : 'Nonaktifkan suara'}>
                {isMuted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                    <path d="M23 9l-6 6M17 9l6 6" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                  </svg>
                )}
              </button>
              <input
                ref={volumeRef}
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="vs-volume-slider"
                aria-label="Volume"
              />
            </div>
            <button className="vs-btn" onClick={toggleFullscreen} aria-label="Layar penuh">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoShowcase() {
  const sectionRef = useRef(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.vs-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.vs-subtitle', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out'
      });

      document.querySelectorAll('.vs-tab').forEach((tab, i) => {
        gsap.from(tab, {
          scrollTrigger: {
            trigger: tab,
            start: 'top 85%'
          },
          y: 30,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.08,
          ease: 'power3.out'
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const selectVideo = useCallback((index) => {
    if (!prefersReducedMotion) {
      gsap.to('.vs-active-indicator', {
        x: index * 100 + '%',
        duration: 0.3,
        ease: 'power2.inOut'
      });
    }
    setActiveVideoIndex(index);
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="section-wrapper vs-section" id="videos">
      <div className="container">
        <p className="section-label">VIDEO SHOWCASE</p>
        <h2 className="section-title vs-title">GAMEPLAY<br />DALAM AKSI</h2>
        <p className="section-desc vs-subtitle">
          Screenshot hanya bisa bercerita sedikit — tonton gameplay asli untuk merasakan combat dan dunia Wuthering Waves.
        </p>

        <div className="vs-tabs">
          <div className="vs-tab-list">
            {videos.map((v, i) => (
              <button
                key={v.id}
                className={`vs-tab ${activeVideoIndex === i ? 'active' : ''}`}
                onClick={() => selectVideo(i)}
                aria-label={`Putar ${v.title}`}
              >
                <span className="vs-tab-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="vs-tab-title">{v.title}</span>
              </button>
            ))}
            <div
              className="vs-active-indicator"
              style={{ transform: `translateX(${activeVideoIndex * 100}%)` }}
            />
          </div>
        </div>

        <div className="vs-player-container">
          <VideoPlayer
            key={videos[activeVideoIndex].id}
            video={videos[activeVideoIndex]}
            isActive={true}
          />
        </div>

        <div className="vs-info">
          <h3 className="vs-info-title">{videos[activeVideoIndex].title}</h3>
          <p className="vs-info-desc">{videos[activeVideoIndex].desc}</p>
        </div>
      </div>

      <style>{`
        .vs-section {
          padding: var(--section-padding) 0;
          background: var(--bg-0);
        }
        .vs-subtitle {
          margin-top: var(--gap-md);
        }
        .vs-tabs {
          margin-top: var(--gap-xl);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .vs-tab-list {
          display: flex;
          gap: 2px;
          position: relative;
          background: var(--bg-2);
          border-radius: var(--radius-lg);
          padding: 4px;
          width: fit-content;
        }
        .vs-tab {
          display: flex;
          align-items: center;
          gap: var(--gap-sm);
          padding: 0.6rem 1.2rem;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: calc(var(--radius-lg) - 2px);
          transition: color var(--duration-fast);
          white-space: nowrap;
          position: relative;
          z-index: 1;
        }
        .vs-tab:hover {
          color: var(--text-secondary);
        }
        .vs-tab.active {
          color: var(--text-primary);
        }
        .vs-tab-num {
          opacity: 0.4;
          font-size: 0.55rem;
        }
        .vs-active-indicator {
          position: absolute;
          top: 4px;
          left: 4px;
          width: calc(100% / 5);
          height: calc(100% - 8px);
          background: var(--bg-card);
          border-radius: calc(var(--radius-lg) - 2px);
          z-index: 0;
          pointer-events: none;
        }
        .vs-player-container {
          margin-top: var(--gap-lg);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
          background: #000;
        }
        .vs-player {
          position: relative;
          aspect-ratio: 16/9;
          background: #000;
          overflow: hidden;
          cursor: pointer;
        }
        .vs-player video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .vs-play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          color: white;
          border: none;
          cursor: pointer;
          transition: background var(--duration-fast);
          z-index: 2;
        }
        .vs-play-overlay:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        /* Controls */
        .vs-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--gap-md);
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.3s, transform 0.3s;
          z-index: 3;
        }
        .vs-controls.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .vs-player:hover .vs-controls {
          opacity: 1;
          transform: translateY(0);
        }
        .vs-progress {
          position: relative;
          height: 6px;
          cursor: pointer;
          margin-bottom: var(--gap-sm);
          border-radius: 3px;
        }
        .vs-progress-bg {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }
        .vs-progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--cyan);
          border-radius: 3px;
          transition: width 0.1s linear;
        }
        .vs-progress-thumb {
          position: absolute;
          top: 50%;
          width: 14px;
          height: 14px;
          background: var(--cyan);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.15s;
          box-shadow: 0 0 8px rgba(63, 224, 208, 0.5);
        }
        .vs-progress:hover .vs-progress-thumb {
          transform: translate(-50%, -50%) scale(1);
        }
        .vs-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .vs-controls-left,
        .vs-controls-right {
          display: flex;
          align-items: center;
          gap: var(--gap-sm);
        }
        .vs-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--duration-fast);
        }
        .vs-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .vs-time {
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }
        .vs-volume-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .vs-volume-slider {
          width: 70px;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
        .vs-volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--cyan);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(63, 224, 208, 0.4);
        }
        .vs-volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--cyan);
          cursor: pointer;
          border: none;
        }
        .vs-info {
          margin-top: var(--gap-lg);
          padding: var(--gap-md);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          background: var(--bg-card);
        }
        .vs-info-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .vs-info-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .vs-tab {
            padding: 0.5rem 0.8rem;
            font-size: 0.55rem;
          }
          .vs-tab-num {
            display: none;
          }
          .vs-volume-slider {
            width: 50px;
          }
        }
      `}</style>
    </section>
  );
}
