        // Intersection Observer for scroll animations (reveal elements)
        document.addEventListener('DOMContentLoaded', () => {
            const reveals = document.querySelectorAll('.reveal');

            const revealOnScroll = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        // Optional: Stop observing once revealed
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.15, // Trigger when 15% visible
                rootMargin: "0px 0px -50px 0px"
            });

            reveals.forEach(reveal => {
                revealOnScroll.observe(reveal);
            });
            
            // Trigger immediately for elements already in view on load
            setTimeout(() => {
                reveals.forEach(reveal => {
                    const windowHeight = window.innerHeight;
                    const elementTop = reveal.getBoundingClientRect().top;
                    if (elementTop < windowHeight - 50) {
                        reveal.classList.add('active');
                    }
                });
            }, 100);
        });

        // Lightbox & Carousel Logic
        let currentImages = [];
        let currentIndex = 0;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const btnPrev = document.getElementById('lightbox-prev');
        const btnNext = document.getElementById('lightbox-next');
        const counter = document.getElementById('lightbox-counter');

        function openLightbox(element) {
            const imgData = element.getAttribute('data-images');
            if (imgData) {
                currentImages = JSON.parse(imgData);
                currentIndex = 0;
                updateLightbox();
                
                lightbox.classList.remove('hidden');
                // Trigger reflow for transition
                void lightbox.offsetWidth;
                lightbox.classList.remove('opacity-0');
                lightbox.classList.add('opacity-100');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        }

        function closeLightbox() {
            lightbox.classList.remove('opacity-100');
            lightbox.classList.add('opacity-0');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300); // Matches transition duration
        }

        function updateLightbox() {
            // Fade out slightly before changing source for smoother transition
            lightboxImg.style.opacity = 0.5;
            
            setTimeout(() => {
                lightboxImg.src = currentImages[currentIndex];
                lightboxImg.style.opacity = 1;
            }, 150);

            if (currentImages.length > 1) {
                btnPrev.classList.remove('hidden');
                btnNext.classList.remove('hidden');
                counter.classList.remove('hidden');
                counter.innerText = `${currentIndex + 1} / ${currentImages.length}`;
            } else {
                btnPrev.classList.add('hidden');
                btnNext.classList.add('hidden');
                counter.classList.add('hidden');
            }
        }

        function nextImage(e) {
            if(e) e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightbox();
        }

        function prevImage(e) {
            if(e) e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightbox();
        }

        // Close when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('.pointer-events-none') === lightbox.querySelector('.pointer-events-none') && e.target !== lightboxImg) {
                closeLightbox();
            }
        });

        // Keyboard Navigation for Lightbox
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('hidden')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight' && currentImages.length > 1) nextImage();
            if (e.key === 'ArrowLeft' && currentImages.length > 1) prevImage();
        });