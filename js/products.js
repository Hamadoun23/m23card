/* =========================================================
   VP — Vêtement Palace · Données produits
   Source unique de vérité, partagée par la home et le catalogue.
   Généré à partir des 32 photos. Modifiez librement noms / prix / catégories.
   ========================================================= */

const CATEGORIES = ["Agbada", "Kaftan", "Ensemble", "Grand Boubou"];

const CATEGORY_COVER = {
  Agbada: "assets/images/produit-20.jpeg",
  Kaftan: "assets/images/produit-02.jpeg",
  Ensemble: "assets/images/produit-03.jpeg",
  "Grand Boubou": "assets/images/produit-08.jpeg"
};

const NAMES = {
  Agbada:        ["Agbada Royal", "Agbada Prestige", "Agbada Émir", "Agbada Sénateur", "Agbada Cérémonie", "Agbada Grand Soir"],
  Kaftan:        ["Kaftan Signature", "Kaftan Lin Brodé", "Kaftan Élégance", "Kaftan Djellaba", "Kaftan Vendredi", "Kaftan Prestige"],
  Ensemble:      ["Ensemble 2 Pièces", "Ensemble Tailleur", "Ensemble Brodé", "Ensemble Contemporain", "Ensemble Leader", "Ensemble Palace"],
  "Grand Boubou":["Grand Boubou Bazin", "Grand Boubou Fête", "Grand Boubou Noble", "Grand Boubou Riche", "Grand Boubou Sahel", "Grand Boubou Majesté"]
};
const COLORS = ["Bleu ciel", "Blanc cassé", "Beige sable", "Vert forêt", "Bordeaux", "Chocolat", "Ivoire", "Olive", "Bleu nuit", "Or"];
const PRICES = [35000, 42000, 45000, 48000, 55000, 60000, 65000, 72000, 85000, 95000];

const PRODUCTS = Array.from({ length: 32 }, (_, i) => {
  const cat = CATEGORIES[i % CATEGORIES.length];
  const nameList = NAMES[cat];
  const name = nameList[Math.floor(i / CATEGORIES.length) % nameList.length];
  const color = COLORS[i % COLORS.length];
  const price = PRICES[(i * 3) % PRICES.length];
  const promo = i % 5 === 0;                 // 1 produit sur 5 en promo
  const isNew = i % 4 === 1;                  // quelques "nouveautés"
  return {
    id: "vp-" + String(i + 1).padStart(2, "0"),
    name,
    category: cat,
    color,
    price,
    oldPrice: promo ? Math.round(price * 1.25 / 1000) * 1000 : null,
    isNew,
    img: `assets/images/produit-${String(i + 1).padStart(2, "0")}.jpeg`
  };
});
