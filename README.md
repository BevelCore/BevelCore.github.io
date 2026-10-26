# BEVELCORE — Portofoliu 3D

Site static (HTML/CSS/JS), gata pentru **GitHub Pages**. Nu necesită instalări sau build.

## 📁 Structura

```
index.html            → pagina principală
data/config.js        → email, Discord, social media, monede, categorii
data/models.js        → LISTA DE MODELE (aici adaugi modele noi)
models/<nume-model>/  → model.glb + imagini (cover.webp, alt.webp ...)
assets/               → stiluri, scripturi, logo, viewer 3D
robots.txt, sitemap.xml, 404.html → SEO
```

## ➕ Cum adaugi un model nou

1. **Export din Blender:** File → Export → **glTF 2.0** → Format: **glTF Binary (.glb)**.
   Bifează *Apply Modifiers*. Salvează-l ca `model.glb`.
2. **Randează 1–3 imagini** (ideal 800×600, fundal transparent sau închis) → `cover.webp` / `cover.jpg`.
3. Creează folderul `models/numele-modelului/` și pune fișierele în el.
4. Deschide `data/models.js`, copiază un bloc `{ ... },`, lipește-l la începutul listei și modifică:
   - `id` = numele folderului
   - `category` = `low-poly`, `high-poly`, `asset-packs`, `roblox-ugc`, `stylized` sau `game-ready`
   - `price` = preț în EUR (`0` = gratuit, `null` = preț la cerere)
   - `buyUrl` = link Gumroad / Sketchfab / Roblox (sau `""` → buton „Contactează-mă”)
5. Urcă pe GitHub (vezi mai jos). Gata — modelul apare cu filtru, preț în 3 monede și 3D View.

> 💡 Ține fișierele `.glb` sub ~10 MB ca site-ul să se încarce repede (Blender: Decimate, texturi 1–2K, compresie Draco la export).

## 🚀 Publicare pe GitHub Pages

1. Pe GitHub (contul **BevelCore**) creează un repository nou numit exact **`BevelCore.github.io`** (Public).
2. Click **Add file → Upload files**, trage TOT conținutul acestui folder (nu folderul în sine), apoi **Commit changes**.
3. Mergi la **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. După 1–2 minute site-ul e live la **https://bevelcore.github.io/**

Pentru actualizări: repeți „Upload files” cu fișierele noi/modificate.

## ✉️ Formularul de contact

Folosește [FormSubmit](https://formsubmit.co) (gratuit). **La primul mesaj trimis de pe site,
vei primi pe bevelcore@gmail.com un email de activare — apasă „Activate”.** După aceea mesajele vin direct pe mail.

## ⚙️ Alte setări (data/config.js)

- Linkuri Instagram / TikTok (acum sunt placeholder) — lasă `""` ca să ascunzi o iconiță.
- Monede: cursul EUR→RON/USD se ia automat zilnic (Banca Centrală Europeană); `fallbackRates` e folosit dacă API-ul nu răspunde.
- Categorii noi: adaugă un rând în `categories`.

## 🔎 SEO

- După publicare, adaugă site-ul în [Google Search Console](https://search.google.com/search-console) și trimite `https://bevelcore.github.io/sitemap.xml`.
- Pune linkul site-ului în bio pe Instagram, TikTok, Discord, ArtStation — linkurile externe ajută cel mai mult.
- Descrieri bune la modele (cu cuvinte ca „low poly”, „game-ready”, „Roblox UGC”) = mai multe căutări.

## 🖥️ Previzualizare locală

Viewer-ul 3D **nu merge** dacă deschizi `index.html` cu dublu-click (browserul blochează fișierele 3D pe `file://`).
Pe GitHub merge normal. Ca să testezi pe calculator: **dublu-click pe `PORNESTE-SITE.bat`** → se deschide
automat http://localhost:8000. Lasă fereastra neagră deschisă cât testezi; închide-o ca să oprești.
