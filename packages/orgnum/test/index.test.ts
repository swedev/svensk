import { describe, it, expect } from "vitest";
import { valid, parse, format } from "../src/index.js";

describe("valid", () => {
  it("accepts valid organisationsnummer", () => {
    // Bolagsverket
    expect(valid("202100-5489")).toBe(true);
    // IKEA (AB)
    expect(valid("556074-7569")).toBe(true);
  });

  it("accepts 10-digit without dash", () => {
    expect(valid("2021005489")).toBe(true);
  });

  it("accepts 12-digit with 16-prefix", () => {
    expect(valid("162021005489")).toBe(true);
  });

  it("rejects invalid checksum", () => {
    expect(valid("556074-7560")).toBe(false);
  });

  it("rejects personnummer-like numbers (3rd digit < 2)", () => {
    // 3rd digit is 0, looks like a personnummer
    expect(valid("850709-9805")).toBe(false);
  });

  it("rejects garbage input", () => {
    expect(valid("")).toBe(false);
    expect(valid("abc")).toBe(false);
    expect(valid("123")).toBe(false);
  });
});

describe("parse", () => {
  it("parses Aktiebolag", () => {
    const data = parse("556074-7569");
    expect(data.type).toBe("Aktiebolag");
    expect(data.groupDigit).toBe(5);
  });

  it("parses Stat/kommun", () => {
    const data = parse("202100-5489");
    expect(data.type).toBe("Stat/kommun/landsting");
    expect(data.groupDigit).toBe(2);
  });

  it("throws on invalid input", () => {
    expect(() => parse("invalid")).toThrow("Invalid organisationsnummer");
  });
});

describe("format", () => {
  it("formats with dash", () => {
    expect(format("5560747569")).toBe("556074-7569");
  });

  it("formats from 12-digit input", () => {
    expect(format("165560747569")).toBe("556074-7569");
  });
});
