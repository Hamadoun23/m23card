/* =========================================================
   VP — Vêtement Palace · Code commun (toutes les pages)
   Utilitaires, nav, reveal, lightbox, effets hero, délégation de clics.
   Dépend de : products.js (PRODUCTS). Chargé avant cart.js.
   ========================================================= */

const WHATSAPP_NUMBER = "22374335905"; // numéro qui reçoit les commandes

/* ---------- Utilitaires ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = n => n.toLocaleString("fr-FR") + " FCFA";

/* ---------- Rendu carte produit (partagé home + catalogue) ---------- */
function cardHTML(p, idx = 0) {
  const tag = p.oldPrice
    ? `<span class="card__tag card__tag--promo">Promo</span>`
    : (p.isNew ? `<span class="card__tag">Nouveau</span>` : "");
  const old = p.oldPrice ? `<span class="card__old">${fmt(p.oldPrice)}</span>` : "";
  const delay = (idx % 8) * 0.08;
  return `
    <article class="card reveal reveal-up" data-cat="${p.category}" style="transition-delay: ${delay}s">
      <div class="card__media">
        ${tag}
        <button class="card__zoom" data-zoom="${p.img}" aria-label="Agrandir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
        <img src="${p.img}" alt="${p.name} — ${p.color}" loading="lazy">
      </div>
      <div class="card__body">
        <span class="card__cat">${p.category} · ${p.color}</span>
        <h3 class="card__name">${p.name}</h3>
        <div class="card__price-row">
          <span class="card__price">${fmt(p.price)}</span>${old}
        </div>
        <button class="card__add" data-add="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter au panier
        </button>
      </div>
    </article>`;
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  $("#toast-msg").textContent = msg;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2600);
}

/* ---------- Reveal on scroll ---------- */
let io;
function observeReveals() {
  if (!io) {
    io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
  }
  $$(".reveal:not(.in)").forEach(el => io.observe(el));
}

/* ---------- Magnetic Hover Effect ---------- */
function initMagneticButtons() {
  if (window.matchMedia("(pointer: fine)").matches) {
    const magnets = $$(".whatsapp-float, .to-top, .nav__logo");
    magnets.forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }
}

/* ---------- Hero cursor spotlight (page d'accueil uniquement) ---------- */
function initHeroSpotlight() {
  const hero = $("#hero");
  if (!hero || !window.matchMedia("(pointer: fine)").matches) return;
  hero.addEventListener("mousemove", e => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty("--mx", x + "%");
    hero.style.setProperty("--my", y + "%");
  });
}

/* ---------- Lightbox ---------- */
function openLightbox(src) {
  $("#lightbox-img").src = src;
  $("#lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  $("#lightbox").classList.remove("open");
  if (!$("#cart").classList.contains("open")) document.body.style.overflow = "";
}

/* ---------- Marque la page courante dans la nav ---------- */
function markCurrentNav(key) {
  $$(`[data-nav]`).forEach(a => a.classList.toggle("is-current", a.dataset.nav === key));
}

/* ---------- Init commun ---------- */
document.addEventListener("DOMContentLoaded", () => {
  observeReveals();
  initMagneticButtons();
  initHeroSpotlight();

  // Délégation de clics partagée (zoom, panier, filtres si présents)
  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add) { addToCart(add.dataset.add); return; }
    const inc = e.target.closest("[data-inc]");
    if (inc) { changeQty(inc.dataset.inc, 1); return; }
    const dec = e.target.closest("[data-dec]");
    if (dec) { changeQty(dec.dataset.dec, -1); return; }
    const rm = e.target.closest("[data-remove]");
    if (rm) { removeItem(rm.dataset.remove); return; }
    const zoom = e.target.closest("[data-zoom]");
    if (zoom) { openLightbox(zoom.dataset.zoom); return; }
    const filter = e.target.closest("[data-filter]");
    if (filter && typeof renderCatalogue === "function") {
      $$(".filter").forEach(f => f.classList.remove("active"));
      filter.classList.add("active");
      const grid = $("#catalogue-grid");
      grid.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      grid.style.opacity = "0";
      grid.style.transform = "translateY(20px)";
      setTimeout(() => {
        renderCatalogue(filter.dataset.filter);
        grid.style.opacity = "1";
        grid.style.transform = "translateY(0)";
      }, 250);
      return;
    }
  });

  // Nav mobile
  const burger = $("#burger"), mob = $("#nav-mobile");
  burger.addEventListener("click", () => { burger.classList.toggle("open"); mob.classList.toggle("open"); });
  $$("#nav-mobile a").forEach(a => a.addEventListener("click", () => { burger.classList.remove("open"); mob.classList.remove("open"); }));

  // Nav scroll state + scroll-to-top
  const nav = $("#nav"), toTop = $("#to-top");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
    toTop.classList.toggle("show", window.scrollY > 600);
  });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Lightbox
  $("#lightbox-close").addEventListener("click", closeLightbox);
  $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") closeLightbox(); });

  // Escape ferme les overlays
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeCart(); closeLightbox(); }
  });
});
