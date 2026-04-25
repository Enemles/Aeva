# Creative OS Pawly — ComfyUI × kie.ai

> Playbook de production créa industrialisée pour Pawly (et marques futures).
> Plan validé le 2026-04-22. Phase B étalée sur 3-4 semaines, budget test Tier 1 ~€5-6.
> **Règle modèles** : GPT Image-2 default partout, Nano Banana Pro fallback uniquement, Nano Banana 2 banni.

## Context

Setup disponible : ComfyUI Desktop (mode API-only) + pack ComfyUI-Kie-API (28 nodes) + KJNodes (Set/Get) + rgthree (Fast Groups Bypasser) + VideoHelperSuite. Clé kie.ai active, Vue Nodes OFF (incompatibilité rgthree).

Le but : industrialiser la production créa Pawly via workflows node réutilisables plutôt que prompts one-shot. Pipeline en deux livrables :

1. **Playbook Markdown** (ce document, exhaustif) — catalogue de workflows, logique nodes, modèles, prompts types, coûts estimés.
2. **Workflow JSONs importables** — livrés tier par tier après validation du playbook.

Brand kit paramétrable (1 seul Set node sourceable par tous les workflows), budget kie.ai cible €50-80/mois.

---

## Architecture

### 1. Brand Kit (fondation — W00)

Un unique groupe `BRAND_KIT` avec KJNodes Set :

| Variable | Type | Valeur Pawly |
|---|---|---|
| `brand_name` | String | Pawly |
| `brand_url` | String | gopawly.pro |
| `brand_logo_path` | Image Load | `input/brand/pawly-logo-p.png` (uploadé une fois) |
| `brand_wordmark_path` | Image Load | `input/brand/pawly-wordmark.png` |
| `palette_cream` | String | `#FAF7F2` |
| `palette_camel` | String | `#C4956A` |
| `palette_terracotta` | String | `#B87333` |
| `palette_dark_brown` | String | `#3D2E1E` |
| `font_display` | String | Playfair Display |
| `font_body` | String | Assistant |
| `tone_keywords` | String | warm, natural, Scandi cozy, editorial, not cinematic |
| `style_A_icons` | String | Silhouettes flat geometric, aplats, pas d'ombre |
| `style_B_flatlay` | String | Vue du dessus bois chêne clair, warm earth, produit centré |
| `style_C_iphone` | String | Photo spontanée, lumière naturelle, produit net pas bokeh |
| `bans_common` | String | NO golden hour, NO cinematic filter, NO heavy bokeh, NO 3D render, NO gradient on flat styles, NO text redesign of product |

Tous les autres workflows utilisent `Get` → zéro duplication, swap instantané pour brand future (autre fichier Brand Kit).

### 2. Cheatsheet modèles (budget €50-80/mois cible, liquidité serrée ce mois — tests étalés)

**Règle principale** : GPT Image-2 en default pour toutes les images, Nano Banana Pro uniquement en fallback (quand GPT Image-2 refuse via modération ou qualité insuffisante avec référence produit). Nano Banana 2 non utilisé.

| Job | Modèle par défaut | Fallback | Coût ~ | Quand |
|---|---|---|---|---|
| Toute image (pin, lifestyle, hero, card) | GPT Image-2 T2I / I2I | Nano Banana Pro | $0.08 | Default pour 100% des images |
| Edit/retouche (changer fond, ajouter élément) | GPT Image-2 I2I | Flux 2 I2I, Nano Banana Pro (avec ref) | $0.08 | Post-gen ajustements |
| Backup si modération GPT bloque | Nano Banana Pro | Seedream 4.5, Grok Imagine | $0.05 | Quand GPT Image-2 refuse |
| Vidéo démo produit 6s | Seedance 2.0 I2V | Seedance 1.5 Pro | $0.50 | Clip produit clé, ads |
| Vidéo variations / test rapide | Seedance V1 Pro Fast | Kling 2.5 I2V | $0.20 | A/B, Pinterest Idea Pins, tests |
| Vidéo mouvement complexe / UGC | Kling 3.0 Motion | Kling 2.6 | $0.80 | Transformations, UGC fluide |
| Background music | Suno Basic | — | $0.05 | Loops Reels/Idea Pins |
| Brainstorm / critic / vision | Gemini 3 Pro | — | $0.01 | Génération concepts, scoring, vision DA |

