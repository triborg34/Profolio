/**
 * Aref Osky - Professional Portfolio JavaScript Engine
 * Author: Aref Osky
 * Year: 2026
 * Pure Vanilla JavaScript implementing interactive elements, scroll animations,
 * dynamic typing, mouse tracking, canvas particle systems, and contact submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. MOBILE DRAWER NAVIGATION
  // ==========================================
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const menuIcon = document.getElementById('menu-icon');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-btn');

  const toggleDrawer = () => {
    mobileDrawer.classList.toggle('transform');
    mobileDrawer.classList.toggle('translate-x-full');
    
    // Switch FontAwesome icon between bars and close X
    if (menuIcon.classList.contains('fa-bars')) {
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-xmark');
    } else {
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    }
  };

  mobileToggle?.addEventListener('click', toggleDrawer);

  // Close drawer when link clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (!mobileDrawer?.classList.contains('translate-x-full')) {
        toggleDrawer();
      }
    });
  });

  // Close drawer on resize to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileDrawer && !mobileDrawer.classList.contains('translate-x-full')) {
      toggleDrawer();
    }
  });


  // ==========================================
  // 2. STICKY HEADER & ACTIVE SECTION HIGHLIGHT
  // ==========================================
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleHeaderAndNavScroll = () => {
    const scrollPos = window.scrollY;

    // Header transformation on scroll
    if (scrollPos > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Active link highlighting based on section scroll coordinates
    let currentSectionId = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id') || 'home';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleHeaderAndNavScroll);
  handleHeaderAndNavScroll(); // Initial run


  // ==========================================
  // 3. MOUSE TRACKING SPOTLIGHT GLOW
  // ==========================================
  const mouseGlow = document.getElementById('mouse-glow');

  if (mouseGlow) {
    // Only track mouse glow on non-touch (hoverable) screens
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
      document.addEventListener('mousemove', (e) => {
        mouseGlow.style.opacity = '1';
        mouseGlow.style.left = `${e.clientX}px`;
        mouseGlow.style.top = `${e.clientY}px`;
      });

      document.addEventListener('mouseleave', () => {
        mouseGlow.style.opacity = '0';
      });
    }
  }


  // ==========================================
  // 4. ANIMATED TYPING COMPONENT
  // ==========================================
  const typingTextEl = document.getElementById('typing-text');
  const roles = [
    'Flutter Developer',
    'Unity Game Developer',
    'C# Developer',
    'Computer Vision Engineer',
    'YOLO Specialist',
    'CCTV Expert'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const typeEffect = () => {
    if (!typingTextEl) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Remove characters
      typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Quicker deleting
    } else {
      // Add characters
      typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing
    }

    // Checking word boundary conditions
    if (!isDeleting && charIndex === currentRole.length) {
      // Full word printed, pause before deleting
      typingSpeed = 2000; 
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Cycle to next role
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Small pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  };

  // Kickstart typing animation
  typeEffect();


  // ==========================================
  // 5. HERO BACKGROUND PARTICLES CANVAS
  // ==========================================
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const maxParticles = 100;
    
    // Handle mouse connection
    let mouse = {
      x: null,
      y: null,
      radius: 150
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(79, 172, 254, 0.4)';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Boundary bounce check
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Interactive mouse push
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = dx / distance;
            const directionY = dy / distance;
            this.x += directionX * force * 1.5;
            this.y += directionY * force * 1.5;
          }
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particlesArray = [];
      for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    // Draw lines connecting nearby particles
    const connectParticles = () => {
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            const opacity = (110 - distance) / 110 * 0.12;
            ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });
      
      connectParticles();
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
  }


  // ==========================================
  // 6. SCROLL REVEAL & STAT COUNTERS & PROGRESS BARS
  // ==========================================
  const scrollElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');
  const progressBars = document.querySelectorAll('.skill-progress');
  const counterElements = document.querySelectorAll('.counter');

  // Utility to animate count totals
  const animateCounter = (element) => {
    if (element.classList.contains('counted')) return;
    element.classList.add('counted');

    const target = parseInt(element.getAttribute('data-target') || '0', 10);
    const duration = 1500; // millisecond duration
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = target / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, stepTime);
  };

  // Intersection Observer for animations
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 1. Reveal Elements
        if (entry.target.classList.contains('reveal-fade-up') ||
            entry.target.classList.contains('reveal-fade-left') ||
            entry.target.classList.contains('reveal-fade-right')) {
          entry.target.classList.add('active');
        }

        // 2. Animate counter variables
        if (entry.target.classList.contains('counter')) {
          animateCounter(entry.target);
        }

        // 3. Fill Skill Progress Bars
        if (entry.target.classList.contains('skill-progress')) {
          const width = entry.target.getAttribute('data-progress') || '0%';
          entry.target.style.width = width;
        }

        // Stop observing once animated (except for normal element reveals sometimes, but keep simple)
        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1, // 10% overlap triggers animation
    rootMargin: '0px 0px -50px 0px' // offset bottom trigger point slightly
  });

  // Track elements
  scrollElements.forEach(el => sectionObserver.observe(el));
  progressBars.forEach(el => sectionObserver.observe(el));
  counterElements.forEach(el => sectionObserver.observe(el));


  // ==========================================
  // 7. PORTFOLIO FILTERING MODULE
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Clear active filter button styling
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        
        // Dynamic hiding & revealing transitions
        if (filter === 'all' || category === filter) {
          card.classList.remove('fade-out');
          card.classList.add('fade-in');
        } else {
          card.classList.remove('fade-in');
          card.classList.add('fade-out');
        }
      });
    });
  });


  // ==========================================
  // 8. CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFieldsContainer = document.getElementById('form-fields-container');
  const formSuccess = document.getElementById('form-success');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fetch values for potential dispatch
    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const message = document.getElementById('contact-message')?.value;

    if (!name || !email || !message) {
      alert('Kindly fill in all form inputs.');
      return;
    }

    // Form submission simulation
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner animate-spin ml-2"></i>';
    }

    setTimeout(() => {
      // Hide form fields & display elegant validation prompt
      if (formFieldsContainer && formSuccess) {
        formFieldsContainer.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        
        // Log to console for demonstration
        console.log('Portfolio Form Received: ', { name, email, message });
      }
    }, 1200);
  });

});
