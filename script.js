"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const WHATSAPP_NUMBER = "233551472190";
  const DEFAULT_WHATSAPP_MESSAGE =
    "Hello Adventures of Life, I want help planning a trip in Ghana or nearby West African countries.";
  const DESKTOP_MENU_BREAKPOINT = 1024;
  const STICKY_OFFSET = 96;
  const FORM_ENDPOINT = "https://formspree.io/f/YOUR_ID";

  const hoverQuery = window.matchMedia("(hover: hover)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const travelStyleAccents = {
    summit: "accent-gold",
    coast: "accent-lagoon",
    canopy: "accent-canopy",
    north: "accent-clay",
  };

  const travelStyles = {
    summit: {
      title: "Volta Highlands",
      summary: "Mist, ridge roads, lake air.",
      audience: "Slow groups / visual seekers",
      includes: "Amedzofe / Wli / Ho",
      visual: "Highland board",
      imgSrc: "adventurepics_preview/IMG_1576.jpg",
      imgAlt: "Hiker on a green hillside trail.",
      highlights: ["Morning ridge frame", "Waterfall arrival reel"],
      style: "summit",
    },
    coast: {
      title: "Black Star Coast",
      summary: "Fort walls, city nights, open water.",
      audience: "Social groups / couples / diaspora guests",
      includes: "Accra / Cape Coast / Ada",
      visual: "Coast board",
      imgSrc: "adventurepics_preview/IMG_1905.jpg",
      imgAlt: "Golden light over a sandy beach.",
      highlights: ["Sunset drive clip", "Fort courtyard portrait"],
      style: "coast",
    },
    canopy: {
      title: "Forest Line",
      summary: "Trails, bridges, falls, quiet rooms.",
      audience: "Nature-first groups / creators",
      includes: "Kakum / village edge / waterfall trail",
      visual: "Canopy board",
      imgSrc: "adventurepics_preview/IMG_6873.jpg",
      imgAlt: "Travel group at a forest trail entrance.",
      highlights: ["Bridge walk reel", "Rainforest texture still"],
      style: "canopy",
    },
    north: {
      title: "Dust Run",
      summary: "Savannah light, wide silence, long roads.",
      audience: "Private groups / wildlife-led itineraries",
      includes: "Tamale / Mole / Larabanga",
      visual: "North board",
      imgSrc: "adventurepics_preview/IMG_1596.jpg",
      imgAlt: "High lookout over open landscape.",
      highlights: ["Golden-hour drive", "Savannah horizon poster"],
      style: "north",
    },
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, factor) => start + (end - start) * factor;
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

  // Shared icon sprite.
  const ensureIconSprite = () => {
    if (!document.getElementById("aol-icon-sprite")) {
      console.warn("Missing inline social icon sprite.");
    }
  };

  // Shared helpers.
  const buildWhatsAppLink = (message) => {
    const encodedMessage = encodeURIComponent((message || DEFAULT_WHATSAPP_MESSAGE).trim());
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
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

  // WhatsApp link hydration.
  const setupWhatsAppLinks = () => {
    const links = document.querySelectorAll("[data-whatsapp-link]");
    const noteTargets = document.querySelectorAll("[data-whatsapp-note]");

    links.forEach((link) => {
      const message = link.dataset.message || DEFAULT_WHATSAPP_MESSAGE;
      link.setAttribute("href", buildWhatsAppLink(message));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer");
    });

    noteTargets.forEach((note) => {
      note.textContent = "WhatsApp is ready for live trip inquiries.";
    });
  };

  // Mobile navigation.
  const setupMobileMenu = () => {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-menu-panel]");

    if (!toggle || !panel) {
      return;
    }

    const closeMenu = () => {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < DESKTOP_MENU_BREAKPOINT) {
          closeMenu();
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= DESKTOP_MENU_BREAKPOINT) {
        closeMenu();
      }
    });
  };

  // Intersection-based reveal system.
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

  // Active navigation state.
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

  // Subtle scroll parallax for hero photos.
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

  // Atlas mouse tilt via CSS variables.
  const setupAtlasTilt = () => {
    const stage = document.querySelector(".atlas-stage");

    if (!stage || !hoverQuery.matches || prefersReducedMotion()) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId = 0;
    let rafPending = false;

    const renderTilt = () => {
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);

      stage.style.setProperty("--parallax-x", currentX.toFixed(2));
      stage.style.setProperty("--parallax-y", currentY.toFixed(2));

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        frameId = window.requestAnimationFrame(renderTilt);
      } else {
        frameId = 0;
      }
    };

    const queueTilt = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(renderTilt);
      }
    };

    stage.addEventListener("mousemove", (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(() => {
          const rect = stage.getBoundingClientRect();

          if (rect.width && rect.height) {
            const nx = (event.clientX - rect.left) / rect.width - 0.5;
            const ny = (event.clientY - rect.top) / rect.height - 0.5;

            targetX = clamp(nx * 16, -16, 16);
            targetY = clamp(ny * 12, -12, 12);
            queueTilt();
          }

          rafPending = false;
        });
      }
    });

    stage.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
      queueTilt();
    });
  };

  // Travel style selector on journeys page.
  const setupTravelStyleSelector = () => {
    const tabs = Array.from(document.querySelectorAll(".selector-tab"));
    const title = document.getElementById("selector-title");
    const summary = document.getElementById("selector-summary");
    const audience = document.getElementById("selector-audience");
    const includes = document.getElementById("selector-includes");
    const visualLabel = document.getElementById("selector-visual-label");
    const highlights = document.getElementById("selector-highlights");
    const preview = document.querySelector(".selector-preview");
    const visualFrame = preview?.querySelector(".selector-visual");
    const visualPhoto = visualFrame?.querySelector(".visual-photo");

    if (!tabs.length || !title || !summary || !includes || !visualLabel || !highlights || !preview || !visualPhoto) {
      return;
    }

    const setActiveTab = (key) => {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.style === key;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
      });
    };

    const setPreviewAccent = (style) => {
      Object.values(travelStyleAccents).forEach((accentClass) => {
        visualFrame.classList.remove(accentClass);
      });

      const accentClass = travelStyleAccents[style];

      if (accentClass) {
        visualFrame.classList.add(accentClass);
      }
    };

    const animatePreview = () => {
      if (typeof preview.animate !== "function" || prefersReducedMotion()) {
        return;
      }

      preview.animate(
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 240,
          easing: "cubic-bezier(0.2, 0.65, 0.2, 1)",
        }
      );
    };

    const renderStyle = (key, { animate = false } = {}) => {
      const style = travelStyles[key];

      if (!style) {
        return;
      }

      title.textContent = style.title;
      summary.textContent = style.summary;
      includes.textContent = style.includes;
      visualLabel.textContent = style.visual;
      highlights.innerHTML = style.highlights.map((item) => `<li>${item}</li>`).join("");
      visualPhoto.src = style.imgSrc;
      visualPhoto.alt = style.imgAlt;

      if (audience) {
        audience.textContent = style.audience;
      }

      document.body.dataset.routeStyle = style.style;
      setActiveTab(key);
      setPreviewAccent(style.style);
      refreshVisualImage(visualPhoto);

      if (animate) {
        animatePreview();
      }
    };

    const params = new URLSearchParams(window.location.search);
    const requestedStyle = params.get("style");
    const initialKey = Object.prototype.hasOwnProperty.call(travelStyles, requestedStyle) ? requestedStyle : "summit";

    renderStyle(initialKey);

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.style;

        if (!key || !Object.prototype.hasOwnProperty.call(travelStyles, key)) {
          return;
        }

        renderStyle(key, { animate: true });
      });
    });
  };

  // Formspree contact form.
  const setupContactForm = () => {
    const form = document.getElementById("contact-form");
    const response = document.getElementById("form-response");

    if (!form || !response) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const btn = form.querySelector('button[type="submit"]');

      if (!btn) {
        return;
      }

      btn.disabled = true;
      btn.textContent = "Sending...";
      response.textContent = "";
      response.removeAttribute("style");

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });

        if (!res.ok) {
          throw new Error("Failed");
        }

        response.textContent = "? Sent! We will be in touch soon.";
        response.style.color = "var(--canopy)";
        form.reset();
      } catch (error) {
        const fallbackLink = buildWhatsAppLink(
          "Hello Adventures of Life, the contact form did not send and I want to continue planning on WhatsApp."
        );

        response.innerHTML = `Something went wrong. <a href="${fallbackLink}" target="_blank" rel="noreferrer">Try WhatsApp</a>`;
        response.style.color = "var(--clay)";

        if (typeof form.animate === "function") {
          form.animate(
            [
              { transform: "translateX(0)" },
              { transform: "translateX(-6px)" },
              { transform: "translateX(6px)" },
              { transform: "translateX(-4px)" },
              { transform: "translateX(4px)" },
              { transform: "translateX(0)" },
            ],
            {
              duration: 360,
              easing: "ease",
            }
          );
        }
      } finally {
        btn.disabled = false;
        btn.textContent = "Send inquiry";
      }
    });
  };

  // Blur-up lazy images.
  const setupLazyImages = () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((image) => {
      refreshVisualImage(image);
    });
  };

  // Footer year.
  const setCurrentYear = () => {
    document.querySelectorAll("[data-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  };

  // Smooth in-page anchor scrolling.
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
  setupTravelStyleSelector();
  setupContactForm();
  setCurrentYear();
  highlightCurrentPage();
  setupRevealAnimations();
  setupHeroParallax();
  setupAtlasTilt();
  setupLazyImages();
  setupSmoothAnchorScroll();

  if (pageLoader) {
    window.requestAnimationFrame(() => {
      pageLoader.classList.add("is-hidden");
    });
  }
});

