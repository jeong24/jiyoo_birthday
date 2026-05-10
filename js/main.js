document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation (Bouncy Effect)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Play once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 2. Audio Control
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    // Set audio volume a bit lower so it doesn't scare people immediately
    bgMusic.volume = 0.6;

    const initAudio = () => {
        if(!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicBtn.classList.add('playing');
                // Create burst of confetti when music starts
                createConfettiBurst();
            }).catch(e => {
                console.log("Autoplay prevented. Click required.");
            });
            document.removeEventListener('click', initAudio);
            document.removeEventListener('touchstart', initAudio);
            document.removeEventListener('scroll', initAudio);
        }
    };

    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);
    document.addEventListener('scroll', initAudio, { once: true });

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.play();
            musicBtn.classList.add('playing');
            createConfettiBurst();
        }
        isPlaying = !isPlaying;
    });

    // 3. Image Gallery Injection & Carousel Logic
    const gallerySlider = document.getElementById('gallery-slider');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    const imageFiles = [
        "KakaoTalk_Photo_2026-05-11-04-30-20 001.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-20 002.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-21 003.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-22 004.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-23 005.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-23 006.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-24 007.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-24 008.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-25 009.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-26 010.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-27 011.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-28 012.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-29 013.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-31 014.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-32 015.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-33 016.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-34 017.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-35 018.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-36 019.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-36 020.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-37 021.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-30-37 022.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-31-06 001.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-31-06 002.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-31-08 003.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-31-09 004.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-31-10 005.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-31-11 006.jpeg",
        "KakaoTalk_Photo_2026-05-11-04-31-11 007.jpeg"
    ];

    let currentLightboxIndex = 0;
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    if (gallerySlider) {
        imageFiles.forEach((filename, index) => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = `./img/${filename}`;
            img.alt = '지유 사진';
            img.loading = 'lazy'; // Add lazy loading for performance
            
            div.appendChild(img);
            gallerySlider.appendChild(div);
            
            // Re-bind Lightbox click
            div.addEventListener('click', () => {
                currentLightboxIndex = index;
                updateLightboxImage();
                lightbox.classList.add('active');
            });
        });
    }

    function updateLightboxImage() {
        lightboxImg.src = `./img/${imageFiles[currentLightboxIndex]}`;
    }

    if (lightboxPrev && lightboxNext) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent closing lightbox
            currentLightboxIndex = (currentLightboxIndex - 1 + imageFiles.length) % imageFiles.length;
            updateLightboxImage();
        });

        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentLightboxIndex = (currentLightboxIndex + 1) % imageFiles.length;
            updateLightboxImage();
        });
    }

    // Swipe logic for lightbox
    let touchstartX = 0;
    let touchendX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        if (touchendX < touchstartX - 50) {
            // swipe left -> next
            currentLightboxIndex = (currentLightboxIndex + 1) % imageFiles.length;
            updateLightboxImage();
        }
        if (touchendX > touchstartX + 50) {
            // swipe right -> prev
            currentLightboxIndex = (currentLightboxIndex - 1 + imageFiles.length) % imageFiles.length;
            updateLightboxImage();
        }
    }

    // 4. Carousel Navigation
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (gallerySlider && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const scrollAmount = gallerySlider.clientWidth * 0.8;
            gallerySlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const scrollAmount = gallerySlider.clientWidth * 0.8;
            gallerySlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content')) {
            lightbox.classList.remove('active');
        }
    });

    // 5. Copy to Clipboard Logic
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    let toastTimeout;

    if (copyBtns.length > 0 && toast) {
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-clipboard-target');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const textToCopy = targetElement.innerText;
                    
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showToast('주소가 복사되었습니다! 📋');
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                        showToast('복사에 실패했습니다.');
                    });
                }
            });
        });
    }

    function showToast(message) {
        if (!toast) return;
        toast.innerText = message;
        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // 6. Canvas Confetti Animation (Party Vibe)
    initConfetti();
});

// Canvas Confetti System
let createConfettiBurst;

function initConfetti() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Confetti Colors (Neon)
    const COLORS = ['#FF3366', '#00E5FF', '#FFD700', '#9D00FF', '#39FF14'];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor(x, y, isBurst = false) {
            this.x = x !== undefined ? x : Math.random() * width;
            this.y = y !== undefined ? y : Math.random() * height - height;
            this.size = Math.random() * 10 + 5;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = isBurst ? Math.random() * -15 - 5 : Math.random() * 3 + 2;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            this.gravity = 0.2;
            this.drag = 0.99;
        }

        update() {
            this.speedX *= this.drag;
            this.speedY += this.gravity;
            
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            // Reset if out of screen (for continuous rain)
            if (this.y > height + 20) {
                this.y = -20;
                this.x = Math.random() * width;
                this.speedY = Math.random() * 3 + 2;
                this.speedX = Math.random() * 6 - 3;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            // Draw a small rectangle for confetti
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            ctx.restore();
        }
    }

    function init() {
        resize();
        particles = [];
        // Initial steady rain
        for (let i = 0; i < 40; i++) {
            particles.push(new Particle());
        }
    }

    // Expose burst function globally
    createConfettiBurst = function() {
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle(width / 2, height, true));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    
    init();
    animate();
}
