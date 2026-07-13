"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const WHATSAPP_NUMBER = "233551472190";
  const DEFAULT_WHATSAPP_MESSAGE =
    "Hello Adventures of Life, I want help planning a trip in Ghana or nearby West African countries.";
  const DESKTOP_MENU_BREAKPOINT = 1024;
  const STICKY_OFFSET = 96;
  const NEXT_TRIP_POPUP_DELAY_MS = 1800;
  const NEXT_TRIP_POPUP_DISMISS_KEY = "aol-next-trip-popup-dismissed-at";
  const NEXT_TRIP_POPUP_DISMISS_MS = 24 * 60 * 60 * 1000;
  const hoverQuery = window.matchMedia("(hover: hover)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const prefersReducedMotion = () => reducedMotionQuery.matches;
  const isModifiedClick = (event) =>
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey;
  const easeInOutCubic = (progress) =>
    progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const ensureIconSprite = () => {
    if (!document.getElementById("aol-icon-sprite")) {
      console.warn("Missing inline social icon sprite.");
    }
  };

  const buildWhatsAppLink = (message) => {
    const encodedMessage = encodeURIComponent((message || DEFAULT_WHATSAPP_MESSAGE).trim());
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  };

  const setWhatsAppHref = (link, message) => {
    if (!link) {
      return;
    }

    const resolvedMessage = message || link.dataset.message || DEFAULT_WHATSAPP_MESSAGE;
    link.dataset.message = resolvedMessage;
    link.setAttribute("href", buildWhatsAppLink(resolvedMessage));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
  };

  const findHashTarget = (hash) => {
    const rawId = hash.replace(/^#/, "");

    if (!rawId) {
      return null;
    }

    const decodedId = decodeURIComponent(rawId);
    const byId = document.getElementById(decodedId);

    if (byId) {
      return byId;
    }

    try {
      return document.querySelector(hash);
    } catch (error) {
      return null;
    }
  };

  const scrollToY = (targetY, behavior = "smooth") => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const finalY = clamp(targetY, 0, maxScroll);

    if (behavior === "auto" || prefersReducedMotion()) {
      window.scrollTo(0, finalY);
      return;
    }

    const startY = window.scrollY;
    const deltaY = finalY - startY;
    const duration = 620;
    let startTime = 0;

    const step = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = clamp((timestamp - startTime) / duration, 0, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + deltaY * eased);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const scrollToHash = (hash, behavior = "smooth") => {
    const target = findHashTarget(hash);

    if (!target) {
      return;
    }

    const targetY = target.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET;
    scrollToY(targetY, behavior);
  };

  const refreshVisualImage = (image, { immediate = false } = {}) => {
    if (!image) {
      return;
    }

    const isJournalImage = Boolean(image.closest(".jy-journal-wrap"));

    if (isJournalImage) {
      image.style.filter = "none";
      image.style.transform = "none";
      image.style.opacity = "1";
      image.style.transition = "none";
      image.style.removeProperty("--photo-filter");
      image.style.removeProperty("--photo-scale");
      image.style.removeProperty("--photo-opacity");
      return;
    }

    const isVisualPhoto = image.classList.contains("visual-photo");

    if (isVisualPhoto) {
      image.style.setProperty("--photo-filter", "blur(8px)");
      image.style.setProperty("--photo-scale", "1.04");
      image.style.setProperty("--photo-opacity", "0.6");
    } else {
      image.style.filter = "blur(8px)";
      image.style.transform = "scale(1.04)";
      image.style.opacity = "0.6";
      image.style.transition = "filter 400ms ease, transform 400ms ease, opacity 400ms ease";
    }

    const reveal = () => {
      if (isVisualPhoto) {
        image.style.setProperty("--photo-filter", "none");
        image.style.setProperty("--photo-scale", "1.01");
        image.style.setProperty("--photo-opacity", "1");
        return;
      }

      image.style.filter = "none";
      image.style.transform = "scale(1)";
      image.style.opacity = "1";
    };

    if (immediate || (image.complete && image.naturalWidth > 0)) {
      window.requestAnimationFrame(reveal);
      return;
    }

    image.addEventListener("load", reveal, { once: true });
    image.addEventListener("error", reveal, { once: true });
  };

  const setupWhatsAppLinks = () => {
    const links = document.querySelectorAll("[data-whatsapp-link]");
    const noteTargets = document.querySelectorAll("[data-whatsapp-note]");

    links.forEach((link) => {
      setWhatsAppHref(link, link.dataset.message || DEFAULT_WHATSAPP_MESSAGE);
    });

    noteTargets.forEach((note) => {
      note.textContent = "WhatsApp is ready for live trip inquiries.";
    });
  };

  const setupMobileMenu = () => {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-menu-panel]");
    const header = toggle ? toggle.closest(".site-header") : null;
    const firstMenuLink = panel ? panel.querySelector(".site-menu-nav a") : null;

    if (!toggle || !panel) {
      return;
    }

    const syncMenuState = (isOpen, shouldFocus = true) => {
      panel.classList.toggle("is-open", isOpen);
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      panel.setAttribute("aria-hidden", String(!isOpen));
      document.body.classList.toggle("nav-open", isOpen);

      if (!shouldFocus) {
        return;
      }

      if (isOpen) {
        window.requestAnimationFrame(() => {
          if (firstMenuLink instanceof HTMLElement) {
            firstMenuLink.focus({ preventScroll: true });
          }
        });
      } else {
        toggle.focus({ preventScroll: true });
      }
    };

    const closeMenu = () => {
      syncMenuState(false);
    };

    const isMenuOpen = () => panel.classList.contains("is-open");

    syncMenuState(false, false);

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      syncMenuState(!isMenuOpen());
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < DESKTOP_MENU_BREAKPOINT) {
          closeMenu();
        }
      });
    });

    panel.addEventListener("click", (event) => {
      if (event.target === panel) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!isMenuOpen() || window.innerWidth >= DESKTOP_MENU_BREAKPOINT) {
        return;
      }

      if (header && !header.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isMenuOpen()) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= DESKTOP_MENU_BREAKPOINT) {
        closeMenu();
      }
    });
  };

  const setupRevealAnimations = () => {
    const items = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");

    if (!items.length) {
      return;
    }

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    items.forEach((item) => observer.observe(item));
  };

  const highlightCurrentPage = () => {
    const currentPage = document.body.dataset.page;

    if (!currentPage) {
      return;
    }

    document.querySelectorAll("[data-nav-page]").forEach((link) => {
      const isCurrent = link.dataset.navPage === currentPage;
      link.classList.toggle("is-active", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      }
    });
  };

  const setupHeroParallax = () => {
    if (!hoverQuery.matches || prefersReducedMotion()) {
      return;
    }

    const heroPhotos = document.querySelectorAll(".hero .visual-placeholder .visual-photo");

    if (!heroPhotos.length) {
      return;
    }

    let rafPending = false;

    const requestTick = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(() => {
          const offset = clamp(window.scrollY * 0.25, -40, 40);
          heroPhotos.forEach((photo) => photo.style.setProperty("--photo-shift", `${offset}px`));
          rafPending = false;
        });
      }
    };

    requestTick();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
  };

  const setupLazyImages = () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((image) => {
      refreshVisualImage(image);
    });
  };

  const setCurrentYear = () => {
    document
      .querySelectorAll('[data-year]')
      .forEach(el => el.textContent = new Date().getFullYear());
  };

  const setupSmoothAnchorScroll = () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]');

      if (!link || isModifiedClick(event)) {
        return;
      }

      const hash = link.getAttribute("href");

      if (!hash || hash === "#") {
        return;
      }

      const target = findHashTarget(hash);

      if (!target) {
        return;
      }

      event.preventDefault();
      scrollToHash(hash, "smooth");

      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
    });

    if (window.location.hash) {
      window.setTimeout(() => {
        scrollToHash(window.location.hash, "auto");
      }, 40);
    }
  };

  ensureIconSprite();
  const pageLoader = document.getElementById("page-loader");
  setupWhatsAppLinks();
  setupMobileMenu();
  setCurrentYear();
  highlightCurrentPage();
  setupRevealAnimations();
  setupHeroParallax();
  setupLazyImages();
  setupSmoothAnchorScroll();

  if (pageLoader) {
    window.requestAnimationFrame(() => {
      pageLoader.classList.add("is-hidden");
    });
  }
});



