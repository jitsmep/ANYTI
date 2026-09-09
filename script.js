/* ═══════════════════════════════════════════════
   ZARA PIXEL — JavaScript
   Features:
   - Loader animation
   - Custom cursor
   - Parallax hero elements
   - Scroll reveal
   - Text scramble on hero
   - Counter animations
   - Testimonials slider
   - Nav scroll state
   - Tilt on card hover
   - Fun interactions
═══════════════════════════════════════════════ */

'use strict';

/* ─── LOADER ─── */
(function initLoader() {
  document.body.classList.add('loading');
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      document.body.classList.remove('loading');
      loader.addEventListener('animationend', () => {
        loader.style.display = 'none';
      }, { once: true });
      // Trigger hero reveals after load
      triggerHeroReveals();
    }, 1900);
  });
})();

/* ─── CUSTOM CURSOR ─── */
(function initCursor() {
  const ring  = document.getElementById('cursor-ring');
  const dot   = document.getElementById('cursor-dot');
  const label = document.getElementById('cursor-label');

  if (!ring || !dot) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let dotX = 0, dotY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // dot follows mouse tightly
    dotX += (mouseX - dotX) * 0.9;
    dotY += (mouseY - dotY) * 0.9;
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';

    // ring follows with lag
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    // label follows dot
    label.style.left = (dotX + 15) + 'px';
    label.style.top  = (dotY + 15) + 'px';

    raf = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor states
  document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const cursorType = el.dataset.cursor;
      if (cursorType === 'view') {
        document.body.classList.add('cursor-view');
        label.textContent = 'View →';
      } else {
        document.body.classList.add('cursor-hover');
        if (el.dataset.cursor) label.textContent = el.dataset.cursor;
      }
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover', 'cursor-view');
      label.textContent = '';
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = ''; ring.style.opacity = '';
  });
})();

/* ─── PARALLAX HERO ─── */
(function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  let mouseX = 0, mouseY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function updateParallax() {
    parallaxEls.forEach(el => {
      const strength = parseFloat(el.dataset.parallax) * 80;
      el.style.transform = `translate(${mouseX * strength}px, ${mouseY * strength}px)`;
    });
    rafId = requestAnimationFrame(updateParallax);
  }
  updateParallax();

  // Cleanup
  window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
})();

