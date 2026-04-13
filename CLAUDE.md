# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

One-product Shopify dropshipping store "Pawly" — interactive self-moving cat ball.
Built on Shopify Dawn theme (v15.4.1).

## Brand

- **Name**: Pawly
- **Style**: Warm/natural, Scandi cozy
- **Colors**: Background crème #FAF7F2, text brun #3D2E1E, accent #C4956A, buttons terracotta #B87333
- **Typography**: Headings Playfair Display, body Assistant
- **Tone**: Warm, honest, emotional — guilt of absence angle ("your cat is bored without you")
- **Language**: English only (UK/DE/NL/Scandinavia markets)

## Architecture

Shopify Dawn theme with custom JSON templates:

- `templates/index.json` — Homepage (hero → problem → solution → benefits → social proof → CTA)
- `templates/product.json` — Product page (gallery, collapsible tabs, trust badges)
- `templates/page.faq.json` — FAQ (9 collapsible questions)
- `templates/page.about.json` — About Pawly (brand story)
- `templates/page.policy.json` — Return & refund policy
- `config/settings_data.json` — Theme config (colors, typography, spacing, cart drawer)
- `sections/header-group.json` — Header with announcement bar
- `sections/footer-group.json` — Footer with newsletter, payment icons

## Key Decisions

- **Cart type**: Drawer (not page redirect, not notification)
- **Bundle**: Shopify Bundles app (native) — 2x for €39.99
- **Reviews**: Judge.me app + imported from AliExpress
- **Tracking**: Meta Pixel via Facebook & Instagram app, GA4 via Google & YouTube app
- **Shipping**: Transparent "6-12 business days from our fulfilment partner"
- **No country/language selectors** — single language store (EN)

## Navigation

Home → Meet the Ball (product) → FAQ → About Pawly → Contact
