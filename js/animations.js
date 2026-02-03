/**
 * Animation Control and Helpers
 */

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Add ripple effect to buttons
 * @param {Event} e - Click event
 */
function createRipple(e) {
  const button = e.currentTarget;
  
  // Remove existing ripples
  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  button.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

/**
 * Initialize ripple effects for all buttons
 */
function initRippleEffects() {
  const buttons = document.querySelectorAll('button, .btn, .btn-start, .btn-next, .nav-link, .option-card');
  
  buttons.forEach(button => {
    button.addEventListener('click', createRipple);
  });
}

/**
 * Animate element entrance
 * @param {HTMLElement} element - Element to animate
 * @param {string} animationType - Type of animation
 */
function animateElement(element, animationType = 'fadeIn') {
  element.style.animation = `${animationType} 0.6s ease-out`;
  
  // Remove animation after completion
  element.addEventListener('animationend', () => {
    element.style.animation = '';
  }, { once: true });
}

/**
 * Stagger animations for multiple elements
 * @param {NodeList} elements - Elements to animate
 * @param {number} delay - Delay between animations in ms
 */
function staggerAnimation(elements, delay = 100) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        element.style.transition = 'all 0.5s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });
    }, index * delay);
  });
}

/**
 * Animate number counter
 * @param {HTMLElement} element - Element containing the number
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, target, duration = 1000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuad = progress * (2 - progress);
    const current = Math.floor(start + (target - start) * easeOutQuad);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Animate progress bar
 * @param {HTMLElement} progressBar - Progress bar element
 * @param {number} percentage - Target percentage (0-100)
 */
function animateProgressBar(progressBar, percentage) {
  progressBar.style.width = '0%';
  
  setTimeout(() => {
    progressBar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    progressBar.style.width = percentage + '%';
  }, 100);
}

/**
 * Create particle effect
 * @param {HTMLElement} container - Container element
 * @param {number} count - Number of particles
 */
function createParticles(container, count = 20) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 5 + 2;
    const x = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = Math.random() * 3 + 2;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      left: ${x}%;
      bottom: -10px;
      animation: floatUp ${duration}s ease-in ${delay}s infinite;
      pointer-events: none;
    `;
    
    container.appendChild(particle);
  }
}

/**
 * Shake element (for error feedback)
 * @param {HTMLElement} element - Element to shake
 */
function shakeElement(element) {
  element.classList.add('animate-shake');
  element.addEventListener('animationend', () => {
    element.classList.remove('animate-shake');
  }, { once: true });
}

/**
 * Pulse element (for success feedback)
 * @param {HTMLElement} element - Element to pulse
 */
function pulseElement(element) {
  element.classList.add('animate-pulse');
  element.addEventListener('animationend', () => {
    element.classList.remove('animate-pulse');
  }, { once: true });
}

/**
 * Confetti animation for quiz completion
 * @param {HTMLElement} container - Container element
 */
function createConfetti(container) {
  const colors = ['#4285F4', '#EA4335', '#34A853', '#FBBC04'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * 100;
    const rotation = Math.random() * 360;
    const duration = Math.random() * 2 + 2;
    const delay = Math.random() * 0.5;
    
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${color};
      left: ${x}%;
      top: -20px;
      transform: rotate(${rotation}deg);
      animation: confettiFall ${duration}s linear ${delay}s forwards;
      pointer-events: none;
      z-index: 1000;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, (duration + delay) * 1000);
  }
}

/**
 * Initialize all animations on page load
 */
function initAnimations() {
  // Initialize scroll animations
  if ('IntersectionObserver' in window) {
    initScrollAnimations();
  }
  
  // Initialize ripple effects
  initRippleEffects();
  
  // Add page load animation
  document.body.classList.add('animate-fade-in');
}

// Add confetti fall animation style
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatUp {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }
    
    @keyframes confettiFall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
    }
    
    @keyframes rippleEffect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    button, .btn, .btn-start, .btn-next, .nav-link {
      position: relative;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
  window.animations = {
    initScrollAnimations,
    createRipple,
    animateElement,
    staggerAnimation,
    animateCounter,
    animateProgressBar,
    createParticles,
    shakeElement,
    pulseElement,
    createConfetti,
    initAnimations
  };
}
