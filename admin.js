"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const endpoint = "/api/admin/dashboard";
  const inviteEndpoint = "/api/admin/review-invites";
  const status = document.querySelector("[data-admin-status]");
  const inquiryList = document.querySelector("[data-admin-inquiries]");
  const reviewList = document.querySelector("[data-admin-reviews]");
  const inviteList = document.querySelector("[data-admin-invites]");
  const inviteForm = document.querySelector("[data-admin-invite-form]");
  const generatedPanel = document.querySelector("[data-admin-generated]");
  const generatedLinks = document.querySelector("[data-generated-links]");

  const setStatus = (message, isError = false) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  };

  const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value || "")
      : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(date);
  };

  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const emptyState = (text) => {
    const node = make("p", "admin-empty", text);
    return node;
  };

  const actionButton = (label, action, id, extra = {}) => {
    const button = make("button", "admin-action", label);
    button.type = "button";
    button.dataset.adminAction = action;
    button.dataset.recordId = String(id);
    Object.entries(extra).forEach(([key, value]) => {
      button.dataset[key] = String(value);
    });
    return button;
  };

  const renderInquiries = (inquiries) => {
    inquiryList.replaceChildren();
    document.querySelector("[data-inquiry-count]").textContent = String(inquiries.length);
    if (!inquiries.length) {
      inquiryList.appendChild(emptyState("No inquiries yet."));
      return;
    }

    inquiries.forEach((inquiry) => {
      const card = make("article", "admin-record glass-panel");
      const head = make("div", "admin-record-head");
      const titleWrap = make("div");
      titleWrap.append(make("h3", "", inquiry.name), make("p", "admin-record-meta", `${inquiry.email} / ${formatDate(inquiry.created_at)}`));
      head.append(titleWrap, make("span", `admin-badge admin-badge--${inquiry.status}`, inquiry.status));
      card.append(head, make("p", "admin-record-trip", inquiry.trip));
      if (inquiry.message) card.appendChild(make("p", "admin-record-body", inquiry.message));
      const actions = make("div", "admin-record-actions");
      if (inquiry.status !== "contacted") actions.appendChild(actionButton("Mark contacted", "inquiry-status", inquiry.id, { status: "contacted" }));
      if (inquiry.status !== "closed") actions.appendChild(actionButton("Close", "inquiry-status", inquiry.id, { status: "closed" }));
      if (inquiry.status !== "new") actions.appendChild(actionButton("Reopen", "inquiry-status", inquiry.id, { status: "new" }));
      card.appendChild(actions);
      inquiryList.appendChild(card);
    });
  };

  const renderReviews = (reviews) => {
    reviewList.replaceChildren();
    document.querySelector("[data-review-count]").textContent = String(reviews.length);
    if (!reviews.length) {
      reviewList.appendChild(emptyState("No submitted reviews yet."));
      return;
    }

    reviews.forEach((review) => {
      const isPublished = Number(review.approved) === 1;
      const card = make("article", "admin-record glass-panel");
      const head = make("div", "admin-record-head");
      const titleWrap = make("div");
      titleWrap.append(make("h3", "", review.public_name), make("p", "admin-record-meta", `${review.trip} / ${review.rating} stars / ${formatDate(review.created_at)}`));
      head.append(titleWrap, make("span", `admin-badge ${isPublished ? "admin-badge--published" : "admin-badge--hidden"}`, isPublished ? "published" : "hidden"));
      card.append(head, make("p", "admin-record-body", review.review));
      const actions = make("div", "admin-record-actions");
      actions.appendChild(actionButton(isPublished ? "Unpublish" : "Publish", "review-status", review.id, { approved: isPublished ? "false" : "true" }));
      card.appendChild(actions);
      reviewList.appendChild(card);
    });
  };

  const renderInvites = (invites) => {
    inviteList.replaceChildren();
    document.querySelector("[data-invite-count]").textContent = String(invites.length);
    if (!invites.length) {
      inviteList.appendChild(emptyState("No review invitations created yet."));
      return;
    }

    invites.forEach((invite) => {
      const card = make("article", "admin-record admin-record--compact glass-panel");
      const head = make("div", "admin-record-head");
      const titleWrap = make("div");
      titleWrap.append(make("h3", "", invite.name), make("p", "admin-record-meta", `${invite.contact} / ${invite.trip}`));
      head.append(titleWrap, make("span", `admin-badge admin-badge--${invite.status}`, invite.status));
      card.appendChild(head);
      if (invite.status === "issued") {
        const actions = make("div", "admin-record-actions");
        actions.appendChild(actionButton("Revoke link", "invite-revoke", invite.id));
        card.appendChild(actions);
      }
      inviteList.appendChild(card);
    });
  };

  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Request failed (${response.status}).`);
    return payload;
  };

  const loadDashboard = async () => {
    setStatus("Loading current records...");
    try {
      const data = await request(endpoint);
      renderInquiries(data.inquiries || []);
      renderReviews(data.reviews || []);
      renderInvites(data.invites || []);
      setStatus(`Updated ${new Intl.DateTimeFormat("en-GB", { timeStyle: "short" }).format(new Date())}`);
    } catch (error) {
      setStatus(error.message, true);
    }
  };

  document.addEventListener("click", async (event) => {
    const refresh = event.target.closest("[data-admin-refresh]");
    if (refresh) {
      loadDashboard();
      return;
    }

    const copy = event.target.closest("[data-copy-invites]");
    if (copy && generatedLinks) {
      await navigator.clipboard.writeText(generatedLinks.value);
      setStatus("Review links copied.");
      return;
    }

    const button = event.target.closest("[data-admin-action]");
    if (!button) return;
    button.disabled = true;
    try {
      const body = {
        action: button.dataset.adminAction,
        id: Number(button.dataset.recordId),
      };
      if (button.dataset.status) body.status = button.dataset.status;
      if (button.dataset.approved) body.approved = button.dataset.approved === "true";
      await request(endpoint, { method: "PATCH", body: JSON.stringify(body) });
      await loadDashboard();
    } catch (error) {
      setStatus(error.message, true);
      button.disabled = false;
    }
  });

  inviteForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = inviteForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    setStatus("Creating secure links...");

    const formData = new FormData(inviteForm);
    const attendees = String(formData.get("attendees") || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(",");
        return separator < 0
          ? { name: line, contact: "" }
          : { name: line.slice(0, separator).trim(), contact: line.slice(separator + 1).trim() };
      });

    try {
      const data = await request(inviteEndpoint, {
        method: "POST",
        body: JSON.stringify({
          trip: formData.get("trip"),
          trip_date: formData.get("trip_date"),
          expires_in_days: formData.get("expires_in_days"),
          attendees,
        }),
      });
      generatedLinks.value = data.invites
        .map((invite) => `${invite.name}, ${invite.contact}\n${invite.url}`)
        .join("\n\n");
      generatedPanel.hidden = false;
      setStatus(`${data.invites.length} secure review link${data.invites.length === 1 ? "" : "s"} created.`);
      await loadDashboard();
    } catch (error) {
      setStatus(error.message, true);
    } finally {
      submit.disabled = false;
    }
  });

  loadDashboard();
});
