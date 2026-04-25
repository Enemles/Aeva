---
version: "alpha"
name: Pawly
description: Pet lifestyle — warm, natural, Scandi cozy. Éditorial flat, pas cheap, chaleureux.

colors:
  primary: "#B87333"
  terracotta: "#B87333"
  terracotta-deep: "#8B5A2B"
  cream: "#FAF7F2"
  biscuit: "#F0EAE0"
  brown: "#3D2E1E"
  brown-deep: "#2A1F14"
  camel: "#C4956A"
  white: "#FFFFFF"

typography:
  h0-hero:
    fontFamily: Quicksand
    fontWeight: 500
    fontSize: 6.8rem
    lineHeight: 1.1
    letterSpacing: -0.005em
  h1:
    fontFamily: Quicksand
    fontWeight: 500
    fontSize: 5rem
    lineHeight: 1.15
    letterSpacing: 0em
  h2:
    fontFamily: Quicksand
    fontWeight: 500
    fontSize: 3rem
    lineHeight: 1.2
    letterSpacing: 0em
  h3:
    fontFamily: Quicksand
    fontWeight: 500
    fontSize: 2rem
    lineHeight: 1.25
    letterSpacing: 0em
  body:
    fontFamily: Nunito
    fontWeight: 400
    fontSize: 1.6rem
    lineHeight: 1.5
  body-sm:
    fontFamily: Nunito
    fontWeight: 400
    fontSize: 1.4rem
    lineHeight: 1.5
  tagline:
    fontFamily: Nunito
    fontWeight: 400
    fontSize: 1.5rem
    lineHeight: 1.5
    fontStyle: italic
  overline:
    fontFamily: Quicksand
    fontWeight: 600
    fontSize: 1.1rem
    lineHeight: 1
    letterSpacing: 0.14em
    textTransform: uppercase
  label-caps:
    fontFamily: Quicksand
    fontWeight: 500
    fontSize: 1.2rem
    lineHeight: 1
    letterSpacing: 0.12em
    textTransform: uppercase
  button-label:
    fontFamily: Quicksand
    fontWeight: 600
    fontSize: 1.3rem
    lineHeight: 1
    letterSpacing: 0.1em
    textTransform: uppercase

rounded:
  none: 0px
  sm: 2px
  pill: 999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 60px
  section-desktop: 60px
  section-mobile: 40px
  page-width: 1200px
  grid-gutter: 12px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.button-label}"
    rounded: "{rounded.sm}"
    padding: 14px
  button-primary-hover:
    backgroundColor: "{colors.brown}"
    textColor: "{colors.cream}"
  button-primary-active:
    backgroundColor: "{colors.terracotta-deep}"
    textColor: "{colors.white}"
  button-on-dark:
    backgroundColor: "{colors.camel}"
    textColor: "{colors.brown}"
    typography: "{typography.button-label}"
    rounded: "{rounded.sm}"
    padding: 14px
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.terracotta}"
    typography: "{typography.button-label}"
    rounded: "{rounded.sm}"
    padding: 14px
  button-secondary-hover:
    backgroundColor: "rgba(184, 115, 51, 0.08)"
    textColor: "{colors.terracotta}"
  card-product:
    backgroundColor: "transparent"
    textColor: "{colors.brown}"
    rounded: "{rounded.none}"
  card-product-alt:
    backgroundColor: "{colors.biscuit}"
    textColor: "{colors.brown}"
    rounded: "{rounded.none}"
  section-dark:
    backgroundColor: "{colors.brown-deep}"
    textColor: "{colors.cream}"
  card-product-overline:
    textColor: "{colors.terracotta}"
    typography: "{typography.overline}"
  card-product-title:
    textColor: "{colors.brown}"
    typography: "{typography.h3}"
  card-product-tagline:
    textColor: "{colors.brown}"
    typography: "{typography.tagline}"
  badge:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.brown}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 6px
  badge-sale:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.cream}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 6px
  header:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.brown}"
    typography: "{typography.label-caps}"
  header-link-hover:
    textColor: "{colors.terracotta}"
  cart-count:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    size: 18px
  announcement-bar:
    backgroundColor: "{colors.brown}"
    textColor: "{colors.cream}"
    typography: "{typography.overline}"
  menu-drawer:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.brown}"
    typography: "{typography.label-caps}"
  menu-drawer-item-hover:
    textColor: "{colors.terracotta}"
  input:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.brown}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 12px
  input-label:
    textColor: "{colors.brown}"
    typography: "{typography.label-caps}"
