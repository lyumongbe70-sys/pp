/**
 * KIM PYEONG (김평) — LUXURY PORTFOLIO SCRIPT
 * Features: Lenis Smooth Scroll, GSAP ScrollTrigger, Parallax, Video Modal,
 * Dynamic Top Button, Generative Ambient Audio, and Interactive Canvas.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. DYNAMIC YEAR
  // ------------------------------------------------------------------------
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------------------
  // 2. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER INTEGRATION
  // ------------------------------------------------------------------------
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      smoothTouch: false,
      touchMultiplier: 2.0
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // ------------------------------------------------------------------------
  // 3. SMOOTH NAVIGATION (MENU CLICK TO SECTION)
  // ------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileToggle = document.getElementById('mobileToggle');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSelector = link.getAttribute('data-target') || link.getAttribute('href');
      if (!targetSelector) return;

      const targetElem = document.querySelector(targetSelector);
      if (targetElem) {
        // If mobile drawer is open, close it
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          mobileDrawer.classList.remove('open');
          if (mobileToggle) mobileToggle.classList.remove('is-active');
        }

        if (lenis) {
          lenis.scrollTo(targetElem, {
            offset: -70,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            onComplete: () => {
              if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
              }
            }
          });
        } else {
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Mobile menu toggle button
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('is-active', isOpen);
    });
  }

  // ------------------------------------------------------------------------
  // 4. FLOATING TOP BUTTON & SCROLL PROGRESS
  // ------------------------------------------------------------------------
  const topBtn = document.getElementById('topBtn');
  const topProgressRing = document.getElementById('topProgressRing');
  const header = document.getElementById('header');

  const circleCircumference = 2 * Math.PI * 24; // r=24 -> ~150.796

  function handleScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Header glassmorphism on scroll
    if (header) {
      if (scrollY > 60) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }

    // Top button visibility & progress ring
    if (topBtn) {
      if (scrollY > 300) {
        topBtn.classList.add('visible');
      } else {
        topBtn.classList.remove('visible');
      }

      if (topProgressRing && maxScroll > 0) {
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        const offset = circleCircumference - (progress * circleCircumference);
        topProgressRing.style.strokeDashoffset = offset;
      }
    }

    // Active navigation highlight
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = '#' + sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (topBtn) {
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.6,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. LUXURY PRELOADER ANIMATION
  // ------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloaderBar');
  const preloaderCounter = document.getElementById('preloaderCounter');

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 14) + 10;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);

      if (preloaderBar) preloaderBar.style.width = '100%';
      if (preloaderCounter) preloaderCounter.textContent = '100%';

      setTimeout(() => {
        if (preloader) preloader.classList.add('preloader-loaded');
        initEntranceAnimations();
      }, 200);
    } else {
      if (preloaderBar) preloaderBar.style.width = loadProgress + '%';
      if (preloaderCounter) preloaderCounter.textContent = loadProgress + '%';
    }
  }, 25);

  // ------------------------------------------------------------------------
  // 6. CUSTOM LUXURY CURSOR FOLLOWER
  // ------------------------------------------------------------------------
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');

  if (cursorDot && cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateCursor() {
      glowX += (mouseX - glowX) * 0.18;
      glowY += (mouseY - glowY) * 0.18;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .work-card, .persona-tab, input, select, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ------------------------------------------------------------------------
  // 7. AMBIENT GOLD SPARKLE CANVAS
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;
    const colors = [
      'rgba(212, 175, 55, 0.65)',   // Imperial Gold
      'rgba(255, 226, 138, 0.75)',  // Bright Gold
      'rgba(224, 49, 131, 0.55)',   // Jewel Magenta
      'rgba(126, 34, 206, 0.45)',   // Royal Violet
      'rgba(0, 206, 201, 0.5)'      // Peacock Cyan
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.15,
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulse: Math.random() * Math.PI
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d\.]+\)$/, `${currentAlpha})`);
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  // ------------------------------------------------------------------------
  // 8. GSAP SCROLLTRIGGER & PARALLAX ANIMATIONS
  // ------------------------------------------------------------------------
  function initEntranceAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Hero entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .fromTo('.hero-badge-tag', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo('.title-line', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.9 }, '-=0.5')
      .fromTo('.hero-subtext', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
      .fromTo('.hero-cta-group .btn-luxury', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.8 }, '-=0.5');

    // General Parallax on [data-speed]
    document.querySelectorAll('[data-speed]').forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 1;
      const yOffset = (1 - speed) * 150;
      gsap.to(el, {
        y: yOffset,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    // Section Titles Reveal
    document.querySelectorAll('.section-header-centered, .works-title-group, .contact-header').forEach(header => {
      gsap.from(header.children, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%'
        }
      });
    });

    // Stats Counter Animation
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      const numberEl = card.querySelector('.stat-number');
      if (numberEl) {
        const targetVal = parseInt(numberEl.getAttribute('data-target'), 10) || 0;
        gsap.to(numberEl, {
          innerText: targetVal,
          duration: 2.2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
          }
        });
      }
    });

    // Work Cards Stagger Entrance
    gsap.from('.work-card', {
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#worksGrid',
        start: 'top 80%'
      }
    });

    // Skills Master Grid Entrance
    gsap.fromTo('.skill-category-card',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#skill',
          start: 'top 85%',
          once: true
        }
      }
    );

    // Parallax Tilt on Monogram Card
    const monogramCard = document.querySelector('.monogram-card');
    if (monogramCard) {
      monogramCard.addEventListener('mousemove', (e) => {
        const rect = monogramCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(monogramCard, {
          rotationY: x * 18,
          rotationX: -y * 18,
          transformPerspective: 800,
          ease: 'power1.out',
          duration: 0.4
        });
      });
      monogramCard.addEventListener('mouseleave', () => {
        gsap.to(monogramCard, {
          rotationY: 0,
          rotationX: 0,
          ease: 'power2.out',
          duration: 0.7
        });
      });
    }

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // ------------------------------------------------------------------------
  // 9. ABOUT PERSONA SWITCHER
  // ------------------------------------------------------------------------
  const personaTabs = document.querySelectorAll('.persona-tab');
  const personaPanels = document.querySelectorAll('.persona-panel');

  personaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-persona');

      personaTabs.forEach(t => t.classList.remove('active'));
      personaPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 10. WORKS FILTER TABS
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.classList.remove('hide');
          gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        } else {
          card.classList.add('hide');
        }
      });

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  // Hover video auto-play on desktop
  workCards.forEach(card => {
    const video = card.querySelector('.work-preview-video');
    if (video) {
      card.addEventListener('mouseenter', () => {
        video.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        video.pause();
      });
    }
  });

  // ------------------------------------------------------------------------
  // 11. INTERACTIVE CINEMATIC VIDEO MODAL
  // ------------------------------------------------------------------------
  const videoModal = document.getElementById('videoModal');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');
  const modalCategory = document.getElementById('modalCategory');
  const modalYear = document.getElementById('modalYear');
  const modalTitle = document.getElementById('modalTitle');
  const modalRole = document.getElementById('modalRole');
  const modalDesc = document.getElementById('modalDesc');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openVideoModal(data) {
    if (!videoModal || !modalVideoPlayer) return;

    modalVideoPlayer.src = data.video;
    if (modalTitle) modalTitle.textContent = data.title || 'Project Showcase';
    if (modalCategory) modalCategory.textContent = data.category || 'CINEMATIC FILM';
    if (modalYear) modalYear.textContent = data.year || '2026';
    if (modalRole) modalRole.textContent = data.role || 'Visual Director';
    if (modalDesc) modalDesc.textContent = data.desc || '';

    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    modalVideoPlayer.play().catch(() => {});

    // Stop Lenis while modal is open
    if (lenis) lenis.stop();
  }

  function closeVideoModal() {
    if (!videoModal || !modalVideoPlayer) return;
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    modalVideoPlayer.pause();
    modalVideoPlayer.src = '';

    // Resume Lenis
    if (lenis) lenis.start();
  }

  // Attach click handler to work media
  document.querySelectorAll('.work-card-media').forEach(mediaBox => {
    mediaBox.addEventListener('click', () => {
      const videoSrc = mediaBox.getAttribute('data-video');
      const title = mediaBox.getAttribute('data-title');
      const category = mediaBox.getAttribute('data-category');
      const role = mediaBox.getAttribute('data-role');
      const year = mediaBox.getAttribute('data-year');
      const desc = mediaBox.getAttribute('data-desc');

      openVideoModal({ video: videoSrc, title, category, role, year, desc });
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeVideoModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeVideoModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('open')) {
      closeVideoModal();
    }
  });

  // ------------------------------------------------------------------------
  // 12. GENERATIVE LUXURY AMBIENT AUDIO (Pure Web Audio Synthesizer)
  // ------------------------------------------------------------------------
  const soundToggle = document.getElementById('soundToggle');
  let audioCtx = null;
  let isAudioPlaying = false;
  let activeNodes = [];

  function createAmbientDrone() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Ethereal luxury chords (F# major 9 / warm cinematic harmony: 92.5Hz, 138.6Hz, 174.6Hz, 233.1Hz)
    const frequencies = [92.5, 138.6, 174.6, 233.1, 277.2];
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.09, audioCtx.currentTime + 3);

    // Warm Lowpass Filter
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);

    // Reverb / Delay Simulation
    const delay = audioCtx.createDelay();
    delay.delayTime.setValueAtTime(0.4, audioCtx.currentTime);
    const feedback = audioCtx.createGain();
    feedback.gain.setValueAtTime(0.35, audioCtx.currentTime);

    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterGain);

    const oscs = [];

    frequencies.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Subtle slow detune modulation
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.1 + idx * 0.05, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(2.5, audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(0.18 / frequencies.length, audioCtx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start();
      oscs.push(osc, lfo);
    });

    filter.connect(masterGain);
    filter.connect(delay);
    masterGain.connect(audioCtx.destination);

    activeNodes = { masterGain, oscs, filter };
  }

  function stopAmbientDrone() {
    if (activeNodes && activeNodes.masterGain && audioCtx) {
      activeNodes.masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        if (activeNodes.oscs) {
          activeNodes.oscs.forEach(osc => {
            try { osc.stop(); } catch(e) {}
          });
        }
        activeNodes = null;
      }, 1300);
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      isAudioPlaying = !isAudioPlaying;
      if (isAudioPlaying) {
        createAmbientDrone();
        soundToggle.classList.add('playing');
      } else {
        stopAmbientDrone();
        soundToggle.classList.remove('playing');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 13. INTERACTIVE CONTACT FORM
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();

      if (!name || !email) {
        formFeedback.textContent = '모든 필수 항목을 입력해주세요.';
        formFeedback.style.color = '#fa709a';
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-inner">TRANSMITTING...</span>';
      }

      setTimeout(() => {
        formFeedback.innerHTML = `✦ 소중한 메시지가 전달되었습니다. <strong>${name}</strong>님, 신속히 회신드리겠습니다.`;
        formFeedback.style.color = '#ffe28a';
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="btn-inner">INQUIRY SENT</span><span class="btn-arrow">✓</span>';
        }
      }, 1000);
    });
  }

});
