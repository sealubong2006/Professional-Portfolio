/* ========================================
   Portfolio JavaScript
   Vanilla JS - No dependencies
   ======================================== */

(function() {
    'use strict';

    /* ========================================
       DOM Elements
       ======================================== */
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const yearElement = document.getElementById('currentYear');

    /* ========================================
       Active Section Tracking on Scroll
       ======================================== */
    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding nav link
                const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    /* ========================================
       Project Filtering
       ======================================== */
    function filterProjects(filterValue) {
        projectCards.forEach(card => {
            const tags = card.getAttribute('data-tags');
            
            if (filterValue === 'all') {
                // Show all projects
                card.classList.remove('hidden');
            } else {
                // Show projects that match the filter
                if (tags && tags.includes(filterValue)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            }
        });
    }

    /* ========================================
       Filter Button Click Handler
       ======================================== */
    function setupFilterButtons() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value and filter projects
                const filterValue = this.getAttribute('data-filter');
                filterProjects(filterValue);
            });
        });
    }

    /* ========================================
       Smooth Scroll Enhancement
       ======================================== */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only handle internal links
                if (href === '#' || href === '') return;
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = header ? header.offsetHeight : 72;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* ========================================
       Header Scroll Effect
       ======================================== */
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.boxShadow = 'none';
        }
    }

    /* ========================================
       Intersection Observer for Fade-in Animations
       ======================================== */
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(element => {
            observer.observe(element);
        });

        // Observe individual project cards for staggered animation
        projectCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 50}ms`;
            observer.observe(card);
        });
    }

    /* ========================================
       Dynamic Copyright Year
       ======================================== */
    function setCurrentYear() {
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = currentYear;
        }
    }

    /* ========================================
       Form Submission Handler (Optional)
       ======================================== */
    function setupFormHandler() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                // Formspree will handle the submission
                // You can add additional validation or UI feedback here
                const submitButton = this.querySelector('button[type="submit"]');
                
                if (submitButton) {
                    submitButton.textContent = 'Sending...';
                    submitButton.disabled = true;
                }
            });
        }
    }

    /* ========================================
       Debounce Utility for Scroll Events
       ======================================== */
    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /* ========================================
       Event Listeners
       ======================================== */
    function setupEventListeners() {
        // Scroll events with debouncing
        window.addEventListener('scroll', debounce(() => {
            updateActiveSection();
            handleHeaderScroll();
        }, 10));

        // Resize events
        window.addEventListener('resize', debounce(() => {
            updateActiveSection();
        }, 100));
    }

    /* ========================================
       Keyboard Navigation Enhancement
       ======================================== */
    function setupKeyboardNavigation() {
        // Add keyboard support for filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    /* ========================================
       Accessibility Improvements
       ======================================== */
    function setupAccessibility() {
        // Add ARIA labels to dynamically changing elements
        filterButtons.forEach(button => {
            button.setAttribute('role', 'button');
            button.setAttribute('tabindex', '0');
        });

        // Update ARIA states for active filter
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            activeFilter.setAttribute('aria-pressed', 'true');
        }
    }

    /* ========================================
       Performance: Lazy Load Images (if added later)
       ======================================== */
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    /* ========================================
       Print Styles Handler
       ======================================== */
    function setupPrintHandler() {
        window.addEventListener('beforeprint', () => {
            // Show all hidden project cards when printing
            projectCards.forEach(card => {
                card.classList.remove('hidden');
            });
        });

        window.addEventListener('afterprint', () => {
            // Restore filter state after printing
            const activeFilter = document.querySelector('.filter-btn.active');
            if (activeFilter) {
                const filterValue = activeFilter.getAttribute('data-filter');
                filterProjects(filterValue);
            }
        });
    }

    /* ========================================
       Analytics Event Tracking (Optional)
       ======================================== */
    function trackEvent(category, action, label) {
        // Placeholder for analytics integration
        // Example: Google Analytics, Plausible, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }

    function setupAnalytics() {
        // Track project clicks
        document.querySelectorAll('.project-link').forEach(link => {
            link.addEventListener('click', function() {
                const projectName = this.closest('.project-card').querySelector('.project-title').textContent;
                const linkType = this.textContent.trim();
                trackEvent('Projects', 'Click', `${projectName} - ${linkType}`);
            });
        });

        // Track filter usage
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                trackEvent('Filters', 'Select', filterValue);
            });
        });

        // Track CTA clicks
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                trackEvent('CTA', 'Click', buttonText);
            });
        });
    }

    /* ========================================
       Initialize Application
       ======================================== */
    function init() {
        // Core functionality
        setCurrentYear();
        setupFilterButtons();
        setupSmoothScroll();
        setupEventListeners();
        
        // Enhancements
        setupIntersectionObserver();
        setupKeyboardNavigation();
        setupAccessibility();
        setupLazyLoading();
        setupFormHandler();
        setupPrintHandler();
        setupAnalytics();
        
        // Initial state
        updateActiveSection();
        handleHeaderScroll();
        
        // Log initialization
        console.log('Portfolio initialized successfully');
    }

    /* ========================================
       Run on DOM Content Loaded
       ======================================== */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ========================================
       Expose Public API (Optional)
       ======================================== */
    window.Portfolio = {
        filterProjects: filterProjects,
        updateActiveSection: updateActiveSection
    };

})();
