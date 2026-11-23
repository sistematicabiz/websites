// Small interface behaviours. The sites work fully without this file.

// Sistematica: mark the menu item of the section in view.
(() => {
  if (document.documentElement.dataset.site !== "sistematica" || !("IntersectionObserver" in window)) return;
  const links = new Map();
  for (const a of document.querySelectorAll('header nav a[href^="#"]')) {
    const section = document.getElementById(a.hash.slice(1));
    if (section) links.set(section, a);
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const link = links.get(entry.target);
        if (entry.isIntersecting) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    },
    { rootMargin: "-40% 0px -59% 0px" }
  );
  links.forEach((_, section) => observer.observe(section));
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
