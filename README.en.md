> **Svensk version:** [README.md](README.md)

# Svensk

Open source TypeScript libraries for Swedish integrations.

Each package is published separately under the `@svensk/` scope on npm — install only what you need.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| [`@svensk/pernum`](packages/pernum/) | Swedish personal identity numbers — validation, parsing, formatting | Implemented |
| [`@svensk/orgnum`](packages/orgnum/) | Swedish organization numbers — validation, parsing, org type | Implemented |
| [`@svensk/helgdagar`](packages/helgdagar/) | Swedish public holidays — official holidays, business day checks | Implemented |
| `@svensk/swish` | Swish payment API client | Planned |
| `@svensk/bankid` | BankID (authentication + signing) | Planned |
| `@svensk/bankgiro` | BankGiro/BG-MAX (parse, create payment files) | Planned |
| `@svensk/sms` | SMS via 46elks / Twilio | Planned |
| `@svensk/sie` | SIE4 accounting format (read + write) | Planned |

## Quick start

```bash
npm install @svensk/pernum
```

```ts
import { valid, parse } from "@svensk/pernum";

valid("199001011234");  // true
parse("900101-1234");   // { year: 1990, month: 1, day: 1, gender: "male", ... }
```

## Design principles

- **Zero runtime dependencies** — pure TypeScript implementations
- **Secure by default** — no hardcoded secrets in examples
- **Each package independent** — install only what you need
- **Strict TypeScript** — full type declarations

## Development

```bash
git clone https://github.com/swedev/svensk.git
cd svensk
npm install
npm test
npm run build
```

## License

MIT
