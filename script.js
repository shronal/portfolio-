
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- inject required styles ---------- */
  const style = document.createElement('style');
  style.textContent = `
    .project-card, .cert-card {
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
      will-change: transform;
      transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease;
    }
    .hover-glow {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
      background: radial-gradient(
        360px circle at var(--gx, 50%) var(--gy, 50%),
        rgba(255, 239, 179, 0.16),
        transparent 60%
      );
      transition: opacity 0.4s ease;
      z-index: 1;
    }
    .project-card:hover .hover-glow,
    .cert-card:hover .hover-glow {
      opacity: 1;
    }
    .project-card:hover, .cert-card:hover {
      box-shadow: 0 18px 40px rgba(1, 30, 27, 0.25);
    }

    .magnetic {
      display: inline-block;
      transition: transform 0.25s cubic-bezier(.22,1,.36,1);
      will-change: transform;
    }

    .link-sweep {
      position: relative;
      background-image: linear-gradient(currentColor, currentColor);
      background-position: 0 100%;
      background-repeat: no-repeat;
      background-size: 0% 1.5px;
      transition: background-size 0.35s cubic-bezier(.22,1,.36,1);
    }
    .link-sweep:hover { background-size: 100% 1.5px; }
  `;
  document.head.appendChild(style);

  /* ---------- 1 & 2. Spotlight glow + 3D tilt on cards ---------- */
  const cards = document.querySelectorAll('.project-card, .cert-card');

  cards.forEach(card => {
    // ensure a glow layer exists
    let glow = card.querySelector(':scope > .hover-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.className = 'hover-glow';
      card.appendChild(glow);
    }

    if (reduceMotion) return; // keep glow, skip motion/tilt

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // spotlight position
      card.style.setProperty('--gx', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--gy', `${(y / rect.height) * 100}%`);

      // tilt amount (max ~6deg)
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * 6;
      const rotateX = -((y - midY) / midY) * 6;

      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* ---------- 4. Animated underline sweep on inline text links ---------- */
  const sweepLinks = document.querySelectorAll('nav a, .contact-link, .footer-link');
  sweepLinks.forEach(el => el.classList.add('link-sweep'));
})();




  // ── THEME TOGGLE
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    if (localStorage.getItem('theme') === 'dark') {
      html.classList.add('dark-mode');
      toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    toggle.addEventListener('click', () => {
      html.classList.toggle('dark-mode');
      const dark = html.classList.contains('dark-mode');
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      toggle.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // ── SMOOTH SCROLL with flash transition
    const overlay = document.getElementById('page-overlay');
    function smoothScrollTo(target) {
      overlay.classList.add('flash');
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => overlay.classList.remove('flash'), 300);
      }, 150);
    }

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        smoothScrollTo(target);
      });
    });

    // ── ACTIVE NAV highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`nav a[href="#${e.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => sectionObserver.observe(s));

    // ── SCROLL REVEAL
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ── TIMELINE REVEAL
    const tlObs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 120);
          tlObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.timeline-item').forEach(el => tlObs.observe(el));

    // ── CERT MODAL
    function openCert(type, title, issuer, date, iconClass, desc, imgSrc) {
      const imgWrap = document.getElementById('modal-img-wrap');
      const imgEl   = document.getElementById('modal-cert-img');
      const pdfEl   = document.getElementById('modal-cert-pdf');

      document.getElementById('modal-icon').className = iconClass;
      document.getElementById('modal-type').textContent = type;
      document.getElementById('modal-title').textContent = title;
      document.getElementById('modal-issuer').textContent = issuer;
      document.getElementById('modal-date').textContent = date;
      document.getElementById('modal-desc').textContent = desc;

      const isPdf = imgSrc && imgSrc.toLowerCase().endsWith('.pdf');

      if (imgSrc && isPdf) {
        imgEl.style.display = 'none';
        imgEl.removeAttribute('src');
        pdfEl.style.display = 'block';
        pdfEl.src = imgSrc;
        pdfEl.dataset.full = imgSrc;
        imgWrap.classList.add('visible');
      } else if (imgSrc) {
        pdfEl.style.display = 'none';
        pdfEl.removeAttribute('src');
        imgEl.style.display = 'block';
        imgEl.onerror = () => { imgWrap.classList.remove('visible'); };
        imgEl.onload  = () => { imgWrap.classList.add('visible'); };
        imgEl.src = imgSrc;
        imgEl.dataset.full = imgSrc;
      } else {
        imgWrap.classList.remove('visible');
        imgEl.removeAttribute('src');
        pdfEl.removeAttribute('src');
      }

      document.getElementById('certModal').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeCert() {
      document.getElementById('certModal').classList.remove('open');
      document.body.style.overflow = '';
    }

    // ── IMAGE LIGHTBOX (click a certificate or project image to view full size)
    function openLightbox(elId) {
      const src = document.getElementById(elId || 'modal-cert-img').dataset.full;
      if (!src) return;
      document.getElementById('lightbox-img').src = src;
      document.getElementById('certLightbox').classList.add('open');
    }
    function closeLightbox() {
      document.getElementById('certLightbox').classList.remove('open');
    }

    // ── PROJECT MODAL (video demo or screenshot gallery)
    let galleryImages = [];
    let galleryIndex = 0;

    function openProject(type, title, desc, tech, github, media) {
      const wrap        = document.getElementById('proj-media-wrap');
      const videoEl      = document.getElementById('proj-video');
      const imgEl        = document.getElementById('proj-image');
      const galleryCtrls = document.getElementById('proj-gallery-controls');

      document.getElementById('proj-title').textContent = title;
      document.getElementById('proj-desc').textContent = desc;
      document.getElementById('proj-tech').innerHTML = tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
      document.getElementById('proj-github').href = github;

      // reset media state
      videoEl.pause();
      videoEl.removeAttribute('src');
      videoEl.style.display = 'none';
      imgEl.style.display = 'none';
      galleryCtrls.style.display = 'none';
      wrap.classList.remove('visible');

      if (type === 'video') {
        videoEl.src = media;
        videoEl.style.display = 'block';
        wrap.classList.add('visible');
      } else if (type === 'gallery') {
        galleryImages = media;
        galleryIndex = 0;
        imgEl.style.display = 'block';
        updateGalleryImage();
        if (galleryImages.length > 1) galleryCtrls.style.display = 'block';
        wrap.classList.add('visible');
      }

      document.getElementById('projModal').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function updateGalleryImage() {
      const imgEl = document.getElementById('proj-image');
      imgEl.src = galleryImages[galleryIndex];
      imgEl.dataset.full = galleryImages[galleryIndex];
      document.getElementById('proj-gallery-counter').textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
    }

    function galleryNav(dir, e) {
      if (e) e.stopPropagation();
      if (!galleryImages.length) return;
      galleryIndex = (galleryIndex + dir + galleryImages.length) % galleryImages.length;
      updateGalleryImage();
    }

    function closeProject() {
      document.getElementById('projModal').classList.remove('open');
      document.getElementById('proj-video').pause();
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeLightbox(); closeCert(); closeProject(); }
      if (document.getElementById('projModal').classList.contains('open')) {
        if (e.key === 'ArrowRight') galleryNav(1);
        if (e.key === 'ArrowLeft') galleryNav(-1);
      }
    });

    // ── PREVENT RIGHT-CLICK & DEV TOOLS SHORTCUTS ──
    document.addEventListener('contextmenu', e => e.preventDefault());

    document.addEventListener('keydown', e => {
      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+I / J / C (DevTools & Console & Inspect)
      if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
      }
      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
    });