# vinyl shop

en moderne vinyl shop med fuld webshop funktionalitet for samlere og fans af vinyl og cd'er.

## tech stack

- **laravel 12** - php backend framework
- **react 19** - frontend bibliotek med typescript
- **inertia.js** - forbinder laravel og react uden at bygge separat api. giver spa oplevelse med server-side routing
- **strapi** - headless cms til produkt data
- **zustand** - state management til indkøbskurv
- **tailwind css** - utility-first css framework

## hvad er inertia.js?

inertia er en "glue" mellem backend og frontend. når du klikker et link, sender inertia en ajax request til laravel. laravel returnerer json med react komponent + props. inertia opdaterer dom'en uden page reload. det giver:

- spa oplevelse (hurtig navigation)
- server-side routing (sikrere)
- ingen separat api at vedligeholde
- bedre seo end traditionelle spa's

## spec liste

| opgave                                                                                                      | status |
| ----------------------------------------------------------------------------------------------------------- | :----: |
| projektstruktur og dokumentation                                                                            |   ✓    |
| readme.md med oversigt, features, tech stack                                                                |   ✓    |
| .env med strapi url og token                                                                                |   ✓    |
| hero indholdstype i strapi (billede/video)                                                                  |   ✓    |
| product indholdstype i strapi (title, artist, genre, year, price, image, sleeve condition, media condition) |   ✓    |
| genres i strapi (kun til filtrering - name, slug)                                                           |   ✓    |
| eksempeldata i strapi (10+ produkter, hero)                                                                 |        |
| strapiservice med hero, products, genres                                                                    |   ✓    |
| layout component                                                                                            |   ✓    |
| header component med logo, nav, search, cart icon                                                           |   ✓    |
| footer component                                                                                            |   ✓    |
| button component                                                                                            |   ✓    |
| card component til produkter                                                                                |   ✓    |
| input, textarea, label components                                                                           |   ✓    |
| product card (billede, titel, artist, pris, condition)                                                      |   ✓    |
| filter sidebar (genre, år, pris range)                                                                      |   ✓    |
| cart drawer component                                                                                       |   ✓    |
| quantity selector                                                                                           |   ✓    |
| home page med hero og featured products                                                                     |   ✓    |
| products page med grid og filtre                                                                            |   ✓    |
| product detail page (billede, info, add to cart)                                                            |   ✓    |
| cart page                                                                                                   |   ✓    |
| loading states (skeleton)                                                                                   |   ✓    |
| error states og fallback ui                                                                                 |   ✓    |
| mobile responsive                                                                                           |   ✓    |
| empty cart state                                                                                            |   ✓    |
| search funktion                                                                                             |   ✓    |
| feature test: products page loading                                                                         |   ✓    |
| feature test: cart functionality                                                                            |   ✓    |
| eslint fix                                                                                                  |   ✓    |
| pint fix                                                                                                    |   ✓    |
| kør tests                                                                                                   |   ✓    |
| build production assets                                                                                     |   ✓    |
| screenshots                                                                                                 |   ✓    |
| dokumentation                                                                                               |   ✓    |

## setup

```bash
# installer dependencies
composer install
bun install

# kopier .env og generer key
cp .env.example .env
php artisan key:generate

# kør strapi (i separat terminal)
cd strapi && bun develop

# kør dev server
composer run dev
```

## tests

```bash
# kør alle tests
composer run test

# kør kun specifikke tests med filter
php artisan test --compact --filter=testName
```
