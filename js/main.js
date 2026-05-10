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

    // 3. Lightbox for Gallery (Placeholders)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Generates a funny placeholder image
            const emojis = ['🤪', '😎', '💃', '👶✨'];
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23222"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="80">${emojis[index%4]}</text><text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-size="25" fill="%23FFF" font-family="sans-serif">여기에 사진 추가!</text></svg>`;
            
            lightboxImg.src = 'data:image/svg+xml;utf8,' + svg;
            lightbox.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // 4. Canvas Confetti Animation (Party Vibe)
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
