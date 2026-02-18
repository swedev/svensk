> **English version:** [README.en.md](README.en.md)

# Svensk

Open source TypeScript-bibliotek med svenska integrationer.

Varje paket publiceras separat under `@svensk/`-scope:t på npm — installera bara det du behöver.

## Paket

| Paket | Beskrivning | Status |
|-------|-------------|--------|
| `@svensk/swish` | Swish API-klient | Planerad |
| `@svensk/bankid` | BankID (autentisering + signering) | Planerad |
| `@svensk/bankgiro` | BankGiro/BG-MAX (parse, skapa betalfiler) | Planerad |
| `@svensk/sms` | SMS via 46elks / Twilio | Planerad |
| `@svensk/sie` | SIE4 (läsa + skriva) | Planerad |

## Existerande paket för vanliga behov

Följande områden täcks redan väl av befintliga npm-paket:

### Personnummer

- [`personnummer`](https://www.npmjs.com/package/personnummer) — ~20k nedladdningar/vecka. Validering, parsning, formatering, kön, ålder. Multi-language-projekt med implementationer i Go, PHP, Java m.fl.
### Organisationsnummer

- [`organisationsnummer`](https://www.npmjs.com/package/organisationsnummer) — ~3k nedladdningar/vecka. Validering och formatering. Samma organisation som `personnummer`.

### Helgdagar

- [`swedish-holidays`](https://www.npmjs.com/package/swedish-holidays) — ~2k nedladdningar/vecka. Röda dagar, helgdagsaftnar, engelska/svenska namn.
- [`date-holidays`](https://www.npmjs.com/package/date-holidays) — ~350k nedladdningar/vecka. Generellt helgdagsbibliotek med stöd för Sverige (och 200+ andra länder).

## Designprinciper

- **Noll runtime-beroenden** — rena TypeScript-implementationer
- **Säkert by default** — inga hårdkodade hemligheter i exempel
- **Varje paket oberoende** — installera bara det du behöver
- **Strikt TypeScript** — fullständiga typdeklarationer

## Utveckling

```bash
git clone https://github.com/swedev/svensk.git
cd svensk
npm install
npm test
npm run build
```

## Licens

MIT
