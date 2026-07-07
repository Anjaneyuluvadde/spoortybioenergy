import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/* =========================================================================
   1. CUSTOM CURSOR PHYSICS
   ========================================================================= */
class CustomCursor {
  constructor() {
    this.dot = document.getElementById('cursor-dot');
    this.ring = document.getElementById('cursor-ring');
    if (!this.dot || !this.ring) return;

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    
    this.dotX = this.mouseX;
    this.dotY = this.mouseY;
    this.ringX = this.mouseX;
    this.ringY = this.mouseY;

    this.init();
    this.animate();
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Handle Hover states
    const hoverables = document.querySelectorAll('a, button, input, select, textarea, .magnetic, .glass-card, .video-play-btn-overlay');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.dot.classList.add('hovered');
        this.ring.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        this.dot.classList.remove('hovered');
        this.ring.classList.remove('hovered');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      this.dot.style.opacity = 0;
      this.ring.style.opacity = 0;
    });
    document.addEventListener('mouseenter', () => {
      this.dot.style.opacity = 1;
      this.ring.style.opacity = 1;
    });
  }

  animate() {
    // Damped smoothing for the dot and outer ring
    this.dotX += (this.mouseX - this.dotX) * 0.3;
    this.dotY += (this.mouseY - this.dotY) * 0.3;
    this.ringX += (this.mouseX - this.ringX) * 0.12;
    this.ringY += (this.mouseY - this.ringY) * 0.12;

    this.dot.style.left = `${this.dotX}px`;
    this.dot.style.top = `${this.dotY}px`;
    this.ring.style.left = `${this.ringX}px`;
    this.ring.style.top = `${this.ringY}px`;

    requestAnimationFrame(() => this.animate());
  }
}

// Instantiate Cursor
new CustomCursor();

/* =========================================================================
   2. MAGNETIC INTERACTION (BUTTONS & LOGO)
   ========================================================================= */
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Pull the element towards the mouse cursor
    gsap.to(el, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  el.addEventListener('mouseleave', () => {
    // Reset back to original position
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power3.out'
    });
  });
});

/* =========================================================================
   3. INTERACTIVE BIO-ENERGY MOLECULAR NETWORK (2D CANVAS)
   ========================================================================= */
class BioEnergyVisualizer {
  constructor() {
    this.canvas = document.getElementById('bio-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.molecules = [];
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.scrollOffset = 0;
    
    this.init();
    this.generateMolecules();
    this.animate();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
    });

