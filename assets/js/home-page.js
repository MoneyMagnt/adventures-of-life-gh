"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const NEXT_TRIP_POPUP_DELAY_MS = 1800;
  const NEXT_TRIP_POPUP_DISMISS_KEY = "aol-next-trip-popup-dismissed-at";
  const NEXT_TRIP_POPUP_DISMISS_MS = 24 * 60 * 60 * 1000;
  const TRIP_DATA = window.AOL_TRIP_DATA || { trips: [], activeTrip: null };
  const ACTIVE_TRIP = TRIP_DATA.activeTrip || null;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const initHomeHeroCarousel = () => {
    const carousel = document.querySelector("[data-home-hero-carousel]");
    if (!carousel) return;

    const viewport = carousel.querySelector(".fg-hero-carousel-viewport");
    const track = carousel.querySelector("[data-home-hero-track]");
    const slides = Array.from(carousel.querySelectorAll("[data-home-hero-slide]"));
    const liveRegion = carousel.querySelector("[data-home-hero-live]");
    if (!viewport || !track || slides.length === 0) return;

    let currentIndex = 0;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let dragX = 0;
    let horizontalDrag = false;
    let autoplayTimer = null;
    let motionPaused = reducedMotionQuery.matches;
    let interactionPaused = false;
    let wheelLocked = false;
    const autoplayDelay = 3200;

    const wrapIndex = (index) => (index + slides.length) % slides.length;
    const slideName = (slide) => slide.querySelector(".fg-hero-label")?.textContent?.trim() || "Trip photo";

    const renderSlide = (nextIndex, announce = true) => {
      currentIndex = wrapIndex(nextIndex);
      track.classList.remove("is-dragging");
      track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;

      slides.forEach((slide, index) => {
        const isActive = index === currentIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      if (announce && liveRegion) {
        liveRegion.textContent = `${slideName(slides[currentIndex])}. Slide ${currentIndex + 1} of ${slides.length}.`;
      }
    };

    const stopAutoplay = () => {
      if (!autoplayTimer) return;
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (motionPaused || interactionPaused || document.hidden || slides.length < 2) return;
      autoplayTimer = window.setInterval(() => renderSlide(currentIndex + 1, false), autoplayDelay);
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    const showManualSlide = (nextIndex) => {
      renderSlide(nextIndex);
      restartAutoplay();
    };

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showManualSlide(currentIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showManualSlide(currentIndex + 1);
      }
    });

    carousel.addEventListener("mouseenter", () => {
      interactionPaused = true;
      stopAutoplay();
    });
    carousel.addEventListener("mouseleave", () => {
      interactionPaused = false;
      startAutoplay();
    });
    carousel.addEventListener("focusin", () => {
      interactionPaused = true;
      stopAutoplay();
    });
    carousel.addEventListener("focusout", (event) => {
      if (carousel.contains(event.relatedTarget)) return;
      interactionPaused = false;
      startAutoplay();
    });

    viewport.addEventListener("dragstart", (event) => event.preventDefault());
    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      dragX = 0;
      horizontalDrag = false;
      interactionPaused = true;
      stopAutoplay();
      viewport.setPointerCapture?.(event.pointerId);
      viewport.classList.add("is-dragging");
      track.classList.add("is-dragging");
    });

    viewport.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      if (!horizontalDrag && Math.abs(deltaY) > Math.abs(deltaX)) return;
      horizontalDrag = Math.abs(deltaX) > 6;
      if (!horizontalDrag) return;
      event.preventDefault();
      dragX = deltaX;
      const dragPercent = (dragX / Math.max(viewport.clientWidth, 1)) * 100;
      track.style.transform = `translate3d(${-(currentIndex * 100) + dragPercent}%, 0, 0)`;
    });

    const finishDrag = (event) => {
      if (event.pointerId !== pointerId) return;
      const threshold = Math.min(72, viewport.clientWidth * 0.16);
      viewport.classList.remove("is-dragging");
      if (horizontalDrag && Math.abs(dragX) >= threshold) {
        renderSlide(currentIndex + (dragX < 0 ? 1 : -1));
      } else {
        renderSlide(currentIndex, false);
      }
      pointerId = null;
      dragX = 0;
      horizontalDrag = false;
      interactionPaused = carousel.matches(":hover") || carousel.contains(document.activeElement);
      startAutoplay();
    };

    viewport.addEventListener("pointerup", finishDrag);
    viewport.addEventListener("pointercancel", finishDrag);
    viewport.addEventListener(
      "wheel",
      (event) => {
        if (wheelLocked || Math.abs(event.deltaX) < 24 || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
          return;
        }
        event.preventDefault();
        wheelLocked = true;
        showManualSlide(currentIndex + (event.deltaX > 0 ? 1 : -1));
        window.setTimeout(() => {
          wheelLocked = false;
        }, 520);
      },
      { passive: false }
    );
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });
    reducedMotionQuery.addEventListener?.("change", ({ matches }) => {
      motionPaused = matches;
      if (matches) stopAutoplay();
      else startAutoplay();
    });
    renderSlide(0, false);
    startAutoplay();
  };

  initHomeHeroCarousel();

  const setupTripInterestOptions = () => {
    const selects = document.querySelectorAll('select[name="interest"]');
    if (!selects.length || !Array.isArray(TRIP_DATA.trips) || !TRIP_DATA.trips.length) return;

    const orderedTrips = [
      ...TRIP_DATA.trips.filter((trip) => trip.id === TRIP_DATA.activeTripId),
      ...TRIP_DATA.trips.filter((trip) => trip.id !== TRIP_DATA.activeTripId),
    ];

    selects.forEach((select) => {
      const placeholder = select.querySelector('option[value=""]')?.cloneNode(true);
      select.replaceChildren();
      if (placeholder) select.appendChild(placeholder);

      orderedTrips.forEach((trip) => {
        const option = document.createElement("option");
        option.value = trip.name;
        option.textContent = trip.status === "booking" ? `${trip.name} (next trip)` : trip.name;
        select.appendChild(option);
      });

      ["Private group", "Custom"].forEach((label) => {
        const option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        select.appendChild(option);
      });
    });
  };

  setupTripInterestOptions();

  const setupHomeNextTripPopup = () => {
    if (document.body.dataset.page !== "home") {
      return;
    }

    const popup = document.querySelector("[data-next-trip-popup]");
    const dialog = popup ? popup.querySelector(".fg-next-trip-dialog") : null;
    const closeTargets = popup ? popup.querySelectorAll("[data-next-trip-close]") : [];
    const closeButton =
      popup && popup.querySelector(".fg-next-trip-close") instanceof HTMLElement
        ? popup.querySelector(".fg-next-trip-close")
        : null;

    if (!(popup instanceof HTMLElement) || !(dialog instanceof HTMLElement)) {
      return;
    }

    if (ACTIVE_TRIP) {
      const bookingPath = ACTIVE_TRIP.bookingPath || "/journeys";
      popup.querySelectorAll(".fg-next-trip-media-link, .fg-next-trip-title-link, [data-next-trip-cta]").forEach((link) => {
        if (link instanceof HTMLAnchorElement) link.href = bookingPath;
      });
      const title = popup.querySelector(".fg-next-trip-title-link");
      const kicker = popup.querySelector(".fg-next-trip-kicker");
      const image = popup.querySelector(".fg-next-trip-dialog-media img");
      const facts = popup.querySelectorAll(".fg-next-trip-facts span");
      if (title) title.textContent = ACTIVE_TRIP.name;
      if (kicker) kicker.textContent = `Next trip / ${ACTIVE_TRIP.dateLabel}`;
      if (image instanceof HTMLImageElement) {
        image.src = ACTIVE_TRIP.image;
        image.alt = `${ACTIVE_TRIP.name} trip flyer`;
      }
      if (facts[0]) facts[0].textContent = `${ACTIVE_TRIP.price.currency} ${ACTIVE_TRIP.price.amount.toLocaleString("en-GH")} total`;
      if (facts[1]) facts[1].textContent = `${ACTIVE_TRIP.price.currency} ${ACTIVE_TRIP.price.deposit.toLocaleString("en-GH")} deposit`;
      if (facts[2]) facts[2].textContent = ACTIVE_TRIP.price.installments ? "Installments accepted" : "Full payment required";
    }

    let lastFocused = null;
    let openTimer = 0;
    let retryTimer = 0;
    const backgroundNodes = Array.from(
      document.querySelectorAll("body > header, body > main, body > footer, body > .whatsapp-fab")
    );

    const wasRecentlyDismissed = () => {
      try {
        const dismissedAt = Number(window.localStorage.getItem(NEXT_TRIP_POPUP_DISMISS_KEY));
        return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < NEXT_TRIP_POPUP_DISMISS_MS;
      } catch {
        return false;
      }
    };

    const rememberDismissal = () => {
      try {
        window.localStorage.setItem(NEXT_TRIP_POPUP_DISMISS_KEY, String(Date.now()));
      } catch {
        // Storage can be unavailable in private browsing; closing must still work.
      }
    };

    const isOpen = () => popup.classList.contains("is-open");

    const closePopup = ({ restoreFocus = true, remember = true } = {}) => {
      window.clearTimeout(retryTimer);
      popup.hidden = true;
      popup.classList.remove("is-open");
      popup.setAttribute("aria-hidden", "true");
      document.body.classList.remove("next-trip-popup-open");
      backgroundNodes.forEach((node) => {
        if (node instanceof HTMLElement) node.inert = false;
      });
      if (remember) rememberDismissal();

      if (restoreFocus && lastFocused instanceof HTMLElement) {
        lastFocused.focus({ preventScroll: true });
      }
    };

    const openPopup = () => {
      if (isOpen()) {
        return;
      }

      if (document.body.classList.contains("nav-open")) {
        retryTimer = window.setTimeout(openPopup, 400);
        return;
      }

      lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      popup.hidden = false;
      popup.classList.add("is-open");
      popup.setAttribute("aria-hidden", "false");
      document.body.classList.add("next-trip-popup-open");
      backgroundNodes.forEach((node) => {
        if (node instanceof HTMLElement) node.inert = true;
      });

      window.requestAnimationFrame(() => {
        closeButton?.focus({ preventScroll: true });
      });
    };

    if (!wasRecentlyDismissed()) {
      openTimer = window.setTimeout(openPopup, NEXT_TRIP_POPUP_DELAY_MS);
    }

    closeTargets.forEach((target) => {
      target.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closePopup();
      });
    });

    dialog.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        closePopup();
      }
      if (event.key === "Tab" && isOpen()) {
        const focusable = Array.from(
          dialog.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((element) => element instanceof HTMLElement && !element.hidden);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("beforeunload", () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(retryTimer);
    });
  };

  setupHomeNextTripPopup();
});
