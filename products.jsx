/* eslint-disable */
// Blue Buffalo Nudges Grillers — one product, multiple hero-image candidates.
// Real source imagery from the user; data matches the Vizit Hero Score detail views.

const PRODUCT = {
  title: 'Blue Buffalo Nudges Grillers Natural Dog Treats, Made in the USA with Real Steak, 16-oz Bag Steak 16 Ounce (Pack of 1)',
  category: 'Dog Treat Cookies, Biscuits & Snacks',
  asin: 'B0BCX4939V',
  brand: 'Blue Buffalo',
};

const ITERATIONS = [
  {
    id: 'B0BCX4939V_Hero_1',
    filename: 'B0BCX4939V_Hero_1.jpg',
    note: 'Live PDP hero · scraped from category page',
    badge: 'Live',
    image: 'assets/B0BCX4939V_Hero_1.jpg',
    score: 20.5,
    tier: 'low',
    mr: 'pending',
    relevance: { pct: 22, tier: 'low' },
    synopsis:
      'Current PDP hero. Visual score of <em>20.5</em> sits in the bottom third of the category. Mobile-Readiness has not been run against this asset yet — queue it to compare the structural signals side-by-side with the four Hero candidates below.',
  },
  {
    id: 'B0BCX4939V_Hero_2',
    filename: 'B0BCX4939V_Hero_2.jpg',
    note: 'Front-of-pack only · no lifestyle elements',
    badge: 'Candidate',
    image: 'assets/B0BCX4939V_Hero_2.jpg',
    score: 7.5,
    tier: 'low',
    mr: {
      brand:       { pct: 86, tier: 'high' },
      productType: { pct: 93, tier: 'high' },
      variant:     { pct: 96, tier: 'high' },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 96, tier: 'high' },
    },
    relevance: { pct: 22, tier: 'low' },
    synopsis:
      'Five-for-five HIGH on mobile-readiness — wordmark, descriptor, variant, count and size each occupy a non-overlapping zone. Visual score drops to <em>7.5</em> though: without lifestyle elements or the dog cue, the asset reads as packaging-only and loses ground vs. the live hero.',
  },
  {
    id: 'B0BCX4939V_Hero_3',
    filename: 'B0BCX4939V_Hero_3.jpg',
    note: 'Pack-only with dog motif and #1 ingredient badge',
    badge: 'Top pick',
    image: 'assets/B0BCX4939V_Hero_3.jpg',
    score: 57.5,
    tier: 'moderate',
    mr: {
      brand:       { pct: 96, tier: 'high' },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 86, tier: 'high' },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 96, tier: 'high' },
    },
    relevance: { pct: 22, tier: 'low' },
    synopsis:
      'Adding the golden retriever and the #1 ingredient callout pushes visual score to <em>57.5</em> — the highest in the candidate set and <em>+37</em> over live. All five mobile-readiness signals stay HIGH. Promote to PDP.',
  },
  {
    id: 'B0BCX4939V_Hero_4',
    filename: 'B0BCX4939V_Hero_4.jpg',
    note: 'Treats extracted onto white · product-first composition',
    badge: 'Candidate',
    image: 'assets/B0BCX4939V_Hero_4.jpg',
    score: 24.5,
    tier: 'low',
    mr: {
      brand:       { pct: 96, tier: 'high' },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 97, tier: 'high' },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 99, tier: 'high' },
    },
    relevance: { pct: 22, tier: 'low' },
    synopsis:
      'Treats lifted out onto the canvas give a product-in-use moment, with mobile-readiness signals all HIGH (variant lifts to 97, size to 99). Visual score lands at <em>24.5</em> — only <em>+4</em> over live; the composition reads cluttered without the dog motif from Hero_3.',
  },
  {
    id: 'B0BCX4939V_Hero_5',
    filename: 'B0BCX4939V_Hero_5.jpg',
    note: 'Treats on right · larger 16 oz lock-up',
    badge: 'Candidate',
    image: 'assets/B0BCX4939V_Hero_5.jpg',
    score: 42.5,
    tier: 'moderate',
    mr: {
      brand:       { pct: 97, tier: 'high' },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 93, tier: 'high' },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 97, tier: 'high' },
    },
    relevance: { pct: 22, tier: 'low' },
    synopsis:
      'Treats anchored bottom-right with a bolder 16 oz lock-up. Visual score of <em>42.5</em>, <em>+22</em> over live, and the cleanest brand legibility in the set at 97. Second-best behind Hero_3 — strong fallback if the dog motif is off-brand for this campaign.',
  },
];

/* Real product photo — replaces the previous SVG illustrations. */
function ProductSVG({ kind }) {
  return (
    <img
      src={kind}
      alt=""
      loading="lazy"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
        display: 'block',
      }}
    />
  );
}

