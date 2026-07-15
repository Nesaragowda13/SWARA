/* ==========================================================================
   ELEGANT MINIMALIST WEDDING INVITATION JAVASCRIPT
   Interactions, Canvas Gold Dust, RSVP, Countdown, Scroll Reveal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // === PRELOADER ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }
        }, 1200);
    });
    
    // Fallback in case load takes too long
    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
    }, 3500);

    // === AUDIO SETUP & CONTROL ===
    const bgMusic = document.getElementById('bg-music');
    const audioToggle = document.getElementById('audio-toggle');
    let isMusicPlaying = false;

    function playMusic() {
        if (bgMusic) {
            bgMusic.play()
                .then(() => {
                    isMusicPlaying = true;
                    updateAudioButtonState();
                })
                .catch(err => {
                    console.log("Autoplay blocked. Music will start on user interaction.");
                });
        }
    }

    function toggleMusic() {
        if (!bgMusic) return;
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
        } else {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
            });
        }
        updateAudioButtonState();
    }

    function updateAudioButtonState() {
        const onIcon = audioToggle.querySelector('.audio-icon.on');
        const offIcon = audioToggle.querySelector('.audio-icon.off');
        if (isMusicPlaying) {
            onIcon.style.display = 'block';
            offIcon.style.display = 'none';
            audioToggle.setAttribute('title', 'Mute Music');
        } else {
            onIcon.style.display = 'none';
            offIcon.style.display = 'block';
            audioToggle.setAttribute('title', 'Play Music');
        }
    }

    if (audioToggle) {
        audioToggle.addEventListener('click', toggleMusic);
    }

    // === 3D ENVELOPE GATE COVER UNLOCK ===
    const waxSeal = document.getElementById('wax-seal');
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const mainContent = document.getElementById('main-content');

    if (waxSeal && envelopeOverlay && mainContent) {
        waxSeal.addEventListener('click', () => {
            // Start background music
            playMusic();
            
            // 1. Flip top flap open
            envelopeOverlay.classList.add('open-top-flap');

            // 2. Slide letter card out of envelope
            setTimeout(() => {
                envelopeOverlay.classList.add('open-letter');
            }, 600);

            // 3. Zoom away the envelope in perspective
            setTimeout(() => {
                envelopeOverlay.classList.add('zoom-out');
            }, 1600);

            // 4. Reveal main invitation website
            setTimeout(() => {
                mainContent.style.display = 'block';
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                    handleScrollReveal();
                }, 50);
            }, 2400);

            // 5. Remove overlay from DOM flow
            setTimeout(() => {
                envelopeOverlay.style.display = 'none';
            }, 3600);
        });
    }

    // === FLOATING GHIBLI LEAVES & PETALS (CANVAS) ===
    const canvas = document.getElementById('gold-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const particles = [];
        const maxParticles = 40;
        const types = ['leaf', 'petal', 'seed'];

        class GhibliParticle {
            constructor() {
                this.reset(true);
            }

            reset(init = false) {
                this.x = Math.random() * canvas.width;
                this.y = init ? Math.random() * canvas.height : -20;
                this.z = Math.random() * 1.5 + 0.5; // Depth factor
                this.type = types[Math.floor(Math.random() * types.length)];
                
                this.size = (Math.random() * 8 + 4) * this.z;
                this.speedY = (Math.random() * 0.8 + 0.4) * this.z;
                this.speedX = (Math.random() * 1.2 - 0.3) * this.z;
                
                this.angle = Math.random() * Math.PI * 2;
                this.angleSpeed = (Math.random() * 0.02 - 0.01) * this.z;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.01 + 0.005;
                
                if (this.type === 'leaf') {
                    this.color = `rgba(${Math.floor(Math.random() * 30 + 40)}, ${Math.floor(Math.random() * 40 + 120)}, ${Math.floor(Math.random() * 30 + 60)}, ${Math.random() * 0.4 + 0.3})`;
                } else if (this.type === 'petal') {
                    this.color = `rgba(${Math.floor(Math.random() * 30 + 225)}, ${Math.floor(Math.random() * 40 + 150)}, ${Math.floor(Math.random() * 30 + 170)}, ${Math.random() * 0.5 + 0.3})`;
                } else {
                    this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`;
                }
            }

            update() {
                this.y += this.speedY;
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.5;
                this.angle += this.angleSpeed;

                if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
                    this.reset(false);
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;

                if (this.type === 'leaf') {
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(-this.size, 0);
                    ctx.lineTo(this.size, 0);
                    ctx.stroke();
                } else if (this.type === 'petal') {
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size / 2);
                    ctx.bezierCurveTo(this.size / 2, -this.size, this.size, -this.size / 2, 0, this.size);
                    ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size / 2, -this.size, 0, -this.size / 2);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, this.size);
                    ctx.stroke();
                }
                ctx.restore();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new GhibliParticle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // === MOUSE MOVE 3D PARALLAX ===
    const heroSection = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    const heroFrame = document.querySelector('.hero-border-frame');

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mouseX = (e.clientX - width / 2) / (width / 2);
            const mouseY = (e.clientY - height / 2) / (height / 2);
            
            if (heroContent) {
                heroContent.style.transform = `translate3d(${mouseX * 25}px, ${mouseY * 20}px, 0)`;
            }
            if (heroFrame) {
                heroFrame.style.transform = `translate3d(${mouseX * -12}px, ${mouseY * -10}px, 0)`;
            }
            heroSection.style.backgroundPosition = `calc(50% + ${mouseX * 15}px) calc(50% + ${mouseY * 10}px)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            if (heroContent) heroContent.style.transform = 'translate3d(0, 0, 0)';
            if (heroFrame) heroFrame.style.transform = 'translate3d(0, 0, 0)';
            heroSection.style.backgroundPosition = '50% 50%';
        });
    }


    // === COUNTDOWN TIMER ===
    const targetDate = new Date('August 27, 2026 10:57:00').getTime();

    const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            clearInterval(countdownTimer);
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) {
                countdownEl.innerHTML = "<div class='wedding-started-msg'>OUR WEDDING HAS BEGUN!</div>";
            }
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

    }, 1000);

    // === NAVIGATION MOBILE MENU TOGGLE ===
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        highlightActiveNavLink();
    });

    function highlightActiveNavLink() {
        const sections = document.querySelectorAll('section');
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // === SCROLL REVEAL (INTERSECTION OBSERVER) ===
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    function handleScrollReveal() {
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }
    handleScrollReveal();


});
