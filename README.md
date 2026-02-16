> **English version:** [README.en.md](README.en.md)

# Svensk

Open source TypeScript-bibliotek med svenska integrationer.

Varje paket publiceras separat under `@svensk/`-scope:t på npm — installera bara det du behöver.

## Paket

| Paket | Beskrivning | Status |
|-------|-------------|--------|
| [`@svensk/pernum`](packages/pernum/) | Personnummer — validering, parsning, formatering | Implementerad |
| [`@svensk/orgnum`](packages/orgnum/) | Organisationsnummer — validering, parsning, organisationstyp | Implementerad |
| [`@svensk/helgdagar`](packages/helgdagar/) | Svenska helgdagar — röda dagar, helgdagsaftnar, arbetsdagar | Implementerad |
| `@svensk/swish` | Swish API-klient | Planerad |
| `@svensk/bankid` | BankID (autentisering + signering) | Planerad |
| `@svensk/bankgiro` | BankGiro/BG-MAX (parse, skapa betalfiler) | Planerad |
| `@svensk/sms` | SMS via 46elks / Twilio | Planerad |
| `@svensk/sie` | SIE4 (läsa + skriva) | Planerad |

## Snabbstart

```bash
npm install @svensk/pernum
```

```ts
import { valid, parse } from "@svensk/pernum";

valid("199001011234");  // true
parse("900101-1234");   // { year: 1990, month: 1, day: 1, gender: "male", ... }
```

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
