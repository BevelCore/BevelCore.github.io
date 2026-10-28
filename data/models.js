/* =========================================================
   BEVELCORE — LISTA DE MODELE
   ---------------------------------------------------------
   CUM ADAUGI UN MODEL NOU (3 pași):
   1. Creează un folder în /models, ex:  models/viking-helmet/
   2. Pune în el:  model.glb  (export din Blender: glTF 2.0 → glTF Binary)
                   cover.webp (sau .jpg/.png) – imaginea principală
                   alte imagini opționale (alt.webp, wire.jpg ...)
   3. Copiază un bloc { ... } de mai jos, lipește-l la ÎNCEPUTUL listei
      și schimbă valorile. Gata!

   Câmpuri:
     id          – numele folderului din /models (obligatoriu)
     category    – unul din id-urile din config.js (low-poly, high-poly, ...)
     name        – numele în engleză / română
     description – descrierea în engleză / română
     price       – preț în EUR (număr). 0 = GRATUIT, null = "Preț la cerere"
     buyUrl      – link de cumpărare (Gumroad, Sketchfab, Roblox...). "" = buton „Contactează-mă”
     images      – lista imaginilor din folder; prima e coperta. (implicit: cover.webp)
     model       – fișierul 3D din folder (implicit: model.glb)
     tris        – număr de triunghiuri (opțional)
     formats     – formate livrate
     tags        – cuvinte cheie pentru căutare și SEO
     views       – (opțional) alte fișiere 3D din folder, ex: [{ file: "interior.glb", label: { en: "Interior", ro: "Interior" }, orbit: "25deg 35deg 95%" }]
     orbit       – (opțional) unghiul inițial al camerei 3D, ex: "30deg 70deg auto"
     featured    – true = apare în secțiunea de sus (hero)
     isNew       – true = afișează eticheta „NEW”
   ========================================================= */
