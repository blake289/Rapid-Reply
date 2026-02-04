// Rapid Reply Landing Page - JavaScript
// Premium animations and interactions

(function () {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==========================================
    // NAVIGATION SCROLL EFFECT
    // ==========================================

    const nav = document.querySelector('.sticky-nav');
    let lastScrollY = 0;

    function handleNavScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 24) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ==========================================
    // SECTION REVEAL ANIMATIONS
    // ==========================================

    if (!prefersReducedMotion) {
        const revealObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, revealObserverOptions);

        // Add reveal class to all sections except hero
        const sections = document.querySelectorAll('section:not(.hero)');
        sections.forEach(section => {
            section.classList.add('reveal');
            revealObserver.observe(section);
        });

        // Add reveal to cards with stagger
        const cardContainers = document.querySelectorAll('.problem-grid, .benefits-grid, .testimonials-grid, .industry-grid, .comparison-grid');

        cardContainers.forEach(container => {
            const cards = container.children;
            Array.from(cards).forEach((card, index) => {
                card.style.transitionDelay = `${index * 75}ms`;
            });
        });
    }

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // ==========================================
    // FORM HANDLING
    // ==========================================

    const auditForm = document.getElementById('audit-form');

    if (auditForm) {
        auditForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullName = document.getElementById('full-name').value.trim();
            const phone = document.getElementById('phone').value.trim();

            // Basic phone validation
            const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;

            if (!fullName || !phone) {
                showToast('Please fill in all fields.', 'error');
                return;
            }

            if (!phoneRegex.test(phone)) {
                showToast('Please enter a valid phone number.', 'error');
                return;
            }

            // Simulated success - in production, this would submit to a backend
            const submitBtn = auditForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            // Simulate API call
            setTimeout(() => {
                submitBtn.textContent = 'Got it! Pick a time that works.';
                submitBtn.style.background = '#22C55E';

                showToast('Got it. Pick a time that works.', 'success');

                // In production, redirect to scheduler
                // window.location.href = '/schedule';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    auditForm.reset();
                }, 3000);
            }, 1000);
        });
    }

    // ==========================================
    // TOAST NOTIFICATIONS
    // ==========================================

    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        // Styles
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 200ms ease',
            background: type === 'error' ? '#EF4444' : type === 'success' ? '#22C55E' : '#00D4AA',
            color: type === 'success' || type === 'info' ? '#081018' : '#ffffff'
        });

        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 200);
        }, 4000);
    }

    // ==========================================
    // MOBILE STICKY CTA VISIBILITY
    // ==========================================

    const mobileStickyCta = document.querySelector('.mobile-sticky-cta');
    const heroSection = document.querySelector('.hero');
    const finalCtaSection = document.querySelector('.final-cta');

    if (mobileStickyCta && heroSection) {
        const stickyCtaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === heroSection) {
                    // Hide mobile sticky when hero is visible
                    mobileStickyCta.style.transform = entry.isIntersecting ? 'translateY(100%)' : 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });

        stickyCtaObserver.observe(heroSection);

        // Also hide when at final CTA
        if (finalCtaSection) {
            const finalCtaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        mobileStickyCta.style.transform = 'translateY(100%)';
                    }
                });
            }, { threshold: 0.5 });

            finalCtaObserver.observe(finalCtaSection);
        }

        // Set initial state
        mobileStickyCta.style.transition = 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)';
        mobileStickyCta.style.transform = 'translateY(100%)';
    }

    // ==========================================
    // FAQ ACCORDION ACCESSIBILITY
    // ==========================================

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const summary = item.querySelector('summary');

        summary.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.open = !item.open;
            }
        });
    });

    // ==========================================
    // BUTTON RIPPLE EFFECT (subtle)
    // ==========================================

    if (!prefersReducedMotion) {
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple';
                Object.assign(ripple.style, {
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    width: '0',
                    height: '0',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none'
                });

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                ripple.animate([
                    { width: '0', height: '0', opacity: 1 },
                    { width: '200px', height: '200px', opacity: 0 }
                ], {
                    duration: 400,
                    easing: 'ease-out'
                }).onfinish = () => ripple.remove();
            });
        });
    }

    // ==========================================
    // PHONE INPUT FORMATTING
    // ==========================================

    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length >= 10) {
                value = value.slice(0, 10);
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }

            e.target.value = value;
        });
    }

    // ==========================================
    // KEYBOARD NAVIGATION ENHANCEMENT
    // ==========================================

    document.addEventListener('keydown', (e) => {
        // Skip to main content with Tab
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
            const hero = document.querySelector('.hero');
            if (hero) {
                const firstFocusable = hero.querySelector('a, button, input, [tabindex="0"]');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }
        }
    });

    // ==========================================
    // INIT
    // ==========================================

    // Initial nav state check
    handleNavScroll();

    // Log for debugging (remove in production)
    console.log('Rapid Reply Landing Page initialized');

})();
