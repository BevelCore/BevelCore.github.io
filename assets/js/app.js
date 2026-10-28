/* BEVELCORE — app logic. Nu e nevoie să modifici acest fișier pentru a adăuga modele. */
(() => {
  "use strict";
  const C = window.SITE_CONFIG, MODELS = (window.MODELS || []).filter(m => m && m.id), L = window.I18N;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem("bc_" + k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem("bc_" + k, v); } catch {} }
  };
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const state = {
    lang: store.get("lang") || ((navigator.language || "").toLowerCase().startsWith("ro") ? "ro" : "en"),
    currency: store.get("cur") || C.baseCurrency,
    rates: { ...C.fallbackRates },
    cat: "all", q: "", sort: "featured", current: null
  };
  if (!C.currencies.includes(state.currency)) state.currency = C.baseCurrency;

  const t = k => (L[state.lang] && L[state.lang][k]) ?? L.en[k] ?? k;
  const loc = v => (v && typeof v === "object") ? (v[state.lang] || v.en || "") : (v || "");
  const catName = id => { const c = C.categories.find(c => c.id === id); return c ? (c[state.lang] || c.en) : id; };
  const file = (m, f) => `models/${m.id}/${f}`;
  const imgs = m => (m.images && m.images.length ? m.images : ["cover.webp"]);

  /* ---------- prices ---------- */
  function money(eur) {
    if (eur === null || eur === undefined || eur === "") return { text: t("price.request"), cls: "price--req" };
    if (Number(eur) === 0) return { text: t("price.free"), cls: "price--free" };
    const v = Number(eur) * (state.rates[state.currency] || 1);
    const whole = state.currency === "RON" || Number.isInteger(v);
    const text = new Intl.NumberFormat(state.lang === "ro" ? "ro-RO" : "en-US", {
      style: "currency", currency: state.currency,
      minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2
    }).format(state.currency === "RON" ? Math.round(v) : v);
    return { text, cls: "" };
  }
  async function loadRates() {
    if (!C.liveRates) return;
    const today = new Date().toISOString().slice(0, 10);
    const cached = store.get("rates");
    if (cached) { try { const c = JSON.parse(cached); if (c.d === today) { Object.assign(state.rates, c.r); return; } } catch {} }
    try {
      const others = C.currencies.filter(c => c !== C.baseCurrency).join(",");
      const r = await fetch(`https://api.frankfurter.app/latest?from=${C.baseCurrency}&to=${others}`);
      if (!r.ok) return;
      const j = await r.json();
      Object.assign(state.rates, j.rates);
      store.set("rates", JSON.stringify({ d: today, r: j.rates }));
      refreshPrices();
    } catch { /* fallback rates stay */ }
  }

  /* ---------- i18n ---------- */
  function applyI18n() {
    document.documentElement.lang = state.lang;
    $$("[data-i18n]").forEach(el => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
    $$("[data-i18n-html]").forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
    $$("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));
    $("#langBtn").setAttribute("aria-label", t("lang.switch"));
    $("#langBtn").title = t("lang.switch");
  }

  /* ---------- currency select ---------- */
  function initCurrency() {
    const sel = $("#currency");
    const sym = { EUR: "€ EUR", RON: "lei RON", USD: "$ USD" };
    sel.innerHTML = C.currencies.map(c => `<option value="${c}">${sym[c] || c}</option>`).join("");
    sel.value = state.currency;
    sel.addEventListener("change", () => { state.currency = sel.value; store.set("cur", sel.value); refreshPrices(); });
  }
  function refreshPrices() {
    renderGrid();
    if (state.current) fillModalPrice(state.current);
  }

  /* ---------- chips / filter ---------- */
  function renderChips() {
    const counts = {};
    MODELS.forEach(m => counts[m.category] = (counts[m.category] || 0) + 1);
    const cats = [{ id: "all" }, ...C.categories.filter(c => counts[c.id])];
    $("#chips").innerHTML = cats.map(c => {
      const label = c.id === "all" ? t("filter.all") : catName(c.id);
      const n = c.id === "all" ? MODELS.length : counts[c.id];
      return `<button class="chip" role="tab" type="button" data-cat="${c.id}" aria-selected="${state.cat === c.id}">${esc(label)} <small>${n}</small></button>`;
    }).join("");
    $("#statModels").textContent = MODELS.length;
    $("#statCats").textContent = cats.length - 1;
  }

  function visibleModels() {
    const q = state.q.trim().toLowerCase();
    let list = MODELS.filter(m => state.cat === "all" || m.category === state.cat);
    if (q) list = list.filter(m => [m.name?.en, m.name?.ro, m.description?.en, m.description?.ro, catName(m.category), ...(m.tags || [])]
      .join(" ").toLowerCase().includes(q));
    const p = m => (m.price === null || m.price === undefined) ? Infinity : Number(m.price);
    if (state.sort === "priceAsc") list = [...list].sort((a, b) => p(a) - p(b));
    if (state.sort === "priceDesc") list = [...list].sort((a, b) => (p(b) === Infinity ? -1 : p(b)) - (p(a) === Infinity ? -1 : p(a)));
    if (state.sort === "name") list = [...list].sort((a, b) => loc(a.name).localeCompare(loc(b.name)));
    return list;
  }

  function renderGrid() {
    const list = visibleModels();
    $("#empty").hidden = list.length > 0;
    $("#grid").innerHTML = list.map((m, i) => {
      const im = imgs(m), pr = money(m.price), name = esc(loc(m.name));
      const badges = [m.isNew ? `<span class="badge badge--new">${t("badge.new")}</span>` : "",
                      Number(m.price) === 0 && m.price !== null ? `<span class="badge badge--free">${t("price.free")}</span>` : ""].join("");
      return `<article class="card" style="animation-delay:${Math.min(i, 8) * 40}ms">
        <button class="card__media" type="button" data-open="${esc(m.id)}" aria-label="${t("card.view3d")}: ${name}">
          <div class="card__badges">${badges}</div>
          <img class="main ${im[1] ? "has-alt" : ""}" src="${file(m, im[0])}" alt="${name} — ${esc(catName(m.category))} 3D model" loading="lazy" width="800" height="600">
          ${im[1] ? `<img class="alt" src="${file(m, im[1])}" alt="" loading="lazy" width="800" height="600">` : ""}
          <span class="card__3d"><svg><use href="#i-cube"/></svg><span>${t("card.view3d")}</span></span>
        </button>
        <div class="card__body">
          <span class="card__cat">${esc(catName(m.category))}</span>
          <h3 class="card__title"><a href="#model/${esc(m.id)}">${name}</a></h3>
          <div class="card__meta">
            <span class="card__tris">${m.tris ? Number(m.tris).toLocaleString(state.lang === "ro" ? "ro-RO" : "en-US") + " " + t("card.tris") : ""}</span>
            <p class="price ${pr.cls}">${pr.text}</p>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  /* ---------- hero ---------- */
  let heroList = [], heroIdx = 0, heroTimer = null;
  function initHero() {
    heroList = MODELS.filter(m => m.featured);
    if (!heroList.length) heroList = MODELS.slice(0, 3);
    if (!heroList.length) { $(".hero__stage").hidden = true; return; }
    $("#heroDots").innerHTML = heroList.map((m, i) => `<button type="button" role="tab" aria-label="${esc(loc(m.name))}" data-hero="${i}"></button>`).join("");
    $("#heroDots").addEventListener("click", e => { const b = e.target.closest("[data-hero]"); if (b) { setHero(+b.dataset.hero); restartHero(); } });
    $("#heroViewer").addEventListener("pointerdown", () => clearInterval(heroTimer));
    $(".hero__caption").addEventListener("click", e => { if (!e.target.closest("[data-hero]")) openModel(heroList[heroIdx].id); });
    $(".hero__caption").style.cursor = "pointer";
    setHero(0); restartHero();
  }
  function restartHero() { clearInterval(heroTimer); if (heroList.length > 1) heroTimer = setInterval(() => setHero((heroIdx + 1) % heroList.length), 9000); }
  function setHero(i) {
    heroIdx = i; const m = heroList[i], v = $("#heroViewer");
    v.poster = file(m, imgs(m)[0]);
    v.src = file(m, m.model || "model.glb");
    v.alt = loc(m.name);
    $("#heroName").textContent = loc(m.name);
    $("#heroCat").textContent = catName(m.category);
    $$("#heroDots button").forEach((b, j) => b.setAttribute("aria-selected", j === i));
  }
  function refreshHeroText() { if (heroList[heroIdx]) { $("#heroName").textContent = loc(heroList[heroIdx].name); $("#heroCat").textContent = catName(heroList[heroIdx].category); } }

  /* ---------- modal ---------- */
  const modal = $("#modal"), mv = $("#mViewer");
  let lastFocus = null;
  function openModel(id, push = true) {
    const m = MODELS.find(x => x.id === id);
    if (!m) return;
    state.current = m; lastFocus = document.activeElement;
    fillModal(m);
    modal.hidden = false; document.body.classList.add("no-scroll");
    $(".modal__close").focus({ preventScroll: true });
    if (push && location.hash !== "#model/" + id) history.pushState(null, "", "#model/" + id);
    document.title = `${loc(m.name)} — ${catName(m.category)} 3D model | BEVELCORE`;
  }
  function closeModal(pop = false) {
    if (modal.hidden) return;
    modal.hidden = true; document.body.classList.remove("no-scroll");
    state.current = null; mv.removeAttribute("src");
    document.title = baseTitle;
    if (!pop && location.hash.startsWith("#model/")) history.pushState(null, "", "#portfolio");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function fillModalPrice(m) {
    const pr = money(m.price);
    const el = $("#mPrice"); el.textContent = pr.text; el.className = "price price--lg " + pr.cls;
    $("#mNote").hidden = !(state.currency !== C.baseCurrency && pr.cls === "");
  }
  function fillModal(m) {
    $("#mCat").textContent = catName(m.category);
    $("#mName").textContent = loc(m.name);
    $("#mDesc").textContent = loc(m.description);
    fillModalPrice(m);
    const specs = [
      [t("modal.category"), catName(m.category)],
      m.tris ? [t("modal.tris"), Number(m.tris).toLocaleString(state.lang === "ro" ? "ro-RO" : "en-US")] : null,
      m.formats ? [t("modal.formats"), m.formats.join(", ")] : null,
      [t("modal.license"), loc(m.license) || t("modal.licenseVal")]
    ].filter(Boolean);
    $("#mSpecs").innerHTML = specs.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join("");
    $("#mTags").innerHTML = (m.tags || []).map(x => `<li>#${esc(x)}</li>`).join("");
    const buy = $("#mBuy");
    const free = Number(m.price) === 0 && m.price !== null;
    if (m.buyUrl) {
      buy.href = m.buyUrl; buy.target = "_blank";
      buy.textContent = free ? t("modal.download") : `${t("modal.buy")} · ${money(m.price).text}`;
    } else {
      buy.href = "#contact"; buy.removeAttribute("target");
      buy.textContent = t("modal.contactBuy");
    }
    buy.onclick = m.buyUrl ? null : e => { e.preventDefault(); goContact("buy", t("contact.buyMsg") + loc(m.name)); };
    $("#mCustom").onclick = e => { e.preventDefault(); goContact("custom", t("contact.customMsg") + loc(m.name)); };

    // media
    const im = imgs(m);
    mv.poster = file(m, im[0]);
    mv.alt = `${loc(m.name)} — interactive 3D model`;
    mv.src = file(m, m.model || "model.glb");
    const views = (m.views || []).filter(v => v && v.file);
    const viewBtn = (key, label) => `<button class="thumb thumb--3d" type="button" data-media="${key}" aria-selected="false" aria-label="3D ${esc(label)}"><svg><use href="#i-cube"/></svg>${views.length ? `<small>${esc(label)}</small>` : ""}</button>`;
    $("#mThumbs").innerHTML = viewBtn("3d", views.length ? (state.lang === "ro" ? "Exterior" : "Exterior") : "3D") +
      views.map((v, i) => viewBtn("3d-" + i, loc(v.label) || v.file)).join("") +
      im.map((f, i) => `<button class="thumb" type="button" data-media="${i}" aria-selected="false" aria-label="Image ${i + 1}" style="background-image:url('${file(m, f)}')"></button>`).join("");
    showMedia("3d");
  }
  function showMedia(which) {
    const m = state.current; if (!m) return;
    const img = $("#mImage");
    if (String(which).startsWith("3d")) {
      const v = which === "3d" ? null : (m.views || [])[+String(which).slice(3)];
      const src = file(m, v ? v.file : (m.model || "model.glb"));
      if (!mv.src || !mv.src.endsWith(src)) {
        const orbit = (v && v.orbit) || m.orbit || "0deg 75deg 105%";
        mv.addEventListener("load", () => {
          mv.cameraOrbit = orbit; mv.cameraTarget = "auto auto auto";
          if (mv.jumpCameraToGoal) mv.jumpCameraToGoal();
        }, { once: true });
        mv.src = src;
      }
      mv.style.visibility = "visible"; img.hidden = true;
    }
    else { mv.style.visibility = "hidden"; img.hidden = false; img.src = file(m, imgs(m)[+which]); img.alt = loc(m.name); }
    $$("#mThumbs .thumb").forEach(b => b.setAttribute("aria-selected", b.dataset.media === String(which)));
  }
  mv.addEventListener("progress", e => { const p = e.detail.totalProgress; $("#mProgress").style.width = (p * 100) + "%"; $("#mProgress").style.opacity = p >= 1 ? 0 : 1; });

  /* ---------- contact ---------- */
  function goContact(topic, msg) {
    closeModal();
    if (topic) $("#topic").value = topic;
    if (msg) $("#message").value = msg + "\n\n";
    $("#contact").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $("#message").focus({ preventScroll: true }), 600);
  }
  function initContact() {
    const links = [];
    if (C.email) links.push(`<a href="mailto:${esc(C.email)}"><svg><use href="#i-mail"/></svg><span>${esc(C.email)}<small>Email</small></span></a>`);
    if (C.discord) links.push(`<a href="${esc(C.discord)}" target="_blank" rel="noopener"><svg><use href="#i-discord"/></svg><span data-i18n="contact.discord">${t("contact.discord")}</span></a>`);
    const S = C.social || {}, names = { instagram: "Instagram", tiktok: "TikTok", artstation: "ArtStation", youtube: "YouTube", sketchfab: "Sketchfab" };
    Object.keys(names).forEach(k => { if (S[k]) links.push(`<a href="${esc(S[k])}" target="_blank" rel="noopener"><svg><use href="#i-${k}"/></svg><span>${names[k]}<small>${esc(S[k].replace(/^https?:\/\/(www\.)?/, ""))}</small></span></a>`); });
    $("#direct").innerHTML = links.join("");

    const soc = [];
    if (C.discord) soc.push(["discord", C.discord, "Discord"]);
    Object.keys(names).forEach(k => S[k] && soc.push([k, S[k], names[k]]));
    if (C.email) soc.push(["mail", "mailto:" + C.email, "Email"]);
    $("#footerSocial").innerHTML = soc.map(([i, h, n]) => `<a href="${esc(h)}" ${h.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} aria-label="${n}"><svg><use href="#i-${i}"/></svg></a>`).join("");

    const form = $("#contactForm"), status = $("#formStatus");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      let ok = true;
      $$("[required]", form).forEach(f => { const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value)); f.classList.toggle("invalid", bad); if (bad) ok = false; });
      if (!ok) return;
      if (form._honey.value) return;
      const btn = form.querySelector("button[type=submit]"), label = btn.querySelector("span");
      btn.disabled = true; label.textContent = t("contact.sending"); status.className = "form__status"; status.textContent = "";
      const data = Object.fromEntries(new FormData(form));
      delete data._honey;
      data._subject = `BEVELCORE — ${form.topic.options[form.topic.selectedIndex].text} — ${data.name}`;
      data._template = "table"; data._captcha = "false";
      try {
        const r = await fetch(`https://formsubmit.co/ajax/${C.email}`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || j.success === "false" || j.success === false) throw new Error(j.message || r.status);
        form.reset(); status.className = "form__status ok"; status.textContent = t("contact.ok");
      } catch {
        status.className = "form__status err";
        status.innerHTML = `${esc(t("contact.err"))} <a href="mailto:${esc(C.email)}">${esc(C.email)}</a>`;
      } finally { btn.disabled = false; label.textContent = t("contact.send"); }
    });
  }

  /* ---------- SEO: structured data for models ---------- */
  function injectLd() {
    const ld = {
      "@context": "https://schema.org", "@type": "ItemList", name: "BEVELCORE 3D models",
      itemListElement: MODELS.map((m, i) => ({
        "@type": "ListItem", position: i + 1,
        item: {
          "@type": "Product", name: m.name?.en || m.id, description: m.description?.en || "",
          image: C.siteUrl + file(m, imgs(m)[0]), category: catName(m.category), brand: { "@type": "Brand", name: "BEVELCORE" },
          url: C.siteUrl + "#model/" + m.id,
          ...(m.price !== null && m.price !== undefined ? { offers: { "@type": "Offer", price: String(m.price), priceCurrency: C.baseCurrency, availability: "https://schema.org/InStock", url: m.buyUrl || C.siteUrl + "#model/" + m.id } } : {})
        }
      }))
    };
    const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
  }

  /* ---------- misc ---------- */
  function toast(msg) {
    let el = $(".toast"); if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("show"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 1800);
  }
  function route(pop) {
    const h = decodeURIComponent(location.hash);
    if (h.startsWith("#model/")) openModel(h.slice(7), false);
    else if (pop) closeModal(true);
  }
  const baseTitle = document.title;

  function bind() {
    $("#chips").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (!b) return; state.cat = b.dataset.cat; renderChips(); renderGrid(); });
    $("#search").addEventListener("input", e => { state.q = e.target.value; renderGrid(); });
    $("#sort").addEventListener("change", e => { state.sort = e.target.value; renderGrid(); });
    $("#grid").addEventListener("click", e => {
      const b = e.target.closest("[data-open]"), a = e.target.closest("a[href^='#model/']");
      if (b) openModel(b.dataset.open); else if (a) { e.preventDefault(); openModel(a.getAttribute("href").slice(7)); }
    });
    modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); const th = e.target.closest("[data-media]"); if (th) showMedia(th.dataset.media); });
    document.addEventListener("keydown", e => {
      if (modal.hidden) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") { // focus trap
        const f = $$("button, a[href], [tabindex]:not([tabindex='-1'])", modal).filter(x => x.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    $("#mShare").addEventListener("click", async () => {
      const url = location.href.split("#")[0] + "#model/" + state.current.id;
      try { if (navigator.share && matchMedia("(pointer:coarse)").matches) await navigator.share({ title: loc(state.current.name), url }); else { await navigator.clipboard.writeText(url); toast(t("modal.copied")); } }
      catch { /* user cancelled */ }
    });
    $("#langBtn").addEventListener("click", () => {
      state.lang = state.lang === "en" ? "ro" : "en"; store.set("lang", state.lang);
      applyI18n(); renderChips(); renderGrid(); refreshHeroText();
      if (state.current) fillModal(state.current);
    });
    $$("[data-quote]").forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      const k = a.dataset.quote;
      goContact(k === "svc.ugc.t" ? "ugc" : "custom", k ? t("contact.quoteMsg") + t(k) : "");
    }));
    const burger = $("#burger"), nav = $("#nav");
    burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
    nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });
    window.addEventListener("popstate", () => route(true));
    // active nav link
    const links = $$(".nav a"), io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(s => io.observe(s));
    $("#year").textContent = new Date().getFullYear();
  }

  // boot
  applyI18n(); initCurrency(); renderChips(); renderGrid(); initHero(); initContact(); bind(); injectLd(); route(false); loadRates();
})();