**Caveat GPT Image-2** (cf. `comfyUI-desktop/CLAUDE.md` ligne 119) : modération OpenAI stricte en amont — éviter termes sensual/sexy/etc. même sur portrait neutre. Le flag `nsfw_checker` est un post-filter seulement. Prompts toujours neutres, vocabulaire factuel. Si refus → basculer sur Nano Banana Pro sans redébat (c'est pour ça qu'il est fallback).

**Répartition indicative €30-40/mois** (ce mois, test lean) : 40 GPT Image-2 ($3.2) + 10 Nano Banana Pro fallback ($0.5) + 6 Seedance 2.0 ($3) + 5 Seedance Fast ($1) + 3 Kling 2.6 ($2) + 10 Suno ($0.5) + 100 Gemini ($1) ≈ $11-12 (≈ €11). Budget confortable pour étaler les tests Tier 1 sur 3-4 semaines sans brûler tout.

**Scale-up €50-80/mois** (quand cashflow le permet) : ~×3 sur les volumes images/vidéos.

### 3. Pattern de base répété dans tous les workflows

```
[Pre-flight]
Credit Check (KIE Get Remaining Credits) → affiche solde
  ↓
[Brand context]
BRAND_KIT Get nodes → texte brand + logo + bans
  ↓
[Prompt assembly]
String Concat (prompt user + style X + bans + brand tone)
  ↓
[Model call]
KIE <model> node → image/video output
  ↓
[Compositing local]
Logo overlay (PIL Image Blend via Python node ou manuel post-prod)
Export multi-format (SaveImage avec suffix ratio)
```

---

## Workflow Catalog

20 workflows organisés en 3 tiers.
**Tier 1 MVP** : fondation + le minimum pour débloquer Pinterest + premières vidéos.
**Tier 2 Scale** : une fois MVP validé, industrialisation.
**Tier 3 Experimental** : meta-workflows, SEO phase 2, automation avancée.

### TIER 1 — MVP (build first)

#### W00 — Brand Kit Foundation
- **Purpose** : définir toutes les constantes brand une fois, référencées partout.
- **Nodes** : 14× KJNodes SetNode (voir table ci-dessus) + 2× LoadImage (logo + wordmark).
- **Inputs** : fichiers logo/wordmark uploadés dans `input/brand/`.
- **Outputs** : aucun, juste du contexte à récupérer via GetNode.
- **Coût** : €0.
- **Validation** : ouvrir, lire valeurs, sauvegarder en template.

#### W01 — Credit Pre-flight + Session Logger
- **Purpose** : avant chaque batch, vérifier crédit restant et loguer dans un fichier texte.
- **Nodes** : KIE Get Remaining Credits → String Format → SaveText.
- **Coût** : $0.
- **Validation** : affiche le solde après chaque run.

#### W02 — Pin Factory (Style B editorial flat-lay)
- **Purpose** : concept court → pin Pinterest 2:3 (1000×1500) en style B flat-lay, prêt pour publication.
- **Nodes** :
  - Brand Kit Get (bans, tone, palette, style_B).
  - PrimitiveNode (user input : concept court en FR, ex : "balle auto-mobile chat indoor hiver").
  - String Concat : `[style B template] + [concept] + [palette] + [bans]` — vocabulaire factuel/neutre (modération GPT Image-2).
  - `KIE_GPT_Image2_T2I` (aspect_ratio=2:3, seed=random). Fallback branch bypass-able via rgthree vers `KIE_NanoBananaPro_Image` si refus modération.
  - Logo overlay node (à créer : PIL composite haut-gauche) OU overlay manuel post-prod.
  - SaveImage suffixé `pin-B-<concept>-<seed>.png`.
