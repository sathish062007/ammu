/**
 * HAPPY BIRTHDAY SADHARNA.E - INTERACTIVE JAVASCRIPT
 * Features: Star Particles, Canvas Confetti, Photo Lightbox,
 * Interactive Cake Candle Blowing, Music Player, Scroll Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initStarCanvas();
  initConfetti();
  initMusicPlayer();
  initHeaderScroll();
  initGalleryLightbox();
  initSurpriseModal();
  initScrollAnimations();
  initCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Star & Particle Canvas Background
   -------------------------------------------------------------------------- */
function initStarCanvas() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Create stars
  const stars = [];
  const starCount = Math.floor((width * height) / 10000);
  const colors = ['#ffffff', '#93c5fd', '#38bdf8', '#60a5fa', '#bfdbfe'];

  for (let i = 0; i < Math.min(starCount, 120); i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005,
      vy: -(Math.random() * 0.3 + 0.1) // Gentle upward float
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      // Twinkle alpha effect
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0.2) {
        star.speed = -star.speed;
      }

      // Upward movement
      star.y += star.vy;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = Math.abs(star.alpha);
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  // Check reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    render();
  }
}

/* --------------------------------------------------------------------------
   2. Canvas Confetti System
   -------------------------------------------------------------------------- */
let fireConfettiBurst = () => {};

function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let particles = [];
  const confettiColors = ['#2563eb', '#38bdf8', '#93c5fd', '#ffffff', '#f59e0b', '#ec4899'];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 4;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.vx = (Math.random() - 0.5) * 12;
      this.vy = Math.random() * -14 - 6;
      this.gravity = 0.3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.opacity = 1;
    }

    update() {
      this.vx *= 0.98;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.opacity -= 0.008;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  fireConfettiBurst = (x = width / 2, y = height / 3, count = 90) => {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y));
    }
  };

  let animationFrame;
  function animateConfetti() {
    ctx.clearRect(0, 0, width, height);

    particles = particles.filter(p => p.opacity > 0 && p.y < height + 50);
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    if (particles.length > 0) {
      animationFrame = requestAnimationFrame(animateConfetti);
    }
  }

  const originalFire = fireConfettiBurst;
  fireConfettiBurst = (x, y, count) => {
    originalFire(x, y, count);
    cancelAnimationFrame(animationFrame);
    animateConfetti();
  };

  // Button Listeners for Confetti
  const finalBtn = document.getElementById('finalConfettiBtn');
  if (finalBtn) {
    finalBtn.addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      fireConfettiBurst(rect.left + rect.width / 2, rect.top, 100);
    });
  }
}

/* --------------------------------------------------------------------------
   3. Background Music Control
   -------------------------------------------------------------------------- */
function initMusicPlayer() {
  const btn = document.getElementById('musicToggleBtn');
  const audio = document.getElementById('bgMusic');
  if (!btn || !audio) return;

  const musicText = btn.querySelector('.music-text');
  let isPlaying = false;

  btn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      btn.classList.remove('playing');
      if (musicText) musicText.textContent = 'Music Off';
      isPlaying = false;
    } else {
      audio.play().then(() => {
        btn.classList.add('playing');
        if (musicText) musicText.textContent = 'Playing 🎵';
        isPlaying = true;
      }).catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }
  });
}

/* --------------------------------------------------------------------------
   4. Header Sticky Scroll Effect
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   5. Photo Gallery Lightbox Preview
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const modal = document.getElementById('photoLightbox');
  const modalImg = document.getElementById('lightboxImage');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const cards = document.querySelectorAll('.gallery-card');

  if (!modal || !modalImg) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-src');
      const captionText = card.getAttribute('data-caption');

      if (imgSrc) {
        modalImg.src = imgSrc;
        modalCaption.textContent = captionText || 'Sadharna.E';
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Birthday Surprise Modal & Interactive Candle Blowing
   -------------------------------------------------------------------------- */
function initSurpriseModal() {
  const surpriseBtn = document.getElementById('surpriseBtn');
  const modal = document.getElementById('surpriseModal');
  const closeBtn = document.getElementById('surpriseClose');
  const flames = document.querySelectorAll('.candle .flame');
  const wishRevealed = document.getElementById('wishRevealed');
  const cakeInstruction = document.getElementById('cakeInstruction');

  if (!surpriseBtn || !modal) return;

  surpriseBtn.addEventListener('click', () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    fireConfettiBurst(window.innerWidth / 2, window.innerHeight / 3, 100);
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Candle blowing logic
  let activeFlamesCount = flames.length;

  flames.forEach(flame => {
    flame.parentElement.addEventListener('click', () => {
      if (flame.classList.contains('active')) {
        flame.classList.remove('active');
        activeFlamesCount--;

        // Little confetti pop for each candle
        const rect = flame.getBoundingClientRect();
        fireConfettiBurst(rect.left, rect.top, 25);

        if (activeFlamesCount === 0) {
          // All candles blown out!
          if (cakeInstruction) {
            cakeInstruction.textContent = '🎉 All candles blown! Wish granted!';
          }
          if (wishRevealed) {
            wishRevealed.classList.remove('hidden');
          }
          // Big celebratory confetti burst!
          setTimeout(() => {
            fireConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 140);
          }, 300);
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Scroll Reveal Animations (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   8. Dynamic Year in Footer
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