---

## Overview

Pawly est une marque **pet lifestyle multi-produit** (indoor + outdoor). Le système visuel porte une promesse simple : *« On pense à eux comme tu penses à eux. »* — chaleureux, honnête, jamais culpabilisant.

Le style est **warm natural Scandi cozy** : palette terre brûlée (cream, terracotta, brun profond), typographie géométrique ronde (Quicksand + Nunito), et un parti-pris **éditorial flat** — pas d'ombres dramatiques, pas de dégradés, pas d'effets cheap. Les formes sont **quasi carrées** (radius 0 ou 2px) pour évoquer la rigueur d'un magazine papier, pas d'un e-shop générique.

Le système s'applique à tous les scénarios produit : chat seul à la maison, chien en rando, et futurs produits pet lifestyle. Le ton reste cohérent quel que soit le contexte.

## Colors

Palette warm earth stricte. Toutes les couleurs sont déjà figées dans les color schemes Shopify (`config/settings_data.json` — schemes 1 à 5).

- **`cream` `#FAF7F2`** — fond principal du site (scheme-1). Sensation papier calcaire chaleureux.
- **`biscuit` `#F0EAE0`** — fond alterné warm (scheme-2), utilisé pour rythmer les sections et pour les cards produit.
- **`brown` `#3D2E1E`** — texte principal, fond contrasté (scheme-3 bg, announcement bar), bordures subtiles en 8% d'opacité.
- **`brown-deep` `#2A1F14`** — fond très sombre (scheme-4), utilisé pour des sections éditoriales rares. Sert aussi de token shadow en 8% d'opacité max.
- **`terracotta` `#B87333`** — couleur d'interaction principale : boutons primaires, hovers, prix en solde, accents chapeau. **Usage parcimonieux** — elle porte l'œil.
- **`terracotta-deep` `#8B5A2B`** — variante foncée, utilisée uniquement sur le scheme-5 (shadow de CTA inversé).
- **`camel` `#C4956A`** — accent doux sur fonds sombres (scheme-3/4 button). Ne jamais utiliser sur cream ou biscuit (contraste insuffisant, manque de punch).
- **`white` `#FFFFFF`** — label bouton terracotta uniquement. Pas de pur blanc ailleurs — le fond de la marque est cream.

**Règle d'or** : **jamais de couleurs hors palette** (bleu, vert, rouge pur, gris neutre). Si un élément a besoin d'une couleur, elle vient de cette liste de 8 tokens.

## Typography

Deux familles Google Fonts, déjà chargées par le thème :

- **Quicksand** — geometric rounded sans, poids 500 (medium) et 600 (semi-bold). Porte toute la hiérarchie visuelle : titres, overlines, labels uppercase, boutons.
- **Nunito** — rounded sans complémentaire, poids 400 (regular). Porte tout le body et les taglines (en italique, seule exception italique du système).

**Tracking** : serré (0 ou légèrement négatif) sur les titres pour un rendu éditorial moderne, **très large (0.1 à 0.18em) en uppercase** pour tous les labels/overlines/boutons — c'est la signature tracking Pawly.

Les styles sont mappés sur les classes CSS existantes (`assets/pawly-overrides.css`) :

- `h0-hero` → `.banner__heading.h0` (hero banners)
- `overline` → `.pawly-overline`, `.pawly-caption`
- `label-caps` → `.pawly-header__link`, `.field__label`, `.menu-drawer__menu-item`
- `tagline` → `.pawly-tagline`, `.pawly-card__tagline`
- `button-label` → `.button:not(.button--tertiary)`

## Layout

- **Container** : `page-width: 1200px`, centré.
- **Section spacing** : `60px` desktop / `40px` mobile (breakpoint `749px`). C'est la respiration éditoriale, plus aérée qu'un thème Dawn par défaut.
- **Grid gutter** : `12px` horizontal et vertical, serré mais confortable en mobile.
- **Hero banners** : padding vertical `6rem` pour imposer la présence.
- **Text measure** : `max-width: 52ch` pour les paragraphes intro, `56ch` pour les body — la lecture reste magazine-like.

