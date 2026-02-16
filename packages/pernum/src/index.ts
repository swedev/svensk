export interface PernumData {
  /** Full year, e.g. 1990 */
  year: number;
  month: number;
  day: number;
  /** 3-digit birth number */
  birthNumber: number;
  /** Luhn check digit */
  checkDigit: number;
  /** "male" (odd birth number) or "female" (even birth number) */
  gender: "male" | "female";
  /** True if this is a coordination number (day + 60) */
  coordinationNumber: boolean;
}

export interface ValidOptions {
  /** Allow coordination numbers (samordningsnummer). Default: true */
  allowCoordinationNumber?: boolean;
}

/**
 * Luhn checksum on a string of digits.
 * Returns true if the sum mod 10 is 0.
 */
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

/**
 * Normalize input to { century, yymmdd, separator, digits }
 * or null if the format is not recognized.
 */
function normalize(input: string): {
  century: number;
  yymmdd: string;
  separator: string;
  digits: string;
} | null {
  const cleaned = input.replace(/\s/g, "");

  // 12-digit: YYYYMMDDXXXX or YYYYMMDD-XXXX
  const long = cleaned.match(
    /^(\d{2})(\d{2})(\d{2})(\d{2})([-+]?)(\d{4})$/
  );
  if (long && long[1]!.length + long[2]!.length === 4 && cleaned.length >= 12) {
    // Actually need to re-match for 12-digit
  }

  const longMatch = cleaned.match(
    /^(\d{4})(\d{2})(\d{2})([-+]?)(\d{4})$/
  );
  if (longMatch) {
    const yyyy = longMatch[1]!;
    const mm = longMatch[2]!;
    const dd = longMatch[3]!;
    const sep = longMatch[4]! || "-";
    const last4 = longMatch[5]!;
    return {
      century: Math.floor(Number(yyyy) / 100),
      yymmdd: yyyy.slice(2) + mm + dd,
      separator: sep,
      digits: last4,
    };
  }

  // 10-digit: YYMMDD-XXXX or YYMMDD+XXXX or YYMMDDXXXX
  const shortMatch = cleaned.match(
    /^(\d{2})(\d{2})(\d{2})([-+]?)(\d{4})$/
  );
  if (shortMatch) {
    const yy = shortMatch[1]!;
    const mm = shortMatch[2]!;
    const dd = shortMatch[3]!;
    const sep = shortMatch[4]! || "-";
    const last4 = shortMatch[5]!;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentCentury = Math.floor(currentYear / 100);
    const yyNum = Number(yy);

    let century: number;
    if (sep === "+") {
      // Person is 100+, so born at least 100 years ago
      const candidateYear = currentCentury * 100 + yyNum;
      if (candidateYear - 100 <= currentYear) {
        century = currentCentury - 1;
      } else {
        century = currentCentury - 2;
      }
    } else {
      // Normal dash: born within last 100 years
      const candidateYear = currentCentury * 100 + yyNum;
      if (candidateYear > currentYear) {
        century = currentCentury - 1;
      } else {
        century = currentCentury;
      }
    }

    return {
      century,
      yymmdd: yy + mm + dd,
      separator: sep,
      digits: last4,
    };
  }

  return null;
}

function isValidDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

/**
 * Validate a Swedish personnummer.
 *
 * Accepts formats: YYYYMMDDXXXX, YYYYMMDD-XXXX, YYMMDDXXXX, YYMMDD-XXXX, YYMMDD+XXXX
 */
export function valid(
  input: string,
  options: ValidOptions = {}
): boolean {
  const { allowCoordinationNumber = true } = options;

  const n = normalize(input);
  if (!n) return false;

  const { century, yymmdd, digits } = n;

  // Luhn check on the 10 digits (YYMMDDXXXX)
  if (!luhn(yymmdd + digits)) return false;

  const year = century * 100 + Number(yymmdd.slice(0, 2));
  const month = Number(yymmdd.slice(2, 4));
  let day = Number(yymmdd.slice(4, 6));

  // Coordination number: day >= 61
  const isCoordination = day > 60;
  if (isCoordination) {
    if (!allowCoordinationNumber) return false;
    day -= 60;
  }

  return isValidDate(year, month, day);
}

/**
 * Parse a Swedish personnummer into its components.
 * Throws if the input is not valid.
 */
export function parse(
  input: string,
  options: ValidOptions = {}
): PernumData {
  if (!valid(input, options)) {
    throw new Error(`Invalid personnummer: ${input}`);
  }

  const n = normalize(input)!;
  const { century, yymmdd, digits } = n;

  const year = century * 100 + Number(yymmdd.slice(0, 2));
  const month = Number(yymmdd.slice(2, 4));
  let day = Number(yymmdd.slice(4, 6));

  const isCoordination = day > 60;
  if (isCoordination) day -= 60;

  const birthNumber = Number(digits.slice(0, 3));
  const checkDigit = Number(digits.slice(3, 4));

  return {
    year,
    month,
    day,
    birthNumber,
    checkDigit,
    gender: birthNumber % 2 === 0 ? "female" : "male",
    coordinationNumber: isCoordination,
  };
}

/**
 * Format a personnummer.
 *
 * - "long": YYYYMMDDXXXX (12 digits, no separator)
 * - "short": YYMMDD-XXXX (10 digits with separator)
 */
export function format(
  input: string,
  style: "long" | "short" = "short"
): string {
  const data = parse(input);
  const mm = String(data.month).padStart(2, "0");
  const dd = String(
    data.day + (data.coordinationNumber ? 60 : 0)
  ).padStart(2, "0");
  const suffix = String(data.birthNumber).padStart(3, "0") + data.checkDigit;

  if (style === "long") {
    return `${data.year}${mm}${dd}${suffix}`;
  }

  const yy = String(data.year).slice(2);
  const now = new Date();
  const age = now.getFullYear() - data.year;
  const sep = age >= 100 ? "+" : "-";
  return `${yy}${mm}${dd}${sep}${suffix}`;
}
