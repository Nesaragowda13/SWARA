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

    // === ENVELOPE GATE COVER UNLOCK ===
    const waxSeal = document.getElementById('wax-seal');
    const envelope = document.getElementById('envelope');
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const mainContent = document.getElementById('main-content');

    if (waxSeal && envelope && envelopeOverlay && mainContent) {
        waxSeal.addEventListener('click', () => {
            // Start background music
            playMusic();
            
            // Add classes for opening transitions
            envelopeOverlay.classList.add('fade-out');

            setTimeout(() => {
                mainContent.style.display = 'block';
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                    // Re-trigger reveal observer
                    handleScrollReveal();
                }, 50);
            }, 1000);

            // Remove overlay from DOM flow
            setTimeout(() => {
                envelopeOverlay.style.display = 'none';
            }, 2200);
        });
    }

    // === FLOATING GOLD DUST (CANVAS) ===
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
        const maxParticles = 50;

        class GoldParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height;
                this.size = Math.random() * 2.5 + 0.8;
                this.speedY = Math.random() * 0.8 + 0.3;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.015 + 0.005;
            }

            update() {
                this.y += this.speedY;
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.3;

                // Reset particle
                if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.y = -10;
                    this.x = Math.random() * canvas.width;
                    this.speedY = Math.random() * 0.8 + 0.3;
                    this.speedX = Math.random() * 0.4 - 0.2;
                }
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                
                // Gold glowing gradient colors
                const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                glow.addColorStop(0, `rgba(212, 175, 55, ${this.opacity})`);
                glow.addColorStop(0.8, `rgba(243, 229, 171, ${this.opacity * 0.6})`);
                glow.addColorStop(1, 'rgba(212, 175, 55, 0)');
                
                ctx.fillStyle = glow;
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new GoldParticle());
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

    // === RSVP FORM PERSISTENCE & MODAL ===
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (rsvpForm && rsvpSuccess) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values
            const formData = {
                name: document.getElementById('guest-name').value,
                email: document.getElementById('guest-email').value,
                phone: document.getElementById('guest-phone').value,
                guests: document.getElementById('guest-count').value,
                attendance: rsvpForm.querySelector('input[name="attendance"]:checked').value,
                notes: document.getElementById('guest-notes').value,
                timestamp: new Date().toISOString()
            };

            // Save locally
            const rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
            rsvps.push(formData);
            localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));

            console.log("RSVP Saved:", formData);

            // Display popup success modal
            rsvpSuccess.style.display = 'flex';
            
            // Reset form fields
            rsvpForm.reset();
        });
    }

    if (closeModalBtn && rsvpSuccess) {
        closeModalBtn.addEventListener('click', () => {
            rsvpSuccess.style.opacity = '0';
            setTimeout(() => {
                rsvpSuccess.style.display = 'none';
                rsvpSuccess.style.opacity = '1';
            }, 300);
        });
    }
});
