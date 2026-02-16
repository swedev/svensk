export type OrgType =
  | "Dödsbokoncern"
  | "Stat/kommun/landsting"
  | "Utländskt företag"
  | "Aktiebolag"
  | "Enskild firma"
  | "Ekonomisk förening"
  | "Ideell förening/stiftelse"
  | "Handelsbolag/kommanditbolag"
  | "Okänd";

export interface OrgnumData {
  /** Normalized 10-digit number without dash */
  number: string;
  /** Organization type based on first digit */
  type: OrgType;
  /** The group digit (first digit) */
  groupDigit: number;
  /** Luhn check digit (last digit) */
  checkDigit: number;
}

const ORG_TYPES: Record<number, OrgType> = {
  1: "Dödsbokoncern",
  2: "Stat/kommun/landsting",
  3: "Utländskt företag",
  5: "Aktiebolag",
  6: "Enskild firma",
  7: "Ekonomisk förening",
  8: "Ideell förening/stiftelse",
  9: "Handelsbolag/kommanditbolag",
};

function luhn(digits: string): boolean {
  let sum = 0;
  const len = digits.length;
  for (let i = 0; i < len; i++) {
    let d = Number(digits[len - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function extractDigits(input: string): string | null {
  const cleaned = input.replace(/[\s-]/g, "");
  if (!/^\d+$/.test(cleaned)) return null;

  // Accept 10 or 12 digits
  if (cleaned.length === 10) return cleaned;
  if (cleaned.length === 12) return cleaned.slice(2); // strip century prefix (16)
  return null;
}

/**
 * Validate a Swedish organisationsnummer.
 *
 * Accepts formats: XXXXXXXXXX, XXXXXX-XXXX, 16XXXXXXXXXX, 16XXXXXX-XXXX
 */
export function valid(input: string): boolean {
  const digits = extractDigits(input);
  if (!digits) return false;

  // Third digit must be >= 2 (distinguishes from personnummer)
  const thirdDigit = Number(digits[2]);
  if (thirdDigit < 2) return false;

  return luhn(digits);
}

/**
 * Parse a Swedish organisationsnummer into its components.
 * Throws if the input is not valid.
 */
export function parse(input: string): OrgnumData {
  if (!valid(input)) {
    throw new Error(`Invalid organisationsnummer: ${input}`);
  }

  const digits = extractDigits(input)!;
  const groupDigit = Number(digits[0]);

  return {
    number: digits,
    type: ORG_TYPES[groupDigit] ?? "Okänd",
    groupDigit,
    checkDigit: Number(digits[9]),
  };
}

/**
 * Format an organisationsnummer as XXXXXX-XXXX.
 */
export function format(input: string): string {
  const { number } = parse(input);
  return `${number.slice(0, 6)}-${number.slice(6)}`;
}
