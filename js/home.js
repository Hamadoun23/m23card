/* =========================================================
   VP — Vêtement Palace · Logique propre à la page d'accueil
   Dépend de : products.js, common.js, cart.js.
   ========================================================= */

/* ---------- Marquee ---------- */
function buildMarquee() {
  const items = ["VP — Vêtement Palace", "La marque des Leaders", "Être l'art ou porter l'art", "Collection Premium", "Bamako · Mali"];
  const seq = [...items, ...items].map(t => `<span>${t}</span><span class="dot">✦</span>`).join("");
  $("#marquee-track").innerHTML = seq;
}

/* ---------- Nouveautés (teaser vers le catalogue) ---------- */
function renderFeatured() {
  const featured = PRODUCTS.filter(p => p.isNew).slice(0, 8);
  $("#featured-grid").innerHTML = featured.map((p, idx) => cardHTML(p, idx)).join("");
  observeReveals();
}

/* ---------- Tuiles catégories → catalogue.html?cat=... ---------- */
function renderCategoryTiles() {
  const el = $("#cat-tiles");
  if (!el) return;
  el.innerHTML = CATEGORIES.map(cat => `
    <a class="cat-tile" href="catalogue.html?cat=${encodeURIComponent(cat)}">
      <img src="${CATEGORY_COVER[cat]}" alt="${cat}" loading="lazy">
      <div class="cat-tile__overlay"></div>
      <div class="cat-tile__label">
        <span>Collection</span>
        <h3>${cat}</h3>
      </div>
    </a>
  `).join("");
}

/* ---------- Stats Counters Animation ---------- */
function animateStats() {
  const stats = $$(".stat-count");
  stats.forEach(stat => {
    const target = parseInt(stat.dataset.target, 10);
    let count = 0;
    const duration = 1600;
    const increment = target / (duration / 16);

    const updateCount = () => {
      count += increment;
      if (count >= target) {
        stat.textContent = target;
      } else {
        stat.textContent = Math.floor(count);
        requestAnimationFrame(updateCount);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => requestAnimationFrame(updateCount), 200);
        observer.unobserve(stat);
      }
    }, { threshold: 0.1 });

    observer.observe(stat);
  });
}

/* ---------- Suivi de section active dans la nav ---------- */
function initScrollSpy() {
  const sectionToNav = { hero: "home", featured: "featured", affiliation: "affiliation", contact: "contact" };
  const sections = Object.keys(sectionToNav).map(id => $("#" + id)).filter(Boolean);
  if (!sections.length) return;
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) markCurrentNav(sectionToNav[e.target.id]); });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
  sections.forEach(s => spy.observe(s));
}

document.addEventListener("DOMContentLoaded", () => {
  markCurrentNav("home");
  initScrollSpy();
  buildMarquee();
  renderFeatured();
  renderCategoryTiles();
  animateStats();

  // Affiliation → WhatsApp
  $("#affil-btn").addEventListener("click", e => {
    e.preventDefault();
    const msg = "Bonjour VP, je souhaite rejoindre le Programme Ambassadeurs et recevoir mon code promo.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  // Newsletter
  $("#newsletter-form").addEventListener("submit", e => {
    e.preventDefault();
    e.target.reset();
    $("#newsletter-feedback").textContent = "✦ Inscription réussie ! Bienvenue dans le Cercle VP.";
  });
});