- **Coût** : ~$0.05/pin.
- **Cas d'usage** : les 3 covers + 10+ pins nourrissage Pinterest organique.
- **Validation** : générer 5 pins sur 5 concepts différents → tous respectent DA.

#### W03 — Product Lifestyle Library (GPT Image-2 I2I + reference, fallback Nano Banana Pro)
- **Purpose** : packshot produit → 10 scènes lifestyle variées (indoor/outdoor/saisons/contextes) pour galerie Shopify + pins + ads.
- **Nodes** :
  - LoadImage (packshot produit, fond blanc).
  - Brand Kit Get (style_C_iphone, bans, tone).
  - String Concat : `[style C] + "Product shown EXACTLY as in reference, do NOT redesign" + [context variation]` — vocabulaire factuel.
  - Loop via rgthree RepeatForEach sur N contextes (salon, fenêtre, terrasse, lit, cuisine…).
  - `KIE_GPT_Image2_I2I` avec reference image input. Fallback branch `KIE_NanoBananaPro_Image` avec ref si modération GPT refuse (à tester : fidélité produit peut varier, on compare sur 2-3 runs).
  - SaveImage batch avec nomenclature `lifestyle-<product>-<context>-<n>.png`.
- **Coût** : ~$0.80 pour 10 variations (GPT Image-2).
- **Cas d'usage** : Pawly Ball (10 scènes indoor), Pawly Bowl (10 scènes outdoor rando).
- **Validation** : produit net, contexte varié, DA Pawly respectée.

#### W09 — Seedance Demo (packshot → clip 6s produit en action)
- **Purpose** : image produit statique → vidéo 6s du produit en usage (chat joue avec balle, chien boit au bol).
- **Nodes** :
  - LoadImage (packshot ou lifestyle scene).
  - Brand Kit Get (tone).
  - String prompt : action description ("white cat gently pawing the ball, soft indoor light, no camera movement").
  - `KIE_Seedance_2.0_I2V` (duration=6s, aspect=9:16 Reels ou 2:3 Pinterest).
  - SaveVideo.
- **Coût** : ~$0.50/clip.
- **Cas d'usage** : 1 clip par produit par semaine pour Reels/TikTok/Pinterest Video Pin.
- **Validation** : mouvement crédible, produit fidèle à la ref, pas de déformation.

#### W10 — Kling I2V Subtle Motion (pin statique → pin animé Pinterest)
- **Purpose** : prendre un pin Tier 1 W02 et lui ajouter micro-animation (feuilles qui bougent, vapeur bol, rayons fenêtre) pour Pinterest Video Pin (+2× engagement vs static).
- **Nodes** :
  - LoadImage (pin existant).
  - Prompt : "subtle ambient motion, leaves swaying, soft particle light, product still".
  - `KIE_Kling_2.6_I2V` (duration=5s, mouvement minimal).
  - SaveVideo (converti en .mp4 9:16 via VideoHelperSuite si besoin).
- **Coût** : ~$0.30/clip.
- **Cas d'usage** : recycler chaque pin statique en video pin, doubler la portée.
- **Validation** : le produit reste fixe, seulement l'ambiance bouge.

#### W14 — Suno Background Loops Library
- **Purpose** : constituer un pack de 20 boucles audio "warm, cosy, editorial" 30s réutilisables sur tous les clips.
- **Nodes** :
  - `KIE_Suno_Basic` × N avec prompts variés ("warm acoustic guitar loop", "soft cosy indoor ambient", "upbeat hiking rhythm", etc.).
  - SaveAudio nomenclature `bg-<mood>-<bpm>.mp3`.
- **Coût** : ~$1 pour 20 loops, one-shot.
- **Cas d'usage** : à monter sur tout clip vidéo ensuite dans CapCut/Premiere.
- **Validation** : 20 fichiers dans `output/audio/`, couvrant indoor cosy + outdoor rando + upbeat CTA.