## Elevation & Depth

**Éditorial flat par principe.** Presque tous les composants ont leur ombre neutralisée (`--*-shadow-opacity: 0` dans `pawly-overrides.css`).

- **Cards, buttons, variant-pills, media, popups, text-boxes** → **aucune ombre**.
- **Menu drawer mobile** → seule exception : `box-shadow: 0 0 40px rgba(61, 46, 30, 0.08)` — une profondeur très subtile pour détacher le drawer de la page.
- **Bordures subtiles** → `rgba(61, 46, 30, 0.06 à 0.08)` pour séparer des blocs sans créer d'ombre.

Si un composant a l'air « plat et un peu nu », c'est voulu. La hiérarchie vient du contraste de couleur (cream / biscuit / brown) et de la typo, pas des ombres.

## Shapes

**Carré éditorial par défaut**, arrondi minimal sur les éléments interactifs :

- `rounded.none` (0px) → cards produit, cards collection, cards blog, media, inputs, popups, text-boxes. La norme.
- `rounded.sm` (2px) → boutons, variant pills, badges. Un chouia d'arrondi pour indiquer l'interactivité, sans basculer dans le pill-shaped.
- `rounded.pill` (999px) → **uniquement** pour le badge numérique du compteur panier (`.pawly-header__cart-count`).

**Jamais de radius intermédiaire** (4, 6, 8px). Le thème est strict : 0, 2, ou rond complet.

## Components

Les composants listés dans le frontmatter YAML renvoient aux classes CSS réelles du thème. Source de vérité pour le styling fin : **`assets/pawly-overrides.css`** (chargé après `base.css` dans `theme.liquid`, priorité cascade).

Classes Pawly custom :

- `.pawly-header`, `.pawly-header__link`, `.pawly-header__cart-count` — header logo centré + nav split
- `.pawly-card`, `.pawly-card__overline`, `.pawly-card__title`, `.pawly-card__tagline`, `.pawly-card__badge` — cards produit éditoriales
- `.pawly-footer__reassurance` — bloc trust SVG au-dessus du footer
- `.pawly-overline`, `.pawly-caption`, `.pawly-tagline` — typos utilitaires
- `.menu-drawer__*` (overrides Dawn) — drawer mobile reskiné

**Les couleurs s'expriment via les color schemes Shopify**, pas directement via les classes. Le thème assigne un scheme (1-5) à chaque section, et le scheme fournit `--color-background`, `--color-foreground`, `--color-button`, etc. Les variables Pawly (`--pawly-color-*`) viennent en complément pour les hovers et accents.

## Do's and Don'ts

**Do**
- Utiliser les 8 couleurs de la palette, pas d'approximations.
- Quicksand pour headings et labels uppercase (tracking 0.1 à 0.18em), Nunito pour le body.
- Respecter le rythme cream ↔ biscuit pour alterner les sections sans monotonie.
- Boutons primaires terracotta **avec hover qui s'assombrit** (→ brown), pas d'inversion brutale.
- Laisser les composants flat ; créer la profondeur par la typo et le contraste de couleur.
- Ton warm, honnête, chaleureux — qui parle à l'animal et au humain ensemble.
- Badges produit `.pawly-card__badge` positionnés en `top-left` (pas top-right), fond cream, texte brown.

**Don't**
- Pas de bleu, vert, rouge pur, gris neutre — **tout doit venir de la palette**.
- Pas de dégradés, pas d'ombres portées dramatiques, pas de glassmorphism, pas de glow.
- Pas de boutons pill-shaped (border-radius > 2px interdit sur les CTA).
- Pas de pur blanc en fond (cream `#FAF7F2` est le fond de la marque).
- Pas de typo concurrente (Inter, Helvetica, Georgia, etc.) — Quicksand + Nunito suffisent.
- Pas de ton culpabilisant (« ton chat est triste sans toi »), **pas de ton tiède** non plus. Warm et direct.
- Camel `#C4956A` **jamais** sur fond cream ou biscuit — réservé aux fonds sombres.
