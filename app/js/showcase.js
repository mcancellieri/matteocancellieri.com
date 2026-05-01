// Import your styles so Parcel bundles them
import '../scss/showcase.scss';
import '../scss/main.scss';
import artworks from '../js/artworks.json';

const gallery = document.querySelector('.gallery-grid');
const homeGallery = document.querySelector('.gallery-grid-home');
const SWIPE_THRESHOLD = 50;
// This function takes your JSON object and turns it into HTML
const renderGallery = (data) => {
    let target;
    if (homeGallery) {
        target = homeGallery;
        const randomNine = arr => [...arr].sort(() => 0.5 - Math.random()).slice(0, 9);
        data = randomNine(artworks);
    } else {
        target = gallery;
        data = artworks;
    }
    target.innerHTML = data.map(item => `   
    <div class="gallery-item">
        <div class="image-container">
                <picture>
                    <source  srcset="/showcase/${item.image}.webp" type="image/webp">
                    <source  srcset="/showcase/${item.image}.jpg" type="image/jpg">
                    <img  src="/showcase/${item.image}.webp"
                         alt="${item.title}"/>
               </picture>
        </div>
        <div class="meta">${item.title} - ${item.medium} - ${item.year} </div>
    </div>
  `).join('');
};

// Execute the render
renderGallery(artworks);

const setupLightbox = () => {
    if (!gallery || homeGallery) {
        return;
    }

    const pictures = Array.from(gallery.querySelectorAll('.gallery-item picture'));
    if (!pictures.length) {
        return;
    }

    const lightboxMarkup = `
        <div class="lightbox" aria-hidden="true">
            <button type="button" class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">&#10094;</button>
            <figure class="lightbox-figure">
                <picture class="lightbox-picture"></picture>
                <figcaption class="lightbox-meta"></figcaption>
            </figure>
            <button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">&#10095;</button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lightboxMarkup);

    const lightbox = document.querySelector('.lightbox');
    const lightboxPicture = lightbox?.querySelector('.lightbox-picture');
    const lightboxMeta = lightbox?.querySelector('.lightbox-meta');
    const closeBtn = lightbox?.querySelector('.lightbox-close');
    const prevBtn = lightbox?.querySelector('.lightbox-prev');
    const nextBtn = lightbox?.querySelector('.lightbox-next');

    if (!lightbox || !lightboxPicture || !lightboxMeta || !closeBtn || !prevBtn || !nextBtn) {
        return;
    }

    let currentIndex = 0;
    let touchStartX = 0;

    const updateLightboxContent = (index) => {
        const picture = pictures[index];
        if (!picture) {
            return;
        }

        lightboxPicture.innerHTML = picture.innerHTML;
        const image = lightboxPicture.querySelector('img');
        const meta = picture.closest('.gallery-item')?.querySelector('.meta')?.textContent || '';

        if (image) {
            image.decoding = 'async';
            image.loading = 'eager';
        }

        lightboxMeta.textContent = meta;
    };

    const openLightbox = (index) => {
        currentIndex = index;
        updateLightboxContent(currentIndex);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
    };

    const showNext = () => {
        currentIndex = (currentIndex + 1) % pictures.length;
        updateLightboxContent(currentIndex);
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + pictures.length) % pictures.length;
        updateLightboxContent(currentIndex);
    };

    pictures.forEach((picture, index) => {
        const item = picture.closest('.gallery-item');
        if (!item) {
            return;
        }

        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', 'Open image in lightbox');

        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(index);
            }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    lightbox.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0]?.clientX || 0;
    }, { passive: true });

    lightbox.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0]?.clientX || 0;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
            return;
        }

        if (deltaX > 0) {
            showPrev();
        } else {
            showNext();
        }
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('is-open')) {
            return;
        }

        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowRight') {
            showNext();
        } else if (event.key === 'ArrowLeft') {
            showPrev();
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll('.gallery-item');

    const observerOptions = {
        root: null,
        threshold: 0.15, // Reveal when 15% is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add the 'active' class to trigger the CSS transition
                entry.target.classList.add('is-visible');
                // Once it's shown, we can stop observing it
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    items.forEach((item, index) => {
        // Set a staggered delay based on the index (0.1s, 0.2s, etc.)
        // This creates that "Motion Minimalism" flow automatically
        item.style.transitionDelay = `${(index % 3) * 0.15}s`;
        observer.observe(item);
    });

    setupLightbox();
});

