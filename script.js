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
    ada: "accent-lagoon",
  };

  const travelStyles = {
    summit: {
      title: "Hike Adakluto",
      typeLabel: "Lake ridge hike",
      summary: "Peak views, ridge steps, Lake Volta air.",
      audience: "First-timers · ridge hikers · crew energy",
      includes: "Adakluto ridge / Lake Volta overlook / return climb",
      visual: "Peak arrival",
      imgSrc: "assets/trips/adakluto-hero.webp",
      imgAlt: "Adventures of Life crew on the Hike Adakluto route.",
      highlights: ["Trail start", "Ridgeline climb", "Lake Volta stop", "Group frame"],
      storyTitle: "The day moves from trail dust to open water.",
      storySummary:
        "Adakluto starts with the climb, opens into Lake Volta views, and ends with the kind of group photos people actually keep.",
      gallery: [
        {
          src: "assets/trips/adakluto-group.webp",
          alt: "Group photo from the Hike Adakluto trip.",
          kicker: "Crew frame",
          title: "The climb settles once the group finds its rhythm.",
          accent: "accent-gold",
          position: "center 52%",
        },
        {
          src: "assets/responsive/adakluto-ridge-close-1440.webp",
          alt: "Ridgeline close frame on the Hike Adakluto route.",
          kicker: "Ridgeline",
          title: "The route tightens before the whole view opens.",
          accent: "accent-gold",
          position: "center 38%",
        },
        {
          src: "assets/trips/lake-volta.webp",
          alt: "Lake Volta stop on Hike Adakluto.",
          kicker: "Lake Volta",
          title: "Water and sky take over the frame.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
        {
          src: "assets/responsive/adakluto-summit-group-1440.webp",
          alt: "Summit group frame from Hike Adakluto.",
          kicker: "Summit crowd",
          title: "The route ends with a frame nobody wants to rush.",
          accent: "accent-canopy",
          position: "center 42%",
        },
      ],
      style: "summit",
    },
    coast: {
      title: "Keta 3 Days",
      typeLabel: "Beach camp weekend",
      summary: "Tent village, sea air, sunrise water, late-night energy.",
      audience: "Weekend crews · social travellers · beach people",
      includes: "Keta / Fort Prinzenstein / beach camp",
      visual: "Beach portrait",
      imgSrc: "assets/trips/keta-portrait.jpg",
      imgAlt: "Keta beach route preview portrait from the trip.",
      highlights: ["Beach camp", "Fort stop", "Sunrise water", "Full crew energy"],
      storyTitle: "Keta feels like a weekend that keeps widening.",
      storySummary:
        "Camp first, then sea air, then the late-night stretch, then the morning after. The strongest Keta trips never feel rushed.",
      gallery: [
        {
          src: "assets/trips/keta-portrait.jpg",
          alt: "Beach portrait from the Keta trip.",
          kicker: "Beach portrait",
          title: "The route carries people as much as scenery.",
          accent: "accent-gold",
          position: "center 46%",
        },
        {
          src: "assets/trips/fort-pr.webp",
          alt: "Fort stop during the Keta trip.",
          kicker: "Fort stop",
          title: "The fort gives the route its historical weight.",
          accent: "accent-lagoon",
          position: "center 52%",
        },
        {
          src: "assets/trips/keta-camp.webp",
          alt: "Beach camp setup on the Keta trip.",
          kicker: "Camp setup",
          title: "Then the route settles into the shoreline.",
          accent: "accent-canopy",
          position: "center 52%",
        },
      ],
      style: "coast",
    },
    canopy: {
      title: "Asenema Waterfalls",
      typeLabel: "Forest waterfall day",
      summary: "Forest entry, cold water payoff, all-crew momentum.",
      audience: "Nature seekers · waterfall crews · soft adventure",
      includes: "Asenema entrance / waterfall trail / forest route",
      visual: "Falls arrival",
      imgSrc: "assets/trips/asenema-waterfalls.webp",
      imgAlt: "Adventures of Life group at Asenema Waterfalls.",
      highlights: ["Entrance climb", "Waterfall arrival", "Group swim", "Forest photos"],
      storyTitle: "The forest keeps building tension until the water hits.",
      storySummary:
        "Asenema is less about distance and more about payoff. Every part of the route is moving toward that first cold-water moment.",
      gallery: [
        {
          src: "assets/trips/asenema-portrait.webp",
          alt: "Traveler seated at the rocks at Asenema Waterfalls.",
          kicker: "Quiet beat",
          title: "Even the still moments look cinematic.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
      ],
      style: "canopy",
    },
    north: {
      title: "Akwamu Gorge",
      typeLabel: "Gorge climb day",
      summary: "Steep climb, ridge payoff, photos that travel far.",
      audience: "Fit groups · challenge seekers · visual climbers",
      includes: "Akwamu Gorge / summit trail / canopy stop",
      visual: "Ridge payoff",
      imgSrc: "assets/trips/akwamu-gorge.webp",
      imgAlt: "Traveler at Akwamu Gorge viewpoint.",
      highlights: ["Station meet-up", "Gorge climb", "Top-view payoff", "Canopy stop"],
      storyTitle: "Akwamu is the hard route with the right reward.",
      storySummary:
        "It starts with movement, gets steeper fast, then opens into one of those lookout points that resets the whole group.",
      gallery: [
        {
          src: "assets/responsive/akwamu-climb-portrait-1440.webp",
          alt: "Climb portrait on the Akwamu Gorge route.",
          kicker: "On the climb",
          title: "The route starts working before the payoff shows up.",
          accent: "accent-clay",
          position: "center 40%",
        },
        {
          src: "assets/responsive/akwamu-gorge-team-1440.webp",
          alt: "Crew frame on the Akwamu Gorge route.",
          kicker: "Crew frame",
          title: "By the middle of the climb, everyone is already locked in.",
          accent: "accent-gold",
          position: "center 38%",
        },
        {
          src: "assets/responsive/akwamu-ridge-group-1440.webp",
          alt: "Ridge group frame during the Akwamu Gorge climb.",
          kicker: "Ridge frame",
          title: "The higher the group gets, the looser the energy becomes.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
      ],
      style: "north",
    },
    ada: {
      title: "Ada / Nkyinkyim Museum",
      typeLabel: "Museum / lagoon day",
      summary: "Sculpture grounds, lagoon movement, quiet portrait frames.",
      audience: "Culture seekers · soft adventure · camera-first crews",
      includes: "Nkyinkyim Museum / Ada / lagoon crossing",
      visual: "Museum arrival",
      imgSrc: "assets/responsive/ada-nkyinkyim-sculpture-field-1440.webp",
      imgAlt: "Ada and Nkyinkyim Museum route preview.",
      highlights: ["Museum grounds", "Boat crossing", "Portrait frames", "Lagoon stop"],
      storyTitle: "Ada shifts from monument scale to quieter water-side moments.",
      storySummary:
        "The route starts in the sculpture grounds, loosens up on the move, and ends with the kind of portrait and lagoon frames that make the day feel longer than it was.",
      gallery: [
        {
          src: "assets/responsive/ada-nkyinkyim-walk-1440.webp",
          alt: "Walking frame from Ada and Nkyinkyim Museum.",
          kicker: "Arrival walk",
          title: "The first frames are already part of the story.",
          accent: "accent-gold",
          position: "center 42%",
        },
        {
          src: "assets/responsive/ada-nkyinkyim-close-portrait-1440.webp",
          alt: "Close portrait from Ada and Nkyinkyim Museum.",
          kicker: "Portrait beat",
          title: "The route leaves room for quieter pictures too.",
          accent: "accent-lagoon",
          position: "center 36%",
        },
        {
          src: "assets/responsive/ada-nkyinkyim-portrait-close-1440.webp",
          alt: "Single portrait from Ada and Nkyinkyim Museum.",
          kicker: "Closer frame",
          title: "Not every memory from the day has to be wide.",
          accent: "accent-clay",
          position: "center 38%",
        },
        {
          src: "assets/responsive/ada-nkyinkyim-lagoon-portrait-1440.webp",
          alt: "Lagoon-side portrait from Ada and Nkyinkyim Museum.",
          kicker: "Lagoon side",
          title: "By the end, the route turns almost still.",
          accent: "accent-canopy",
          position: "center 48%",
        },
      ],
      style: "ada",
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
    const type = document.getElementById("selector-type");
    const title = document.getElementById("selector-title");
    const summary = document.getElementById("selector-summary");
    const audience = document.getElementById("selector-audience");
    const includes = document.getElementById("selector-includes");
    const visualLabel = document.getElementById("selector-visual-label");
    const highlights = document.getElementById("selector-highlights");
    const preview = document.querySelector(".selector-preview");
    const visualFrame = preview?.querySelector(".selector-visual");
    const visualPhoto = visualFrame?.querySelector(".visual-photo");
    const storyBlock = document.querySelector(".journey-story");
    const storyTitle = document.getElementById("selector-story-title");
    const storySummary = document.getElementById("selector-story-summary");
    const storyGallery = document.getElementById("selector-gallery");

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
      if (prefersReducedMotion()) {
        return;
      }

      [preview, storyBlock].forEach((element) => {
        if (!element || typeof element.animate !== "function") {
          return;
        }

        element.animate(
          [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 240,
            easing: "cubic-bezier(0.2, 0.65, 0.2, 1)",
          }
        );
      });
    };

    const renderGallery = (style) => {
      if (!storyGallery || !Array.isArray(style.gallery)) {
        return;
      }

      storyGallery.replaceChildren();

      style.gallery.forEach((item, index) => {
        const article = document.createElement("article");
        article.className = `journey-gallery-card${index === 0 ? " is-featured" : ""}`;

        const frame = document.createElement("div");
        frame.className = `visual-placeholder has-photo journey-gallery-visual ${item.accent || travelStyleAccents[style.style] || ""}`.trim();
        frame.style.setProperty("--photo-position", item.position || "center");

        const image = document.createElement("img");
        image.className = "visual-photo";
        image.src = item.src;
        image.alt = item.alt;
        image.loading = "lazy";
        image.decoding = "async";

        const copy = document.createElement("div");
        copy.className = "visual-copy";

        const kicker = document.createElement("span");
        kicker.className = "visual-kicker";
        kicker.textContent = item.kicker;

        const strong = document.createElement("strong");
        strong.textContent = item.title;

        copy.append(kicker, strong);
        frame.append(image, copy);
        article.append(frame);
        storyGallery.append(article);
        refreshVisualImage(image);
      });
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

      if (type) {
        type.textContent = style.typeLabel || key;
      }

      if (audience) {
        audience.textContent = style.audience;
      }

      if (storyTitle) {
        storyTitle.textContent = style.storyTitle || "";
      }

      if (storySummary) {
        storySummary.textContent = style.storySummary || "";
      }

      document.body.dataset.routeStyle = style.style;
      setActiveTab(key);
      setPreviewAccent(style.style);
      refreshVisualImage(visualPhoto);
      renderGallery(style);

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