/* ─── SCROLL REVEAL ─── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
})();

function triggerHeroReveals() {
  const heroRevealEls = document.querySelectorAll('#hero .reveal-up, #hero .reveal-left');
  heroRevealEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), i * 100 + 100);
  });
}

/* ─── TEXT SCRAMBLE ─── */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.original = el.textContent;
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const length = Math.max(this.original.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from  = this.original[i] || '';
      const to    = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end   = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const { from, to, start, end } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!this.queue[i].char || Math.random() < 0.28) {
          this.queue[i].char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        output += `<span class="scramble-char" style="color:var(--coral);opacity:0.7">${this.queue[i].char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Apply scramble to hero title on hover
(function initScramble() {
  const hl2 = document.querySelector('.hl-2');
  if (!hl2) return;
  const scrambler = new TextScramble(hl2);
  const original = hl2.textContent;
  let isScrambled = false;

  hl2.addEventListener('mouseenter', () => {
    if (!isScrambled) {
      isScrambled = true;
      scrambler.setText('AI Developer').then(() => {
        setTimeout(() => {
          scrambler.setText(original).then(() => { isScrambled = false; });
        }, 800);
      });
    }
  });
})();

/* ─── COUNTER ANIMATION ─── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ─── NAV SCROLL STATE ─── */
(function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

/* ─── MOBILE NAV ─── */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  let open = false;
  hamburger.addEventListener('click', () => {
    open = !open;
    mobileNav.classList.toggle('open', open);
    // Animate spans
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  mobileNav.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      mobileNav.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => s.style.transform = '');
    });
  });
})();

/* ─── TESTIMONIALS SLIDER ─── */
(function initTestimonials() {
  const track  = document.getElementById('testimonials-track');
  const prev   = document.getElementById('testi-prev');
  const next   = document.getElementById('testi-next');
  const dotsWrap = document.getElementById('testi-dots');

  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  const isMobile = () => window.innerWidth < 768;
  const perSlide = () => isMobile() ? 1 : 2;
  let current = 0;
  const totalSlides = () => Math.ceil(cards.length / perSlide());

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const dot = document.createElement('div');
      dot.className = 'testi-dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, totalSlides() - 1));
    const cardWidth  = cards[0].offsetWidth;
    const gapSize    = 24; // 1.5rem gap
    const offset     = current * perSlide() * (cardWidth + gapSize);
    track.style.transform = `translateX(-${offset}px)`;

    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  next.addEventListener('click', () => goTo(current + 1));
  prev.addEventListener('click', () => goTo(current - 1));

  // Auto slide
  let autoSlide = setInterval(() => goTo((current + 1) % totalSlides()), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goTo((current + 1) % totalSlides()), 5000);
  });

  buildDots();
  goTo(0);

  window.addEventListener('resize', () => { buildDots(); goTo(0); });
})();

/* ─── CARD TILT ON HOVER ─── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.case-card, .stat-item, .testi-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── ROTATING BADGE ─── */
(function initBadge() {
  // Badge rotates via CSS, just ensure it's visible
  const badge = document.getElementById('rotating-badge');
  if (!badge) return;

  // Make badge interactive
  badge.style.cursor = 'none';
  badge.addEventListener('click', () => {
    badge.style.animation = 'spin-slow 1s linear infinite';
  });
})();

/* ─── HERO SCROLL PARALLAX ─── */
(function initScrollParallax() {
  const blobs = document.querySelectorAll('#hero .blob');
  const doodles = document.querySelectorAll('#hero .doodle');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    blobs.forEach((blob, i) => {
      const speed = 0.2 + i * 0.05;
      blob.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
})();

/* ─── SMOOTH ANCHOR SCROLL ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ─── SKILL TAG RANDOM COLORS ─── */
(function initSkillColors() {
  const colors = [
    { bg: 'var(--coral)', text: 'white' },
    { bg: 'var(--yellow)', text: 'var(--dark)' },
    { bg: 'var(--teal)', text: 'var(--dark)' },
    { bg: 'var(--purple)', text: 'white' },
  ];

  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      tag.style.background = color.bg;
      tag.style.color = color.text;
      tag.style.borderColor = color.bg;
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.background = '';
      tag.style.color = '';
      tag.style.borderColor = '';
    });
  });
})();

/* ─── BUTTON WIGGLE ON CLICK ─── */
(function initButtonWiggle() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.animation = 'none';
      void btn.offsetWidth; // reflow
      btn.style.animation = 'wiggle 0.3s ease';
    });
    btn.addEventListener('animationend', () => {
      btn.style.animation = '';
    });
  });
})();

/* ─── FUN FACTS EASTER EGG ─── */
(function initFunFacts() {
  const ff4 = document.getElementById('ff4');
  if (!ff4) return;
  let clicks = 0;
  const messages = [
    "🤖 Vibe Coder says: \"Prompting is the new programming.\"",
    "🚀 Vibe Coder says: \"Shipped 3 apps entirely in code!\"",
    "📈 Vibe Coder says: \"Finance + Code = Superpower.\"",
    "🎓 Vibe Coder says: \"Madras Christian College '27!\"",
  ];
  ff4.addEventListener('click', () => {
    const span = ff4.querySelector('span:last-child');
    span.textContent = messages[clicks % messages.length];
    clicks++;
  });
})();

/* ─── PAGE TITLE EASTER EGG ─── */
(function initTitleEasterEgg() {
  const original = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden
      ? 'come back... 👀'
      : original;
  });
})();

/* ─── CHATBOT WIDGET LOGIC ─── */
(function initChatbot() {
  const toggle = document.getElementById('chatbot-toggle');
  const panel = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chat-close-btn');
  const openIcon = document.getElementById('chat-icon-open');
  const closeIcon = document.getElementById('chat-icon-close');
  const messagesWrap = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  if (!toggle || !panel) return;

  let isOpen = false;
  let conversation = [
    { role: 'assistant', content: "Hi there! 👋 I'm Joshuva's portfolio assistant. Ask me anything about his skills, projects, or background!" }
  ];

  function setChatOpen(open) {
    isOpen = open;
    panel.classList.toggle('hidden', !open);
    openIcon.classList.toggle('hidden', open);
    closeIcon.classList.toggle('hidden', !open);
    if (open) {
      setTimeout(() => input.focus(), 200);
    }
  }

  toggle.addEventListener('click', () => setChatOpen(!isOpen));
  closeBtn.addEventListener('click', () => setChatOpen(false));

  function addMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${role}`;
    msg.textContent = text;
    messagesWrap.appendChild(msg);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMessage('user', text);
    conversation.push({ role: 'user', content: text });

    // Show typing indicator
    const typing = document.createElement('div');
    typing.className = 'chat-msg assistant typing';
    typing.textContent = 'Thinking...';
    messagesWrap.appendChild(typing);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;

    try {
      // Try Next.js Groq API route first
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation }),
      });

      typing.remove();

      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || "Sorry, I couldn't get a response right now.";
        addMessage('assistant', reply);
        conversation.push({ role: 'assistant', content: reply });
      } else {
        throw new Error('API route unavailable');
      }
    } catch (err) {
      typing.remove();
      // Smart static fallback response
      const fallbackReply = generateFallbackReply(text);
      addMessage('assistant', fallbackReply);
      conversation.push({ role: 'assistant', content: fallbackReply });
    }
  }

  function generateFallbackReply(query) {
    const q = query.toLowerCase();

    if (q.includes('project') || q.includes('work') || q.includes('built')) {
      return "Joshuva has built 3 key projects: 1) Trading Journal (P/L analytics & performance insights), 2) Finance Tracker (income, budget & savings trends), and 3) Portfolio Builder (real-time portfolio creation). Check out the Projects section or his GitHub @jitsmep!";
    }
    if (q.includes('trading')) {
      return "The Trading Journal helps traders record, organize, and review trades in one place with automated P/L calculations and trading performance analytics.";
    }
    if (q.includes('finance')) {
      return "Joshuva's Finance Tracker app tracks income, expenses, and transaction logs with automated savings calculations and spending trend insights.";
    }
    if (q.includes('skill') || q.includes('python') || q.includes('tool') || q.includes('tech')) {
      return "Joshuva specializes in Python, Vibe Coding, AI-Assisted Development, and Prompt Engineering. He works with VS Code, Antigravity IDE, and MS Excel, and is currently learning Full-stack AI Web Dev & APIs.";
    }
    if (q.includes('education') || q.includes('college') || q.includes('mcc') || q.includes('degree')) {
      return "Joshuva is pursuing a Bachelor of Science in Computer Science at Madras Christian College (Graduating 2027).";
    }
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach')) {
      return "You can reach Joshuva directly via email at pjoshuva31@gmail.com or on GitHub @jitsmep!";
    }
    return "Joshuva P is a Vibe Coder & AI Developer studying Computer Science at Madras Christian College ('27). Feel free to ask about his projects, skills, or email him at pjoshuva31@gmail.com!";
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  });
})();

console.log(
  '%c✦ Hey there! %c\n\nYou found Joshuva P\'s portfolio console.\n\nWant to collaborate? → pjoshuva31@gmail.com | GitHub: https://github.com/jitsmep',
  'font-size:18px; font-weight:bold; color:#FF4D6D;',
  'font-size:13px; color:#7B2FBE;'
);

