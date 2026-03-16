const WHATSAPP_NUMBER = '233000000000';
const DEFAULT_WHATSAPP_MESSAGE = 'Hello Adventures of Life, I want help planning a trip in Ghana or nearby West African countries.';
const DESKTOP_MENU_BREAKPOINT = 1024;

const travelStyles = {
  summit: {
    title: 'Volta Highlands',
    summary: 'Mist, ridge roads, lake air.',
    audience: 'Slow groups / visual seekers',
    includes: 'Amedzofe / Wli / Ho',
    visual: 'Highland board',
    highlights: ['Morning ridge frame', 'Waterfall arrival reel'],
  },
  coast: {
    title: 'Black Star Coast',
    summary: 'Fort walls, city nights, open water.',
    audience: 'Social groups / couples / diaspora guests',
    includes: 'Accra / Cape Coast / Ada',
    visual: 'Coast board',
    highlights: ['Sunset drive clip', 'Fort courtyard portrait'],
  },
  canopy: {
    title: 'Forest Line',
    summary: 'Trails, bridges, falls, quiet rooms.',
    audience: 'Nature-first groups / creators',
    includes: 'Kakum / village edge / waterfall trail',
    visual: 'Canopy board',
    highlights: ['Bridge walk reel', 'Rainforest texture still'],
  },
  north: {
    title: 'Dust Run',
    summary: 'Savannah light, wide silence, long roads.',
    audience: 'Private groups / wildlife-led itineraries',
    includes: 'Tamale / Mole / Larabanga',
    visual: 'North board',
    highlights: ['Golden-hour drive', 'Savannah horizon poster'],
  },
};

function buildWhatsAppLink(message) {
  const encodedMessage = encodeURIComponent(message || DEFAULT_WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

function setupWhatsAppLinks() {
  const links = document.querySelectorAll('[data-whatsapp-link]');
  const noteTargets = document.querySelectorAll('[data-whatsapp-note]');
  const usingPlaceholder = WHATSAPP_NUMBER === '233000000000';

  links.forEach((link) => {
    const message = link.dataset.message || DEFAULT_WHATSAPP_MESSAGE;
    link.setAttribute('href', buildWhatsAppLink(message));
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer');
  });

  noteTargets.forEach((note) => {
    note.textContent = usingPlaceholder
      ? 'WhatsApp still uses a placeholder number. Replace it in script.js before launch.'
      : 'WhatsApp is ready for live trip inquiries.';
  });
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
  const tabs = document.querySelectorAll('.selector-tab');
  const title = document.getElementById('selector-title');
  const summary = document.getElementById('selector-summary');
  const audience = document.getElementById('selector-audience');
  const includes = document.getElementById('selector-includes');
  const visual = document.getElementById('selector-visual-label');
  const highlights = document.getElementById('selector-highlights');

  if (!tabs.length || !title || !summary || !includes || !visual || !highlights) {
    return;
  }

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
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((button) => {
        button.classList.remove('is-active');
        button.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      render(tab.dataset.style);
    });
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

setupWhatsAppLinks();
setupMobileMenu();
setupTravelStyleSelector();
setupContactForm();
setCurrentYear();
highlightCurrentPage();
setupRevealAnimations();