    window.addEventListener('scroll', () => {
      this.scrollOffset = window.scrollY;
    });
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  generateMolecules() {
    const types = ['CH4', 'CO2', 'H2O', 'O2'];
    const count = 35; // Number of floating molecules
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * (window.innerHeight * 3);
      const vx = (Math.random() - 0.5) * 0.27; // Reduced drift speed by 40%
      const vy = (Math.random() - 0.5) * 0.27;
      const angle = Math.random() * Math.PI * 2;
      const angularVelocity = (Math.random() - 0.5) * 0.003; // Reduced rotation speed by 40%
      
      this.molecules.push({
        type,
        x,
        y,
        vx,
        vy,
        angle,
        angularVelocity,
        atoms: this.getAtomStructure(type)
      });
    }
  }

  getAtomStructure(type) {
    switch (type) {
      case 'CH4': // Methane: 1 Carbon (center), 4 Hydrogen (sides)
        return [
          { type: 'C', relX: 0, relY: 0, r: 9, color: 'rgba(56, 182, 107, 0.4)' }, // green
          { type: 'H', relX: -18, relY: 0, r: 6, color: 'rgba(149, 204, 221, 0.45)' }, // sky blue
          { type: 'H', relX: 18, relY: 0, r: 6, color: 'rgba(149, 204, 221, 0.45)' },
          { type: 'H', relX: 0, relY: -18, r: 6, color: 'rgba(149, 204, 221, 0.45)' },
          { type: 'H', relX: 0, relY: 18, r: 6, color: 'rgba(149, 204, 221, 0.45)' }
        ];
      case 'CO2': // Carbon Dioxide: 1 Carbon (center), 2 Oxygen (sides)
        return [
          { type: 'C', relX: 0, relY: 0, r: 9, color: 'rgba(41, 54, 129, 0.35)' }, // navy
          { type: 'O', relX: -16, relY: 0, r: 7.5, color: 'rgba(66, 116, 217, 0.4)' }, // royal blue
          { type: 'O', relX: 16, relY: 0, r: 7.5, color: 'rgba(66, 116, 217, 0.4)' }
        ];
      case 'H2O': // Water: 1 Oxygen (center), 2 Hydrogen (bent)
        return [
          { type: 'O', relX: 0, relY: 0, r: 7.5, color: 'rgba(66, 116, 217, 0.4)' },
          { type: 'H', relX: -13, relY: 12, r: 6, color: 'rgba(149, 204, 221, 0.45)' },
          { type: 'H', relX: 13, relY: 12, r: 6, color: 'rgba(149, 204, 221, 0.45)' }
        ];
      case 'O2': // Oxygen: 2 Oxygen atoms double bonded
        return [
          { type: 'O', relX: -9, relY: 0, r: 7.5, color: 'rgba(66, 116, 217, 0.4)' },
          { type: 'O', relX: 9, relY: 0, r: 7.5, color: 'rgba(66, 116, 217, 0.4)' }
        ];
      default:
        return [];
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const scrollParallax = 0.3; // Reduced parallax drift speed
    const attractionRadius = 110; // Reduced attraction radius by 40%
    const attractionForce = 0.025; // Reduced mouse attraction force by 50%

    let closestAtom = null;
    let minDistance = Infinity;

    this.molecules.forEach(mol => {
      mol.angle += mol.angularVelocity;
      mol.x += mol.vx;
      mol.y += mol.vy;

      const docHeight = Math.max(
        document.documentElement.scrollHeight, 
        window.innerHeight * 3
      );
      
      if (mol.x < -40) mol.x = window.innerWidth + 40;
      if (mol.x > window.innerWidth + 40) mol.x = -40;
      if (mol.y < -40) mol.y = docHeight + 40;
      if (mol.y > docHeight + 40) mol.y = -40;

      const drawY = mol.y - this.scrollOffset * scrollParallax;
      const dx = this.mouseX - mol.x;
      const dy = this.mouseY - drawY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < attractionRadius && this.mouseX > -100) {
        const force = (attractionRadius - dist) / attractionRadius;
        mol.x += (dx / dist) * force * attractionForce;
        mol.y += (dy / dist) * force * attractionForce;
      }

      const cos = Math.cos(mol.angle);
      const sin = Math.sin(mol.angle);
      
      const absAtoms = mol.atoms.map(atom => {
        const absX = mol.x + atom.relX * cos - atom.relY * sin;
        const absY = mol.y + atom.relX * sin + atom.relY * cos;
        return {
          ...atom,
          absX,
          absY,
          drawY: absY - this.scrollOffset * scrollParallax
        };
      });

      absAtoms.forEach(atom => {
        if (atom.type === 'C') {
          const adx = this.mouseX - atom.absX;
          const ady = this.mouseY - atom.drawY;
          const adist = Math.sqrt(adx * adx + ady * ady);
          if (adist < minDistance) {
            minDistance = adist;
            closestAtom = atom;
          }
        }
      });

      this.ctx.lineWidth = 1.5;
      this.ctx.strokeStyle = 'rgba(41, 54, 129, 0.1)';
      
      if (mol.type === 'CH4') {
        for (let idx = 1; idx <= 4; idx++) {
          this.ctx.beginPath();
          this.ctx.moveTo(absAtoms[0].absX, absAtoms[0].drawY);
          this.ctx.lineTo(absAtoms[idx].absX, absAtoms[idx].drawY);
          this.ctx.stroke();
        }
      } else if (mol.type === 'CO2') {
        const center = absAtoms[0];
        const sides = [absAtoms[1], absAtoms[2]];
        
        sides.forEach(side => {
          const bx = (side.absX - center.absX);
          const by = (side.drawY - center.drawY);
          const blen = Math.sqrt(bx * bx + by * by);
          const ox = -by / blen * 1.5;
          const oy = bx / blen * 1.5;

          this.ctx.beginPath();
          this.ctx.moveTo(center.absX + ox, center.drawY + oy);
          this.ctx.lineTo(side.absX + ox, side.drawY + oy);
          this.ctx.stroke();

          this.ctx.beginPath();
          this.ctx.moveTo(center.absX - ox, center.drawY - oy);
          this.ctx.lineTo(side.absX - ox, side.drawY - oy);
          this.ctx.stroke();
        });
      } else if (mol.type === 'H2O') {
        for (let idx = 1; idx <= 2; idx++) {
          this.ctx.beginPath();
          this.ctx.moveTo(absAtoms[0].absX, absAtoms[0].drawY);
          this.ctx.lineTo(absAtoms[idx].absX, absAtoms[idx].drawY);
          this.ctx.stroke();
        }
      } else if (mol.type === 'O2') {
        const atom1 = absAtoms[0];
        const atom2 = absAtoms[1];
        const bx = (atom2.absX - atom1.absX);
        const by = (atom2.drawY - atom1.drawY);
        const blen = Math.sqrt(bx * bx + by * by);
        const ox = -by / blen * 1.5;
        const oy = bx / blen * 1.5;

        this.ctx.beginPath();
        this.ctx.moveTo(atom1.absX + ox, atom1.drawY + oy);
        this.ctx.lineTo(atom2.absX + ox, atom2.drawY + oy);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(atom1.absX - ox, atom1.drawY - oy);
        this.ctx.lineTo(atom2.absX - ox, atom2.drawY - oy);
        this.ctx.stroke();
      }

      absAtoms.forEach(atom => {
        this.ctx.beginPath();
        this.ctx.arc(atom.absX, atom.drawY, atom.r, 0, Math.PI * 2);
        this.ctx.fillStyle = atom.color;
        this.ctx.fill();
        
        this.ctx.lineWidth = 0.75;
        this.ctx.strokeStyle = 'rgba(41, 54, 129, 0.25)';
        this.ctx.stroke();

        this.ctx.font = `600 ${atom.r * 1.1}px Inter`;
        this.ctx.fillStyle = 'rgba(41, 54, 129, 0.7)';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(atom.type, atom.absX, atom.drawY + 0.5);
      });
    });

    if (closestAtom && minDistance < 140 && this.mouseX > -100) {
      this.ctx.beginPath();
      this.ctx.setLineDash([3, 3]);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'rgba(56, 182, 107, 0.45)';
      this.ctx.moveTo(this.mouseX, this.mouseY);
      this.ctx.lineTo(closestAtom.absX, closestAtom.drawY);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      this.ctx.font = '500 8px Outfit';
      this.ctx.fillStyle = 'rgba(56, 182, 107, 0.7)';
      this.ctx.fillText('BIO-CNG C-NODE LINK', this.mouseX + 25, this.mouseY - 8);
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particles
// new BioEnergyVisualizer();


/* =========================================================================
   4. STICKY GLASS NAVBAR & MOBILE TOGGLE
   ========================================================================= */
const navbarWrapper = document.querySelector('.navbar-wrapper');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbarWrapper.classList.add('scrolled');
  } else {
    navbarWrapper.classList.remove('scrolled');
  }
});

