import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Flip } from 'gsap/Flip';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { prefersReducedMotion } from '../gsapSetup';

const galleryImages = [
  { src: '/assets/images/3.6.jpg', region: 'Lahai-Roi', label: 'Version 3.6 — Latest Update' },
  { src: '/assets/images/3.5.jpg', region: 'Lahai-Roi', label: 'Whining Aix\'s Mire' },
  { src: '/assets/images/3.4.jpg', region: 'Rinascita', label: 'Version 3.4 — Port City' },
  { src: '/assets/images/3.3.jpg', region: 'Rinascita', label: 'Tacet Field Combat' },
  { src: '/assets/images/3.2.jpg', region: 'Rinascita', label: 'Sea of Flames' },
  { src: '/assets/images/3.1.jpg', region: 'Rinascita', label: 'Hologram Battle' },
  { src: '/assets/images/3.0.jpg', region: 'Rinascita', label: 'Gorges of Spirits' },
  { src: '/assets/images/2.8.jpg', region: 'Huanglong', label: 'Desorock Highland' },
  { src: '/assets/images/2.7.jpg', region: 'Huanglong', label: 'Echo Combat' },
  { src: '/assets/images/2.6.jpg', region: 'Huanglong', label: 'Jinzhou Outskirts' },
  { src: '/assets/images/2.5.jpg', region: 'Huanglong', label: 'Misty Forest' },
  { src: '/assets/images/2.4.jpg', region: 'Huanglong', label: 'Boss Encounter' },
  { src: '/assets/images/Chisa Splash.jpg', region: 'Rinascita', label: 'Chisa — Splash Art' },
  { src: '/assets/images/Changli Splash.jpg', region: 'Huanglong', label: 'Changli — Splash Art' },
  { src: '/assets/images/Brant Splash.jpg', region: 'Rinascita', label: 'Brant — Splash Art' },
  { src: '/assets/images/Cantarella Splash.jpg', region: 'Huanglong', label: 'Cantarella — Splash Art' },
  { src: '/assets/images/Cartethyia Splash.jpg', region: 'Lahai-Roi', label: 'Cartethyia — Splash Art' },
  { src: '/assets/images/Augusta Splash.jpg', region: 'Huanglong', label: 'Augusta — Splash Art' },
  { src: '/assets/images/Aemeath Splash.jpg', region: 'Rinascita', label: 'Aemeath — Splash Art' },
];

const regions = ['All', 'Huanglong', 'Rinascita', 'Lahai-Roi'];

