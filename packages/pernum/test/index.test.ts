import { describe, it, expect } from "vitest";
import { valid, parse, format } from "../src/index.js";

describe("valid", () => {
  it("accepts valid 12-digit personnummer", () => {
    expect(valid("199001011234")).toBe(false); // bad checksum
    expect(valid("8507099805")).toBe(true);
  });

  it("accepts valid 10-digit with dash", () => {
    expect(valid("850709-9805")).toBe(true);
  });

  it("rejects invalid checksum", () => {
    expect(valid("850709-9800")).toBe(false);
  });

  it("rejects invalid date", () => {
    expect(valid("199013011234")).toBe(false);
    expect(valid("199002301234")).toBe(false);
  });

  it("accepts coordination numbers by default", () => {
    // Day 04 + 60 = 64
    expect(valid("041164-3844")).toBe(true);
  });

  it("rejects coordination numbers when disabled", () => {
    expect(
      valid("041164-3844", { allowCoordinationNumber: false })
    ).toBe(false);
  });

  it("rejects empty and garbage input", () => {
    expect(valid("")).toBe(false);
    expect(valid("abc")).toBe(false);
    expect(valid("123")).toBe(false);
  });

  // Well-known test numbers
  it("validates well-known test personnummer", () => {
    expect(valid("811228-9874")).toBe(true);
    expect(valid("670919-9530")).toBe(true);
  });
});

describe("parse", () => {
  it("parses a valid personnummer", () => {
    const data = parse("850709-9805");
    expect(data.year).toBe(1985);
    expect(data.month).toBe(7);
    expect(data.day).toBe(9);
    expect(data.gender).toBe("female");
    expect(data.coordinationNumber).toBe(false);
  });

  it("detects male gender", () => {
    const data = parse("811228-9874");
    expect(data.gender).toBe("male");
  });

  it("parses coordination number", () => {
    const data = parse("041164-3844");
    expect(data.day).toBe(4);
    expect(data.month).toBe(11);
    expect(data.coordinationNumber).toBe(true);
  });

  it("throws on invalid input", () => {
    expect(() => parse("invalid")).toThrow("Invalid personnummer");
  });
});

describe("format", () => {
  it("formats as short (default)", () => {
    const result = format("198507099805");
    expect(result).toBe("850709-9805");
  });

  it("formats as long", () => {
    const result = format("850709-9805", "long");
    expect(result).toBe("198507099805");
  });

  it("preserves coordination number in formatting", () => {
    const result = format("041164-3844", "long");
    expect(result).toBe("200411643844");
  });
});
