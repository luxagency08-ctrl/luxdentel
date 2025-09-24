// Lux Dentals - Professional Dental Clinic JavaScript
// Enhanced functionality for appointment booking and user interaction

document.addEventListener('DOMContentLoaded', function() {
    console.log('🦷 Lux Dentals website loaded successfully!');

    // Mobile Navigation Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
        });
    });

    // Smooth Scrolling for Navigation Links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Navigation Link Highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

        let currentSection = '';
        const headerHeight = document.querySelector('.header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top - headerHeight - 50;
            const sectionHeight = section.offsetHeight;

            if (sectionTop <= 0 && sectionTop + sectionHeight > 0) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call

    // Header Background Change on Scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        }
    });

    // Enhanced Contact Form Handling
    const contactForm = document.getElementById('appointment-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const email = formData.get('email');
            const service = formData.get('service');
            const date = formData.get('date');
            const time = formData.get('time');
            const message = formData.get('message');

            // Enhanced validation
            if (!validateForm(name, phone, email, service, date, time)) {
                return;
            }

            // Format the date nicely
            const formattedDate = formatDate(date);

            // Create comprehensive WhatsApp message
            const whatsappMessage = `🦷 *APPOINTMENT REQUEST - LUX DENTALS*

👤 *Patient Details:*
• Name: ${name}
• Phone: ${phone}
• Email: ${email}

🏥 *Appointment Details:*
• Service: ${service}
• Date: ${formattedDate}
• Time: ${time}
• Additional Message: ${message || 'None'}

📍 *Clinic Address:*
123 Main Street, Downtown, City, State, ZIP

Please confirm this appointment. Thank you!

🌟 *Emergency? Call: +91 7039944723 (24/7)*`;

            // Open WhatsApp with pre-filled message
            const whatsappUrl = `https://wa.me/917208778215?text=${encodeURIComponent(whatsappMessage)}`;

            // Show loading state
            showLoading(contactForm);

            // Simulate processing time
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');

                // Show success message
                showSuccessMessage();

                // Reset form
                contactForm.reset();
                hideLoading(contactForm);

                // Track appointment request (for analytics)
                trackEvent('appointment_request', {
                    service: service,
                    date: date,
                    method: 'whatsapp'
                });
            }, 1000);
        });
    }

    // Form validation function
    function validateForm(name, phone, email, service, date, time) {
        // Name validation
        if (!name || name.trim().length < 2) {
            showError('Please enter a valid name (at least 2 characters)');
            return false;
        }

        // Phone validation
        if (!phone || !validatePhone(phone)) {
            showError('Please enter a valid phone number');
            return false;
        }

        // Email validation
        if (!email || !validateEmail(email)) {
            showError('Please enter a valid email address');
            return false;
        }

        // Service validation
        if (!service) {
            showError('Please select a service');
            return false;
        }

        // Date validation
        if (!date || !validateDate(date)) {
            showError('Please select a valid future date');
            return false;
        }

        // Time validation
        if (!time) {
            showError('Please select a preferred time');
            return false;
        }

        return true;
    }

    // Phone number validation
    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[0-9]{10,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Date validation (must be future date)
    function validateDate(dateStr) {
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }

    // Format date for display
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }

    // Show error message
    function showError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #fee2e2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #fca5a5;
            font-weight: 500;
        `;
        errorDiv.textContent = message;

        // Insert error message at the top of the form
        const form = document.getElementById('appointment-form');
        form.insertBefore(errorDiv, form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);

        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Show success message
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #059669;
            color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 90%;
        `;
        successDiv.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <h3 style="margin-bottom: 1rem;">Appointment Request Sent!</h3>
            <p>Your appointment request has been sent via WhatsApp. We'll contact you within 1 hour to confirm your appointment.</p>
            <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.9;">Thank you for choosing Lux Dentals!</p>
        `;

        document.body.appendChild(successDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);

        // Click to close
        successDiv.addEventListener('click', () => {
            successDiv.remove();
        });
    }

    // Show loading state
    function showLoading(form) {
        const button = form.querySelector('button[type="submit"]');
        button.innerHTML = '⏳ Sending Request...';
        button.disabled = true;
        button.style.opacity = '0.7';
    }

    // Hide loading state
    function hideLoading(form) {
        const button = form.querySelector('button[type="submit"]');
        button.innerHTML = '📱 Book via WhatsApp';
        button.disabled = false;
        button.style.opacity = '1';
    }

    // Track events for analytics (placeholder function)
    function trackEvent(eventName, properties) {
        console.log('📊 Event tracked:', eventName, properties);
        // Here you would integrate with your analytics service
        // Example: gtag('event', eventName, properties);
    }

    // Add scroll animations for better UX
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .doctor-card, .testimonial-card, .info-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Emergency contact highlighting
    const emergencyElements = document.querySelectorAll('[href="tel:+917039944723"]');
    emergencyElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 1s infinite';
        });

        el.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });

    // Add pulse animation for emergency contacts
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Auto-format phone number input
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    });

    // Set minimum date for appointment booking (tomorrow)
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);

        // Set max date (3 months from now)
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        const maxDateStr = maxDate.toISOString().split('T')[0];
        dateInput.setAttribute('max', maxDateStr);
    }

    // Add click-to-call functionality
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('phone_click', {
                number: this.getAttribute('href').replace('tel:', '')
            });
        });
    });

    // Add click-to-WhatsApp functionality
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('whatsapp_click', {
                number: this.getAttribute('href').match(/\d+/)[0]
            });
        });
    });

    // Add click-to-email functionality
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('email_click', {
                email: this.getAttribute('href').replace('mailto:', '')
            });
        });
    });

    // Service card click tracking
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            trackEvent('service_interest', {
                service: serviceName
            });
        });
    });

    // Doctor card click tracking
    const doctorCards = document.querySelectorAll('.doctor-card');
    doctorCards.forEach(card => {
        card.addEventListener('click', function() {
            const doctorName = this.querySelector('h3').textContent;
            trackEvent('doctor_interest', {
                doctor: doctorName
            });
        });
    });

    // Page load time tracking
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackEvent('page_load_time', {
            load_time: loadTime,
            user_agent: navigator.userAgent
        });

        console.log(`🚀 Page loaded in ${loadTime}ms`);
    });

    // Scroll depth tracking
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercentage = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercentage > maxScroll) {
            maxScroll = scrollPercentage;

            // Track at 25%, 50%, 75%, and 100% scroll depths
            if ([25, 50, 75, 100].includes(maxScroll)) {
                trackEvent('scroll_depth', {
                    depth: maxScroll
                });
            }
        }
    });

    // Form abandonment tracking
    const formInputs = document.querySelectorAll('#appointment-form input, #appointment-form select, #appointment-form textarea');
    let formStarted = false;

    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (!formStarted) {
                formStarted = true;
                trackEvent('form_start');
            }
        });
    });

    // Track form abandonment on page leave
    window.addEventListener('beforeunload', function() {
        if (formStarted && !contactForm.submitted) {
            trackEvent('form_abandon');
        }
    });

    console.log('🦷 Lux Dentals - All functionality loaded!');
    console.log('📱 Ready to accept appointments via WhatsApp');
    console.log('🚨 Emergency contact: +91 7039944723');
});

// Utility functions available globally
window.LuxDentals = {
    // Call main number
    callClinic: function() {
        window.location.href = 'tel:+917208778215';
    },

    // Call emergency number
    callEmergency: function() {
        window.location.href = 'tel:+917039944723';
    },

    // Open WhatsApp
    openWhatsApp: function(message = '') {
        const defaultMessage = message || 'Hi Lux Dentals! I would like to inquire about your dental services.';
        const url = `https://wa.me/917208778215?text=${encodeURIComponent(defaultMessage)}`;
        window.open(url, '_blank');
    },

    // Send email
    sendEmail: function(subject = '', body = '') {
        const defaultSubject = subject || 'Inquiry about Dental Services';
        const defaultBody = body || 'Hello Lux Dentals team,

I would like to inquire about your dental services.

Best regards';
        const url = `mailto:luxagency08@gmail.com?subject=${encodeURIComponent(defaultSubject)}&body=${encodeURIComponent(defaultBody)}`;
        window.location.href = url;
    }
};

// Console welcome message
console.log(`
🦷 Welcome to Lux Dentals!
📍 Location: 123 Main Street, Downtown
📞 Phone: +91 7208778215  
🚨 Emergency: +91 7039944723 (24/7)
📧 Email: luxagency08@gmail.com
⭐ Rating: 4.8/5 stars (250+ reviews)

Available functions:
- LuxDentals.callClinic()
- LuxDentals.callEmergency()  
- LuxDentals.openWhatsApp()
- LuxDentals.sendEmail()
`);