// Import your styles so Parcel bundles them
import '../scss/showcase.scss';
import '../scss/main.scss';
import artworks from '../js/artworks.json';
import artworksHome from '../js/artworksHome.json';

const gallery = document.querySelector('.gallery-grid');
const homeGallery = document.querySelector('.gallery-grid-home');
// This function takes your JSON object and turns it into HTML
const renderGallery = (data) => {
    let target;
    if (homeGallery){
        target=homeGallery;
        const randomNine = arr => [...arr].sort(() => 0.5 - Math.random()).slice(0, 9);
        data=randomNine(artworksHome);
    }
    else {
        target=gallery;
        data=artworks;
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
});

