const DESKTOP_MENU_BREAKPOINT = 1024;

const travelStyles = {
  summit: {
    title: 'Volta Highlands',
    summary: 'Mist, ridge roads, lake air.',
    audience: 'Slow groups / visual seekers',
    includes: 'Amedzofe / Wli / Ho',
    visual: 'Highland board',
    highlights: ['Morning ridge frame', 'Waterfall arrival reel'],
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
    visual: 'Coast board',
    highlights: ['Sunset drive clip', 'Fort courtyard portrait'],
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
    visual: 'Canopy board',
    highlights: ['Bridge walk reel', 'Rainforest texture still'],
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
    visual: 'North board',
    highlights: ['Golden-hour drive', 'Savannah horizon poster'],
    image: {
      src: 'adventurepics_preview/IMG_1596.jpg',
      alt: 'High lookout view over a town and open landscape.',
      position: 'center 60%',
      kicker: 'North',
    },
  },
};

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

setupMobileMenu();
setupTravelStyleSelector();
setupAtlasParallax();
setupContactForm();
setCurrentYear();
highlightCurrentPage();
setupRevealAnimations();