window.MODELS = [
  {
    id: "cozy-winter-cabin",
    category: "stylized",
    name: { en: "Cozy Winter Log Cabin — Full Interior", ro: "Cabană de iarnă din bușteni — cu interior complet" },
    description: {
      en: "Snowy log cabin with a fully furnished interior: living room with stone fireplace and Christmas tree, kitchen with dining table, three bedrooms, bathroom and a cellar hatch. Front porch with string lights, wreath and icicles, snow-covered roof and stone chimney. Every room is lit and modeled, so the camera can go inside — great for cozy, Christmas, survival and horror games. Use the 'Interior' 3D view to look inside without the roof.",
      ro: "Cabană din bușteni acoperită de zăpadă, cu interior complet mobilat: living cu șemineu din piatră și brad de Crăciun, bucătărie cu masă, trei dormitoare, baie și trapă de pivniță. Verandă cu instalație de lumini, coroniță și țurțuri, acoperiș cu zăpadă și horn din piatră. Fiecare cameră e modelată și luminată, deci camera poate intra în casă — perfectă pentru jocuri cozy, de Crăciun, survival și horror. Folosește vederea 3D „Interior” ca să vezi înăuntru fără acoperiș."
    },
    price: 10, buyUrl: "",
    images: ["exterior.webp", "cutaway-front.webp", "interior-living.webp", "interior-kitchen.webp", "interior-bedroom.webp", "veranda.webp", "cutaway-back.webp"],
    views: [ { file: "interior.glb", label: { en: "Interior", ro: "Interior" }, orbit: "25deg 35deg 95%" } ],
    tris: 52440, formats: ["GLB", "FBX", "OBJ", "BLEND"],
    tags: ["cabin", "log cabin", "house", "interior", "winter", "christmas", "snow", "furniture", "environment", "cabana"],
    featured: true, isNew: true
  },
  {
    id: "snowman-4-phases-pack",
    category: "asset-packs",
    name: { en: "Snowman 4 Phases Pack — Cute to Creepy", ro: "Pachet Om de Zăpadă în 4 faze — de la drăguț la înfricoșător" },
    description: {
      en: "Four snowman variants that evolve from a classic cheerful snowman into a cracked, glowing-eyed horror creature with ice fangs and spikes. Perfect for winter, Christmas and horror games, boss evolutions, trailers and seasonal events. Each phase is a separate, cleanly named object set with a pivoted head ready to animate.",
      ro: "Patru variante de om de zăpadă care evoluează de la clasicul om de zăpadă vesel la o creatură horror cu fisuri, ochi luminoși, colți și țepi de gheață. Perfect pentru jocuri de iarnă, Crăciun și horror, evoluții de boss, trailere și evenimente sezoniere. Fiecare fază e un set separat de obiecte, denumite clar, cu capul pe pivot, gata de animat."
    },
    price: 15, buyUrl: "",
    images: ["cover.webp", "scene.webp", "alt.webp"],
    tris: 51022, formats: ["GLB", "FBX", "OBJ", "BLEND"],
    tags: ["snowman", "winter", "christmas", "horror", "creepy", "evolution", "asset pack", "stylized", "om de zapada"],
    featured: true, isNew: true
  },
  {
    id: "royal-crown-ugc",
    category: "roblox-ugc",
    name: { en: "Royal Jewel Crown", ro: "Coroană regală cu pietre" },
    description: {
      en: "Gold crown with eight gem-tipped spikes and a velvet cushion. Built to Roblox UGC head-accessory limits, clean topology, ready for Studio import.",
      ro: "Coroană aurie cu opt vârfuri și pietre prețioase, cu interior de catifea. Respectă limitele Roblox UGC pentru accesorii de cap, topologie curată, gata de import în Studio."
    },
    price: 3, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 9408, formats: ["FBX", "OBJ", "BLEND"],
    tags: ["roblox", "ugc", "hat", "crown", "accessory", "king"],
    featured: true, isNew: true
  },
  {
    id: "neon-cat-headphones-ugc",
    category: "roblox-ugc",
    name: { en: "Neon Cat-Ear Headphones", ro: "Căști neon cu urechi de pisică" },
    description: {
      en: "Trendy cat-ear headphones with glowing neon accents. Optimised Roblox UGC accessory, emissive-ready materials.",
      ro: "Căști cu urechi de pisică și accente neon luminoase. Accesoriu Roblox UGC optimizat, materiale cu emisie de lumină."
    },
    price: 3, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 8152, formats: ["FBX", "OBJ", "BLEND"],
    tags: ["roblox", "ugc", "headphones", "cat ears", "neon", "accessory"],
    isNew: true
  },
  {
    id: "low-poly-floating-island",
    category: "low-poly",
    name: { en: "Low Poly Floating Island", ro: "Insulă plutitoare low poly" },
    description: {
      en: "Cozy floating island diorama with trees, a cottage and a waterfall. Flat-shaded, mobile friendly, perfect for menus and casual games.",
      ro: "Dioramă cu insulă plutitoare, copaci, căsuță și cascadă. Flat shading, potrivită pentru mobil, meniuri și jocuri casual."
    },
    price: 3, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 358, formats: ["GLB", "FBX", "OBJ", "BLEND"],
    tags: ["low poly", "island", "diorama", "environment", "mobile game"],
    featured: true
  },
  {
    id: "low-poly-pine-diorama",
    category: "low-poly",
    name: { en: "Low Poly Pine Tile", ro: "Pin low poly pe hexagon" },
    description: {
      en: "Ultra-light hex tile with a pine tree and rocks — under 200 triangles. Ideal for strategy, tile-based and hyper-casual games.",
      ro: "Hexagon ultra-ușor cu pin și pietre — sub 200 de triunghiuri. Ideal pentru jocuri de strategie, pe tile-uri și hyper-casual."
    },
    price: 2, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 174, formats: ["GLB", "FBX", "OBJ"],
    tags: ["low poly", "tree", "pine", "hex tile", "free"]
  },
  {
    id: "ornate-ceramic-vase",
    category: "high-poly",
    name: { en: "Ornate Ceramic Vase", ro: "Vază ceramică ornamentală" },
    description: {
      en: "High-detail glazed ceramic vase with gold trims and a wave ornament band. Smooth subdivided surfaces for close-up renders and product visualisation.",
      ro: "Vază ceramică glazurată, cu detalii aurii și bandă ornamentală. Suprafețe netede, subdivizate, pentru randări de aproape și vizualizare de produs."
    },
    price: 5, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 127104, formats: ["GLB", "FBX", "BLEND"],
    tags: ["high poly", "vase", "ceramic", "product visualization", "interior"]
  },
  {
    id: "abstract-marble-sculpture",
    category: "high-poly",
    name: { en: "Abstract Marble Sculpture", ro: "Sculptură abstractă din marmură" },
    description: {
      en: "Flowing torus-knot sculpture on a dark pedestal. High-poly decor piece for archviz, interior scenes and NFT/art renders.",
      ro: "Sculptură fluidă (torus knot) pe piedestal închis la culoare. Obiect decorativ high poly pentru archviz, interioare și randări artistice."
    },
    price: 5, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 87808, formats: ["GLB", "FBX", "BLEND"],
    tags: ["high poly", "sculpture", "marble", "archviz", "decor"]
  },
  {
    id: "medieval-props-pack",
    category: "asset-packs",
    name: { en: "Medieval Props Pack", ro: "Pachet obiecte medievale" },
    description: {
      en: "Crates, barrels, bucket, grain sack and lantern — a ready-to-dress medieval set. Each prop is a separate, game-ready object.",
      ro: "Lăzi, butoaie, găleată, sac și felinar — set medieval gata de folosit. Fiecare obiect este separat și game-ready."
    },
    price: 5, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 4400, formats: ["GLB", "FBX", "OBJ", "BLEND"],
    tags: ["asset pack", "medieval", "props", "barrel", "crate", "rpg"],
    featured: true
  },
  {
    id: "stylized-nature-pack",
    category: "asset-packs",
    name: { en: "Stylized Nature Pack", ro: "Pachet natură stilizată" },
    description: {
      en: "Rocks, mushrooms, bushes, grass tufts and a tree stump in a bright stylized look. Mix and match to build forests fast.",
      ro: "Pietre, ciuperci, tufișuri, fire de iarbă și un buștean, într-un stil colorat. Combină-le pentru a construi rapid păduri."
    },
    price: 5, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 1652, formats: ["GLB", "FBX", "OBJ", "BLEND"],
    tags: ["asset pack", "nature", "rocks", "mushroom", "foliage", "stylized"]
  },
  {
    id: "mushroom-cottage",
    category: "stylized",
    name: { en: "Mushroom Cottage", ro: "Căsuța-ciupercă" },
    description: {
      en: "Whimsical fairy-tale mushroom house with glowing windows and a stone path. Great for cozy, fantasy and kids games.",
      ro: "Căsuță-ciupercă din povești, cu ferestre luminate și potecă de piatră. Perfectă pentru jocuri cozy, fantasy și pentru copii."
    },
    price: 3, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 7244, formats: ["GLB", "FBX", "BLEND"],
    tags: ["stylized", "fantasy", "mushroom", "house", "cozy"]
  },
  {
    id: "arcane-potion-bottle",
    category: "stylized",
    name: { en: "Arcane Potion Bottle", ro: "Sticlă cu poțiune magică" },
    description: {
      en: "Glass potion flask with glowing purple liquid, bubbles and a cork stopper. Transparent materials set up for real-time engines.",
      ro: "Flacon de sticlă cu lichid mov luminos, bule și dop de plută. Materiale transparente pregătite pentru motoare real-time."
    },
    price: 4, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 13796, formats: ["GLB", "FBX", "BLEND"],
    tags: ["stylized", "potion", "bottle", "magic", "rpg item"]
  },
  {
    id: "pirate-treasure-chest",
    category: "game-ready",
    name: { en: "Pirate Treasure Chest", ro: "Cufăr de comori pirat" },
    description: {
      en: "Iron-banded wooden chest with a gold lock and spilled coins. Lid is a separate object, ready to animate.",
      ro: "Cufăr de lemn cu benzi de fier, lacăt auriu și monede. Capacul este obiect separat, gata de animat."
    },
    price: 5, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 2256, formats: ["GLB", "FBX", "OBJ", "BLEND"],
    tags: ["game ready", "chest", "treasure", "pirate", "loot"]
  },
  {
    id: "sci-fi-cargo-crate",
    category: "game-ready",
    name: { en: "Sci-Fi Cargo Crate", ro: "Container sci-fi" },
    description: {
      en: "Armored sci-fi crate with emissive light strips and hazard corners. Very low triangle count, ideal for shooters and space games.",
      ro: "Container sci-fi blindat, cu benzi luminoase și colțuri de avertizare. Număr foarte mic de triunghiuri, ideal pentru shootere și jocuri spațiale."
    },
    price: 5, buyUrl: "",
    images: ["cover.webp", "alt.webp"],
    tris: 336, formats: ["GLB", "FBX", "OBJ", "BLEND"],
    tags: ["game ready", "sci-fi", "crate", "container", "fps"]
  }
];
