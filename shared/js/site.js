// Small interface behaviours. The sites work fully without this file.

// Sistematica: mark the menu item of the section in view.
(() => {
  if (document.documentElement.dataset.site !== "sistematica") return;
  const items = [...document.querySelectorAll('header nav a[href^="#"]')]
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter((item) => item.section);
  let queued = false;
  const update = () => {
    queued = false;
    const ordered = [...items].sort((a, b) => a.section.getBoundingClientRect().top - b.section.getBoundingClientRect().top);
    const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const line = window.innerHeight * 0.4;
    const reached = ordered.filter((item) => item.section.getBoundingClientRect().top <= line);
    const active = atEnd ? ordered.at(-1) : reached.at(-1);
    for (const item of items) {
      if (item === active) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    }
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();
})();

// Briefly outline the block reached from an in-page link.
(() => {
  const DURATION = 1200;
  const highlight = (hash) => {
    if (!hash || hash === "#top") return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      target.classList.remove("arrived");
      void target.offsetWidth;
      target.classList.add("arrived");
      setTimeout(() => target.classList.remove("arrived"), DURATION);
    };
    window.addEventListener("scrollend", start, { once: true });
    setTimeout(start, 750);
  };
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.('a[href*="#"]');
    if (link && link.pathname === location.pathname && link.origin === location.origin) highlight(link.hash);
  });
  if (location.hash) highlight(location.hash);
})();

// Contact forms: messages under each field. Without JavaScript the browser's own validation still applies.
// Netlify removes data-netlify from the published HTML, so forms are found by name.
(() => {
  const MESSAGES = {
    name: "Please enter your name.",
    emailMissing: "Please enter your email address.",
    emailInvalid: "Please enter a valid email address, like name@example.com.",
    message: "Please write your message.",
  };
  const problem = (field) => {
    const empty = !field.value.trim();
    if (field.type === "email") {
      if (empty) return MESSAGES.emailMissing;
      return field.validity.typeMismatch ? MESSAGES.emailInvalid : "";
    }
    return empty ? MESSAGES[field.name] : "";
  };
  const show = (field, text) => {
    const box = field.closest(".f");
    const id = `${field.id}-error`;
    let error = document.getElementById(id);
    if (text) {
      if (!error) {
        error = document.createElement("p");
        error.id = id;
        error.className = "field-error";
        box.append(error);
      }
      error.textContent = text;
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", id);
      box.classList.add("has-error");
    } else {
      error?.remove();
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
      box.classList.remove("has-error");
    }
  };
  for (const form of document.querySelectorAll('form[name^="contact-"]')) {
    const fields = [...form.querySelectorAll(".f [required]")];
    const button = form.querySelector('button[type="submit"]');
    const label = button.textContent;
    form.noValidate = true;
    for (const field of fields) {
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid")) show(field, problem(field));
      });
      field.addEventListener("blur", () => {
        if (field.value.trim()) show(field, problem(field));
      });
    }
    form.addEventListener("submit", (event) => {
      if (button.classList.contains("is-sending")) return event.preventDefault();
      const invalid = fields.filter((field) => {
        const text = problem(field);
        show(field, text);
        return text;
      });
      if (invalid.length) {
        event.preventDefault();
        invalid[0].focus();
        return;
      }
      button.classList.add("is-sending");
      button.setAttribute("aria-disabled", "true");
      button.textContent = "Sending…";
    });
    // Coming back with the browser's Back button: the form is usable again.
    window.addEventListener("pageshow", () => {
      button.classList.remove("is-sending");
      button.removeAttribute("aria-disabled");
      button.textContent = label;
    });
  }
})();

// Small screens: the menu folds into a burger button. Without JavaScript the menu stays visible as a list.
(() => {
  const header = document.querySelector("header.site");
  const nav = header?.querySelector("nav");
  const bar = header?.querySelector(".wrap");
  if (!nav || !bar) return;
  if (!nav.id) nav.id = "site-menu";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "menu-toggle";
  button.setAttribute("aria-controls", nav.id);
  button.setAttribute("aria-expanded", "false");
  button.innerHTML =
    '<span class="sr-only">Menu</span><svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path class="b1" d="M3 6h18"/><path class="b2" d="M3 12h18"/><path class="b3" d="M3 18h18"/></svg>';
  bar.insertBefore(button, nav);
  header.classList.add("has-menu");
  const set = (open, refocus) => {
    header.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    if (!open && refocus) button.focus();
  };
  button.addEventListener("click", () => set(!header.classList.contains("menu-open")));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) set(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("menu-open")) set(false, true);
  });
  document.addEventListener("click", (event) => {
    if (header.classList.contains("menu-open") && !header.contains(event.target)) set(false);
  });
  window.matchMedia("(min-width:1001px)").addEventListener("change", (event) => {
    if (event.matches) set(false);
  });
})();

// Touch screens have no hover, so home-page cards fade in as they come into view instead.
// The cards are only hidden once this script has run, so without JavaScript nothing is lost.
(() => {
  if (!("IntersectionObserver" in window)) return;
  if (!window.matchMedia("(hover:none)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const cards = [...document.querySelectorAll(".areas .col, .press .pr, .svc > *, .collab .cb")];
  if (!cards.length) return;
  const seen = new Map();
  for (const card of cards) {
    const index = seen.get(card.parentElement) ?? 0;
    seen.set(card.parentElement, index + 1);
    card.style.setProperty("--reveal-delay", `${Math.min(index, 3) * 80}ms`);
    card.classList.add("reveal");
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  cards.forEach((card) => observer.observe(card));
})();
