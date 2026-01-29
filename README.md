| Title     | Eksamensprojekt: CMS Forløb                                    |
| --------- | -------------------------------------------------------------- |
| Kunde     | Nordic Bites                                                   |
| Koncept   | En nordisk madblog med fokus på sæsonens råvarer og enkelthed. |
| Målgruppe | Hjemmekokke der søger inspiration til nordisk mad.             |

# Projektbeskrivelse

> [!NOTE]
> Strapi-typer (`strapi/types/generated/`) er ignoreret i git, da de genereres automatisk.
> For at undgå TypeScript-fejl og sikre opdaterede typer skal Strapi køres lokalt første gang:
> `cd strapi && bun develop`

Dette projekt løser "Mulighed 1" i CMS-opgaven. Sitet er bygget som en Headless løsning til kunden **Nordic Bites**. Sitet er en SSR side bygget i Laravel, som får sin data fra Strapi, der fungerer som Headless CMS.