export default function Gallery() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [activeRegion, setActiveRegion] = useState('All');
  const [filteredImages, setFilteredImages] = useState(galleryImages);
  const [selectedImage, setSelectedImage] = useState(null);
  const draggableInstance = useRef(null);
  const lightboxRef = useRef(null);

  useEffect(() => {
    if (activeRegion === 'All') {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(img => img.region === activeRegion));
    }
  }, [activeRegion]);

  useEffect(() => {
    if (!gridRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const totalWidth = gridRef.current.scrollWidth - gridRef.current.parentElement.offsetWidth;
      if (totalWidth > 0) {
        draggableInstance.current = Draggable.create(gridRef.current, {
          type: 'x',
          bounds: { minX: -totalWidth, maxX: 0 },
          inertia: true,
          edgeResistance: 0.65,
          throwResistance: 1200
        })[0];
      }
    }, sectionRef);
    return () => {
      if (draggableInstance.current) {
        draggableInstance.current.kill();
        draggableInstance.current = null;
      }
      ctx.revert();
    };
  }, [filteredImages]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.gal-title', {
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleFilterChange = useCallback((region) => {
    if (!prefersReducedMotion && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.gal-card');
      const state = Flip.getState(cards);
      setActiveRegion(region);
      requestAnimationFrame(() => {
        const newCards = gridRef.current.querySelectorAll('.gal-card');
        Flip.from(state, {
          duration: 0.5,
          ease: 'power2.inOut',
          stagger: 0.02,
          absolute: true,
          onEnter: elements => gsap.fromTo(elements,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 0.35 }
          ),
          onLeave: elements => gsap.to(elements,
            { opacity: 0, scale: 0.85, duration: 0.25 }
          )
        });
      });
    } else {
      setActiveRegion(region);
    }
  }, [prefersReducedMotion]);

  const openLightbox = useCallback((img) => {
    setSelectedImage(img);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const navigateLightbox = useCallback((direction) => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.src === selectedImage.src);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      nextIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    setSelectedImage(filteredImages[nextIndex]);
  }, [selectedImage, filteredImages]);

  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedImage, closeLightbox, navigateLightbox]);

  const handleCardHover = useCallback((e) => {
    if (prefersReducedMotion) return;
    gsap.to(e.currentTarget, {
      wiggle: { type: 'easeOut', strength: 2, duration: 0.3 },
      duration: 0.3
    });
  }, [prefersReducedMotion]);

  const getGridClass = (index) => {
    const patterns = ['span-1x1', 'span-2x1', 'span-1x1', 'span-1x2', 'span-1x1', 'span-1x1'];
    return patterns[index % patterns.length];
  };

  return (
    <section ref={sectionRef} className="section-wrapper gal-section" id="gallery">
      <div className="container">
        <p className="section-label">Screenshots</p>
        <h2 className="section-title gal-title">Gallery</h2>
        <p className="section-desc">
          Koleksi screenshot pribadi dari berbagai momen di Solaris-3 — drag untuk menjelajahi.
        </p>
        <div className="gal-filters" role="tablist" aria-label="Filter by region">
          {regions.map(region => (
            <button
              key={region}
              role="tab"
              aria-selected={activeRegion === region}
              className={`gal-filter-btn ${activeRegion === region ? 'active' : ''}`}
              onClick={() => handleFilterChange(region)}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="gal-track-wrapper">
        <div ref={gridRef} className="gal-track">
          {filteredImages.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className={`gal-card ${getGridClass(i)}`}
              onClick={() => openLightbox(img)}
              onKeyDown={(e) => { if (e.key === 'Enter') openLightbox(img); }}
              onMouseEnter={handleCardHover}
              tabIndex={0}
              role="button"
              aria-label={`View ${img.label}`}
            >
              <img src={img.src} alt={img.label} loading="lazy" />
              <div className="gal-card-overlay">
                <span className="gal-card-label">{img.label}</span>
                <span className="gal-card-region">{img.region}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="gal-lightbox"
          ref={lightboxRef}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div className="gal-lightbox-content" onClick={e => e.stopPropagation()}>
            <button
              className="gal-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <button
              className="gal-lightbox-nav gal-lightbox-prev"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              aria-label="Previous image"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="gal-lightbox-img-wrapper">
              <img src={selectedImage.src} alt={selectedImage.label} />
            </div>
            <button
              className="gal-lightbox-nav gal-lightbox-next"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              aria-label="Next image"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div className="gal-lightbox-info">
              <p className="gal-lightbox-label">{selectedImage.label}</p>
              <p className="gal-lightbox-region">{selectedImage.region}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gal-section {
          padding: var(--section-padding) 0;
          background: var(--bg-secondary);
          overflow: hidden;
        }
        .gal-filters {
          display: flex;
          gap: var(--gap-sm);
          margin-top: var(--gap-lg);
          margin-bottom: var(--gap-lg);
          flex-wrap: wrap;
        }
        .gal-filter-btn {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.5rem 1.2rem;
          border-radius: 100px;
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all var(--duration-fast);
        }
        .gal-filter-btn:hover,
        .gal-filter-btn.active {
          border-color: var(--cyan);
          color: var(--cyan);
          box-shadow: 0 0 12px rgba(63, 224, 208, 0.2);
        }
        .gal-track-wrapper {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          overflow: hidden;
          cursor: grab;
          padding: var(--gap-md) 0;
        }
        .gal-track-wrapper:active {
          cursor: grabbing;
        }
        .gal-track {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          grid-auto-rows: 200px;
          gap: var(--gap-md);
          padding: var(--gap-md) var(--gap-lg);
          width: max-content;
          min-width: 100%;
        }
        .gal-card {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
          transition: border-color var(--duration-normal), box-shadow var(--duration-normal);
          cursor: pointer;
          outline: none;
        }
        .gal-card:focus-visible {
          border-color: var(--cyan);
          box-shadow: 0 0 0 2px var(--cyan);
        }
        .gal-card:hover,
        .gal-card:focus-visible {
          border-color: var(--border-hover);
          box-shadow: 0 0 20px rgba(63, 224, 208, 0.15);
        }
        .gal-card.span-2x1 {
          grid-column: span 2;
        }
        .gal-card.span-1x2 {
          grid-row: span 2;
        }
        .gal-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--duration-slow);
        }
        .gal-card:hover img {
          transform: scale(1.06);
        }
        .gal-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--gap-md);
          background: linear-gradient(transparent, rgba(10, 11, 16, 0.92));
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity var(--duration-fast), transform var(--duration-fast);
        }
        .gal-card:hover .gal-card-overlay,
        .gal-card:focus-visible .gal-card-overlay {
          opacity: 1;
          transform: translateY(0);
        }
        .gal-card-label {
          font-family: var(--font-display);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-primary);
        }
        .gal-card-region {
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--cyan);
          padding: 2px 8px;
          border: 1px solid rgba(63, 224, 208, 0.3);
          border-radius: 100px;
        }

        /* Lightbox */
        .gal-lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(7, 9, 13, 0.96);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--gap-lg);
          cursor: pointer;
          animation: gal-fadeIn 0.2s ease;
        }
        @keyframes gal-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .gal-lightbox-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--gap-md);
          cursor: default;
          max-width: 95vw;
        }
        .gal-lightbox-img-wrapper {
          max-width: 80vw;
          max-height: 80vh;
        }
        .gal-lightbox-img-wrapper img {
          max-width: 100%;
          max-height: 80vh;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          object-fit: contain;
        }
        .gal-lightbox-close {
          position: absolute;
          top: -16px;
          right: -16px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          background: var(--bg-1);
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color var(--duration-fast);
          z-index: 2;
        }
        .gal-lightbox-close:hover {
          border-color: var(--cyan);
        }
        .gal-lightbox-nav {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          background: rgba(10, 11, 16, 0.8);
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color var(--duration-fast), background var(--duration-fast);
          flex-shrink: 0;
        }
        .gal-lightbox-nav:hover {
          border-color: var(--cyan);
          background: rgba(63, 224, 208, 0.1);
        }
        .gal-lightbox-info {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          white-space: nowrap;
        }
        .gal-lightbox-label {
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-primary);
        }
        .gal-lightbox-region {
          font-size: 0.65rem;
          color: var(--cyan);
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .gal-track {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            grid-auto-rows: 160px;
          }
          .gal-card.span-2x1 {
            grid-column: span 1;
          }
          .gal-lightbox-nav {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
