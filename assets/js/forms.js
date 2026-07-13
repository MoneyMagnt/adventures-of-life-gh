"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const WHATSAPP_NUMBER = "233551472190";
  const DEFAULT_WHATSAPP_MESSAGE =
    "Hello Adventures of Life, I want help planning a trip in Ghana or nearby West African countries.";
  const INQUIRIES_ENDPOINT = "/api/inquiries";
  const REVIEWS_ENDPOINT = "/api/reviews";
  const SITE_CONFIG_ENDPOINT = "/api/site-config";
  const REVIEW_INVITE_ENDPOINT = "/api/review-invite";
  const LOCAL_INQUIRY_STORAGE_KEY = "aol-trip-inquiries-local";
  const LOCAL_REVIEW_STORAGE_KEY = "aol-community-reviews-local";

  const buildWhatsAppLink = (message) => {
    const encodedMessage = encodeURIComponent((message || DEFAULT_WHATSAPP_MESSAGE).trim());
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  };

  const buildInquiryMessage = ({
    routeTitle = "",
    name = "",
    email = "",
    interest = "",
    notes = "",
  } = {}) => {
    const selectedTrip = routeTitle || interest || "a trip";
    const lines = [
      "Hello Adventures of Life,",
      `I want to ask about ${selectedTrip}.`,
    ];

    if (name) lines.push(`Name: ${name}`);
    if (email) lines.push(`Email: ${email}`);
    if (interest && !routeTitle) lines.push(`Trip: ${interest}`);
    if (notes) lines.push(`Notes: ${notes}`);

    lines.push("Please let me know the next step.");
    return lines.join("\n");
  };

  const isLocalPreview = () =>
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  let siteConfigPromise = null;
  let turnstileScriptPromise = null;

  const loadSiteConfig = async () => {
    if (siteConfigPromise) {
      return siteConfigPromise;
    }

    if (isLocalPreview()) {
      siteConfigPromise = Promise.resolve({
        turnstileSiteKey: "",
        reviewInviteRequired: true,
      });
      return siteConfigPromise;
    }

    siteConfigPromise = fetch(SITE_CONFIG_ENDPOINT, {
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || "Could not load the site security config.");
        }

        return {
          turnstileSiteKey: String(data.turnstileSiteKey || "").trim(),
          reviewInviteRequired: data.reviewInviteRequired !== false,
        };
      })
      .catch(() => ({
        turnstileSiteKey: "",
        reviewInviteRequired: true,
      }));

    return siteConfigPromise;
  };

  const loadTurnstileScript = async () => {
    if (window.turnstile) {
      return window.turnstile;
    }

    if (turnstileScriptPromise) {
      return turnstileScriptPromise;
    }

    turnstileScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-turnstile-script="true"]');

      if (existing) {
        existing.addEventListener("load", () => resolve(window.turnstile), {
          once: true,
        });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstileScript = "true";
      script.addEventListener("load", () => resolve(window.turnstile), { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });

    return turnstileScriptPromise;
  };

  const mountTurnstileProtection = async ({
    form,
    response,
    missingMessage,
  }) => {
    const container = form?.querySelector("[data-turnstile-container]");
    const tokenField = form?.elements?.turnstile_token;

    if (!form || !container || !tokenField) {
      return {
        enabled: false,
        missing: false,
        reset() {},
      };
    }

    if (isLocalPreview()) {
      container.hidden = true;
      return {
        enabled: false,
        missing: false,
        reset() {
          tokenField.value = "";
        },
      };
    }

    const config = await loadSiteConfig();

    if (!config.turnstileSiteKey) {
      container.hidden = true;
      return {
        enabled: false,
        missing: true,
        reset() {
          tokenField.value = "";
        },
      };
    }

    try {
      const turnstile = await loadTurnstileScript();

      if (!turnstile || typeof turnstile.render !== "function") {
        throw new Error("Turnstile is unavailable.");
      }

      tokenField.value = "";
      const widgetId = turnstile.render(container, {
        sitekey: config.turnstileSiteKey,
        theme: "auto",
        callback: (token) => {
          tokenField.value = token || "";
        },
        "expired-callback": () => {
          tokenField.value = "";
        },
        "error-callback": () => {
          tokenField.value = "";
        },
      });

      return {
        enabled: true,
        missing: false,
        reset() {
          tokenField.value = "";
          if (window.turnstile && typeof window.turnstile.reset === "function") {
            window.turnstile.reset(widgetId);
          }
        },
      };
    } catch (error) {
      if (response) {
        response.textContent = missingMessage;
        response.style.color = "var(--clay)";
      }

      container.hidden = true;
      return {
        enabled: false,
        missing: true,
        reset() {
          tokenField.value = "";
        },
      };
    }
  };

  const triggerFormShake = (form) => {
    if (!form || typeof form.animate !== "function") {
      return;
    }

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
  };

  const setupContactForm = () => {
    const form = document.getElementById("contact-form");
    const response = document.getElementById("form-response");

    if (!form || !response) {
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    let turnstileController = null;

    const turnstileReady = mountTurnstileProtection({
      form,
      response,
      missingMessage: "Trip form protection is not configured right now.",
    }).then((controller) => {
      turnstileController = controller;

      if (controller.missing && button && !isLocalPreview()) {
        button.disabled = true;
      }

      return controller;
    });

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
        const controller = await turnstileReady;

        if (
          !isLocalPreview() &&
          controller.enabled &&
          !String(form.elements.turnstile_token?.value || "").trim()
        ) {
          throw new Error("Please confirm you are human and try again.");
        }

        const payload = Object.fromEntries(new FormData(form));

        const res = await fetch(INQUIRIES_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...payload,
            source_path: window.location.pathname || "/",
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error || "Failed");
        }

        response.textContent = "Inquiry sent. Zico will follow up soon.";
        response.style.color = "var(--canopy)";
        form.reset();
        turnstileController?.reset();
      } catch (error) {
        if (isLocalPreview()) {
          try {
            const payload = Object.fromEntries(new FormData(form));
            const raw = window.localStorage.getItem(LOCAL_INQUIRY_STORAGE_KEY);
            const next = Array.isArray(JSON.parse(raw || "[]"))
              ? JSON.parse(raw || "[]")
              : [];
            next.unshift({
              ...payload,
              source_path: window.location.pathname || "/",
              created_at: new Date().toISOString(),
            });
            window.localStorage.setItem(
              LOCAL_INQUIRY_STORAGE_KEY,
              JSON.stringify(next.slice(0, 24))
            );
          } catch (storageError) {
            // Ignore local preview persistence failures.
          }

          response.textContent =
            "Saved in local preview. On the live site this goes straight into the trip inbox.";
          response.style.color = "var(--canopy)";
          form.reset();
          return;
        }

        const fallbackLink = buildWhatsAppLink(
          buildInquiryMessage({
            name: form.elements.name?.value,
            email: form.elements.email?.value,
            interest: form.elements.interest?.value,
            notes: form.elements.message?.value,
          })
        );

        const friendlyError =
          error instanceof Error && error.message
            ? error.message
            : "We couldn't save your inquiry right now.";

        response.replaceChildren(document.createTextNode(`${friendlyError} `));
        const fallbackAnchor = document.createElement("a");
        fallbackAnchor.href = fallbackLink;
        fallbackAnchor.target = "_blank";
        fallbackAnchor.rel = "noreferrer";
        fallbackAnchor.textContent = "Send it on WhatsApp";
        response.appendChild(fallbackAnchor);
        response.style.color = "var(--clay)";
        triggerFormShake(form);
        turnstileController?.reset();
      } finally {
        btn.disabled = false;
        btn.textContent = "Send inquiry";
      }
    });
  };

  const buildReviewDisplayName = (value) => {
    const parts = String(value || "")
      .replace(/[^\p{L}\p{N}\s'-]+/gu, " ")
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map(part => part.trim())
      .filter(Boolean);

    if (!parts.length) {
      return "Traveller";
    }

    const first = parts[0].slice(0, 24);
    const firstDisplay = first ? `${first.charAt(0).toUpperCase()}${first.slice(1)}` : "Traveller";

    if (parts.length === 1) {
      return firstDisplay;
    }

    const last = parts[parts.length - 1];
    const lastInitial = last ? `${last.charAt(0).toUpperCase()}.` : "";
    return `${firstDisplay} ${lastInitial}`.trim();
  };

  const buildReviewInitials = (value) => {
    const parts = String(value || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    if (!parts.length) {
      return "AO";
    }

    return parts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const normalizeReview = (review) => {
    const displayName = buildReviewDisplayName(
      review.displayName || review.display_name || review.public_name || review.name
    );

    return {
      id: review.id || `${displayName}-${review.trip || ""}-${review.tripDate || review.trip_date || ""}`,
      displayName,
      initials: buildReviewInitials(displayName),
      trip: String(review.trip || "").trim(),
      tripDate: String(review.tripDate || review.trip_date || "").trim(),
      rating: Math.max(1, Math.min(5, Number.parseInt(review.rating, 10) || 5)),
      review: String(review.review || "").trim(),
      createdAt: review.createdAt || review.created_at || new Date().toISOString(),
    };
  };

  const loadLocalReviews = () => {
    try {
      const raw = window.localStorage.getItem(LOCAL_REVIEW_STORAGE_KEY);
      const parsed = JSON.parse(raw || "[]");

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map(normalizeReview);
    } catch (error) {
      return [];
    }
  };

  const saveLocalReview = (review) => {
    try {
      const next = [review, ...loadLocalReviews()].slice(0, 12);
      window.localStorage.setItem(LOCAL_REVIEW_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      // Ignore local preview persistence failures.
    }
  };

  const createReviewCard = (review) => {
    const card = document.createElement("article");
    card.className = "fg-review-card reveal is-visible";
    card.dataset.reviewId = String(review.id);

    const head = document.createElement("div");
    head.className = "fg-review-head";

    const badge = document.createElement("div");
    badge.className = "fg-review-badge";
    badge.setAttribute("aria-hidden", "true");
    badge.textContent = review.initials;

    const meta = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = review.displayName;
    const trip = document.createElement("span");
    trip.textContent = review.tripDate
      ? `${review.trip} / ${review.tripDate}`
      : review.trip;

    meta.append(name, trip);
    head.append(badge, meta);

    const rating = document.createElement("div");
    rating.className = "fg-review-rating";
    rating.setAttribute("aria-label", `${review.rating} out of 5 stars`);

    const stars = document.createElement("span");
    stars.setAttribute("aria-hidden", "true");
    stars.textContent = "★".repeat(review.rating);

    const score = document.createElement("em");
    score.textContent = review.rating.toFixed(1);

    rating.append(stars, score);

    const body = document.createElement("p");
    body.textContent = `"${review.review}"`;

    card.append(head, rating, body);
    return card;
  };

  const renderCommunityReviews = (feed, status, reviews, message, isError = false) => {
    if (!feed || !status) {
      return;
    }

    feed.replaceChildren();

    if (!reviews.length) {
      feed.hidden = true;
      status.hidden = false;
      status.textContent = message;
      status.classList.toggle("is-error", isError);
      return;
    }

    reviews.forEach((review) => {
      feed.appendChild(createReviewCard(review));
    });

    feed.hidden = false;
    status.hidden = true;
    status.textContent = "";
    status.classList.remove("is-error");
  };

  const fetchCommunityReviews = async () => {
    const res = await fetch(REVIEWS_ENDPOINT, {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Failed to load reviews");
    }

    const reviews = Array.isArray(data.reviews) ? data.reviews : [];
    return reviews.map(normalizeReview);
  };

  const submitCommunityReview = async (payload) => {
    const res = await fetch(REVIEWS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Failed to submit review");
    }

    return {
      action: data.action || "created",
      review: normalizeReview(data.review || payload),
    };
  };

  const fetchReviewInvite = async (token) => {
    const url = new URL(REVIEW_INVITE_ENDPOINT, window.location.origin);
    url.searchParams.set("token", token);

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Could not check your review link.");
    }

    return data.invite || null;
  };

  const setReadonlyFieldValue = (field, value, locked = true) => {
    if (!field) {
      return;
    }

    if (field instanceof HTMLSelectElement) {
      const hasOption = Array.from(field.options).some(
        (option) => option.value === value
      );

      if (!hasOption && value) {
        const option = new Option(value, value, true, true);
        field.add(option);
      }

      if (value) {
        field.value = value;
      }

      field.disabled = locked;
      return;
    }

    if (typeof value === "string") {
      field.value = value;
    }

    field.readOnly = locked;
    field.setAttribute("aria-readonly", String(locked));
  };

  const setReviewFormAvailability = (form, enabled) => {
    form
      .querySelectorAll('input:not([type="hidden"]):not([name="website"]), select, textarea')
      .forEach((field) => {
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
          field.readOnly = !enabled;
        }

        if (field instanceof HTMLSelectElement || field instanceof HTMLButtonElement) {
          field.disabled = !enabled;
        }
      });

    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = !enabled;
    }
  };

  const setupCommunityReviews = () => {
    const form = document.getElementById("review-form-submit");
    const response = document.getElementById("review-form-response");
    const feed = document.getElementById("reviews-feed");
    const status = document.getElementById("reviews-status");
    const inviteStatus = document.getElementById("review-invite-status");
    const inviteSummary = document.getElementById("review-invite-summary");

    if (!form || !response || !feed || !status) {
      return;
    }

    let turnstileController = null;
    const reviewToken = new URLSearchParams(window.location.search).get("review_token") || "";
    const turnstileReady = mountTurnstileProtection({
      form,
      response,
      missingMessage: "Review protection is not configured right now.",
    }).then((controller) => {
      turnstileController = controller;
      return controller;
    });

    const primeReviewInvite = async () => {
      if (isLocalPreview()) {
        if (inviteStatus) {
          inviteStatus.textContent =
            "Local preview stays open for testing. Live reviews only publish from verified trip links.";
        }
        return;
      }

      setReviewFormAvailability(form, false);

      if (!reviewToken) {
        if (inviteStatus) {
          inviteStatus.textContent =
            "This review form only opens from a verified trip link. Ask Zico to resend yours on WhatsApp.";
        }
        return;
      }

      form.elements.review_token.value = reviewToken;

      try {
        const controller = await turnstileReady;
        const invite = await fetchReviewInvite(reviewToken);

        if (!invite) {
          throw new Error("This review link is invalid or has expired.");
        }

        if (controller.missing) {
          if (inviteStatus) {
            inviteStatus.textContent = "Review protection is not configured right now.";
          }
          return;
        }

        if (inviteStatus) {
          inviteStatus.textContent =
            "Verified traveller link confirmed. Your trip details are locked in below.";
        }

        if (inviteSummary) {
          inviteSummary.hidden = false;
          inviteSummary.textContent = `${invite.trip} / ${invite.trip_date}`;
        }

        if (form.elements.name && !String(form.elements.name.value || "").trim()) {
          form.elements.name.value = invite.name || "";
        }

        setReviewFormAvailability(form, true);
        setReadonlyFieldValue(form.elements.contact, "Verified from your trip link", true);
        setReadonlyFieldValue(form.elements.trip, invite.trip, true);
        setReadonlyFieldValue(form.elements.trip_date, invite.trip_date, true);
      } catch (error) {
        if (inviteStatus) {
          inviteStatus.textContent =
            error instanceof Error && error.message
              ? error.message
              : "This review link is invalid or has expired.";
        }
      }
    };

    const renderInitialReviews = async () => {
      try {
        const reviews = await fetchCommunityReviews();
        renderCommunityReviews(feed, status, reviews, "No reviews yet. Be the first traveller to leave one.");
      } catch (error) {
        if (isLocalPreview()) {
          const localReviews = loadLocalReviews();
          renderCommunityReviews(
            feed,
            status,
            localReviews,
            "Local preview has no reviews yet. Submit the first one below."
          );
          return;
        }

        const liveDbMissing =
          error instanceof Error &&
          /reviews database is not configured yet/i.test(error.message);

        if (liveDbMissing) {
          renderCommunityReviews(
            feed,
            status,
            [],
            "Reviews are temporarily unavailable right now.",
            true
          );
          return;
        }

        renderCommunityReviews(
          feed,
          status,
          [],
          "No reviews yet. Be the first traveller to leave one.",
          false
        );
      }
    };

    renderInitialReviews();
    primeReviewInvite();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const button = form.querySelector('button[type="submit"]');

      if (!button) {
        return;
      }

      const payload = Object.fromEntries(new FormData(form));
      response.textContent = "";
      response.removeAttribute("style");
      button.disabled = true;
      button.textContent = "Posting...";
      let lockAfterSubmit = false;

      try {
        const controller = await turnstileReady;

        if (
          !isLocalPreview() &&
          controller.enabled &&
          !String(form.elements.turnstile_token?.value || "").trim()
        ) {
          throw new Error("Please confirm you are human and try again.");
        }

        const result = await submitCommunityReview(payload);
        const review = result.review;
        const existingCard = Array.from(feed.children).find(
          (card) => card.dataset && card.dataset.reviewId === String(review.id)
        );

        if (existingCard) {
          existingCard.replaceWith(createReviewCard(review));
        } else {
          feed.prepend(createReviewCard(review));
        }

        feed.hidden = false;
        status.hidden = true;
        response.textContent = "Thanks. Your verified review is live now.";
        response.style.color = "var(--canopy)";
        form.reset();
        if (form.elements.review_token) {
          form.elements.review_token.value = reviewToken;
        }
        if (inviteStatus) {
          inviteStatus.textContent =
            "That review link has been used. Ask Zico if you need another one.";
        }
        setReviewFormAvailability(form, false);
        if (inviteSummary) {
          inviteSummary.hidden = true;
        }
        turnstileController?.reset();
        lockAfterSubmit = true;
      } catch (error) {
        if (isLocalPreview()) {
          const review = normalizeReview({
            ...payload,
            createdAt: new Date().toISOString(),
          });

          saveLocalReview(review);
          feed.prepend(createReviewCard(review));
          feed.hidden = false;
          status.hidden = true;
          response.textContent =
            "Saved in local preview. On the live site verified trip links publish reviews here.";
          response.style.color = "var(--canopy)";
          form.reset();
        } else {
          const liveDbMissing =
            error instanceof Error &&
            /reviews database is not configured yet/i.test(error.message);

          response.textContent = liveDbMissing
            ? "Reviews are temporarily unavailable right now."
            : error instanceof Error && error.message
              ? error.message
              : "Could not post your review right now. Please try again in a moment.";
          response.style.color = "var(--clay)";
          turnstileController?.reset();
        }
      } finally {
        button.disabled = lockAfterSubmit;
        button.textContent = "Post review";
      }
    });
  };

  setupContactForm();
  setupCommunityReviews();
});
