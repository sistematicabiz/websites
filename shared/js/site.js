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
