import { describe, it, expect } from "vitest";
import { easter, year, isHoliday, isBusinessDay } from "../src/index.js";

describe("easter", () => {
  it("calculates known Easter dates", () => {
    // Well-known Easter Sunday dates
    const cases: [number, string][] = [
      [2024, "2024-03-31"],
      [2025, "2025-04-20"],
      [2026, "2026-04-05"],
      [2027, "2027-03-28"],
      [2028, "2028-04-16"],
    ];
    for (const [yr, expected] of cases) {
      const d = easter(yr);
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      expect(str).toBe(expected);
    }
  });
});

describe("year", () => {
  it("returns 16 holidays (13 röda dagar + 3 aftnar)", () => {
    const holidays = year(2026);
    expect(holidays).toHaveLength(16);
  });

  it("includes all röda dagar for 2026", () => {
    const holidays = year(2026);
    const rodaDagar = holidays.filter((h) => h.type === "rod_dag");
    expect(rodaDagar).toHaveLength(13);

    const names = rodaDagar.map((h) => h.name);
    expect(names).toContain("Nyårsdagen");
    expect(names).toContain("Trettondedag jul");
    expect(names).toContain("Långfredagen");
    expect(names).toContain("Påskdagen");
    expect(names).toContain("Annandag påsk");
    expect(names).toContain("Första maj");
    expect(names).toContain("Kristi himmelsfärdsdag");
    expect(names).toContain("Pingstdagen");
    expect(names).toContain("Sveriges nationaldag");
    expect(names).toContain("Midsommardagen");
    expect(names).toContain("Alla helgons dag");
    expect(names).toContain("Juldagen");
    expect(names).toContain("Annandag jul");
  });

  it("has correct dates for 2026 Easter-dependent holidays", () => {
    const holidays = year(2026);
    const byName = (name: string) => holidays.find((h) => h.name === name);

    // Easter 2026 = April 5
    expect(byName("Långfredagen")?.date).toBe("2026-04-03");
    expect(byName("Påskdagen")?.date).toBe("2026-04-05");
    expect(byName("Annandag påsk")?.date).toBe("2026-04-06");
    expect(byName("Kristi himmelsfärdsdag")?.date).toBe("2026-05-14");
    expect(byName("Pingstdagen")?.date).toBe("2026-05-24");
  });

  it("calculates midsommar correctly for 2026", () => {
    const holidays = year(2026);
    const midsommardag = holidays.find((h) => h.name === "Midsommardagen");
    const midsommarafton = holidays.find((h) => h.name === "Midsommarafton");

    // 2026: Saturday June 20 is the first Saturday >= June 20
    expect(midsommardag?.date).toBe("2026-06-20");
    expect(midsommarafton?.date).toBe("2026-06-19");
  });

  it("calculates alla helgons dag correctly for 2026", () => {
    const holidays = year(2026);
    const allHelgon = holidays.find((h) => h.name === "Alla helgons dag");
    // 2026: Oct 31 is a Saturday
    expect(allHelgon?.date).toBe("2026-10-31");
  });

  it("returns holidays sorted by date", () => {
    const holidays = year(2026);
    for (let i = 1; i < holidays.length; i++) {
      expect(holidays[i]!.date >= holidays[i - 1]!.date).toBe(true);
    }
  });
});

describe("isHoliday", () => {
  it("identifies Christmas as a holiday", () => {
    const result = isHoliday(new Date(2026, 11, 25));
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Juldagen");
    expect(result!.type).toBe("rod_dag");
  });

  it("identifies julafton as an afton", () => {
    const result = isHoliday(new Date(2026, 11, 24));
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Julafton");
    expect(result!.type).toBe("afton");
  });

  it("returns null for a regular day", () => {
    // 2026-02-16 is a Monday, no holiday
    expect(isHoliday(new Date(2026, 1, 16))).toBeNull();
  });
});

describe("isBusinessDay", () => {
  it("returns false for Saturday", () => {
    // 2026-02-14 is Saturday
    expect(isBusinessDay(new Date(2026, 1, 14))).toBe(false);
  });

  it("returns false for Sunday", () => {
    expect(isBusinessDay(new Date(2026, 1, 15))).toBe(false);
  });

  it("returns false for röd dag", () => {
    // 2026-01-01 Thursday, Nyårsdagen
    expect(isBusinessDay(new Date(2026, 0, 1))).toBe(false);
  });

  it("returns false for helgdagsafton", () => {
    // 2026-12-24 Thursday, Julafton
    expect(isBusinessDay(new Date(2026, 11, 24))).toBe(false);
  });

  it("returns true for a normal weekday", () => {
    // 2026-02-16 Monday
    expect(isBusinessDay(new Date(2026, 1, 16))).toBe(true);
  });
});