/* 12 product tabs — one per ASIN. Only B0BCX4939V has iterations populated. */
const PRODUCT_TABS = [
  {
    asin: 'B0BCX4939V',
    short: 'Nudges Grillers Steak · 16 oz',
    title: 'Blue Buffalo Nudges Grillers Natural Dog Treats, Made in the USA with Real Steak, 16-oz Bag Steak 16 Ounce (Pack of 1)',
    category: 'Dog Treat Cookies, Biscuits & Snacks',
  },
  {
    asin: 'B0GLKZSKNY',
    short: 'Tastefuls Chicken & Brown Rice · 22 lb',
    title: 'Blue Buffalo Tastefuls Chicken & Brown Rice Recipe Dry Indoor Cat Food for Adult Cats, Real Chicken First, Deliciously Healthy Natural Cat Food, Supports Digestive Care and Coat Health, 22 lbs.',
    category: 'Dry Cat Food',
  },
  {
    asin: 'B0GQWVCGY4',
    short: 'Wilderness Chicken Grain-Free · 34 lb',
    title: 'Blue Buffalo Wilderness with Chicken High Protein Grain Free Dry Food for Adult Dogs, 34% Protein, Supports Immunity With Antioxidant-Rich LifeSource Bits, Promotes Healthy Muscle Development, 34 lbs.',
    category: 'Dry Dog Food',
  },
  {
    asin: 'B01MSDZWOY',
    short: 'Delights Filet Mignon Variety · 12 ct',
    title: 'Blue Buffalo Delights Natural Adult Small Breed Wet Dog Food, Variety Pack, Made with Natural Ingredients, Filet Mignon & New York Strip Recipe in Hearty Gravy, 3.5-oz. Cups (12 Count, 6 of Each) Variety Pack: Filet Mignon & New York Strip 3.5 Ounce (Pack of 12)',
    category: 'Wet Dog Food',
  },
  {
    asin: 'B0GFGKV676',
    short: 'Nudges Minis Chicken Pot Pie · 10 oz',
    title: 'Blue Buffalo Nudges Minis Chicken Pot Pie Recipe, Natural Dog Treats Mineral-Enhanced for Flavor, 10 oz. Bag Chicken Pot Pie 10 Ounce (Pack of 1)',
    category: 'Dog Treat Cookies, Biscuits & Snacks',
  },
  {
    asin: 'B08MKWMGXT',
    short: 'Tastefuls Kitten Paté Chicken · 24 ct',
    title: 'Blue Buffalo Tastefuls Wet Cat Food Paté for Kittens, Made with Natural Ingredients | Chicken Entrée, 3-oz. Cans (24 count ) 3 Ounce (Pack of 24)',
    category: 'Wet Cat Food',
  },
  {
    asin: 'B002UT92EY',
    short: 'Wilderness Adult Cat Chicken · 12 lb',
    title: 'Blue Buffalo Wilderness Natural Adult Dry Cat Food, High-Protein and Grain-Free Diet, Supports Healthy Muscle Development and a Healthy Immune System, Chicken, 12-lb. Bag Chicken 12 Pound (Pack of 1)',
    category: 'Dry Cat Food',
  },
  {
    asin: 'B01N28JOUH',
    short: 'Delights Rotisserie Chicken · 12 ct',
    title: 'Blue Buffalo Delights Small Breed Natural Wet Dog Food, Rotisserie Chicken Flavor in Gravy, 3.5-oz Cups, 12 Count Chicken 3.5 Ounce (Pack of 12)',
    category: 'Wet Dog Food',
  },
  {
    asin: 'B0BCX5Y7BY',
    short: 'Nudges Jerky Bites Chicken · 16 oz',
    title: 'Blue Buffalo Nudges Jerky Bites Dog Treats, Made in the USA with Natural Ingredients, Bite-Sized Pieces, Chicken, 16-oz Bag Chicken 1 Pound (Pack of 1)',
    category: 'Dog Jerky Treats',
  },
  {
    asin: 'B08MLBGGB5',
    short: 'Tastefuls Flaked Variety · 12 ct',
    title: 'Blue Buffalo Tastefuls Flaked Wet Cat Food Variety Pack, Made with Natural Ingredients, Tuna, Chicken, Fish & Shrimp, 3-oz Cans (12 Count, 4 of Each) Variety Pack: Tuna, Chicken, Fish & Shrimp 1 Ounce (Pack of 12)',
    category: 'Wet Cat Food',
  },
  {
    asin: 'B09LPJB3RJ',
    short: 'Tastefuls Spoonless Chicken & Turkey · 12 ct',
    title: 'Blue Buffalo Tastefuls Spoonless Singles Variety Pack, Wet Cat Food Paté, 2.6-oz. Twin-Pack Trays, Chicken & Turkey Entreé (12 Count) Chicken & Turkey 1 Count (Pack of 12)',
    category: 'Wet Cat Food',
  },
  {
    asin: 'B0BCX65BNY',
    short: 'Nudges Homestyle Chicken · 16 oz',
    title: 'Blue Buffalo Nudges Homestyle Natural Dog Treats, Made in the USA with Real Chicken, Peas, and Carrots, 16-oz. Bag Chicken 16 Ounce (Pack of 1)',
    category: 'Dog Treat Cookies, Biscuits & Snacks',
  },
];

/* ─── B0GQWVCGY4 · Wilderness Chicken Grain-Free 34 lb ──────────── */
/* User supplied mobile-readiness only; visual score not yet run.    */

