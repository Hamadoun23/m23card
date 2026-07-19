/* =========================================================
   VP — Vêtement Palace · Logique propre à la page Catalogue
   Dépend de : products.js, common.js, cart.js.
   ========================================================= */

function renderCatalogue(filter = "Tous") {
  const list = filter === "Tous" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  $("#catalogue-grid").innerHTML = list.map((p, idx) => cardHTML(p, idx)).join("");
  observeReveals();
}

function renderFilters(active = "Tous") {
  const cats = ["Tous", ...CATEGORIES];
  $("#filters").innerHTML = cats.map(c =>
    `<button class="filter ${c === active ? "active" : ""}" data-filter="${c}">${c}</button>`
  ).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  markCurrentNav("catalogue");

  const params = new URLSearchParams(window.location.search);
  const requestedCat = params.get("cat");
  const initial = requestedCat && CATEGORIES.includes(requestedCat) ? requestedCat : "Tous";

  renderFilters(initial);
  renderCatalogue(initial);
});
