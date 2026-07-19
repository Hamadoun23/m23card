/* =========================================================
   VP — Vêtement Palace · Données produits
   Source unique de vérité, partagée par la home et le catalogue.
   Chaque catégorie a son propre dossier dans assets/images/ —
   ajoutez ou remplacez des photos directement dedans.
   ========================================================= */

const CATEGORIES = [
  "VP - Big Boubou", "VP - Majesty", "VP - Uniforms for mariage", "VP - Royales",
  "VP - Féminin", "VP - Classe", "VP - Bazin", "VP Chill", "VP - Pro",
  "VP - Boubou Tissu", "VP - Bogolan", "VP - Costard"
];

// Dossier assets/images/<slug>/ associé à chaque catégorie
const CATEGORY_FOLDER = {
  "VP - Big Boubou": "big-boubou",
  "VP - Majesty": "majesty",
  "VP - Uniforms for mariage": "uniforms-for-mariage",
  "VP - Royales": "royales",
  "VP - Féminin": "feminin",
  "VP - Classe": "classe",
  "VP - Bazin": "bazin",
  "VP Chill": "chill",
  "VP - Pro": "pro",
  "VP - Boubou Tissu": "boubou-tissu",
  "VP - Bogolan": "bogolan",
  "VP - Costard": "costard"
};

// Nombre de photos actuellement présentes dans chaque dossier
const CATEGORY_COUNT = {
  "VP - Big Boubou": 3,
  "VP - Majesty": 3,
  "VP - Uniforms for mariage": 3,
  "VP - Royales": 3,
  "VP - Féminin": 3,
  "VP - Classe": 3,
  "VP - Bazin": 3,
  "VP Chill": 3,
  "VP - Pro": 3,
  "VP - Boubou Tissu": 3,
  "VP - Bogolan": 2,
  "VP - Costard": 1
};

const CATEGORY_COVER = Object.fromEntries(
  CATEGORIES.map(cat => [cat, `assets/images/${CATEGORY_FOLDER[cat]}/produit-01.jpeg`])
);

const COLORS = ["Bleu ciel", "Blanc cassé", "Beige sable", "Vert forêt", "Bordeaux", "Chocolat", "Ivoire", "Olive", "Bleu nuit", "Or"];

// Prix à définir plus tard — tout est à 0 FCFA pour le moment.
const PRODUCTS = CATEGORIES.flatMap((cat, catIdx) => {
  const folder = CATEGORY_FOLDER[cat];
  return Array.from({ length: CATEGORY_COUNT[cat] }, (_, n) => {
    const globalIdx = catIdx * 10 + n; // pour varier la couleur / promo / nouveauté
    const color = COLORS[globalIdx % COLORS.length];
    const promo = n === 0;
    const isNew = n === 1;
    return {
      id: `${folder}-${String(n + 1).padStart(2, "0")}`,
      name: cat,
      category: cat,
      color,
      price: 0,
      oldPrice: null,
      promo,
      isNew,
      img: `assets/images/${folder}/produit-${String(n + 1).padStart(2, "0")}.jpeg`
    };
  });
});
