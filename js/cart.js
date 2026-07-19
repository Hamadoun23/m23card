/* =========================================================
   VP — Vêtement Palace · Panier & commande WhatsApp
   Dépend de : products.js (PRODUCTS), common.js ($, $$, fmt, showToast).
   localStorage partagé entre toutes les pages (même origine).
   ========================================================= */

let cart = JSON.parse(localStorage.getItem("vp-cart") || "[]");
const saveCart = () => localStorage.setItem("vp-cart", JSON.stringify(cart));

function addToCart(id) {
  const item = cart.find(c => c.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  const p = PRODUCTS.find(p => p.id === id);
  showToast(`« ${p.name} » ajouté au panier`);
}
function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
}
function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
}
const cartTotal = () => cart.reduce((s, c) => {
  const p = PRODUCTS.find(p => p.id === c.id);
  return s + (p ? p.price * c.qty : 0);
}, 0);
const cartCount = () => cart.reduce((s, c) => s + c.qty, 0);

function bumpCount() {
  const el = $("#cart-count");
  const n = cartCount();
  el.textContent = n;
  el.classList.toggle("show", n > 0);
}

/* ---------- Rendu panier ---------- */
function renderCart() {
  const body = $("#cart-body");
  if (!cart.length) {
    body.innerHTML = `
      <div class="cart__empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>Votre panier est vide.<br>Ajoutez des pièces au panier et validez.</p>
      </div>`;
  } else {
    body.innerHTML = cart.map(c => {
      const p = PRODUCTS.find(p => p.id === c.id);
      if (!p) return "";
      return `
        <div class="cart-item">
          <img src="${p.img}" alt="${p.name}">
          <div class="cart-item__info">
            <span class="cart-item__name">${p.name}</span>
            <span class="cart-item__price">${fmt(p.price)}</span>
            <div class="cart-item__ctrl">
              <div class="qty">
                <button data-dec="${p.id}" aria-label="Moins">−</button>
                <span>${c.qty}</span>
                <button data-inc="${p.id}" aria-label="Plus">+</button>
              </div>
              <button class="cart-item__remove" data-remove="${p.id}">Retirer</button>
            </div>
          </div>
        </div>`;
    }).join("");
  }
  $("#cart-total").textContent = fmt(cartTotal());
  const checkoutBtn = $("#cart-checkout");
  checkoutBtn.toggleAttribute("disabled", cart.length === 0);
  bumpCount();
}

/* ---------- Checkout WhatsApp ---------- */
function checkout() {
  if (!cart.length) return;
  let msg = "Bonjour VP — Vêtement Palace,\nJe souhaite commander :\n\n";
  cart.forEach(c => {
    const p = PRODUCTS.find(p => p.id === c.id);
    msg += `• ${p.name} (${p.color}) × ${c.qty} — ${fmt(p.price * c.qty)}\n`;
  });
  msg += `\nTotal : ${fmt(cartTotal())}\n\nMerci de me confirmer la disponibilité, les tailles et la livraison.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ---------- Drawer ---------- */
const openCart = () => { $("#cart").classList.add("open"); $("#overlay").classList.add("open"); document.body.style.overflow = "hidden"; };
const closeCart = () => { $("#cart").classList.remove("open"); $("#overlay").classList.remove("open"); document.body.style.overflow = ""; };

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  $("#cart-open").addEventListener("click", openCart);
  $("#cart-close").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);
  $("#cart-checkout").addEventListener("click", checkout);
});