// Mobile navbar drawer toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
if (mobileToggle && navMenu) {
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('open');
  });

  // Close when nav links clicked
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('open');
    });
  });
}

// Active Nav link spy on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
  let scrollY = window.pageYOffset;
  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
    const sectionId = current.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${sectionId}`) {
          item.classList.add('active');
        }
      });
    }
  });
});

/* =========================================================================
   5. 3D CARD TILT EFFECT (AWWWARDS STYLE)
   ========================================================================= */
const tiltPanels = document.querySelectorAll('.panel-3d');
tiltPanels.forEach(panel => {
  panel.addEventListener('mousemove', (e) => {
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation factors based on cursor position relative to card center
    const tiltX = ((y / rect.height) - 0.5) * -12; // max tilt 12 degrees
    const tiltY = ((x / rect.width) - 0.5) * 12;

    gsap.to(panel, {
      rotateX: tiltX,
      rotateY: tiltY,
      scale: 1.015,
      duration: 0.35,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  });

  panel.addEventListener('mouseleave', () => {
    gsap.to(panel, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    });
  });
});

/* =========================================================================
   6. MOUSE POSITION TRACKING GLOW ON GLASS CARDS
   ========================================================================= */
const glassCards = document.querySelectorAll('.glass-card');
glassCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

/* =========================================================================
   7. SCROLL PROGRESS INDICATOR
   ========================================================================= */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollVal = (scrollTop / docHeight) * 100;
  if (scrollBar) {
    scrollBar.style.width = `${scrollVal}%`;
  }
});

/* =========================================================================
   8. GSAP SCROLLTRIGGERS AND TEXT REVEALS
   ========================================================================= */

// Hero Text Reveal (Reduced motion offset for high-readability)
gsap.from('#hero .anim-title-reveal', {
  opacity: 0,
  y: 20,
  duration: 1.0,
  ease: 'power3.out',
  delay: 0.2
});

gsap.from('#hero .anim-fade-up', {
  opacity: 0,
  y: 15,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power3.out'
});

gsap.from('#hero .anim-scale-in', {
  opacity: 0,
  scale: 0.97,
  duration: 0.9,
  ease: 'power3.out',
  delay: 0.2
});

/* =========================================================================
   9. PREMIUM VERTICAL STORYTELLING TIMELINE (SCROLL-DRIVEN & SCRUBBED)
   ========================================================================= */
function initVerticalTimeline() {
  const container = document.querySelector('.vertical-timeline-container');
  const trackLine = document.querySelector('.v-timeline-progress');
  const particle = document.querySelector('.v-timeline-particle');
  const steps = document.querySelectorAll('.v-timeline-step');

  if (!container || !steps.length) return;

  // Create scrubbed master timeline for line drawing and particle traveling
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 70%',   // starts when top of timeline is 70% from top of screen
      end: 'bottom 70%',  // ends when bottom of timeline is 70% from top of screen
      scrub: 1.0,         // smooth scrub lag
      invalidateOnRefresh: true
    }
  });

  // Animate the progress line height and the particle travel
  masterTl.to(trackLine, {
    height: '100%',
    ease: 'none',
    duration: 1
  }, 0);

  masterTl.to(particle, {
    top: '100%',
    ease: 'none',
    duration: 1
  }, 0);

  // Set initial states for cards and nodes, then animate them inside the master scrub timeline
  steps.forEach((step, idx) => {
    const card = step.querySelector('.v-step-card');
    const node = step.querySelector('.v-step-node');

    const totalSteps = steps.length;
    const progressPercent = idx / (totalSteps - 1);
    
    // Position of the step along the line is progressPercent (0 to 1)
    // We start the entry animation slightly before progressPercent and end slightly after
    const animDuration = 0.15; // scrub timeline duration weight (0.7s equivalent)
    const animStart = Math.max(0, progressPercent - animDuration / 2);

    // Initial state: hidden, offset vertically/horizontally, and scaled down
    // Alternating start positions: odd cards slide from left, even cards slide from right
    let startX = idx % 2 === 0 ? -40 : 40; 
    
    gsap.set(card, { 
      opacity: 0, 
      x: startX,
      y: 35, 
      scale: 0.9 
    });
    gsap.set(node, { 
      scale: 0.7,
      backgroundColor: '#ffffff'
    });

    // Node scale up as particle approaches
    masterTl.to(node, {
      scale: 1.15,
      ease: 'back.out(2)',
      duration: animDuration * 0.4
    }, animStart);

    // Card entry: Fade in, translate X/Y, scale up (Spring-like ease)
    masterTl.to(card, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      ease: 'power2.out',
      duration: animDuration
    }, animStart);
  });

  // Register ScrollTriggers for class toggling (Active & Completed states)
  // This allows clean triggers based on the center of the viewport (top 50%)
  steps.forEach((step, idx) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          step.classList.add('active');
          step.classList.remove('completed');
        } else {
          step.classList.remove('active');
          // If we scroll past the step down, mark it as completed
          if (self.progress > 0) {
            step.classList.add('completed');
          } else {
            step.classList.remove('completed');
          }
        }
      }
    });
  });
}
initVerticalTimeline();

/* =========================================================================
   10. INTERACTIVE STATISTICS NUMBERS COUNT-UP
   ========================================================================= */
function initCountUp() {
  const counters = document.querySelectorAll('.count-up');
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
    
    if (counter.closest('#hero') || counter.closest('.stats-sec')) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          counter.textContent = obj.val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      });
    } else {
      counter.textContent = target.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  });
}
initCountUp();

/* =========================================================================
   10a-2. STATS SECTION BOXES STAGGERED REVEAL
   ========================================================================= */
function initStatsAnimation() {
  const statBoxes = document.querySelectorAll('.stats-sec .stat-box');
  if (!statBoxes.length) return;

  gsap.from(statBoxes, {
    scrollTrigger: {
      trigger: '.stats-sec',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 25,
    scale: 0.95,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  });
}
initStatsAnimation();

/* =========================================================================
   10b. ABOUT SECTION WAVE TEXT ANIMATION
   ========================================================================= */
function initAboutWaveText() {
  const container = document.querySelector('.about-right-text');
  if (!container) return;

  const subtitles = container.querySelectorAll('.section-subtitle');
  const titles = container.querySelectorAll('.section-title');
  const paragraphs = container.querySelectorAll('.section-paragraph');
  const bulletTexts = container.querySelectorAll('.bullet-text');

  // Utility function to split text content into spans
  function splitText(element, mode = 'chars') {
    const text = element.textContent.trim();
    element.innerHTML = '';
    
    if (mode === 'chars') {
      const chars = [...text];
      chars.forEach(char => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.className = 'wave-char';
        if (char === ' ') {
          span.innerHTML = '&nbsp;';
        } else {
          span.textContent = char;
        }
        element.appendChild(span);
      });
    } else if (mode === 'words') {
      const words = text.split(/\s+/);
      words.forEach((word, idx) => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.className = 'wave-word';
        span.textContent = word;
        element.appendChild(span);
        
        if (idx < words.length - 1) {
          const space = document.createElement('span');
          space.style.display = 'inline-block';
          space.innerHTML = '&nbsp;';
          element.appendChild(space);
        }
      });
    }
  }

  // Split target texts
  subtitles.forEach(el => splitText(el, 'chars'));
  titles.forEach(el => splitText(el, 'chars'));
  paragraphs.forEach(el => splitText(el, 'words'));
  bulletTexts.forEach(el => splitText(el, 'words'));

  // Define GSAP scroll reveals
  subtitles.forEach(subtitle => {
    gsap.to(subtitle.querySelectorAll('.wave-char'), {
      scrollTrigger: {
        trigger: subtitle,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      startAt: { y: 15 },
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.out'
    });
  });

  titles.forEach(title => {
    gsap.to(title.querySelectorAll('.wave-char'), {
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      startAt: { y: 20 },
      duration: 0.6,
      stagger: 0.015,
      ease: 'power3.out'
    });
  });

  paragraphs.forEach(paragraph => {
    gsap.to(paragraph.querySelectorAll('.wave-word'), {
      scrollTrigger: {
        trigger: paragraph,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      startAt: { y: 15 },
      duration: 0.6,
      stagger: 0.02,
      ease: 'power2.out'
    });
  });

  bulletTexts.forEach(bullet => {
    gsap.to(bullet.querySelectorAll('.wave-word'), {
      scrollTrigger: {
        trigger: bullet,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      startAt: { y: 10 },
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.out'
    });
  });
}
initAboutWaveText();

/* =========================================================================
   10c. SERVICES SECTION CARD SPREAD ANIMATION
   ========================================================================= */
function initServicesCardSpread() {
  const cards = document.querySelectorAll('.services-grid .service-card');
  if (!cards.length) return;

  cards.forEach((card, idx) => {
    let startX = 0;
    let startY = 0;

    // Col 1 (left) spreads from right to left (starts shifted right/center)
    if (idx % 3 === 0) {
      startX = -70;
    }
    // Col 2 (center) slides up
    else if (idx % 3 === 1) {
      startY = 40;
    }
    // Col 3 (right) spreads from left to right (starts shifted left/center)
    else if (idx % 3 === 2) {
      startX = 70;
    }

    gsap.from(card, {
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 82%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: startX,
      y: startY,
      duration: 1.0,
      ease: 'power3.out',
      delay: (idx % 3) * 0.15 + Math.floor(idx / 3) * 0.1
    });
  });
}
initServicesCardSpread();

/* =========================================================================
   11. CONTACT FORM HANDLERS & SUCCESS MODAL
   ========================================================================= */
const inquiryForm = document.getElementById('proposal-form');
const successOverlay = document.getElementById('form-success-overlay');
const resetFormBtn = document.getElementById('reset-form-btn');

if (inquiryForm && successOverlay) {
  inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Show transmitting state on button
    const submitBtn = inquiryForm.querySelector('.form-submit-btn');
    const origHtml = submitBtn.innerHTML;
    submitBtn.style.opacity = '0.7';
    submitBtn.innerHTML = '<span>Transmitting...</span>';

    setTimeout(() => {
      // Show success modal overlay with animated checkmark
      successOverlay.classList.add('show');
      inquiryForm.reset();
      
      // Reset submit button state
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = origHtml;
    }, 1500);
  });
}

if (resetFormBtn && successOverlay) {
  resetFormBtn.addEventListener('click', () => {
    successOverlay.classList.remove('show');
  });
}

/* =========================================================================
   12. NEWSLETTER FORM HANDLER
   ========================================================================= */
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    const origVal = input.value;
    input.value = "Subscription Successful!";
    input.disabled = true;
    input.style.color = "#38B66B";

    setTimeout(() => {
      input.value = "";
      input.disabled = false;
      input.style.color = "";
    }, 3000);
  });
}

/* =========================================================================
   12a. PROJECTS SHOWCASE STAGGERED REVEAL
   ========================================================================= */
function initProjectsReveal() {
  const flips = document.querySelectorAll('.project-card-flip');
  if (!flips.length) return;

  gsap.from(flips, {
    scrollTrigger: {
      trigger: '.projects-grid',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    scale: 0.96,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });
}
initProjectsReveal();

/* =========================================================================
   12b. TARGET SEGMENTS CARD SHUFFLE (INDUSTRIES DECK)
   ========================================================================= */
function initCardShuffle() {
  const deck = document.querySelector('.shuffle-deck');
  const cards = document.querySelectorAll('.shuffle-card');
  const btnNext = document.querySelector('.shuffle-btn.btn-next');
  const btnPrev = document.querySelector('.shuffle-btn.btn-prev');
  const indicators = document.querySelectorAll('.shuffle-indicators .indicator');
  
  if (!deck || !cards.length) return;
  
  let currentIndex = 0;
  const total = cards.length;
  let isAnimating = false;

  // Apply stack layouts based on the current active card
  function updateStack() {
    cards.forEach((card, idx) => {
      // Calculate position relative to the active card on top
      const relativeIndex = (idx - currentIndex + total) % total;
      
      if (relativeIndex === 0) {
        // Active card on top
        card.style.zIndex = '10';
        card.style.opacity = '1';
        card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
        card.style.pointerEvents = 'auto';
      } else if (relativeIndex === 1) {
        // Second card in stack
        card.style.zIndex = '9';
        card.style.opacity = '0.92';
        card.style.transform = 'translate3d(0, 16px, -30px) scale(0.95) rotate(1.5deg)';
        card.style.pointerEvents = 'none';
      } else if (relativeIndex === 2) {
        // Third card in stack
        card.style.zIndex = '8';
        card.style.opacity = '0.84';
        card.style.transform = 'translate3d(0, 32px, -60px) scale(0.90) rotate(-1.5deg)';
        card.style.pointerEvents = 'none';
      } else {
        // Hidden cards in background
        card.style.zIndex = '1';
        card.style.opacity = '0';
        card.style.transform = 'translate3d(0, 48px, -90px) scale(0.85) rotate(0deg)';
        card.style.pointerEvents = 'none';
      }
    });

    // Update dot indicators
    indicators.forEach((ind, idx) => {
      if (idx === currentIndex) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });
  }

  function nextCard() {
    if (isAnimating) return;
    isAnimating = true;
    
    const topCard = cards[currentIndex];
    
    // Slide top card out to the right and rotate it slightly
    gsap.to(topCard, {
      x: '120%',
      y: 20,
      rotation: 8,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => {
        // Advance current index
        currentIndex = (currentIndex + 1) % total;
        updateStack();
        
        // Let it slide back into the background stack smoothly
        isAnimating = false;
      }
    });
  }

  function prevCard() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Target the card that will become the new top card (the last card in relative order)
    const newTopIndex = (currentIndex - 1 + total) % total;
    const targetCard = cards[newTopIndex];
    
    // Set target card starting position off-screen left and invisible
    gsap.set(targetCard, {
      x: '-120%',
      y: 20,
      rotation: -8,
      opacity: 0,
      zIndex: 11 // bring to absolute front
    });
    
    // Slide the new top card into the center position
    gsap.to(targetCard, {
      x: '0%',
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        currentIndex = newTopIndex;
        updateStack();
        isAnimating = false;
      }
    });
  }

  // Click controls
  if (btnNext) btnNext.addEventListener('click', nextCard);
  if (btnPrev) btnPrev.addEventListener('click', prevCard);
  
  // Clicking the top card directly shuffles it
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      const relativeIndex = (idx - currentIndex + total) % total;
      if (relativeIndex === 0) {
        nextCard();
      }
    });
  });

  // Initialize
  updateStack();
}
initCardShuffle();

/* =========================================================================
   12c. SUSTAINABILITY ECO-LOOP ACCELERATION ANIMATION
   ========================================================================= */
function initSustainLoop() {
  const pillars = document.querySelectorAll('.sustain-pillar-item');
  const particles = document.querySelector('.hud-flow-particles');
  const nodes = document.querySelectorAll('.hud-node');
  
  if (!pillars.length || !particles) return;

  pillars.forEach((pillar, idx) => {
    pillar.addEventListener('mouseenter', () => {
      // Accelerate flow animation loop
      particles.style.animationDuration = '1.8s';
      particles.style.stroke = 'var(--color-secondary-blue)';
      
      // Determine which nodes to highlight based on pillar index
      if (idx === 0) {
        // Circular Economy -> Feedstock & Digestate
        document.querySelector('.node-feedstock')?.classList.add('active');
        document.querySelector('.node-digestate')?.classList.add('active');
      } else if (idx === 1) {
        // Carbon Reduction -> Biogas & CO2 Offsets
        document.querySelector('.node-biogas')?.classList.add('active');
        document.querySelector('.node-offsets')?.classList.add('active');
      } else if (idx === 2) {
        // Renewable Base Load -> Biogas & Core
        document.querySelector('.node-biogas')?.classList.add('active');
        document.querySelector('.hud-core')?.classList.add('active');
      }
    });

    pillar.addEventListener('mouseleave', () => {
      // Reset speed and color
      particles.style.animationDuration = '5s';
      particles.style.stroke = 'var(--color-eco-green)';
      
      // Remove all active states
      nodes.forEach(node => node.classList.remove('active'));
      document.querySelector('.hud-core')?.classList.remove('active');
    });
  });
}
initSustainLoop();

/* =========================================================================
   12d. SUSTAINABILITY TITLE TYPEWRITER ANIMATION
   ========================================================================= */
function initSustainTypewriter() {
  const title = document.querySelector('#sustainability .section-title');
  const subtitle = document.querySelector('#sustainability .section-subtitle');
  if (!title || !subtitle) return;

  const originalTitleText = title.textContent.trim();
  const originalSubtitleText = subtitle.textContent.trim();

  // Clear text initially to prepare for typewriter trigger
  title.textContent = '';
  subtitle.textContent = '';

  function typeText(element, text, speed = 40, callback) {
    let index = 0;
    element.textContent = '';
    element.classList.add('typing-active');
    
    const interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
        element.classList.remove('typing-active');
        if (callback) callback();
      }
    }, speed);
  }

  // Create ScrollTrigger to initiate typing when section enters viewport
  ScrollTrigger.create({
    trigger: '#sustainability',
    start: 'top 80%',
    onEnter: () => {
      // Type subtitle first, then initiate title typing
      typeText(subtitle, originalSubtitleText, 45, () => {
        setTimeout(() => {
          typeText(title, originalTitleText, 25);
        }, 150);
      });
    },
    once: true
  });
}
initSustainTypewriter();

/* =========================================================================
   12e. BLOG CARD CURTAIN REVEAL ANIMATION
   ========================================================================= */
function initBlogReveal() {
  const wrappers = document.querySelectorAll('.reveal-card-wrapper');
  if (!wrappers.length) return;

  wrappers.forEach((wrapper, idx) => {
    const overlay = wrapper.querySelector('.card-reveal-overlay');
    const card = wrapper.querySelector('.blog-card');

    if (!overlay || !card) return;

    // Set initial layout states
    gsap.set(card, { opacity: 0, y: 30 });
    gsap.set(overlay, { scaleY: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    // 1. Slide curtain overlay up
    tl.to(overlay, {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.85,
      ease: 'power3.inOut',
      delay: idx * 0.15 // Stagger columns sequence
    });

    // 2. Fade/slide content in slightly before curtain finishes
    tl.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: 'power2.out'
    }, '-=0.55');
  });
}
initBlogReveal();

/* =========================================================================
   12f. CTA SECTION WAVE TEXT ANIMATION
   ========================================================================= */
function initCtaWaveText() {
  const title = document.querySelector('.cta-title');
  const subtitle = document.querySelector('.cta-subtitle');
  if (!title || !subtitle) return;

  // Utility to split text into characters
  function splitToChars(element) {
    const text = element.textContent.trim();
    element.innerHTML = '';
    const chars = [...text];
    chars.forEach(char => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.className = 'cta-wave-char';
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
      }
      element.appendChild(span);
    });
  }

  // Split both title and subtitle into characters
  splitToChars(title);
  splitToChars(subtitle);

  // Animate on scroll trigger
  gsap.to(subtitle.querySelectorAll('.cta-wave-char'), {
    scrollTrigger: {
      trigger: '.cta-box',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 1,
    y: 0,
    startAt: { y: 15 },
    duration: 0.5,
    stagger: 0.015,
    ease: 'power2.out'
  });

  gsap.to(title.querySelectorAll('.cta-wave-char'), {
    scrollTrigger: {
      trigger: '.cta-box',
      start: 'top 82%',
      toggleActions: 'play none none none'
    },
    opacity: 1,
    y: 0,
    startAt: { y: 20 },
    duration: 0.6,
    stagger: 0.015,
    ease: 'power3.out'
  });
}
initCtaWaveText();

// Copyright Year dynamic loader
const footerYear = document.getElementById('footer-year');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}
