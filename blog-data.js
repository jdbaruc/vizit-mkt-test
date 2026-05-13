/* ══════════════════════════════════════════════════════════════════
   blog-data.js — shared article store (localStorage)
   Used by Blog.html, Blog Article.html, and Blog CMS.html.

   Public API: window.VizitBlog
     .list()                → all articles (incl. hidden / drafts)
     .listVisible()         → visible on public site (not hidden, not archived)
     .listPublished()       → published & visible
     .bySlug(slug)          → one article or undefined
     .update(slug, patch)   → merge patch, persist, fire event
     .add(article)          → prepend, persist, fire event
     .remove(slug)          → delete, persist, fire event
     .replaceAll(arr)       → wipe + replace (used by CSV import)
     .reset()               → clear store; next read returns SEED
     .thumbClass(category)  → ti-* class for tinted thumbnails
     .authorInitials(name)  → 2-char avatar initials
     .formatDate(iso)       → "Mar 04"
     .onChange(fn)          → register listener; returns unsubscribe
   ══════════════════════════════════════════════════════════════════ */
(function () {
  var KEY = 'vizit.blog.articles.v2';
  var EVT = 'vizit-blog-updated';

  // ────────────────────────────────────────────────────────────────
  // Seed — mirrors the static rows in the CMS table.
  // First visit on any page hydrates from this; subsequent visits
  // use whatever the user has saved.
  // ────────────────────────────────────────────────────────────────
  function sec(t, body) { return { title: t, body: body }; }
  var P = function (s) { return '<p>' + s + '</p>'; };

  var SEED = [
    {
      title: "How we built the Conversion Readiness Standard",
      slug: "conversion-readiness-standard",
      category: "Thought Leadership",
      author: "Elena Choi",
      authorRole: "Head of Research",
      coAuthor: "Jordan Reyes",
      coAuthorRole: "Principal Researcher",
      readTime: "12 min",
      description: "Three years. 100M+ images. 10T+ commerce signals. Inside the benchmark every CPG catalog now scores against — what we measured, what we threw out, and why a single number decides whether content ships.",
      featured: true, hidden: false, draft: false, archived: false,
      publishedOn: "2026-03-04", updatedOn: "2026-03-04",
      heroImage: "", thumbnail: "",
      tags: ["Standard", "Research", "Methodology"],
      retailer: "", useCase: "",
      sections: [
        sec("What \"ready\" means, measurably",
          P("For most of digital commerce's history, \"is this image good?\" has been a question answered by the loudest person in the room. Brand managers had taste. Creative directors had instincts. Compliance had checklists. Nobody had a number — and so nothing shipped against a standard. It shipped against an opinion.") +
          P("When we started this project in early 2023, the premise was simple: <strong>convertibility is observable</strong>. Shoppers behave in patterns. Those patterns leave signal across hundreds of measurable dimensions — pack-front clarity, claim placement, visual weight, foreground contrast, the geometry of attention.") +
          P("The harder question was what to call <em>ready</em>. Not ready to win a design award. Ready to <strong>convert at first impression</strong> against the population of shoppers who will see it on a phone, in two-tenths of a second, on a retailer page they didn't choose.")
        ),
        sec("The signals we kept — and the ones we threw out",
          P("We started with 1,140 candidate signals. By year two we were down to 184. By the time we shipped, 87. The cuts were sometimes counterintuitive.") +
          P("<strong>Survived:</strong> Pack-front legibility at thumb size. Product centrality. Foreground-to-background contrast ratio. Claim hierarchy. Cropline geometry.") +
          P("<strong>Cut:</strong> Brand color saturation. Logo size as a percentage of frame. Photographic style. Image resolution above 1080px. Background \"premium-ness.\" Photographic style — the dimension creative teams argue about most — turned out to be a near-zero predictor of conversion once pack-front legibility was controlled for.")
        ),
        sec("Why a single score wins over a dashboard",
          P("Most of the conversion-intelligence work we saw in the wild before Vizit was dashboard-shaped. A page would show you twelve metrics, ten meters, three trend lines, and leave you to figure out which one mattered. We tried this. It is worse than nothing.") +
          P("So we collapsed it. The Vizit Score is a 0–100 number on each asset and a 0–100 number on the page that contains it. Above 80 is conversion-ready. Below 60 is leaving revenue on the table. Between is the optimization zone. That's the entire decision surface.") +
          P("In production, teams stop arguing about whether something is good. They argue about <em>how to get it above 80</em>, which is a much more productive argument.")
        )
      ]
    },
    {
      title: "Inside Mars Petcare's +30% conversion lift on optimized SKUs",
      slug: "mars-petcare-lift",
      category: "Use Case",
      author: "Priya Shah", authorRole: "Customer Lead",
      readTime: "6 min",
      description: "Why a small handful of pack-front visual cues moved double-digit conversion — and how the team built a repeatable workflow around them.",
      featured: true, hidden: false, draft: false, archived: false,
      publishedOn: "2026-02-27", updatedOn: "2026-02-27",
      heroImage: "", thumbnail: "",
      tags: ["Mars", "Pet care", "Conversion"],
      retailer: "Walmart", useCase: "Conversion Lift",
      sections: [
        sec("The starting catalog", P("Mars Petcare came in with 412 SKUs and a question: which ones are losing us revenue at first impression? The audit ran in a week. 38% were below the Conversion Readiness threshold.")),
        sec("What changed", P("The optimization sprint focused on three pack-front cues: product clarity at thumb size, foreground contrast, and claim hierarchy. No new photography. No new packaging.") + P("Average Vizit Score went from 64 to 81. Conversion on optimized SKUs lifted 30% over the following 8-week window.")),
        sec("The repeatable workflow", P("The team now runs every new SKU through Vizit before launch. The decision is a single number — above 80 is ship, below 80 is iterate. Argument time on creative reviews dropped by an estimated 60%."))
      ]
    },
    {
      title: "Why mobile heroes lose 23% of shoppers in the first half-second",
      slug: "mobile-hero-first-half-second",
      category: "Research",
      author: "Elena Choi", authorRole: "Head of Research",
      readTime: "8 min",
      description: "An eye-tracking study across 14,800 shoppers and 6 categories reveals the exact frame where attention collapses — and how to hold it.",
      featured: false, hidden: false, draft: false, archived: false,
      publishedOn: "2026-02-21", updatedOn: "2026-02-21",
      heroImage: "", thumbnail: "",
      tags: ["Mobile", "Eye-tracking", "Hero"],
      sections: [
        sec("The 500ms window", P("Across 14,800 shoppers, the median time-on-hero before swipe was 480ms. That is the window every product page is competing in.")),
        sec("Where attention breaks", P("Three failure modes account for 78% of bounces: pack illegible at thumb size, foreground crowding, and an off-center product anchor.")),
        sec("How to hold it", P("Single-product hero, centered, with at least 60% pack-front legibility at 320px width. The math is annoyingly simple. The hard part is fighting brand-design instincts that pull against it."))
      ]
    },
    {
      title: "How Target Plus brands win the first impression",
      slug: "target-plus-first-impression",
      category: "Retailer Spotlight",
      author: "Marcus Lin", authorRole: "Retail Lead",
      readTime: "7 min",
      description: "A breakdown of what the top-performing Target Plus brands do differently on their PDPs — and what every brand on the platform can learn from them.",
      featured: false, hidden: false, draft: false, archived: false,
      publishedOn: "2026-03-04", updatedOn: "2026-03-04",
      heroImage: "", thumbnail: "",
      tags: ["Target", "Retail media", "PDP"],
      retailer: "Target",
      sections: [
        sec("The Target Plus shelf", P("Target Plus is a curated marketplace where every PDP is competing with first-party content for the same shopper. The top-performing brands score 84+ on the Vizit Score.")),
        sec("Three things they do differently", P("They lead with hero clarity over lifestyle. They use carousel position 2 for value, not for vibe. And they treat the mobile hero as the only image that matters.")),
        sec("The bar to clear", P("Below an 80, a Target Plus brand is on the back foot. Above 90, it shows up in retailer-curated collections. The standard is unforgiving — and the math is public."))
      ]
    },
    {
      title: "What's new in Vizit Score v9 — sharper signals, faster verdicts",
      slug: "score-v9-release",
      category: "Product Update",
      author: "Sam Okafor", authorRole: "Product Lead",
      readTime: "4 min",
      description: "Notes from the latest release: tighter category baselines, sub-second scoring for hero assets, and a new \"Why this scored\" diagnostic feed.",
      featured: true, hidden: false, draft: false, archived: false,
      publishedOn: "2026-03-01", updatedOn: "2026-03-01",
      heroImage: "", thumbnail: "",
      tags: ["Release", "Score engine"],
      sections: [
        sec("Tighter category baselines", P("v9 retunes 18 of 32 category baselines using Q4 shopper data. Pet care, beverage, and personal care got the most movement.")),
        sec("Sub-second scoring", P("Hero scoring now returns in under 800ms p95. Catalog scoring throughput is 4x v8.")),
        sec("Why this scored", P("Every score now ships with a decomposition: which signals lifted it, which dragged it, and what the highest-leverage fix would be. No more dashboard-spelunking."))
      ]
    },
    {
      title: "Carousel order matters more than you think",
      slug: "carousel-order",
      category: "Research",
      author: "Jordan Reyes", authorRole: "Principal Researcher",
      readTime: "5 min",
      description: "An A/B test across 1,284 SKUs showed reordering image 2 and image 3 lifted conversion 7% on average — with zero new creative.",
      featured: false, hidden: false, draft: true, archived: false,
      publishedOn: "", updatedOn: "2026-03-04",
      heroImage: "", thumbnail: "",
      tags: ["Carousel", "A/B"],
      sections: [
        sec("The setup", P("1,284 SKUs. Same images. Image 2 and 3 swapped. Eight-week test window across three retailers.")),
        sec("The result", P("Average lift: 7.1%. Standard error 1.2%. The effect held across categories — strongest in personal care, weakest in beverage.")),
        sec("Why", P("Image 2 is doing more work than the industry treats it as. It's the second-impression hero, not a supporting beat. Optimize accordingly."))
      ]
    },
    {
      title: "The first-impression layer of digital commerce, explained",
      slug: "first-impression-layer",
      category: "Thought Leadership",
      author: "Priya Shah", authorRole: "Customer Lead",
      readTime: "5 min",
      description: "Your PIM, DAM, and shelf-analytics tools weren't built to tell you whether content will convert. Where the new layer sits — and why it matters now.",
      featured: true, hidden: false, draft: false, archived: false,
      publishedOn: "2026-01-23", updatedOn: "2026-01-23",
      heroImage: "", thumbnail: "",
      tags: ["Industry", "Stack"],
      sections: [
        sec("The stack today", P("Manage → Distribute → Monitor → Activate. That's the modern ecom stack. Nothing in it answers the question of whether the content will convert at first impression.")),
        sec("Where the layer sits", P("Between Distribute and Monitor — before content ships, after it's been assembled. It's the layer that says \"this is ready\" or \"this is not ready,\" against a portable standard.")),
        sec("Why now", P("Retail media costs are up 38% YoY. The cost of a low-converting first impression has never been higher. The layer was always going to exist. The only question was who would build it."))
      ]
    },
    {
      title: "A global beverage brand cut underperforming heroes by 41%",
      slug: "beverage-hero-audit",
      category: "Use Case",
      author: "Marcus Lin", authorRole: "Retail Lead",
      readTime: "7 min",
      description: "The catalog audit that surfaced 312 below-standard SKUs — and the optimization sprint that closed the gap in nine weeks.",
      featured: false, hidden: false, draft: true, archived: false,
      publishedOn: "", updatedOn: "2026-03-02",
      heroImage: "", thumbnail: "",
      tags: ["Beverage", "Catalog audit"],
      sections: [
        sec("The audit", P("760 SKUs scored in 36 hours. 312 came in below the 70 threshold.")),
        sec("The sprint", P("Nine weeks. Three creative pods. Four-image refresh per SKU. 287 of the 312 cleared the bar by the end of the sprint.")),
        sec("The result", P("Underperforming heroes dropped from 41% of the catalog to 6%. Conversion lift across optimized SKUs averaged 18%."))
      ]
    },
    {
      title: "The seasonal refresh: get every SKU to \"ready\" before launch",
      slug: "seasonal-refresh",
      category: "Thought Leadership",
      author: "Sam Okafor", authorRole: "Product Lead",
      readTime: "9 min",
      description: "How three CPG brands sequence catalog refreshes against retail media flights — and the audit checklist they all run.",
      featured: false, hidden: false, draft: true, archived: false,
      publishedOn: "", updatedOn: "2026-02-28",
      heroImage: "", thumbnail: "",
      tags: ["Workflow", "Seasonal"],
      sections: [
        sec("The cadence", P("Three windows per year. Each one starts six weeks before the retail media flight. Each one ends with every targeted SKU above 80.")),
        sec("The checklist", P("Hero clarity. Carousel order. Claim hierarchy. Pack-front contrast. Mobile-first audit. Cross-retailer parity. Five hours per SKU on average.")),
        sec("Why it works", P("Because it forces the conversation onto the standard before media spend commits. Argument time drops. Win rate goes up."))
      ]
    }
  ];

  // ────────────────────────────────────────────────────────────────
  // Storage
  // ────────────────────────────────────────────────────────────────
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return null;
  }
  function persist(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {}
    fire();
  }
  function fire() {
    try { window.dispatchEvent(new CustomEvent(EVT)); } catch (e) {}
  }

  // ────────────────────────────────────────────────────────────────
  // Helpers (shared)
  // ────────────────────────────────────────────────────────────────
  function thumbClass(cat) {
    var c = (cat || '').toLowerCase().trim();
    if (!c) return 'ti-product';
    if (/research|study|data|analysis/.test(c))           return 'ti-research';
    if (/use case|case study|customer|story/.test(c))     return 'ti-case';
    if (/product|release|update|launch|feature/.test(c))  return 'ti-product';
    if (/thought|opinion|leadership|perspective/.test(c)) return 'ti-playbook';
    if (/retailer|spotlight|industry|market/.test(c))     return 'ti-industry';
    var h = 0; for (var i = 0; i < c.length; i++) h = ((h << 5) - h + c.charCodeAt(i)) | 0;
    var T = ['ti-research','ti-case','ti-product','ti-playbook','ti-industry'];
    return T[Math.abs(h) % T.length];
  }
  function authorInitials(name) {
    var s = (name || '').trim();
    if (!s) return '?';
    var parts = s.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  function formatDate(d) {
    if (!d) return '';
    var dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var day = String(dt.getDate());
    if (day.length < 2) day = '0' + day;
    return months[dt.getMonth()] + ' ' + day + ', ' + dt.getFullYear();
  }
  function formatDateShort(d) {
    if (!d) return '';
    var dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var day = String(dt.getDate());
    if (day.length < 2) day = '0' + day;
    return months[dt.getMonth()] + ' ' + day;
  }

  function ensureDefaults(a) {
    return Object.assign({
      tags: [], featured: false, hidden: false, draft: false, archived: false,
      heroImage: '', thumbnail: '', sections: [], description: '',
      authorRole: '', readTime: '', category: '', publishedOn: '', updatedOn: '',
      sliderImages: [], videoLink: ''
    }, a || {});
  }

  // ────────────────────────────────────────────────────────────────
  // Public API
  // ────────────────────────────────────────────────────────────────
  var api = {
    KEY: KEY, EVT: EVT,
    list: function () {
      var stored = load();
      if (!stored) return SEED.map(ensureDefaults);
      return stored.map(ensureDefaults);
    },
    listVisible: function () {
      return this.list().filter(function (a) { return !a.hidden && !a.archived; });
    },
    listPublished: function () {
      return this.list().filter(function (a) {
        return !a.hidden && !a.archived && !a.draft && a.publishedOn;
      });
    },
    bySlug: function (slug) {
      return this.list().find(function (a) { return a.slug === slug; });
    },
    update: function (slug, patch) {
      var arr = this.list();
      var i = -1;
      for (var k = 0; k < arr.length; k++) if (arr[k].slug === slug) { i = k; break; }
      if (i === -1) return null;
      arr[i] = ensureDefaults(Object.assign({}, arr[i], patch));
      persist(arr);
      return arr[i];
    },
    add: function (article) {
      var arr = this.list();
      arr.unshift(ensureDefaults(article));
      persist(arr);
    },
    remove: function (slug) {
      persist(this.list().filter(function (a) { return a.slug !== slug; }));
    },
    replaceAll: function (arr) {
      persist(arr.map(ensureDefaults));
    },
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      fire();
    },
    thumbClass: thumbClass,
    authorInitials: authorInitials,
    formatDate: formatDate,
    formatDateShort: formatDateShort,
    onChange: function (fn) {
      var handler = function () { try { fn(); } catch (e) {} };
      window.addEventListener(EVT, handler);
      // Cross-tab sync via storage event
      var storageHandler = function (e) { if (e.key === KEY) handler(); };
      window.addEventListener('storage', storageHandler);
      return function () {
        window.removeEventListener(EVT, handler);
        window.removeEventListener('storage', storageHandler);
      };
    }
  };

  window.VizitBlog = api;
})();
