window.SITE_CONFIG = {
  brand: "BEVELCORE",
  siteUrl: "https://bevelcore.github.io/",

  /* ---- CONTACT ---- */
  email: "bevelcore@gmail.com",
  discord: "https://discord.com/users/458569668165107712",
  social: {
    instagram: "https://instagram.com/bevelcore",   // PLACEHOLDER – schimbă cu linkul tău
    tiktok: "https://www.tiktok.com/@bevelcore",     // PLACEHOLDER – schimbă cu linkul tău
    artstation: "",
    youtube: "",
    sketchfab: ""
  },
  baseCurrency: "EUR",
  currencies: ["EUR", "RON", "USD"],
  fallbackRates: { EUR: 1, RON: 5.09, USD: 1.16 },
  liveRates: true,

  /* ---- CATEGORII ----
     id = numele scurt folosit în models.js (fără spații)
     Poți adăuga categorii noi copiind un rând. */
  categories: [
    { id: "low-poly",    en: "Low Poly",        ro: "Low Poly" },
    { id: "high-poly",   en: "High Poly",       ro: "High Poly" },
    { id: "asset-packs", en: "Asset Packs",     ro: "Pachete de asset-uri" },
    { id: "roblox-ugc",  en: "Roblox UGC",      ro: "Roblox UGC" },
    { id: "stylized",    en: "Stylized",        ro: "Stilizate" },
    { id: "game-ready",  en: "Game-Ready Props", ro: "Obiecte game-ready" }
  ]
};