const ITERATIONS_B0GQWVCGY4 = [
  {
    id: 'B0GQWVCGY4_original-hero',
    filename: 'B0GQWVCGY4_original-hero.jpg',
    note: 'Live PDP hero · full bag · Nature\u2019s Evolutionary Diet lock-up',
    badge: 'Live',
    image: 'assets/B0GQWVCGY4_original-hero.jpg',
    score: 51.5,
    tier: 'moderate',
    mr: {
      brand:       { pct: 88,  tier: 'high' },
      productType: { pct: 60,  tier: 'low'  },
      variant:     { pct: 63,  tier: 'low'  },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 90,  tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Current PDP hero. Visual score <em>51.5</em> sits mid-pack at <em>#5 of 10</em> — the wolf-led Hero_1 and Hero_14 compositions each clear it by ~22 points. Mobile-Readiness still flags <em>Product Type</em> (60) and <em>Variant</em> (63) in the LOW band — the Nature\u2019s Evolutionary Diet stack and the chicken cue read poorly at thumbnail size.',
  },
  {
    id: 'B0GQWVCGY4_Hero_1',
    filename: 'B0GQWVCGY4_Hero_1.jpg',
    note: 'Grain-Free Formula art · wolf-led composition',
    badge: 'Top pick',
    image: 'assets/B0GQWVCGY4_Hero_1.jpg',
    score: 73.5,
    tier: 'high',
    mr: {
      brand:       { pct: 90,  tier: 'high' },
      productType: { pct: 70,  tier: 'med'  },
      variant:     { pct: 76,  tier: 'med'  },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 95,  tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      '<em>#1 of 10</em> on audience visual score at <em>73.5</em> — <em>+22</em> over the live hero. Wolf-led pack art carries the strongest first-impression weight in the set. Mobile-Readiness still shows Product Type (70) and Variant (76) in the MED band; pulling the chicken-vs-grain-free callout out of the descriptor stack would push both past 85 without touching the composition.',
  },
  {
    id: 'B0GQWVCGY4_Hero_2',
    filename: 'B0GQWVCGY4_Hero_2.jpg',
    note: 'Grain-Free Formula · tighter wolf crop',
    badge: 'Candidate',
    image: 'assets/B0GQWVCGY4_Hero_2.jpg',
    score: 64.5,
    tier: 'high',
    mr: {
      brand:       { pct: 88,  tier: 'high' },
      productType: { pct: 68,  tier: 'med'  },
      variant:     { pct: 79,  tier: 'med'  },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 98,  tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      '<em>#3 of 10</em> at <em>64.5</em>, <em>+13</em> over live. Tighter wolf crop nudges Size (98) and Variant (79) over Hero_1 but loses 9 points of visual appeal — the closer crop trims the pack-art context that anchors Hero_1\u2019s first read.',
  },
  {
    id: 'B0GQWVCGY4_Hero_4',
    filename: 'B0GQWVCGY4_Hero_4.jpg',
    note: 'Inverted layout · chickens above wolf face',
    badge: 'Candidate',
    image: 'assets/B0GQWVCGY4_Hero_4.jpg',
    score: 63.5,
    tier: 'high',
    mr: {
      brand:       { pct: 90,  tier: 'high' },
      productType: { pct: 65,  tier: 'med'  },
      variant:     { pct: 76,  tier: 'med'  },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 95,  tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      '<em>#4 of 10</em> at <em>63.5</em> — within a point of Hero_2. The ingredient-first read works, but Product Type holds at 65 (MED) and Hero_1 + Hero_14 still beat it by ~10 points. Use only when the ingredient story matters more than the wolf as brand anchor.',
  },
  {
    id: 'B0GQWVCGY4_Hero_14',
    filename: 'B0GQWVCGY4_Hero_14.jpg',
    note: 'Centered wolf · Wilderness arch overlap',
    badge: 'Candidate',
    image: 'assets/B0GQWVCGY4_Hero_14.jpg',
    score: 73.0,
    tier: 'high',
    mr: {
      brand:       { pct: 86,  tier: 'high' },
      productType: { pct: 65,  tier: 'med'  },
      variant:     { pct: 92,  tier: 'high' },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 98,  tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      '<em>#2 of 10</em> at <em>73.0</em> — within half a point of Hero_1 and the strongest variant signal (92) of any high-scoring candidate. The Wilderness arch overlapping the wolf does double duty: brand anchor and variant cue. Product Type still 65 (MED). Strong fallback to Hero_1 with meaningful MR upside.',
  },
  {
    id: 'B0GQWVCGY4_Hero_20',
    filename: 'B0GQWVCGY4_Hero_20.jpg',
    note: '\u201Cwith Chicken\u201D variant strip · text-forward',
    badge: 'Candidate',
    image: 'assets/B0GQWVCGY4_Hero_20.jpg',
    score: 13.0,
    tier: 'low',
    mr: {
      brand:       { pct: 92,  tier: 'high' },
      productType: { pct: 70,  tier: 'med'  },
      variant:     { pct: 93,  tier: 'high' },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 96,  tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      '<em>#9 of 10</em> at <em>13.0</em> — biggest MR-vs-Visual disconnect in the set. Brand (92) and Variant (93) both lead the field, but the text-forward composition reads as a copy block, not a hero. Do not promote despite the strong readability signals.',
  },
  {
    id: 'B0GQWVCGY4_Hero_21',
    filename: 'B0GQWVCGY4_Hero_21.jpg',
    note: 'Compact wolf vignette · ingredients prominent',
    badge: 'Candidate',
    image: 'assets/B0GQWVCGY4_Hero_21.jpg',
    score: 30.0,
    tier: 'low',
    mr: {
      brand:       { pct: 86,  tier: 'high' },
      productType: { pct: 92,  tier: 'high' },
      variant:     { pct: 88,  tier: 'high' },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 98,  tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      '<em>#7 of 10</em> at <em>30.0</em>. The only candidate that scores five-for-five HIGH on mobile-readiness, but the audience ranked it well below the wolf-led pack-art compositions. The compact vignette reads clinical; shoppers prefer Hero_1 and Hero_14’s bolder art. Useful where MR weight is heaviest — otherwise pass.',
  },
  {
    id: 'B0GQWVCGY4_Hero_22',
    filename: 'B0GQWVCGY4_Hero_22.jpg',
    note: 'Wolf framed · simplified descriptor',
    badge: 'Candidate',
    image: 'assets/B0GQWVCGY4_Hero_22.jpg',
    score: 14.0,
    tier: 'low',
    mr: {
      brand:       { pct: 90,  tier: 'high' },
      productType: { pct: 60,  tier: 'low'  },
      variant:     { pct: 90,  tier: 'high' },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 98,  tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      '<em>#8 of 10</em> at <em>14.0</em>. Framed wolf portrait reads cleanly on Brand and Variant (both 90), but Product Type collapses to 60 (LOW) and the simplified composition lands flat with shoppers. Do not promote.',
  },
  {
    id: 'B0GQWVCGY4_Hero_24',
    filename: 'B0GQWVCGY4_Hero_24.jpg',
    note: 'Hero refinement · highest brand legibility',
    badge: 'Candidate',
    image: 'assets/B0GQWVCGY4_Hero_24.jpg',
    score: 36.5,
    tier: 'low',
    mr: {
      brand:       { pct: 95,  tier: 'high' },
      productType: { pct: 75,  tier: 'med'  },
      variant:     { pct: 92,  tier: 'high' },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 98,  tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      '<em>#6 of 10</em> at <em>36.5</em>. Highest Brand score in the set (95) with Variant 92 — the safest readability play — but the refinement loses 15 points of visual appeal vs. the live hero. Audience response is muted.',
  },
  {
    id: 'B0GQWVCGY4_Hero_25',
    filename: 'B0GQWVCGY4_Hero_25.jpg',
    note: 'Sibling of Hero_24 · slightly tighter crop',
    badge: 'Candidate',
    image: 'assets/B0GQWVCGY4_Hero_25.jpg',
    score: 12.0,
    tier: 'low',
    mr: {
      brand:       { pct: 95,  tier: 'high' },
      productType: { pct: 65,  tier: 'med'  },
      variant:     { pct: 92,  tier: 'high' },
      count:       { pct: 100, tier: 'high' },
      size:        { pct: 98,  tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      '<em>#10 of 10</em> at <em>12.0</em> — last place. Near-identical to Hero_24 with a tighter crop; Brand and Variant hold but Product Type drops 10 points to 65 (MED) and the audience drops it another 24 points below Hero_24. Do not promote.',
  },
];

/* ─── B0BCX5Y7BY · Nudges Jerky Bites Chicken 16 oz ──────────── */
/* Visual score + full mobile-readiness signals supplied for 11 hero candidates. */

const ITERATIONS_B0BCX5Y7BY = [
  {
    id: 'B0BCX5Y7BY_Hero_1',
    filename: 'B0BCX5Y7BY_Hero_1.jpg',
    note: 'Blue lower band · Jerky Bites lock-up · brand legibility soft',
    badge: 'Candidate',
    image: 'assets/B0BCX5Y7BY_Hero_1.jpg',
    score: 75,
    tier: 'high',
    mr: {
      brand:       { pct: 70, tier: 'med'  },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 88, tier: 'high' },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 88, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Variant-correct Jerky Bites composition with dog + product fan. Brand drops to <em>70</em> (MED) — the wordmark sits against a tight gradient and loses contrast on mobile. Variant (88), Product Type (90) and Size (88) all read HIGH. Visual score lands at <em>75</em>.',
  },
  {
    id: 'B0BCX5Y7BY_Hero_1_alt',
    filename: 'B0BCX5Y7BY_Hero_1(1).jpg',
    note: 'Green lower band · Jerky Cuts variant lock-up',
    badge: 'Candidate',
    image: 'assets/B0BCX5Y7BY_Hero_1(1).jpg',
    score: 75,
    tier: 'high',
    mr: {
      brand:       { pct: 87, tier: 'high' },
      productType: { pct: 88, tier: 'high' },
      variant:     { pct: 88, tier: 'high' },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 87, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Jerky <em>Cuts</em> art on a Jerky Bites ASIN — composition reads cleanly five-for-five HIGH on mobile-readiness, but variant alignment with the parent listing is the question. Visual score <em>75</em>.',
  },
  {
    id: 'B0BCX5Y7BY_Hero_2',
    filename: 'B0BCX5Y7BY_Hero_2.jpg',
    note: 'Bites art · larger pack render · descriptor centered',
    badge: 'Candidate',
    image: 'assets/B0BCX5Y7BY_Hero_2.jpg',
    score: 77,
    tier: 'high',
    mr: {
      brand:       { pct: 88, tier: 'high' },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 88, tier: 'high' },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 88, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Variant-correct Bites pack with a larger render fixes the Brand softness seen in Hero_1 — wordmark up to <em>88</em>. Five-for-five HIGH on mobile-readiness, visual score <em>77</em>.',
  },
  {
    id: 'B0BCX5Y7BY_Hero_2_alt',
    filename: 'B0BCX5Y7BY_Hero_2(1).jpg',
    note: 'Cuts art · pack centered · highest visual score',
    badge: 'Top pick',
    image: 'assets/B0BCX5Y7BY_Hero_2(1).jpg',
    score: 83,
    tier: 'high',
    mr: {
      brand:       { pct: 88, tier: 'high' },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 75, tier: 'med'  },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 88, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Highest visual score in the set at <em>83</em> — clean centered pack with no extra props. Trade-off is Variant alignment: this asset shows Jerky <em>Cuts</em> against a Jerky Bites ASIN, dragging that signal to <em>75</em> (MED). Promote only if the listing’s variant copy is updated to match.',
  },
  {
    id: 'B0BCX5Y7BY_Hero_3',
    filename: 'B0BCX5Y7BY_Hero_3.jpg',
    note: 'Bites art · dog + product fan + USA Chicken badge',
    badge: 'Candidate',
    image: 'assets/B0BCX5Y7BY_Hero_3.jpg',
    score: 75,
    tier: 'high',
    mr: {
      brand:       { pct: 88, tier: 'high' },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 88, tier: 'high' },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 88, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Variant-correct Bites composition with the small dog and #1 Ingredient badge. Five-for-five HIGH on mobile-readiness, visual score <em>75</em> — three points behind Hero_2 because the dog crop competes with the descriptor for vertical attention.',
  },
  {
    id: 'B0BCX5Y7BY_Hero_3_alt',
    filename: 'B0BCX5Y7BY_Hero_3(1).jpg',
    note: 'Cuts art · single jerky piece kicker · clean white field',
    badge: 'Candidate',
    image: 'assets/B0BCX5Y7BY_Hero_3(1).jpg',
    score: 79,
    tier: 'high',
    mr: {
      brand:       { pct: 88, tier: 'high' },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 75, tier: 'med'  },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 88, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Cuts pack with a single jerky piece breaking the frame at lower-left — composition reads premium, visual score <em>79</em>. Variant signal still <em>75</em> (MED) because of the Cuts/Bites mismatch.',
  },
  {
    id: 'B0BCX5Y7BY_Hero_4',
    filename: 'B0BCX5Y7BY_Hero_4.jpg',
    note: 'Cuts art · dog tucked behind product · lifestyle-lite',
    badge: 'Candidate',
    image: 'assets/B0BCX5Y7BY_Hero_4.jpg',
    score: 75,
    tier: 'high',
    mr: {
      brand:       { pct: 87, tier: 'high' },
      productType: { pct: 88, tier: 'high' },
      variant:     { pct: 75, tier: 'med'  },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 87, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Cuts art with dog tucked behind product. Brand and Size both ease back to <em>87</em>; Variant <em>75</em> (MED) again. Visual score <em>75</em> — no lift over the cleaner Hero_3_alt composition.',
  },
  {
    id: 'B0BCX5Y7BY_Hero_5',
    filename: 'B0BCX5Y7BY_Hero_5.jpg',
    note: 'Bites art · USA Chicken badge moved to top band',
    badge: 'Candidate',
    image: 'assets/B0BCX5Y7BY_Hero_5.jpg',
    score: 74,
    tier: 'high',
    mr: {
      brand:       { pct: 87, tier: 'high' },
      productType: { pct: 88, tier: 'high' },
      variant:     { pct: 87, tier: 'high' },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 87, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Variant-correct Bites pack with the #1 Ingredient badge pulled up into the descriptor band. Five-for-five HIGH but each signal is a point or two softer than Hero_2; visual score <em>74</em> — lowest in the candidate set.',
  },
  {
    id: 'B0BCX5Y7BY_Hero_6',
    filename: 'B0BCX5Y7BY_Hero_6.jpg',
    note: 'Cuts art · dog tight crop · ingredient badge top-right',
    badge: 'Candidate',
    image: 'assets/B0BCX5Y7BY_Hero_6.jpg',
    score: 79,
    tier: 'high',
    mr: {
      brand:       { pct: 88, tier: 'high' },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 88, tier: 'high' },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 88, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Cuts art that scores well on every readability dimension — five-for-five HIGH including Variant at <em>88</em>. Visual score <em>79</em>. Strongest performer that doesn’t require updating the listing’s variant copy.',
  },
  {
    id: 'B0BCX5Y7BY_Hero_7',
    filename: 'B0BCX5Y7BY_Hero_7.jpg',
    note: 'Cuts art · jerky piece kicker bottom-left · dog cropped right',
    badge: 'Candidate',
    image: 'assets/B0BCX5Y7BY_Hero_7.jpg',
    score: 79,
    tier: 'high',
    mr: {
      brand:       { pct: 87, tier: 'high' },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 88, tier: 'high' },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 88, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Mirror of Hero_6 with the jerky piece moved bottom-left and dog cropped on the right. Same <em>79</em> visual score; Brand a tick softer at <em>87</em>. Use Hero_6 over this unless the asymmetric kicker is desired.',
  },
  {
    id: 'B0BCX5Y7BY_Hero_8',
    filename: 'B0BCX5Y7BY_Hero_8.jpg',
    note: 'Cuts art · centered pack · no lifestyle elements',
    badge: 'Candidate',
    image: 'assets/B0BCX5Y7BY_Hero_8.jpg',
    score: 80,
    tier: 'high',
    mr: {
      brand:       { pct: 88, tier: 'high' },
      productType: { pct: 90, tier: 'high' },
      variant:     { pct: 90, tier: 'high' },
      count:       { pct: 92, tier: 'high' },
      size:        { pct: 88, tier: 'high' },
    },
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Best variant-aligned signal in the Cuts set — Variant <em>90</em> alongside five-for-five HIGH on every other axis. Visual score <em>80</em>, three behind the Top Pick but with the cleanest mobile-readiness profile. Strong safe alternate.',
  },
];

/* ─── B01MSDZWOY · Delights Filet Mignon & NY Strip Variety 12 ct ──── */
/* User supplied mobile-readiness + visual score for 9 hero candidates. */
/* tier thresholds:  high ≥ 85   med 65–84   low < 65                   */

const mrTier = (pct) => (pct >= 85 ? 'high' : pct >= 65 ? 'med' : 'low');
const mr5 = (b, p, v, c, s) => ({
  brand:       { pct: b, tier: mrTier(b) },
  productType: { pct: p, tier: mrTier(p) },
  variant:     { pct: v, tier: mrTier(v) },
  count:       { pct: c, tier: mrTier(c) },
  size:        { pct: s, tier: mrTier(s) },
});

const ITERATIONS_B01MSDZWOY = [
  {
    id: 'B01MSDZWOY_840243121618_12',
    filename: '840243121618_12.jpg',
    note: 'Pack-only · centered Delights diamond · variety pack lock-up',
    badge: 'Candidate',
    image: 'assets/B01MSDZWOY_840243121618_12.jpg',
    score: 66,
    tier: 'moderate',
    mr: mr5(80, 55, 50, 90, 22),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Highest visual score among on-variant candidates at <em>66</em> — clean centered diamond with the 12 Count Variety Pack banner clearly seated against the green field. Count reads HIGH (<em>90</em>) but Variant (<em>50</em>) and Size (<em>22</em>) stay LOW; the New York Strip / Filet Mignon split is below the fold on small screens and the 3.5 oz size never appears at the canvas top. Promote.',
  },
  {
    id: 'B01MSDZWOY_840243121618_13',
    filename: '840243121618_13.jpg',
    note: 'Pack-only · 12 Count banner top-aligned · grain-free callout',
    badge: 'Top pick',
    image: 'assets/B01MSDZWOY_840243121618_13.jpg',
    score: 58,
    tier: 'moderate',
    mr: mr5(85, 60, 55, 90, 20),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Front-of-pack with the dog cue tucked into the green field. Brand reads HIGH (<em>85</em>) and Count strong at <em>90</em>, but the variant strip drops to <em>55</em> and Size sits at <em>20</em>. Visual score <em>58</em> — second on-variant pick if the Top Pick is rejected for the centered crop.',
  },
  {
    id: 'B01MSDZWOY_840243121618_11',
    filename: '840243121618_11.jpg',
    note: 'Pack-only · Grain Free badge moved upper-left · cup duo bottom',
    badge: 'Candidate',
    image: 'assets/B01MSDZWOY_840243121618_11.jpg',
    score: 53,
    tier: 'moderate',
    mr: mr5(85, 80, 55, 85, 20),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Grain Free callout swapped to the upper-left and the descriptor stack lifts Product Type to <em>80</em> (MED). Brand HIGH at <em>85</em>; variant still LOW (<em>55</em>) and Size <em>20</em>. Visual score <em>53</em>.',
  },
  {
    id: 'B01MSDZWOY_840243121618_1',
    filename: '840243121618_1.jpg',
    note: 'Skillet hero · gravy + veg detail · centered diamond',
    badge: 'Candidate',
    image: 'assets/B01MSDZWOY_840243121618_1.jpg',
    score: 21.5,
    tier: 'low',
    mr: mr5(88, 82, 60, 88, 22),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Cast-iron skillet hero with the brand diamond centered above. Cleanest readability set in the candidate group — Brand <em>88</em>, Product Type <em>82</em>, Count <em>88</em> — but the food-only composition without the dog cue scores only <em>21.5</em>. Mobile signals are HIGH; visual appeal is not.',
  },
  {
    id: 'B01MSDZWOY_840243121618_3',
    filename: '840243121618_3.jpg',
    note: 'Skillet hero · variant strip pinned to bottom edge',
    badge: 'Candidate',
    image: 'assets/B01MSDZWOY_840243121618_3.jpg',
    score: 13.5,
    tier: 'low',
    mr: mr5(85, 82, 60, 88, 25),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Same skillet treatment as Image 5 with the variant strip pinned to the bottom edge. Brand and Product Type both HIGH; visual score collapses to <em>13.5</em> — the food-led composition reads as generic stew without a Delights signal at eye height.',
  },
  {
    id: 'B01MSDZWOY_840243121618_6',
    filename: '840243121618_6.jpg',
    note: 'Cup duo with skillet inset · NO By-Product ribbon',
    badge: 'Candidate',
    image: 'assets/B01MSDZWOY_840243121618_6.jpg',
    score: 12.5,
    tier: 'low',
    mr: mr5(85, 80, 60, 88, 25),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Cup duo with the NO By-Product ribbon along the left and a skillet inset. Brand, Product Type and Count all HIGH; Variant <em>60</em> and Size <em>25</em> still LOW. Visual score <em>12.5</em> — the ribbon adds clutter without lifting trust signals on mobile.',
  },
  {
    id: 'B01MSDZWOY_840243121618_7',
    filename: '840243121618_7.jpg',
    note: 'Cup duo + skillet · brand diamond pinned top',
    badge: 'Candidate',
    image: 'assets/B01MSDZWOY_840243121618_7.jpg',
    score: 6.5,
    tier: 'low',
    mr: mr5(85, 82, 60, 88, 25),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Brand diamond pinned to the top with the skillet hero and cup duo below. Strong on Brand (<em>85</em>) and Product Type (<em>82</em>) but visual score drops to <em>6.5</em> — bottom-of-pile in the candidate set. Composition reads stacked and hierarchy fights itself.',
  },
  {
    id: 'B01MSDZWOY_840243121618_5',
    filename: '840243121618_5.jpg',
    note: 'Cup duo flat-lay · packshot inset right',
    badge: 'Candidate',
    image: 'assets/B01MSDZWOY_840243121618_5.jpg',
    score: 6.5,
    tier: 'low',
    mr: mr5(82, 65, 55, 88, 22),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Cup duo laid flat with a small packshot inset on the right. Weakest readability in the candidate set — Brand <em>82</em>, Product Type <em>65</em> (MED border), Variant <em>55</em> (LOW). Tied for lowest visual score at <em>6.5</em>; do not promote.',
  },
  {
    id: 'B01MSDZWOY_840243129461_21',
    filename: '840243129461_21.jpg',
    note: 'Off-variant · Delectables Chicken & Beef Toppers · not Delights',
    badge: 'Off-variant',
    image: 'assets/B01MSDZWOY_840243129461_21.jpg',
    score: 91,
    tier: 'high',
    mr: mr5(85, 80, 60, 82, 65),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Highest visual score in the set at <em>91</em>, but the asset shows the <em>Delectables</em> toppers line — a different product than the Delights variety pack this ASIN sells. Mobile-Readiness now reads HIGH on Brand (<em>85</em>) and Count (<em>82</em>, MED border), MED across Product Type (<em>80</em>) and Size (<em>65</em>), with Variant LOW at <em>60</em>. The variant mismatch still invalidates a direct swap — investigate listing copy before promoting.',
  },
];

/* ─── B09LPJB3RJ · Tastefuls Spoonless Singles Chicken & Turkey 12 ct ──── */
/* Live PDP hero scanned twice; 5 hero candidates with visual score + MR.   */
/* tier thresholds:  high ≥ 85   med 65–84   low < 65                        */

const ITERATIONS_B09LPJB3RJ = [
  {
    id: 'B09LPJB3RJ_818wkiyJCSL_0',
    filename: '818wkiyJCSL_0.jpg',
    note: 'Live PDP hero · Amazon CDN · original scan',
    badge: 'Live',
    image: 'assets/B09LPJB3RJ_840243143757_1.jpg',
    score: null,
    tier: 'pending',
    mr: mr5(83, 89, 61, 7, 44),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Current PDP hero pulled from the Amazon CDN. Visual score not yet run. Brand <em>83</em> (MED) and Product Type <em>89</em> (HIGH) carry the tile, but Variant <em>61</em> drops to LOW — the Turkey Entrée strip loses contrast against the orange band on small screens. Count <em>7</em> and Size <em>44</em> both LOW: the twin-tray reads as 2 trays and the 1.3 oz subscript never crosses the legibility threshold.',
  },
  {
    id: 'B09LPJB3RJ_818wkiyJCSL_0_alt',
    filename: '818wkiyJCSL_0(1).jpg',
    note: 'Live PDP hero · rescan with updated MR model',
    badge: 'Live',
    image: 'assets/B09LPJB3RJ_840243143757_1.jpg',
    score: null,
    tier: 'pending',
    mr: mr5(91, 86, 61, 11, 46),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Same live PDP hero re-scored against the updated mobile-readiness model. Brand lifts to <em>91</em> and Product Type to <em>86</em> — both clear HIGH. Variant still LOW at <em>61</em>, with Count (<em>11</em>) and Size (<em>46</em>) unchanged in their LOW band. Use this scan when ranking the candidates below.',
  },
  {
    id: 'B09LPJB3RJ_840243143757_1',
    filename: '840243143757_1.jpg',
    note: 'Brand diamond left · utensil seal centered · 1.3 OZ subscript',
    badge: 'Top pick',
    image: 'assets/B09LPJB3RJ_840243143757_1.jpg',
    score: 38,
    tier: 'low',
    mr: mr5(83, 89, 61, 7, 44),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Leads the candidate set on audience visual score (<em>38</em>) and matches the live PDP hero composition exactly — same MR pattern, same eye-level cat crop, same 1.3 OZ subscript. Product Type reads HIGH at <em>89</em> but Variant (<em>61</em>), Count (<em>7</em>) and Size (<em>44</em>) all sit LOW. Best of an underperforming set; promote only with copy-side fixes to the variant strip.',
  },
  {
    id: 'B09LPJB3RJ_840243143757_4',
    filename: '840243143757_4.jpg',
    note: 'Utensil seal shrunk bottom-right · 1.3 OZ retained · cleanest brand',
    badge: 'Candidate',
    image: 'assets/B09LPJB3RJ_840243143757_4.jpg',
    score: 34.5,
    tier: 'low',
    mr: mr5(91, 85, 83, 14, 0),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Cleanest brand legibility in the set — Brand <em>91</em> and Product Type <em>85</em> both HIGH, Variant lifts to <em>83</em> (MED) with the smaller seal pulled off the descriptor. Size drops to <em>0</em>: the 1.3 oz subscript renders too small for the scanner to pick up at all. Visual score <em>34.5</em> — second place behind 840243143757_1.',
  },
  {
    id: 'B09LPJB3RJ_840243143757_2',
    filename: '840243143757_2.jpg',
    note: 'Utensil seal upper-right · no size subscript · strongest variant',
    badge: 'Candidate',
    image: 'assets/B09LPJB3RJ_840243143757_2.jpg',
    score: 34.5,
    tier: 'low',
    mr: mr5(88, 81, 90, 10, 68),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Best Variant signal in the candidate set at <em>90</em> (HIGH) and the only candidate with Size in the MED band (<em>68</em>). Brand HIGH at <em>88</em>; Product Type <em>81</em> dips to MED because the descriptor loses one line without the size subscript. Tied for visual score at <em>34.5</em>.',
  },
  {
    id: 'B09LPJB3RJ_840243143757_3',
    filename: '840243143757_3.jpg',
    note: 'Utensil seal tucked bottom-right · descriptor stack centered',
    badge: 'Candidate',
    image: 'assets/B09LPJB3RJ_840243143757_3.jpg',
    score: 34.5,
    tier: 'low',
    mr: mr5(83, 72, 89, 10, 9),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Variant reads HIGH at <em>89</em> with the seal pulled fully out of the descriptor zone, but Product Type drops to <em>72</em> (MED) and Size collapses to <em>9</em> — the 1.3 oz subscript is absent entirely. Tied at <em>34.5</em> visual; weakest readability of the three tied candidates.',
  },
  {
    id: 'B09LPJB3RJ_840243143757_5',
    filename: '840243143757_5.jpg',
    note: 'Mirrored layout · cat left · brand diamond right · 1.3 OZ retained',
    badge: 'Candidate',
    image: 'assets/B09LPJB3RJ_840243143757_5.jpg',
    score: 13,
    tier: 'low',
    mr: mr5(89, 81, 91, 19, 73),
    relevance: { pct: 0, tier: 'low' },
    synopsis:
      'Strongest mobile-readiness profile in the set — Variant <em>91</em> and Brand <em>89</em> both HIGH, Size <em>73</em> MED, the cleanest spread overall. But the audience scored it dead last at <em>13</em>: flipping the cat to the left puts it ahead of the brand diamond in reading order and the descriptor stack falls into the lower-right corner where shoppers don\u2019t look first. Do not promote despite the strong MR numbers.',
  },
];

/* Iterations are keyed by ASIN. */
const ITERATIONS_BY_ASIN = {
  'B0BCX4939V': ITERATIONS,
  'B0GQWVCGY4': ITERATIONS_B0GQWVCGY4,
  'B0BCX5Y7BY': ITERATIONS_B0BCX5Y7BY,
  'B01MSDZWOY': ITERATIONS_B01MSDZWOY,
  'B09LPJB3RJ': ITERATIONS_B09LPJB3RJ,
};

window.PRODUCT = PRODUCT;
window.PRODUCT_TABS = PRODUCT_TABS;
window.ITERATIONS = ITERATIONS;
window.ITERATIONS_B0BCX5Y7BY = ITERATIONS_B0BCX5Y7BY;
window.ITERATIONS_B01MSDZWOY = ITERATIONS_B01MSDZWOY;
window.ITERATIONS_B09LPJB3RJ = ITERATIONS_B09LPJB3RJ;
window.ITERATIONS_BY_ASIN = ITERATIONS_BY_ASIN;
window.ProductSVG = ProductSVG;
