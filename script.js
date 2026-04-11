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
    togo: "accent-sand",
  };

  const travelStyles = {
    summit: {
      title: "Hike Adakluto",
      typeLabel: "Adakluto trail day",
      summary: "Trail start, steep climb, and the group photo at the top.",
      audience: "First-time hikers · small groups · people who want a real climb",
      includes: "Trail start / stair sections / summit marker",
      visual: "Trail start",
      imgSrc: "assets/trips/adakluto-trail-preview.jpg",
      imgAlt: "Adventures of Life crew on the Hike Adakluto route.",
      highlights: ["Trail start", "Steep stair section", "Peak marker", "Group summit"],
      storyTitle: "From the first step to the summit photo.",
      storySummary:
        "Adakluto is a proper hiking day. You start easy, hit the steeper sections, reach the marker, take the group photo, and come down feeling like you earned it.",
      gallery: [
        {
          src: "assets/trips/adakluto-beginning-preview.jpg",
          alt: "Early trail start on the Hike Adakluto route.",
          kicker: "Trail start",
          title: "The day starts gently before the real climb kicks in.",
          accent: "accent-gold",
          position: "center 46%",
        },
        {
          src: "assets/trips/adakluto-trail-preview.jpg",
          alt: "Trail frame from Hike Adakluto.",
          kicker: "Trail section",
          title: "This is where the route starts asking a bit more from you.",
          accent: "accent-clay",
          position: "center 48%",
        },
        {
          src: "assets/responsive/adakluto-ridge-close-1440.webp",
          alt: "Steeper section on Hike Adakluto.",
          kicker: "Steep section",
          title: "The steeper section is where the group settles into a rhythm.",
          accent: "accent-gold",
          position: "center 38%",
        },
        {
          src: "assets/trips/adakluto-peak-preview.jpg",
          alt: "Peak marker on Hike Adakluto.",
          kicker: "Peak marker",
          title: "At the top, everyone stops for the photo they worked for.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
        {
          src: "assets/responsive/adakluto-group-peak-1440.webp",
          alt: "Peak group frame from Hike Adakluto.",
          kicker: "Group summit",
          title: "The summit photo is the part people post first.",
          accent: "accent-canopy",
          position: "center 46%",
        },
      ],
      style: "summit",
    },
    coast: {
      title: "Keta 3 Days",
      typeLabel: "Beach camp weekend",
      summary: "Tent village, fort stop, sea air, and a long beach weekend.",
      audience: "Weekend crews · social travellers · beach people",
      includes: "Keta / Fort Prinzenstein / beach camp",
      visual: "Beach camp",
      imgSrc: "assets/trips/keta-camp.webp",
      imgAlt: "Beach camp route preview from the Keta trip.",
      highlights: ["Beach camp", "Fort stop", "Sunrise water", "Full crew energy"],
      storyTitle: "Keta feels bigger every time the day opens up.",
      storySummary:
        "You settle into camp, move between the fort and the beach, stay up later than planned, and wake up to sea air again.",
      gallery: [
        {
          src: "assets/trips/keta-tent-village-2-preview.jpg",
          alt: "Tent village frame from the Keta trip.",
          kicker: "Tent village",
          title: "The trip starts feeling real once the tents are up.",
          accent: "accent-gold",
          position: "center 46%",
        },
        {
          src: "assets/trips/fort-pr.webp",
          alt: "Fort stop during the Keta trip.",
          kicker: "Fort stop",
          title: "The fort gives the weekend some weight.",
          accent: "accent-lagoon",
          position: "center 52%",
        },
        {
          src: "assets/trips/keta-beachline.webp",
          alt: "Beachline frame from the Keta trip.",
          kicker: "Shoreline",
          title: "By the end, nobody wants to rush back home.",
          accent: "accent-lagoon",
          position: "center 48%",
        },
      ],
      style: "coast",
    },
    canopy: {
      title: "Asenema Waterfalls",
      typeLabel: "Forest waterfall day",
      summary: "Forest walk, cold waterfall, and a relaxed group day.",
      audience: "Nature lovers · easygoing groups · people who want water at the end",
      includes: "Asenema entrance / waterfall trail / forest route",
      visual: "Waterfall day",
      imgSrc: "assets/trips/asenema-group-preview.jpg",
      imgAlt: "Adventures of Life group at Asenema Waterfalls.",
      highlights: ["Entrance climb", "Waterfall arrival", "Group swim", "Forest photos"],
      storyTitle: "The forest keeps pulling you toward the water.",
      storySummary:
        "Asenema is the kind of trip where the walk stays light, the water does the talking, and the group settles quickly.",
      gallery: [
        {
          src: "assets/trips/asenema-entrance-preview.jpg",
          alt: "Trail entrance at Asenema Waterfalls.",
          kicker: "Trail entry",
          title: "Even the entrance feels like the day is changing.",
          accent: "accent-gold",
          position: "center 44%",
        },
        {
          src: "assets/trips/asenema-waterfalls.webp",
          alt: "Waterfall arrival at Asenema.",
          kicker: "Falls arrival",
          title: "Then you hear the water before you fully see it.",
          accent: "accent-lagoon",
          position: "center 46%",
        },
        {
          src: "assets/trips/asenema-fitcheck-preview.jpg",
          alt: "Fitcheck portrait from the Asenema Waterfalls trip.",
          kicker: "Quiet beat",
          title: "The quieter moments on this trip happen naturally.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
        {
          src: "assets/trips/asenema-crew.webp",
          alt: "Crew moment at Asenema Waterfalls.",
          kicker: "Crew moment",
          title: "Once people reach the water, everyone loosens up.",
          accent: "accent-canopy",
          position: "center 42%",
        },
      ],
      style: "canopy",
    },
    north: {
      title: "Akwamu Gorge",
      typeLabel: "Gorge climb day",
      summary: "Steep climb, tired legs, and a view worth the effort.",
      audience: "Fit groups · challenge seekers · people who do not mind sweating for the view",
      includes: "Akwamu Gorge / summit trail / canopy stop",
      visual: "At the top",
      imgSrc: "assets/trips/akwamu-peak-preview.jpg",
      imgAlt: "Peak view on the Akwamu Gorge route.",
      highlights: ["Station meet-up", "Gorge climb", "View at the top", "Canopy stop"],
      storyTitle: "Akwamu is hard on the legs and worth it at the top.",
      storySummary:
        "The climb bites early, the group keeps pushing, and the view at the top changes everybody's face.",
      gallery: [
        {
          src: "assets/trips/akwamu-peak-preview.jpg",
          alt: "Peak view from Akwamu Gorge.",
          kicker: "Peak pull",
          title: "This is the view that makes the climb make sense.",
          accent: "accent-clay",
          position: "center 40%",
        },
        {
          src: "assets/responsive/akwamu-climb-portrait-1440.webp",
          alt: "Climb portrait on the Akwamu Gorge route.",
          kicker: "On the climb",
          title: "Before the top, there is the part where everybody gets serious.",
          accent: "accent-clay",
          position: "center 40%",
        },
        {
          src: "assets/responsive/akwamu-gorge-team-1440.webp",
          alt: "Crew frame on the Akwamu Gorge route.",
          kicker: "Crew moment",
          title: "By the middle of the climb, everyone is already in it together.",
          accent: "accent-gold",
          position: "center 38%",
        },
        {
          src: "assets/trips/akwamu-boat.webp",
          alt: "Boat-side frame connected to the Akwamu Gorge route.",
          kicker: "Water break",
          title: "The water break changes the pace at the right time.",
          accent: "accent-lagoon",
          position: "center 48%",
        },
        {
          src: "assets/responsive/akwamu-crew-1280.webp",
          alt: "Ridge frame during the Akwamu Gorge climb.",
          kicker: "Ridge stop",
          title: "Once you get higher, people start smiling again.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
        {
          src: "assets/trips/laura-akwamu.webp",
          alt: "Crew member frame from the Akwamu Gorge trip.",
          kicker: "Crew portrait",
          title: "A lot of repeat travellers first showed up on a day like this.",
          accent: "accent-gold",
          position: "center 44%",
        },
      ],
      style: "north",
    },
    ada: {
      title: "Ada / Nkyinkyim Museum",
      typeLabel: "Museum / lagoon day",
      summary: "Museum grounds, water crossing, portraits, and an easy day out.",
      audience: "Culture lovers · slower groups · people who want a softer day",
      includes: "Nkyinkyim Museum / Ada / lagoon crossing",
      visual: "Museum day",
      imgSrc: "assets/responsive/ada-nkyinkyim-candid-1440.webp",
      imgAlt: "Ada and Nkyinkyim Museum route preview.",
      highlights: ["Museum grounds", "Boat crossing", "Group photos", "Water stop"],
      storyTitle: "Ada gives the group more room to slow down.",
      storySummary:
        "You start in the museum grounds, move toward the water, take your time with the portraits, and end the day calmer than you started it.",
      gallery: [
        {
          src: "assets/responsive/ada-nkyinkyim-portrait-close-1440.webp",
          alt: "Single portrait from Ada and Nkyinkyim Museum.",
          kicker: "Portrait beat",
          title: "The quieter photos come naturally here.",
          accent: "accent-lagoon",
          position: "center 38%",
        },
        {
          src: "assets/responsive/ada-nkyinkyim-boat-ride-1440.webp",
          alt: "Boat ride frame from Ada and Nkyinkyim Museum.",
          kicker: "Boat crossing",
          title: "The water crossing changes the rhythm of the day.",
          accent: "accent-clay",
          position: "center 46%",
        },
        {
          src: "assets/responsive/ada-nkyinkyim-water-edge-1440.webp",
          alt: "Water-edge frame from Ada and Nkyinkyim Museum.",
          kicker: "Water edge",
          title: "By the water, everything slows down a little.",
          accent: "accent-canopy",
          position: "center 48%",
        },
        {
          src: "assets/responsive/ada-nkyinkyim-monument-group-1440.webp",
          alt: "Group frame from Ada and Nkyinkyim Museum.",
          kicker: "Monument group",
          title: "The museum grounds give the whole group a place to gather.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
      ],
      style: "ada",
    },
    togo: {
      title: "Togo",
      typeLabel: "Latest trip / details landing soon",
      summary: "We just got back. The route notes and full gallery are being prepared.",
      audience: "Early joiners · cross-border travellers · people watching for the next drop",
      includes: "Trip notes / photo selects / full gallery soon",
      visual: "Just back",
      imgSrc: "assets/togo-preview.svg",
      imgAlt: "Togo trip placeholder while the full gallery is being prepared.",
      highlights: ["Trip completed", "Photos sorting", "Gallery soon", "Inquiry open"],
      storyTitle: "Togo just landed. Full story next.",
      storySummary:
        "The trip is done. The team is sorting the photos, route notes, and best moments before the full Togo page goes live.",
      gallery: [
        {
          src: "assets/togo-preview.svg",
          alt: "Togo placeholder marking that the trip just returned.",
          kicker: "Just back",
          title: "We have just come off the road and the first edit is still being built.",
          accent: "accent-sand",
          position: "center center",
        },
        {
          src: "assets/togo-route.svg",
          alt: "Togo route notes placeholder.",
          kicker: "Route notes",
          title: "The strongest stops and story beats are being pulled together now.",
          accent: "accent-lagoon",
          position: "center center",
        },
        {
          src: "assets/togo-gallery.svg",
          alt: "Togo gallery placeholder.",
          kicker: "Photo selects",
          title: "If you want first access when it lands, ask about the next trip early.",
          accent: "accent-canopy",
          position: "center center",
        },
      ],
      style: "togo",
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

  const ensureIconSprite = () => {
    if (!document.getElementById("aol-icon-sprite")) {
      console.warn("Missing inline social icon sprite.");
    }
  };

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
    const stageFrame = document.getElementById("selector-stage-frame");
    const stageImage = document.getElementById("selector-stage-img");
    const stageKicker = document.getElementById("selector-stage-kicker");
    const stageTitle = document.getElementById("selector-stage-title");
    const stageOpen = document.getElementById("selector-stage-open");
    const lightbox = document.getElementById("journey-lightbox");
    const lightboxImage = document.getElementById("journey-lightbox-img");
    const lightboxKicker = document.getElementById("journey-lightbox-kicker");
    const lightboxTitle = document.getElementById("journey-lightbox-title");
    const lightboxClose = document.getElementById("journey-lightbox-close");
    const lightboxBackdrop = lightbox?.querySelector("[data-lightbox-close]");

    let activeGalleryStyle = null;
    let activeGalleryIndex = 0;

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

    const setFrameAccent = (frame, styleKey, itemAccent) => {
      if (!frame) {
        return;
      }

      Object.values(travelStyleAccents).forEach((accentClass) => {
        frame.classList.remove(accentClass);
      });

      const accentClass = itemAccent || travelStyleAccents[styleKey];

      if (accentClass) {
        frame.classList.add(accentClass);
      }
    };

    const getThumbSrc = (src) => {
      if (typeof src !== "string") {
        return src;
      }

      if (src.includes("-1440.webp")) {
        return src.replace("-1440.webp", "-960.webp");
      }

      if (src.includes("-1280.webp")) {
        return src.replace("-1280.webp", "-960.webp");
      }

      return src;
    };

    const openLightbox = () => {
      if (!lightbox || !activeGalleryStyle) {
        return;
      }

      const item = activeGalleryStyle.gallery?.[activeGalleryIndex];

      if (!item || !lightboxImage || !lightboxKicker || !lightboxTitle) {
        return;
      }

      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("has-lightbox-open");
      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
      lightboxKicker.textContent = item.kicker;
      lightboxTitle.textContent = item.title;
    };

    const closeLightbox = () => {
      if (!lightbox) {
        return;
      }

      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("has-lightbox-open");
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

    const setActiveGalleryItem = (style, index = 0) => {
      if (!storyGallery || !stageFrame || !stageImage || !stageKicker || !stageTitle || !Array.isArray(style.gallery)) {
        return;
      }

      const boundedIndex = clamp(index, 0, style.gallery.length - 1);
      const item = style.gallery[boundedIndex];

      if (!item) {
        return;
      }

      activeGalleryStyle = style;
      activeGalleryIndex = boundedIndex;
      stageFrame.style.setProperty("--photo-position", item.position || "center");
      setFrameAccent(stageFrame, style.style, item.accent);
      stageImage.src = item.src;
      stageImage.alt = item.alt;
      stageKicker.textContent = item.kicker;
      stageTitle.textContent = item.title;
      refreshVisualImage(stageImage);

      if (lightbox && !lightbox.hidden && lightboxImage && lightboxKicker && lightboxTitle) {
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt;
        lightboxKicker.textContent = item.kicker;
        lightboxTitle.textContent = item.title;
      }

      storyGallery.querySelectorAll(".journey-thumb").forEach((thumb, thumbIndex) => {
        const isActive = thumbIndex === boundedIndex;
        thumb.classList.toggle("is-active", isActive);
        thumb.setAttribute("aria-selected", String(isActive));
      });
    };

    const renderGallery = (style) => {
      if (!storyGallery || !Array.isArray(style.gallery)) {
        return;
      }

      storyGallery.replaceChildren();
      activeGalleryStyle = style;

      style.gallery.forEach((item, index) => {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "journey-thumb";
        thumb.setAttribute("aria-label", `${style.title}: ${item.kicker}`);
        thumb.setAttribute("aria-selected", "false");

        const thumbImage = document.createElement("img");
        thumbImage.className = "journey-thumb-image";
        thumbImage.src = getThumbSrc(item.src);
        thumbImage.alt = item.alt;
        thumbImage.loading = "lazy";
        thumbImage.decoding = "async";

        const thumbText = document.createElement("span");
        thumbText.className = "journey-thumb-label";
        thumbText.textContent = item.kicker;

        thumb.append(thumbImage, thumbText);
        thumb.addEventListener("click", () => setActiveGalleryItem(style, index));
        storyGallery.append(thumb);
      });

      setActiveGalleryItem(style, 0);
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

    stageOpen?.addEventListener("click", openLightbox);
    stageFrame?.addEventListener("click", openLightbox);
    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxBackdrop?.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox && !lightbox.hidden) {
        closeLightbox();
      }
    });
  };

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


