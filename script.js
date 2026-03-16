const WHATSAPP_NUMBER = '233000000000';
const DEFAULT_WHATSAPP_MESSAGE = 'Hello Adventures of Life, I would love help planning a trip in Ghana or nearby West African countries.';

const travelStyles = {
  homecoming: {
    title: 'Heritage Homecoming',
    summary:
      'A reflective route for diaspora travelers and culture seekers with Ghana at the center and optional Benin extension.',
    audience: 'Diaspora travelers, family groups, history lovers',
    includes: 'Accra, Cape Coast, Elmina, host-led dinners, storytelling moments',
    highlights: [
      'Gentle pacing for emotional depth and real connection',
      'Local hosts who carry context, warmth, and care',
      'Beautiful space for memory making, reflection, and reunion',
    ],
  },
  leisure: {
    title: 'Coastal Escape',
    summary:
      'A polished sun-and-culture route that blends stylish stays, seaside energy, and easy social moments across Ghana and Togo.',
    audience: 'Couples, friend groups, first-time West Africa travelers',
    includes: 'Accra, Ada, Cape Coast, Lome, beach clubs, design-led stays',
    highlights: [
      'Perfect for relaxed luxury with personality',
      'Balances iconic stops with genuine local flavor',
      'An easy entry point for global travelers new to the region',
    ],
  },
  creative: {
    title: 'Creator Circle',
    summary:
      'A culture-rich route for photographers, filmmakers, founders, and brands who want content, connection, and collaboration.',
    audience: 'Creators, tastemakers, media communities, brand teams',
    includes: 'Art districts, studios, hosted conversations, scenic shoot moments',
    highlights: [
      'Built for collaboration and beautiful documentation',
      'Connects guests to living creative scenes across the route',
      'Great for repeat group launches and social storytelling',
    ],
  },
  retreat: {
    title: 'Team Retreat',
    summary:
      'A flagship group journey for communities, remote teams, wellness founders, and organizers who want structure with soul.',
    audience: 'Remote teams, masterminds, wellness groups, private communities',
    includes: 'Private hosting, facilitation support, work sessions, cultural experiences',
    highlights: [
      'Combines bonding time with breathing room',
      'Easy to customize with private villas and retreat touchpoints',
      'Strong option for annual community or company trips',
    ],
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
      ? 'WhatsApp is wired with a placeholder Ghana number for now. Replace it in script.js when you are ready to go live.'
      : 'WhatsApp is ready for direct trip inquiries.';
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
      if (window.innerWidth <= 880) {
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
    if (window.innerWidth > 880) {
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
  const highlights = document.getElementById('selector-highlights');

  if (!tabs.length || !title || !summary || !audience || !includes || !highlights) {
    return;
  }

  const render = (key) => {
    const style = travelStyles[key];

    if (!style) {
      return;
    }

    title.textContent = style.title;
    summary.textContent = style.summary;
    audience.textContent = style.audience;
    includes.textContent = style.includes;
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

    response.textContent = `Thanks, ${name}. Your inquiry is captured in the page flow and ready to connect to email, Airtable, or a booking CRM next.`;
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
      threshold: 0.14,
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
