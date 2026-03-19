const DESKTOP_MENU_BREAKPOINT = 1024;

const travelStyles = {
  summit: {
    title: 'Volta Highlands',
    summary: 'Mist, ridge roads, lake air.',
    audience: 'Slow groups / visual seekers',
    includes: 'Amedzofe / Wli / Ho',
    visual: 'Highland glow',
    highlights: ['Morning ridge', 'Waterfall arrival'],
    image: {
      src: 'adventurepics_preview/IMG_0157.jpg',
      alt: 'Hiker leading the way on a mountain path with a river view behind her.',
      position: '64% center',
      kicker: 'Summit',
    },
  },
  coast: {
    title: 'Black Star Coast',
    summary: 'Fort walls, city nights, open water.',
    audience: 'Social groups / couples / diaspora guests',
    includes: 'Accra / Cape Coast / Ada',
    visual: 'Coast shimmer',
    highlights: ['Sunset drive', 'Fort courtyard'],
    image: {
      src: 'adventurepics_preview/IMG_1905.jpg',
      alt: 'Golden light over a sandy beach and calm sea.',
      position: 'center 52%',
      kicker: 'Coast',
    },
  },
  canopy: {
    title: 'Forest Line',
    summary: 'Trails, bridges, falls, quiet rooms.',
    audience: 'Nature-first groups / creators',
    includes: 'Kakum / village edge / waterfall trail',
    visual: 'Canopy hush',
    highlights: ['Bridge walk', 'Rainforest texture'],
    image: {
      src: 'adventurepics_preview/IMG_6880.jpg',
      alt: 'Travel group posing at Hike Adakluto.',
      position: 'center 38%',
      kicker: 'Canopy',
    },
  },
  north: {
    title: 'Dust Run',
    summary: 'Savannah light, wide silence, long roads.',
    audience: 'Private groups / wildlife-led itineraries',
    includes: 'Tamale / Mole / Larabanga',
    visual: 'North hush',
    highlights: ['Golden-hour drive', 'Savannah horizon'],
    image: {
      src: 'adventurepics_preview/IMG_1596.jpg',
      alt: 'High lookout view over a town and open landscape.',
      position: 'center 60%',
      kicker: 'North',
    },
  },
};
function ensureIconSprite() {
  if (document.getElementById("aol-icon-sprite")) {
    return;
  }

  const sprite = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style="position:absolute;width:0;height:0;overflow:hidden"
      aria-hidden="true"
      focusable="false"
      id="aol-icon-sprite"
    >
      <defs>
        <radialGradient id="ig-glow" cx="30%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#FEDA77" />
          <stop offset="35%" stop-color="#F58529" />
          <stop offset="60%" stop-color="#DD2A7B" />
          <stop offset="80%" stop-color="#8134AF" />
          <stop offset="100%" stop-color="#515BD4" />
        </radialGradient>
      </defs>

      <symbol id="icon-whatsapp" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="#25D366" />
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967c-.273-.099-.471-.148-.67.15c-.197.297-.767.966-.94 1.164c-.173.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.018-.458.13-.606c.134-.133.298-.347.446-.52s.198-.298.298-.497c.099-.198.05-.371-.025-.52s-.669-1.612-.916-2.207c-.242-.579-.487-.5-.669-.51a13 13 0 0 0-.57-.01c-.198 0-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074s2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625c.712.227 1.36.195 1.871.118c.571-.085 1.758-.719 2.006-1.413s.248-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214l-3.741.982l.998-3.648l-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884c2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413" fill="#ffffff" />
      </symbol>

      <symbol id="icon-tiktok" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="#0B0B0F" />
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93c-.01 2.92.01 5.84-.02 8.75c-.08 1.4-.54 2.79-1.35 3.94c-1.31 1.92-3.58 3.17-5.91 3.21c-1.43.08-2.86-.31-4.08-1.03c-2.02-1.19-3.44-3.37-3.65-5.71c-.02-.5-.03-1-.01-1.49c.18-1.9 1.12-3.72 2.58-4.96c1.66-1.44 3.98-2.13 6.15-1.72c.02 1.48-.04 2.96-.04 4.44c-.99-.32-2.15-.23-3.02.37c-.63.41-1.11 1.04-1.36 1.75c-.21.51-.15 1.07-.14 1.61c.24 1.64 1.82 3.02 3.5 2.87c1.12-.01 2.19-.66 2.77-1.61c.19-.33.4-.67.41-1.06c.1-1.79.06-3.57.07-5.36c.01-4.03-.01-8.05.02-12.07" fill="#25F4EE" transform="translate(-0.6 0.35)" />
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93c-.01 2.92.01 5.84-.02 8.75c-.08 1.4-.54 2.79-1.35 3.94c-1.31 1.92-3.58 3.17-5.91 3.21c-1.43.08-2.86-.31-4.08-1.03c-2.02-1.19-3.44-3.37-3.65-5.71c-.02-.5-.03-1-.01-1.49c.18-1.9 1.12-3.72 2.58-4.96c1.66-1.44 3.98-2.13 6.15-1.72c.02 1.48-.04 2.96-.04 4.44c-.99-.32-2.15-.23-3.02.37c-.63.41-1.11 1.04-1.36 1.75c-.21.51-.15 1.07-.14 1.61c.24 1.64 1.82 3.02 3.5 2.87c1.12-.01 2.19-.66 2.77-1.61c.19-.33.4-.67.41-1.06c.1-1.79.06-3.57.07-5.36c.01-4.03-.01-8.05.02-12.07" fill="#FE2C55" transform="translate(0.6 -0.35)" />
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93c-.01 2.92.01 5.84-.02 8.75c-.08 1.4-.54 2.79-1.35 3.94c-1.31 1.92-3.58 3.17-5.91 3.21c-1.43.08-2.86-.31-4.08-1.03c-2.02-1.19-3.44-3.37-3.65-5.71c-.02-.5-.03-1-.01-1.49c.18-1.9 1.12-3.72 2.58-4.96c1.66-1.44 3.98-2.13 6.15-1.72c.02 1.48-.04 2.96-.04 4.44c-.99-.32-2.15-.23-3.02.37c-.63.41-1.11 1.04-1.36 1.75c-.21.51-.15 1.07-.14 1.61c.24 1.64 1.82 3.02 3.5 2.87c1.12-.01 2.19-.66 2.77-1.61c.19-.33.4-.67.41-1.06c.1-1.79.06-3.57.07-5.36c.01-4.03-.01-8.05.02-12.07" fill="#ffffff" />
      </symbol>

      <symbol id="icon-instagram" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="url(#ig-glow)" />
        <path d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388a5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947s.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911c.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552c1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388a5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912c.056-1.28.07-1.69.063-4.948c-.006-3.258-.02-3.667-.081-4.947c-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123a5.9 5.9 0 0 0-2.128-1.38c-.764-.294-1.636-.496-2.914-.55C15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895a3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228c-.06-1.264-.072-1.644-.08-4.848c-.006-3.204.006-3.583.061-4.848c.05-1.169.246-1.805.408-2.228c.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417c1.265-.06 1.644-.072 4.848-.08c3.203-.006 3.583.006 4.85.062c1.168.05 1.804.244 2.227.408c.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227c.06 1.265.074 1.645.08 4.848c.005 3.203-.006 3.583-.061 4.848c-.051 1.17-.245 1.805-.408 2.23c-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418c-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442a1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024a6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16A4 4 0 0 1 8 12.008" fill="#ffffff" />
      </symbol>

      <symbol id="icon-snapchat" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="#FFFC00" />
        <path
          d="M12.206.793c.99 0 4.347.276 5.93 3.821c.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51c.075.045.203.09.401.09c.3-.016.659-.12 1.033-.301a1 1 0 0 1 .464-.104c.182 0 .359.029.509.09c.45.149.734.479.734.838q.022.674-1.213 1.168c-.089.029-.209.075-.344.119c-.45.135-1.139.36-1.333.81c-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014c.255.044.435.27.42.509a.6.6 0 0 1-.045.225c-.24.569-1.273.988-3.146 1.271c-.059.091-.12.375-.164.57c-.029.179-.074.36-.134.553c-.076.271-.27.405-.555.405h-.03a3 3 0 0 1-.538-.074a6 6 0 0 0-1.273-.135c-.3 0-.599.015-.913.074c-.6.104-1.123.464-1.723.884c-.853.599-1.826 1.288-3.294 1.288c-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288c-.599-.42-1.107-.779-1.707-.884a7 7 0 0 0-.928-.074c-.54 0-.958.089-1.272.149a3 3 0 0 1-.54.074c-.374 0-.523-.224-.583-.42c-.061-.192-.09-.389-.135-.567c-.046-.181-.105-.494-.166-.57c-1.918-.222-2.95-.642-3.189-1.226a.6.6 0 0 1-.055-.225a.496.496 0 0 1 .42-.509c3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869c-.195-.434-.884-.658-1.332-.809a2 2 0 0 1-.346-.119c-1.107-.435-1.257-.93-1.197-1.273c.09-.479.674-.793 1.168-.793c.146 0 .27.029.383.074c.42.194.789.3 1.104.3c.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"
          fill="#ffffff"
          stroke="#0B0B0F"
          stroke-width="0.7"
          stroke-linejoin="round"
        />
      </symbol>
    </svg>
  `;

  document.body.insertAdjacentHTML("afterbegin", sprite);
}
function setupMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-menu-panel]');

  if (!toggle || !panel) {
    return;
  }

  const closeMenu = () => {
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < DESKTOP_MENU_BREAKPOINT) {
        closeMenu();
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= DESKTOP_MENU_BREAKPOINT) {
      closeMenu();
    }
  });
}

function setupTravelStyleSelector() {
  const tabs = Array.from(document.querySelectorAll('.selector-tab'));
  const title = document.getElementById('selector-title');
  const summary = document.getElementById('selector-summary');
  const audience = document.getElementById('selector-audience');
  const includes = document.getElementById('selector-includes');
  const visual = document.getElementById('selector-visual-label');
  const highlights = document.getElementById('selector-highlights');
  const visualFrame = document.querySelector('.selector-visual');
  const visualPhoto = visualFrame ? visualFrame.querySelector('img') : null;
  const visualKicker = visualFrame ? visualFrame.querySelector('.visual-kicker') : null;

  if (!tabs.length || !title || !summary || !includes || !visual || !highlights) {
    return;
  }

  const setActiveTab = (key) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.style === key;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  };

  const getInitialKey = () => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('style');

    if (requested && Object.prototype.hasOwnProperty.call(travelStyles, requested)) {
      return requested;
    }

    return tabs[0]?.dataset?.style || 'summit';
  };

  const render = (key) => {
    const style = travelStyles[key];

    if (!style) {
      return;
    }

    title.textContent = style.title;
    summary.textContent = style.summary;
    if (audience) {
      audience.textContent = style.audience;
    }
    includes.textContent = style.includes;
    visual.textContent = style.visual;
    highlights.innerHTML = style.highlights.map((item) => `<li>${item}</li>`).join('');

    document.body.dataset.routeStyle = key;

    if (style.image && visualFrame) {
      if (style.image.position) {
        visualFrame.style.setProperty('--photo-position', style.image.position);
      }

      if (visualKicker && style.image.kicker) {
        visualKicker.textContent = style.image.kicker;
      }

      if (visualPhoto && style.image.src) {
        visualPhoto.src = style.image.src;
        visualPhoto.alt = style.image.alt || '';
      }
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.style;
      if (!key) {
        return;
      }

      setActiveTab(key);
      render(key);
    });
  });

  const initialKey = getInitialKey();
  setActiveTab(initialKey);
  render(initialKey);
}

function setupAtlasParallax() {
  const stage = document.querySelector('.atlas-stage');

  if (!stage) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsHover = window.matchMedia('(hover: hover)').matches;

  if (prefersReducedMotion || !supportsHover) {
    return;
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const update = (event) => {
    const rect = stage.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return;
    }

    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;

    const px = clamp(nx * 14, -14, 14);
    const py = clamp(ny * 10, -10, 10);

    stage.style.setProperty('--parallax-x', px.toFixed(2));
    stage.style.setProperty('--parallax-y', py.toFixed(2));
  };

  stage.addEventListener('pointermove', update);
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--parallax-x', '0');
    stage.style.setProperty('--parallax-y', '0');
  });
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const response = document.getElementById('form-response');

  if (!form || !response) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.toString().trim() || 'traveler';

    response.textContent = `Request received, ${name}. We can shape the route from here.`;
    form.reset();
  });
}

function setCurrentYear() {
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function highlightCurrentPage() {
  const currentPage = document.body.dataset.page;

  document.querySelectorAll('[data-nav-page]').forEach((link) => {
    if (link.dataset.navPage === currentPage) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function setupRevealAnimations() {
  const items = document.querySelectorAll('.reveal');

  if (!items.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  items.forEach((item) => observer.observe(item));
}

ensureIconSprite();
setupMobileMenu();
setupTravelStyleSelector();
setupAtlasParallax();
setupContactForm();
setCurrentYear();
highlightCurrentPage();
setupRevealAnimations();