### TIER 2 — Scale (une fois MVP tourné)

#### W04 — Pin Series Generator (1 concept → 5 variations composition)
- **Purpose** : même concept, 5 cadrages/compositions différents → choisir le meilleur ou les publier en série.
- **Nodes** : Pin Factory W02 + rgthree Seed List (5 seeds fixes) + String variations injection.
- **Coût** : ~$0.25/série.
- **Cas d'usage** : quand un concept performe, en tirer une série cohérente.

#### W05 — Multi-format Exporter (1 image → Pinterest 2:3 + IG 1:1 + IG Story 9:16 + Facebook 1.91:1)
- **Purpose** : une même création déclinée pour tous les canaux en un seul run.
- **Nodes** : LoadImage → PIL Crop+Pad × 4 formats → SaveImage × 4 avec suffixe format.
- **Coût** : $0 (local compositing).
- **Cas d'usage** : chaque pin Tier 1 passé dans W05 → 4 assets.

#### W06 — Seasonal Swarm (produit + saison → pack variations)
- **Purpose** : même produit × 4 saisons × 3 moods = 12 lifestyle scenes saisonnières.
- **Nodes** : Product Lifestyle W03 + rgthree Loop sur tag saison + mood.
- **Coût** : ~$0.60/swarm.
- **Cas d'usage** : préparer 3 mois de contenu Pinterest d'un coup.

#### W07 — Product Hero Shot (packshot éditorial studio)
- **Purpose** : packshot brut (fond blanc e-commerce) → packshot éditorial sur matière (lin, bois, pierre) pour page produit.
- **Nodes** : `KIE_GPT_Image2_I2I` (edit background) + Brand Kit style B. Fallback `KIE_Flux_2_I2I` ou `KIE_NanoBananaPro_Image` si refus.
- **Coût** : ~$0.08/shot.
- **Cas d'usage** : visuels galerie Shopify hero.

