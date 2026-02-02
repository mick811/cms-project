| title     | eksamensprojekt: cms forløb                            |
| --------- | ------------------------------------------------------ |
| kunde     | vinyl shop                                             |
| koncept   | en moderne vinyl shop med fuld webshop funktionalitet. |
| målgruppe | samlere og fans af vinyl og cd'er.                     |

> [!warning]
> dette er et eksamensprojekt. koden er til undervisningsformål og er ikke optimeret til produktionsbrug.

# projektbeskrivelse

> [!note]
> strapi-typer (`strapi/types/generated/`) er ignoreret i git, da de genereres automatisk.
> for at undgå typescript-fejl og sikre opdaterede typer skal strapi køres lokalt første gang:
> `cd strapi && bun develop`

dette projekt løser "mulighed 1" i cms-opgaven. sitet er bygget som en headless løsning til en fiktiv vinyl shop. sitet er en ssr side bygget i laravel, som får sin data fra strapi, der fungerer som headless cms.

## spec liste

### fase 1: setup & cms

- [x] projektstruktur og dokumentation
- [x] readme.md med oversigt, features, tech stack
- [x] .env med strapi url og token
- [x] hero indholdstype i strapi (billede/video)
- [x] product indholdstype i strapi (title, artist, genre, year, price, image, sleeve condition, media condition)
- [ ] about indholdstype i strapi (title, body, image)
- [ ] genres i strapi (kun til filtrering - name, slug)
- [ ] eksempeldata i strapi (10+ produkter, hero, about)
- [ ] strapiservice med hero, products, about, genres

### fase 2: components

- [x] layout component
- [ ] header component med logo, nav, search, cart icon
- [ ] footer component
- [x] button component
- [x] card component til produkter
- [x] input, textarea, label components
- [ ] product card (billede, titel, artist, pris, condition)
- [ ] filter sidebar (genre, år, pris range)
- [ ] cart drawer component
- [ ] quantity selector

### fase 3: pages

- [x] home page med hero og featured products
- [ ] products page med grid og filtre
- [ ] product detail page (billede, info, add to cart)
- [ ] cart page
- [ ] checkout page (ui only, ingen payment)
- [ ] order confirmation page
- [ ] about page
- [ ] contact page
- [ ] login/register pages
- [ ] profile page med order history

### fase 4: polish

- [x] loading states (skeleton)
- [ ] error states og fallback ui
- [ ] mobile responsive
- [ ] empty cart state
- [ ] search funktion

### fase 5: testing & quality

- [ ] feature test: products page loading
- [ ] feature test: cart functionality
- [ ] feature test: contact form validation
- [ ] eslint fix
- [ ] pint fix
- [ ] kør tests
- [ ] build production assets

### fase 6: documentation

- [ ] screenshots
- [ ] dokumentation

## tech stack

- laravel 12 (php 8.2+)
- inertia v2 med ssr
- react 19
- tailwind css v4
- vite
- strapi som headless cms
- bun som package manager
- laravel fortify til authentication
- shadcn/ui components

## setup

```bash
# installer dependencies
composer install
npm install

# kopier .env og generer key
cp .env.example .env
php artisan key:generate

# kør strapi (i separate terminal)
cd strapi && bun develop

# kør dev server
composer run dev
```

## tests

```bash
# kør alle tests
php artisan test

# kør kun feature tests med filter
php artisan test --compact tests/feature/dashboardtest.php
```

## licens

mit
