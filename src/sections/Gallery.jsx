import { useEffect, useRef, useState } from 'react';
import gsap from '../gsapSetup';
import { ScrollTrigger } from '../gsapSetup';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Flip } from 'gsap/Flip';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { prefersReducedMotion } from '../gsapSetup';

const galleryImages = [
  { src: '/assets/images/3.6.jpg', category: 'landscape', label: 'Verdant Highlands' },
  { src: '/assets/images/3.5.jpg', category: 'landscape', label: 'Whining Aix\'s Mire' },
  { src: '/assets/images/3.4.jpg', category: 'landscape', label: 'Port City of Guixu' },
  { src: '/assets/images/3.3.jpg', category: 'combat', label: 'Tacet Field' },
  { src: '/assets/images/3.2.jpg', category: 'landscape', label: 'Sea of Flames' },
  { src: '/assets/images/3.1.jpg', category: 'combat', label: 'Hologram Battle' },
  { src: '/assets/images/3.0.jpg', category: 'landscape', label: 'Gorges of Spirits' },
  { src: '/assets/images/2.8.jpg', category: 'landscape', label: 'Desorock Highland' },
  { src: '/assets/images/2.7.jpg', category: 'combat', label: 'Echo Combat' },
  { src: '/assets/images/2.6.jpg', category: 'landscape', label: 'Jinzhou Outskirts' },
  { src: '/assets/images/2.5.jpg', category: 'landscape', label: 'Misty Forest' },
  { src: '/assets/images/2.4.jpg', category: 'combat', label: 'Boss Fight' },
];

const categories = ['all', 'landscape', 'combat'];

export default function Gallery() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredImages, setFilteredImages] = useState(galleryImages);
  const [selectedImage, setSelectedImage] = useState(null);
  const draggableRef = useRef(null);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(img => img.category === activeCategory));
    }
  }, [activeCategory]);

  useEffect(() => {
    if (!trackRef.current) return;
    const ctx = gsap.context(() => {
      // Draggable with InertiaPlugin
      if (trackRef.current && !prefersReducedMotion) {
        const track = trackRef.current;
        const totalWidth = track.scrollWidth - track.parentElement.offsetWidth;

        draggableRef.current = Draggable.create(track, {
          type: 'x',
          bounds: { minX: -totalWidth, maxX: 0 },
          inertia: true,
          edgeResistance: 0.65,
          throwResistance: 1500
        })[0];
      }

      // ScrollTrigger entrance
      if (!prefersReducedMotion) {
        gsap.from('.gallery-card', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%'
          },
          y: 60,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out'
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [filteredImages]);

  const handleFilterChange = (cat) => {
    if (!prefersReducedMotion && trackRef.current) {
      const state = Flip.getState('.gallery-card');
      setActiveCategory(cat);
      requestAnimationFrame(() => {
        Flip.from(state, {
          duration: 0.6,
          ease: 'power2.inOut',
          stagger: 0.03,
          absolute: true,
          onEnter: elements => gsap.fromTo(elements,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.4 }
          ),
          onLeave: elements => gsap.to(elements,
            { opacity: 0, scale: 0.8, duration: 0.3 }
          )
        });
      });
    } else {
      setActiveCategory(cat);
    }
  };

  return (
    <section ref={sectionRef} className="section-wrapper gallery-section" id="gallery">
      <div className="container">
        <p className="section-label">Screenshots</p>
        <h2 className="section-title">Gallery</h2>
        <p className="section-desc">
          Koleksi screenshot pribadi dari berbagai momen di Solaris-3 — drag untuk menjelajahi.
        </p>
        <div className="gallery-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleFilterChange(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="gallery-track-wrapper">
        <div ref={trackRef} className="gallery-track">
          {filteredImages.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="gallery-card"
              onClick={() => setSelectedImage(img)}
            >
              <img src={img.src} alt={img.label} loading="lazy" />
              <div className="gallery-card-overlay">
                <span>{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.label} />
            <p className="lightbox-label">{selectedImage.label}</p>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .gallery-section {
          padding: var(--section-padding) 0;
          background: var(--bg-secondary);
          overflow: hidden;
        }
        .gallery-filters {
          display: flex;
          gap: var(--gap-sm);
          margin-top: var(--gap-lg);
          margin-bottom: var(--gap-lg);
        }
        .filter-btn {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.5rem 1.2rem;
          border-radius: 100px;
          font-family: var(--font-heading);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all var(--duration-fast);
        }
        .filter-btn:hover,
        .filter-btn.active {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
          box-shadow: var(--glow-cyan);
        }
        .gallery-track-wrapper {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          overflow: hidden;
          cursor: grab;
          padding: var(--gap-md) 0;
        }
        .gallery-track-wrapper:active {
          cursor: grabbing;
        }
        .gallery-track {
          display: flex;
          gap: var(--gap-md);
          padding: var(--gap-md) var(--gap-lg);
          width: max-content;
        }
        .gallery-card {
          position: relative;
          flex-shrink: 0;
          width: 320px;
          height: 220px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
          transition: border-color var(--duration-normal), box-shadow var(--duration-normal);
        }
        .gallery-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--glow-cyan-strong);
        }
        .gallery-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--duration-slow);
        }
        .gallery-card:hover img {
          transform: scale(1.08);
        }
        .gallery-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--gap-md);
          background: linear-gradient(transparent, rgba(10,11,16,0.9));
          font-family: var(--font-heading);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-primary);
          opacity: 0;
          transform: translateY(10px);
          transition: opacity var(--duration-fast), transform var(--duration-fast);
        }
        .gallery-card:hover .gallery-card-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        /* Lightbox */
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(10, 11, 16, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--gap-lg);
          cursor: pointer;
        }
        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          cursor: default;
        }
        .lightbox-content img {
          max-width: 100%;
          max-height: 80vh;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
        }
        .lightbox-label {
          text-align: center;
          margin-top: var(--gap-md);
          font-family: var(--font-heading);
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }
        .lightbox-close {
          position: absolute;
          top: -12px;
          right: -12px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          background: var(--bg-primary);
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color var(--duration-fast);
        }
        .lightbox-close:hover {
          border-color: var(--accent-cyan);
        }

        @media (max-width: 768px) {
          .gallery-card {
            width: 260px;
            height: 180px;
          }
        }
      `}</style>
    </section>
  );
}