#### W11 — Ad Multi-scène (hook / reveal / CTA → vidéo 15s)
- **Purpose** : 3 scènes vidéo Seedance concaténées pour ad Meta/TikTok/Reels.
- **Nodes** :
  - Scene 1 (hook) : lifestyle pain point (chat qui s'ennuie, chien qui a soif) via Seedance Fast.
  - Scene 2 (reveal) : produit en action via Seedance 2.0 (W09).
  - Scene 3 (CTA) : pack shot + wordmark via image+zoom Kling.
  - VideoHelperSuite Concat + Fade Transitions.
  - Suno track W14 overlay.
- **Coût** : ~$1.50/ad.
- **Cas d'usage** : 2-3 ads/mois, base des tests Meta quand rallumé.

#### W15 — Concept → Static + Video Chain
- **Purpose** : un seul prompt concept génère à la fois le pin statique W02 ET son animation W10, nommés identiquement.
- **Nodes** : W02 fork → W10, SaveImage + SaveVideo avec même basename.
- **Coût** : ~$0.35/pair.
- **Cas d'usage** : productiviser la paire pin+video pin Pinterest.

#### W16 — Review Card Composer (avis client → card Pinterest/IG)
- **Purpose** : input texte avis client → card brand avec avis + étoiles + produit.
- **Nodes** : String input → Brand Kit text styling → GPT Image-2 T2I avec template prompt "editorial review card, star rating, dark brown text on cream" + overlay logo. Fallback Nano Banana Pro.
- **Coût** : ~$0.08/card.
- **Cas d'usage** : recycler chaque review Judge.me en asset social.

#### W18 — Product Page Gallery Filler (produit → pack 8 photos diversifiées)
- **Purpose** : combler une galerie Shopify (hero + 7 angles/contextes) d'un coup.
- **Nodes** : W03 paramétré avec 8 contextes spécifiques page produit.
- **Coût** : ~$0.40/gallery.
- **Cas d'usage** : chaque nouveau produit importé DSers/CJ.

### TIER 3 — Experimental / Phase 2

#### W08 — Variant Generator (couleurs hypothétiques du produit)
- **Purpose** : tester visuellement une variante couleur avant même de commander à CJ/DSers.
- **Nodes** : GPT Image-2 I2I avec prompt "same product, change color to <X>, keep shape exactly" + validation Gemini 3 Pro "does this look plausible". Fallback Flux 2 I2I.
- **Coût** : ~$0.10/variant.
- **Cas d'usage** : research produit / A/B visual pre-commande.

#### W12 — UGC-Style Reels (phone-vibes person+product)
- **Purpose** : simuler une UGC iPhone de quelqu'un qui utilise le produit, sans avoir à shooter.
- **Nodes** : Nano Banana Pro (scène main + produit + cadrage phone) → Kling 3.0 Motion (mouvement phone naturel).
- **Coût** : ~$1/clip.
- **Cas d'usage** : ads Meta/TikTok UGC sans créateur.
- **Note** : à valider éthiquement — ne pas prétendre que c'est un vrai utilisateur.

#### W13 — Before/After Transformation
- **Purpose** : 2 images (avant / après) → clip transformation fluide (chat endormi → chat qui joue).
- **Nodes** : LoadImage × 2 → Kling 2.6 Transition → SaveVideo.
- **Coût** : ~$0.60/clip.

#### W17 — Campaign Brainstormer (Gemini 3 Pro → 10 concepts → auto-queue Pin Factory)
- **Purpose** : description campagne + objectif → Gemini 3 Pro pond 10 concepts visuels structurés JSON → chacun enqueue une run de W02.
- **Nodes** : `KIE_Gemini_3_Pro` avec system prompt "you are a Pinterest creative director for Pawly, output JSON array of 10 concepts with {title, scene_description, mood, format}" → JSON Parse → rgthree RepeatForEach → W02.
- **Coût** : ~$0.01 Gemini + $0.50 pin batch = ~$0.51/campagne.
- **Cas d'usage** : jeudi soir, tu lances "campagne rentrée scolaire dog dad rando" → samedi matin 10 pins prêts.

#### W19 — Critic Pass (output + brand brief → Gemini score + pick top-N)
- **Purpose** : après un batch, Gemini 3 Pro note chaque output contre la DA (respect palette, style, interdictions) et renvoie top 3.
- **Nodes** : LoadImage batch → Gemini 3 Pro Vision (input image + brand brief) → Score JSON → Python filter top-N → SaveImage dans `output/curated/`.
- **Coût** : ~$0.02/image evaluated.
- **Cas d'usage** : curation automatique après batch de 20+.

#### W20 — Blog Hero Visual (Phase 2 SEO pillar)
- **Purpose** : titre article → 1 hero 16:9 + 3 inline illustrations + 1 pin companion 2:3.
- **Nodes** : Gemini 3 Pro (title → 5 image briefs) → W02/W07 batch → multi-format exports.
- **Coût** : ~$0.30/article.
- **Cas d'usage** : quand le pillar content démarre (Phase 2 CLAUDE.md).

---

## Implementation Sequence

### Phase A — Playbook validé (ce document)

Référence vivante de tous les workflows, pas besoin de tout construire.

### Phase B — Tier 1 MVP (7 workflows JSON, étalés sur 3-4 semaines vu liquidité serrée ce mois)

Ordre de build recommandé, avec check liquidité entre chaque :

**Semaine 1 — Fondations gratuites / quasi-gratuites**
1. **W00 Brand Kit** — construction du node, €0. ~15 min.
2. **W01 Credit Pre-flight** — lancement gratuit, €0. ~5 min.
3. **W14 Suno Loops** — ~$1 pour 20 loops, one-shot qui sert pour des mois. ~30 min build + 20 min runs.

**Semaine 2 — Image factory**

4. **W02 Pin Factory** — build + 3-5 runs test (GPT Image-2 default, fallback Nano Banana Pro). ~$0.40 de tests. Dépend W00.
5. **W03 Product Lifestyle** — build + 3-5 runs test par produit. ~$0.80 de tests. Dépend W00.

**Semaine 3 — Vidéo factory**

6. **W09 Seedance Demo** — build + 2-3 runs test. ~$1.50 de tests. Dépend W03 (pour avoir des inputs lifestyle).
7. **W10 Kling Motion** — build + 2-3 runs test. ~$0.90 de tests. Dépend W02 (pour avoir des pins).

**Semaine 4 — consolidation**
- Review des outputs, curation, ajustement prompts templates, docs d'usage perso.
- Budget cumulé Tier 1 test : ~$5-6 (€5-6) — très en-dessous des €30-40/mois cible ce mois.

**Principe** : avant chaque run, W01 Credit Pre-flight pour vérifier solde. Une mauvaise surprise peut tuer un mois entier.

### Phase C — Tier 2 Scale

Construit au fil des besoins : dès qu'un Tier 1 tourne bien et que tu sens le goulot, on ajoute le Tier 2 qui débouche. Ex : dès que W02 pond 10 pins, ajoute W04 (séries) + W05 (multi-format). Dès que W09 existe, ajoute W11 (multi-scène).

### Phase D — Tier 3 Experimental

Quand le Tier 2 tourne et que tu as bande passante pour expérimenter. W17 (Campaign Brainstormer) est le plus différenciant.

---

## Files to create (when we build)

| Path | Contenu |
|---|---|
| `/Users/selmene/Developer/www/perso/comfyUI-desktop/user/default/workflows/W00-brand-kit-pawly.json` | Brand Kit foundation |
| `/Users/selmene/Developer/www/perso/comfyUI-desktop/user/default/workflows/W01-credit-preflight.json` | Credit check |
| `/Users/selmene/Developer/www/perso/comfyUI-desktop/user/default/workflows/W02-pin-factory.json` | Pin Factory Style B |
| `/Users/selmene/Developer/www/perso/comfyUI-desktop/user/default/workflows/W03-product-lifestyle.json` | Lifestyle library |
| `/Users/selmene/Developer/www/perso/comfyUI-desktop/user/default/workflows/W09-seedance-demo.json` | Video demo |
| `/Users/selmene/Developer/www/perso/comfyUI-desktop/user/default/workflows/W10-kling-motion.json` | Pin animé |
| `/Users/selmene/Developer/www/perso/comfyUI-desktop/user/default/workflows/W14-suno-loops.json` | Audio loops |
| `/Users/selmene/Developer/www/perso/comfyUI-desktop/input/brand/pawly-logo-p.png` | Logo P à uploader (fourni par user) |
| `/Users/selmene/Developer/www/perso/comfyUI-desktop/input/brand/pawly-wordmark.png` | Wordmark à uploader (fourni par user) |

## Éléments existants à réutiliser

- **Custom nodes déjà installés** : ComfyUI-Kie-API (28 nodes), ComfyUI-KJNodes (Set/Get), rgthree-comfy (Fast Groups Bypasser, RepeatForEach), ComfyUI-VideoHelperSuite (Concat, Fade).
- **Workflows existants à étudier** : `custom_nodes/ComfyUI-Kie-API/example_workflows/Kie-AI-Nodes.json` (catalogue complet), `KIE-AI-Banana-Pro-Grid.json` (pattern grid/variations), `Kie AI - Kling 3.0 Motion.json` (pattern I2V motion), `Kie AI Suno.json` (pattern audio).
- **Pattern doc** : `comfyUI-desktop/custom_nodes/ComfyUI-Kie-API/web/docs/*.md` (35 docs, un par node).
- **DA memory** : `/Users/selmene/.claude/projects/-Users-selmene-Developer-www-perso-drop/memory/feedback_brand_DA.md` (3 styles A/B/C + palette + bans + règles prompts).
- **Scripts existants** (`drop/`) : `scripts/generate-pins.mjs` + `generate-pins-bis.mjs` — prompts déjà validés, à récupérer pour injection dans W02.

---

## Verification

### Smoke test Tier 1

1. Lancer ComfyUI Desktop.
2. Charger W00 Brand Kit → vérifier que les Set nodes exposent bien les variables.
3. Charger W01 Credit Pre-flight → run → vérifier solde affiché.
4. Charger W02 Pin Factory → input concept "balle auto-mobile chat indoor hiver" → run → vérifier pin 2:3, DA Style B respectée, pas de golden hour/bokeh.
5. Charger W14 Suno Loops → run batch 3 loops → vérifier 3 `.mp3` dans `output/audio/`.
6. Charger W03 Product Lifestyle avec ref Pawly Ball → run 3 contextes → produit fidèle, DA Style C.
7. Charger W09 Seedance Demo avec une lifestyle scene W03 → run → clip 6s, mouvement crédible, produit fidèle.
8. Charger W10 Kling Motion avec un pin W02 → run → clip 5s mouvement subtil.

### Validation coût

Après le smoke test, relancer W01 Credit Pre-flight → vérifier delta crédit < $3 pour le run complet (ordre de grandeur attendu).

### Validation qualité DA

Pour chaque Tier 1 output, checker visuellement :
- Palette warm earth respectée (cream, camel, terracotta, dark brown)
- Pas de golden hour / cinematic / bokeh excessif
- Logo et wordmark lisibles (si inclus dans le workflow ou ajoutés post-prod)
- Produit fidèle à la ref (pas de redesign Pawly Ball / Bowl)

### Intégration au repo Pawly

- Aucun workflow ne modifie le repo `drop/`. Tous les assets générés restent dans `comfyUI-desktop/output/` puis sont copiés/uploadés manuellement vers Shopify / Pinterest / Canva quand choisis.
- Ce playbook est versionné dans `drop/CREATIVE-OS.md` comme référence du repo.

---

## Out of scope

- Pas d'automatisation de publication (Pinterest/Shopify/Meta) depuis ComfyUI — reste manuel ou via les apps natives.
- Pas d'intégration direct avec drop-control PWA pour l'instant (potentiel Tier 3 plus tard : tracker coût créa/CA par campagne).
- Pas de pipeline SEO pillar complet — W20 scaffoldé mais à activer en Phase 2 seulement.
- Meta Ads paused côté stratégie (CLAUDE.md) → les workflows vidéo ads (W11, W12) sont prêts mais attendront la réactivation.

---

## Suivi d'avancement

| Workflow | Status | Date | Notes |
|---|---|---|---|
| W00 Brand Kit | Build OK | 2026-04-22 | À vérifier après restart |
| W01 Credit Pre-flight | Build OK + testé | 2026-04-22 | Solde fonctionnel |
| W14 Suno Loops | **Re-build BATCH** (4 moods restants) | 2026-04-24 | Track A Cosy Acoustic OK 2026-04-22 (`bg-cosy-acoustic-a.mp3`). Workflow retransformé en BATCH : 4 `KIE_Suno_Music_Basic` (Hiking / Editorial Slow / Minimal Ambient / Playful Motion) + 8 PreviewAudio en 1 Queue. 13 nodes / 8 links / 4 groups. Coût ~$0.20 total. À Queue après W01 credit check. Nommage cible : `bg-hiking-upbeat-a/b.mp3`, `bg-editorial-slow-a/b.mp3`, `bg-minimal-ambient-a/b.mp3`, `bg-playful-motion-a/b.mp3`. |
| W02 Pin Factory | **Validé BATCH v4** | 2026-04-23 | 5 concepts → 5 pins 2:3 style B flat-lay en 1 Queue. 28 nodes / 30 links / 6 groups. ~$0.40/Queue. **User a validé la sortie DA.** |
| W03 Product Lifestyle | **Validé partiellement** (2/5) | 2026-04-23 | Premier Queue : 5 concepts ont tourné en séquentiel (bug de ma promesse "parallèle" — ComfyUI est single-threaded + chaque node KIE est bloquant). Durée totale longue, un task coincé 9+ min chez kie.ai. User a gardé **c1 (salon matin chat blanc) + c5 (chambre matin chat endormi)**. c2, c3, c4 rejetés. Coût confirmé modéré. Pour relancer : remplacer les 3 concepts rejetés, re-Queue. |
| W09 Seedance Hooks | **Re-build** (v2, Seedance 2.0 FULL) | 2026-04-23 | **Pivot** après test v1 : Seedance Fast sur packshot = inutilisable (dérive, invente). v2 = Seedance 2.0 **FULL** (`bytedance/seedance-2`) + input obligatoire = **scène narrative déjà validée** (W02/W03 ou image custom dédiée hook), pas packshot. Batch 2 clips = $1/Queue. Usage ciblé : hooks Reels/Pinterest/ads. Prompts = directives d'animation sur scène existante, pas création. 9 nodes / 6 links / 4 groups. À tester sur scène validée. |
| W10 Kling Motion | **Deprecated** (non MVP) | 2026-04-23 | Test v1 2026-04-23 : rendu hyper cheap (mouvements IA évidents, ambiance plastique) + coût élevé. Sortie du Tier 1 MVP. Fichier JSON conservé dans `workflows/` mais à NE PAS utiliser sans revalidation. Pour animer un pin/lifestyle → passer par W09 Seedance 2.0 full à la place. |
| W05 Multi-format Exporter | **Validé (Tier 2)** | 2026-04-23 | 1 image → 4 formats social (Pinterest 2:3, IG 1:1, Story 9:16, FB 1.91:1) via ImageResizeKJv2 + crop center. 100% local, **$0**. User a validé 2026-04-23. Pipeline standard : après chaque asset validé W02/W03, le passer dans W05. |
| W04 Hero Series T2I | **Re-build v2** (variation textuelle forcée) | 2026-04-24 | Pivot après test v1 : **kie.ai cache sur hash prompt** (GPT Image-2 déterministe) → 4× le même prompt = 4× la même image. User a rapporté "c'est les 4 les mêmes". v2 injecte 4 **composition_variation** distinctes (wide landscape / tight sofa crop / slight overhead / eye-level) via JoinStringMulti, combinées au user_concept_base + prompt_tail. 4 prompts textuellement différents → 4 compositions réelles. 23 nodes / 20 links / 5 groups. Coût ~$0.32/Queue. Cas d'usage : hero brand umbrella 16:9 sans produit, background website. **Validé 2026-04-25** (compositions distinctes confirmées). |
| W21 Translate / Edit Batch (utilitaire) | Build | 2026-04-25 | **Hors catalogue Tier 1-3** — utilitaire I2I batch sur demande. 6 LoadImage + 1 shared_edit_prompt PrimitiveString + 6 KIE_GptImage2_ImageToImage (aspect `auto`) + 6 PreviewImage + 6 SaveImage (`translate/out-N-`). Le même prompt d'édition est appliqué aux 6 images en 1 Queue. Cas typiques : traduction texte FR→EN, style transfer, background swap, color grade. 26 nodes / 24 links / 5 groups. Coût ~$0.48/Queue. À tester. |
| W22 Rebrand Infographic Pawly (utilitaire) | Re-build (pivot redesign) | 2026-04-25 | **Hors catalogue Tier 1-3** — pivot du préset par rapport au build initial : on ne PRÉSERVE plus les labels/icônes (sinon les images AliExpress restent moches), on les **redesigne** intégralement. Préservation = produit fidèle (forme/proportions/couleur/matière) + **contenu factuel** des infos (specs, features, dimensions, bénéfices). Liberté = layout en grille éditoriale, typo rounded sans clean, icônes flat geometric line consistant, palette Pawly, negative space, hiérarchie visuelle, FR cible France/Belgique. Suppression badges urgence cheap, watermarks, anglais cassé, déco rouge/jaune e-commerce asiatique. 26 nodes / 24 links / 5 groups. Coût ~$0.48/Queue. À tester sur images CJ/AliExpress. |
