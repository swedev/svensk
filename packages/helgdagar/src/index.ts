export type HolidayType = "rod_dag" | "afton";

export interface Holiday {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Swedish name */
  name: string;
  /** "rod_dag" = official public holiday, "afton" = de facto half-day */
  type: HolidayType;
}

/**
 * Calculate Easter Sunday for a given year using the Anonymous Gregorian algorithm.
 * Valid for years 1583+.
 */
export function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

function dateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Find the Saturday between two dates (inclusive).
 * Used for midsommar and alla helgons dag.
 */
function saturdayBetween(startMonth: number, startDay: number, endMonth: number, endDay: number, year: number): Date {
  const start = new Date(year, startMonth - 1, startDay);
  const end = new Date(year, endMonth - 1, endDay);
  const d = new Date(start);
  while (d <= end) {
    if (d.getDay() === 6) return d; // Saturday
    d.setDate(d.getDate() + 1);
  }
  return start; // fallback, shouldn't happen
}

/**
 * Get all Swedish holidays for a given year.
 *
 * Includes:
 * - 13 official public holidays (röda dagar)
 * - 3 de facto half-days (helgdagsaftnar: julafton, midsommarafton, nyårsafton)
 */
export function year(yr: number): Holiday[] {
  const easterDate = easter(yr);
  const midsommardag = saturdayBetween(6, 20, 6, 26, yr);
  const allaHelgonsDag = saturdayBetween(10, 31, 11, 6, yr);

  const holidays: Holiday[] = [
    // Fixed röda dagar
    { date: `${yr}-01-01`, name: "Nyårsdagen", type: "rod_dag" },
    { date: `${yr}-01-06`, name: "Trettondedag jul", type: "rod_dag" },
    { date: `${yr}-05-01`, name: "Första maj", type: "rod_dag" },
    { date: `${yr}-06-06`, name: "Sveriges nationaldag", type: "rod_dag" },
    { date: `${yr}-12-25`, name: "Juldagen", type: "rod_dag" },
    { date: `${yr}-12-26`, name: "Annandag jul", type: "rod_dag" },

    // Easter-dependent röda dagar
    { date: dateStr(addDays(easterDate, -2)), name: "Långfredagen", type: "rod_dag" },
    { date: dateStr(easterDate), name: "Påskdagen", type: "rod_dag" },
    { date: dateStr(addDays(easterDate, 1)), name: "Annandag påsk", type: "rod_dag" },
    { date: dateStr(addDays(easterDate, 39)), name: "Kristi himmelsfärdsdag", type: "rod_dag" },
    { date: dateStr(addDays(easterDate, 49)), name: "Pingstdagen", type: "rod_dag" },

    // Moveable röda dagar
    { date: dateStr(midsommardag), name: "Midsommardagen", type: "rod_dag" },
    { date: dateStr(allaHelgonsDag), name: "Alla helgons dag", type: "rod_dag" },

    // Helgdagsaftnar (de facto days off)
    { date: dateStr(addDays(midsommardag, -1)), name: "Midsommarafton", type: "afton" },
    { date: `${yr}-12-24`, name: "Julafton", type: "afton" },
    { date: `${yr}-12-31`, name: "Nyårsafton", type: "afton" },
  ];

  holidays.sort((a, b) => a.date.localeCompare(b.date));
  return holidays;
}

/**
 * Check if a date is a Swedish holiday.
 * Returns the holiday info or null.
 */
export function isHoliday(date: Date): Holiday | null {
  const ds = dateStr(date);
  const holidays = year(date.getFullYear());
  return holidays.find((h) => h.date === ds) ?? null;
}

/**
 * Check if a date is a Swedish business day.
 * A business day is not a weekend (Saturday/Sunday), not a röd dag, and not a helgdagsafton.
 */
export function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  if (day === 0 || day === 6) return false; // weekend
  return isHoliday(date) === null;
}
