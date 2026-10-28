// Mobile nav toggle. The nav is visible without JS; the script collapses it.
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById(toggle?.getAttribute("aria-controls"));

if (toggle && nav) {
  nav.dataset.open = "false";
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    const open = nav.dataset.open !== "true";
    nav.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  });
}
