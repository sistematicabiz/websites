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
