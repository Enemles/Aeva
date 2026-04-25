# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Shopify dropshipping store **Pawly** — marque **pet lifestyle multi-produit** (indoor + outdoor).
Built on Shopify Dawn theme (v15.4.1).

Pivot stratégique (2026-04-19) : passage de one-product (balle interactive chat) à une vraie marque multi-produit. La balle chat reste le produit phare, rejointe par une gamelle d'eau portative pour chiens (cible dog dad en rando) et d'autres produits pet lifestyle ajoutés progressivement.

## Brand

- **Nom** : Pawly
- **Positionnement** : pet lifestyle — la vie avec ton animal, indoor et outdoor
- **Angle umbrella** : *« On pense à eux comme tu penses à eux. »* — centre sur la promesse produit, s'applique à tous les scénarios (chat seul à la maison, chien en rando, futurs produits)
- **Style** : warm/natural, Scandi cozy
- **Couleurs** : fond crème #FAF7F2, texte brun #3D2E1E, accent #C4956A, boutons terracotta #B87333
- **Typographie** : titres Quicksand (medium 500, geometric rounded sans), corps Nunito (regular 400, rounded sans complémentaire)
- **Ton** : warm, honest, chaleureux — pas culpabilisant, pas tiède
- **Langue actuelle** : **français uniquement** (expédition FR/BE). Phase 2 : multilingue EN/DE/NL via Shopify Markets
- **Marché cible Phase 1** : France + Belgique. Phase 2 : UK, Allemagne, Pays-Bas, Scandinavie

## Produits

- **Pawly Ball** — balle interactive auto-mobile pour chats d'intérieur (€24,99 / €39,99 pour 2). Handle Shopify : `new-cat-interactive-ball-toy-automatic-rolling-cat-ball-rechargeable-smart-kitten-interactive-toy-intelligent-balls-toy-for-cat`. Angle : stimulation du chat quand le propriétaire n'est pas là
- **Pawly Bowl** (wording provisoire) — gamelle d'eau portative pour chiens, cible dog dad en rando été. Import via DSers en cours. Angle : ne jamais laisser son chien avoir soif en rando
- Produits additionnels : gérés progressivement par l'utilisateur via sa formation

## Architecture

Shopify Dawn theme avec templates JSON custom :

- `templates/index.json` — Homepage brand hub (hero umbrella → pitch marque → showcase produits → bénéfices cross-produit → social proof → CTA collection)
- `templates/product.json` — Page produit par défaut (utilisée pour Pawly Ball, landing mono-produit avec angle cat indoor)
- `templates/product.water-bowl.json` — Template alternatif pour Pawly Bowl (angle dog dad rando outdoor) — à créer une fois le handle DSers connu
- `templates/collection.json` — Collection "Boutique" regroupant tous les produits
- `templates/page.faq.json` — FAQ restructurée (Commandes/livraison + Questions produits par famille)
- `templates/page.about.json` — About Pawly (brand story élargie indoor+outdoor)
- `templates/page.policy.json` — Politique de retour et remboursement (générique tous produits)
- `templates/page.contact.json` — Contact
- `templates/blog.json`, `templates/article.json` — Blog (utilisés en Phase 2 pour le pillar SEO)
- `config/settings_data.json` — Thème config (couleurs, typo, spacing, cart drawer)
- `sections/header-group.json` — Header + barre d'annonce
- `sections/footer-group.json` — Footer avec newsletter, payment icons

## Stratégie acquisition (Phase 1)

- **Pas de Meta Ads** pour l'instant (paused jusqu'à rentabilité organique/Pinterest)
- **Organique + SEO on-page** : metas, schema.org, JSON-LD Product/Organization, alt text, H1/H2 optimisés. Pas encore de pillar complet (reporté Phase 2)
- **Pinterest Ads** : déploiement du crédit 100€ de lancement sur 1-2 campagnes test
- **Judge.me + reviews AliExpress** importées : conservé

## Stratégie Phase 2 (après premières ventes)

- Pillar SEO complet (hub + 10-15 spokes articles) sur blog
- Multilingue EN/DE/NL via Shopify Markets
- Meta Ads rallumé (quand rentable)
- Produits additionnels selon formation utilisateur

## Key Decisions

- **Cart type** : Drawer
- **Bundle** : Shopify Bundles app (native) — 2x Pawly Ball pour €39,99
- **Reviews** : Judge.me app + import AliExpress
- **Tracking** : Meta Pixel via app Facebook & Instagram (gardé en stand-by), GA4 via app Google & YouTube
- **Sourcing** : CJdropshipping (Pawly Ball) + DSers (Pawly Bowl)
- **Shipping display** : Transparent « Commandes traitées sous 1 à 3 jours ouvrés. Livraison estimée : 5 à 8 jours ouvrés en Europe »
- **Pas de sélecteurs pays/langue** en Phase 1 (store monolingue FR). Sélecteurs à activer en Phase 2 via Shopify Markets

## Navigation

Accueil → Boutique (collection all) → À propos → FAQ → Contact

*(Phase 1 : le menu admin Shopify `main-menu` sera mis à jour pour retirer l'ancien lien direct "Meet the Ball" et le remplacer par "Boutique".)*

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
