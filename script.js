/**
 * Dream Business Center - Main JavaScript
 * Handles smooth scrolling, mobile navigation, portfolio filtering,
 * scroll animations, back-to-top button, and form interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== DOM ELEMENTS ====================
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('backToTop');
    const portfolioGrid = document.getElementById('portfolioGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const contactForm = document.getElementById('contactForm');
    const yearSpan = document.getElementById('year');
    const sections = document.querySelectorAll('section[id]');

    // ==================== UPDATE COPYRIGHT YEAR ====================
    yearSpan.textContent = new Date().getFullYear();

    // ==================== HEADER SCROLL EFFECT ====================
    /**
     * Adds 'scrolled' class to header when user scrolls past 50px
     * This triggers the glassmorphism background on the navbar
     */
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ==================== SMOOTH SCROLLING ====================
    /**
     * Smooth scroll to target section when clicking anchor links
     * Accounts for fixed header height offset
     */
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }

            // Update active nav link
            updateActiveNavLink(targetId);
        }
    }

    // Attach smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });

    // ==================== ACTIVE NAV LINK HIGHLIGHTING ====================
    /**
     * Updates active state on nav links based on current scroll position
     * Uses IntersectionObserver for performance
     */
    function updateActiveNavLink(activeId) {
        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }

    // Use IntersectionObserver to detect which section is in view
    const observerOptions = {
        root: null,
        rootMargin: `-${header.offsetHeight}px 0px -50% 0px`,
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNavLink(`#${entry.target.id}`);
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // ==================== MOBILE MENU TOGGLE ====================
    /**
     * Toggles mobile navigation menu open/closed
     */
    function toggleMobileMenu() {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on a nav link
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // ==================== BACK TO TOP BUTTON ====================
    /**
     * Shows/hides back-to-top button based on scroll position
     * Smooth scrolls to top when clicked
     */
    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', handleBackToTop);

    // ==================== PORTFOLIO FILTERING ====================
    /**
     * Filters portfolio items based on category
     * Adds fade animation when showing/hiding items
     */
    function filterPortfolio(e) {
        const filterValue = e.target.dataset.filter;

        // Update active button state
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Filter items
        const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item');

        portfolioItems.forEach(item => {
            const category = item.dataset.category;

            if (filterValue === 'all' || category === filterValue) {
                item.classList.remove('hidden');
                // Small delay for stagger effect
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', filterPortfolio);
    });

    // ==================== SCROLL REVEAL ANIMATIONS ====================
    /**
     * Reveals elements as they scroll into view using IntersectionObserver
     */
    const revealElements = document.querySelectorAll('.service-card, .portfolio-item, .section-header');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // ==================== CONTACT FORM HANDLING ====================
    /**
     * Handles form submission with basic validation feedback
     * In production, replace with actual form submission logic
     */
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.email || !data.service || !data.message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission success
        showFormMessage('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
        contactForm.reset();
    });

    /**
     * Displays temporary feedback message below form
     */
    function showFormMessage(message, type) {
        // Remove existing message if any
        const existingMsg = contactForm.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msgEl = document.createElement('div');
        msgEl.className = `form-message form-message-${type}`;
        msgEl.textContent = message;
        msgEl.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 0.75rem;
            font-size: 0.95rem;
            font-weight: 500;
            text-align: center;
            animation: fadeInUp 0.3s ease;
            ${type === 'success' 
                ? 'background: rgba(13, 148, 136, 0.2); color: #5eead4; border: 1px solid rgba(13, 148, 136, 0.3);' 
                : 'background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3);'
            }
        `;

        contactForm.appendChild(msgEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            msgEl.style.opacity = '0';
            msgEl.style.transition = 'opacity 0.5s ease';
            setTimeout(() => msgEl.remove(), 500);
        }, 5000);
    }

    // ==================== PARALLAX EFFECT FOR HERO SHAPES ====================
    /**
     * Subtle parallax movement for hero background shapes on mouse move
     */
    const heroShapes = document.querySelectorAll('.shape');
    const hero = document.querySelector('.hero');

    // Only apply on non-touch devices
    if (!window.matchMedia('(pointer: coarse)').matches) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            heroShapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    // ==================== INITIALIZATION ====================
    // Trigger initial header state check
    handleHeaderScroll();

    console.log('Dream Business Center website initialized successfully.');
});
