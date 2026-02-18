> **Svensk version:** [README.md](README.md)

# Svensk

Open source TypeScript libraries for Swedish integrations.

Each package is published separately under the `@svensk/` scope on npm — install only what you need.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| [`@svensk/helgdagar`](packages/helgdagar/) | Swedish public holidays — official holidays, business day checks | Implemented |
| `@svensk/swish` | Swish payment API client | Planned |
| `@svensk/bankid` | BankID (authentication + signing) | Planned |
| `@svensk/bankgiro` | BankGiro/BG-MAX (parse, create payment files) | Planned |
| `@svensk/sms` | SMS via 46elks / Twilio | Planned |
| `@svensk/sie` | SIE4 accounting format (read + write) | Planned |

## Existing packages for common needs

The following areas are already well covered by established npm packages:

### Personal identity numbers (personnummer)

- [`personnummer`](https://www.npmjs.com/package/personnummer) — ~20k downloads/week. Validation, parsing, formatting, gender, age. Multi-language project with implementations in Go, PHP, Java and more.
### Organization numbers (organisationsnummer)

- [`organisationsnummer`](https://www.npmjs.com/package/organisationsnummer) — ~3k downloads/week. Validation and formatting. Same organization as `personnummer`.


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
