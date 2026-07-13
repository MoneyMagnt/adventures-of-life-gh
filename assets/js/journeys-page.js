"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const WHATSAPP_NUMBER = "233551472190";
  const TRIP_DATA = window.AOL_TRIP_DATA || { activeTrip: null };
  const ACTIVE_TRIP = TRIP_DATA.activeTrip || null;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = () => reducedMotionQuery.matches;

  const setupJourneysJournalEffects = () => {
    if (document.body.dataset.page !== "journeys") {
      return;
    }

    const journalPage = document.querySelector(".jy-journal-page");
    const roadColumn = document.querySelector(".jy-road-column");
    const roadPath = document.querySelector(".jy-road-path");
    const stops = Array.from(document.querySelectorAll(".jy-stop"));
    const cadQuote = document.querySelector(".jy-cadence-quote");
    const phases = Array.from(document.querySelectorAll(".jy-phase"));
    const introItems = Array.from(
      document.querySelectorAll(".jy-page-intro-copy, .jy-page-intro-stats .fg-stat-card")
    );

    if (!journalPage || !stops.length) {
      return;
    }

    const revealInstantly = (target) => {
      target.classList.add("is-visible");

      if (!target.classList.contains("jy-stop")) {
        return;
      }

      const dot = target.querySelector(".jy-stop-dot");
      const stamp = target.querySelector(".jy-passport-stamp");

      if (dot) {
        dot.classList.add("dot-arrived");
      }

      if (stamp) {
        stamp.classList.add("stamp-visible");
      }
    };

    introItems.forEach((item, index) => {
      item.classList.add("jy-reveal");
      item.style.transitionDelay = `${index * 0.08}s`;
    });

    stops.forEach((stop, index) => {
      stop.classList.add("jy-reveal");
      stop.style.transitionDelay = `${0.06 + index * 0.07}s`;

      const info = stop.querySelector(".jy-stop-info");
      const name = stop.querySelector(".jy-stop-name");
      const date = stop.querySelector(".jy-stop-date");

      if (
        info &&
        name &&
        date &&
        !stop.classList.contains("is-past") &&
        !info.querySelector(".jy-stop-cta")
      ) {
        const cleanName = (name.childNodes[0]?.textContent || name.textContent || "").trim();
        const isCurrentNext = stop.classList.contains("is-next");
        const cta = document.createElement("a");

        cta.className = "jy-stop-cta";
        if (isCurrentNext) {
          cta.href = ACTIVE_TRIP?.bookingPath || "/trips/cote-divoire-28-august";
          cta.textContent = "See trip details and secure your slot";
        } else {
          const message = `Hello Adventures of Life, I want to ask about ${cleanName} on ${date.textContent.trim()}.`;
          cta.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
          cta.target = "_blank";
          cta.rel = "noreferrer";
          cta.textContent = `Ask about ${cleanName}`;
        }
        info.appendChild(cta);
      }

      if (!prefersReducedMotion()) {
        stop.addEventListener("mouseenter", () => stop.classList.add("hovered"));
        stop.addEventListener("mouseleave", () => stop.classList.remove("hovered"));
        stop.addEventListener("focusin", () => stop.classList.add("hovered"));
        stop.addEventListener("focusout", () => stop.classList.remove("hovered"));
      }
    });

    if (cadQuote) {
      cadQuote.classList.add("jy-reveal");
      cadQuote.style.transitionDelay = "0.08s";
    }

    phases.forEach((phase, index) => {
      phase.classList.add("jy-reveal");
      phase.style.transitionDelay = `${0.14 + index * 0.1}s`;
    });

    const revealAll = document.querySelectorAll(".jy-reveal");

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      revealAll.forEach(revealInstantly);

      if (roadPath) {
        roadPath.style.strokeDasharray = "none";
        roadPath.style.strokeDashoffset = "0";
      }

      journalPage.classList.add("is-road-ready");
      return;
    }

    if (roadPath && roadColumn && typeof roadPath.getTotalLength === "function") {
      const roadLength = roadPath.getTotalLength();
      roadPath.style.strokeDasharray = `${roadLength}`;
      roadPath.style.strokeDashoffset = `${roadLength}`;

      new IntersectionObserver((entries, observer) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        const start = performance.now();
        const duration = 2600;

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          roadPath.style.strokeDashoffset = `${roadLength * (1 - eased)}`;

          if (progress < 1) {
            requestAnimationFrame(tick);
            return;
          }

          journalPage.classList.add("is-road-ready");
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      }, { threshold: 0.12 }).observe(roadColumn);
    } else if (roadPath) {
      roadPath.style.strokeDasharray = "none";
      roadPath.style.strokeDashoffset = "0";
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) {
          return;
        }

        target.classList.add("is-visible");

        if (target.classList.contains("jy-stop")) {
          const dot = target.querySelector(".jy-stop-dot");
          const stamp = target.querySelector(".jy-passport-stamp");

          if (dot) {
            window.setTimeout(() => dot.classList.add("dot-arrived"), 180);
          }

          if (stamp) {
            window.setTimeout(() => stamp.classList.add("stamp-visible"), 360);
          }
        }

        observer.unobserve(target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -36px 0px" });

    revealAll.forEach((item) => revealObserver.observe(item));
  };

  setupJourneysJournalEffects();
});
