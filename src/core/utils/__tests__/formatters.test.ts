import { parseSalary, formatPostedDate } from "../formatters";

describe("parseSalary", () => {
  it('debería parsear un rango estándar "$45k - $65k"', () => {
    const result = parseSalary("$45k - $65k");
    expect(result).toEqual({
      min: 45000,
      max: 65000,
      currency: "$",
    });
  });

  it("debería manejar un string vacío", () => {
    const result = parseSalary("");
    expect(result).toEqual({
      min: 0,
      max: 0,
      currency: "",
    });
  });

  it('debería parsear un valor único "$50k"', () => {
    const result = parseSalary("$50k");
    expect(result.min).toBe(50000);
    expect(result.max).toBe(50000);
    expect(result.currency).toBe("$");
  });

  it('debería manejar números con comas "$100,000 - $150,000"', () => {
    const result = parseSalary("$100,000 - $150,000");
    expect(result.min).toBe(100000);
    expect(result.max).toBe(150000);
  });

  it("debería detectar diferentes monedas (€, £, ¥)", () => {
    expect(parseSalary("€50k").currency).toBe("€");
    expect(parseSalary("£30k").currency).toBe("£");
    expect(parseSalary("¥100k").currency).toBe("¥");
  });

  it('debería ser insensible a mayúsculas "$50K"', () => {
    const result = parseSalary("$50K");
    expect(result.min).toBe(50000);
  });

  it("debería manejar null o undefined sin romper", () => {
    expect(parseSalary(null as any)).toEqual({ min: 0, max: 0, currency: "" });
    expect(parseSalary(undefined as any)).toEqual({
      min: 0,
      max: 0,
      currency: "",
    });
  });

  it("debería manejar texto sin números (ej. 'Competitive')", () => {
    const result = parseSalary("Competitive salary");
    expect(result).toEqual({ min: 0, max: 0, currency: "" });
  });
});

describe("formatPostedDate", () => {
  const mockNow = new Date("2026-06-26T12:00:00Z");

  it('debería retornar "Today" para una fecha de hoy', () => {
    const today = new Date().toISOString();
    const result = formatPostedDate(today);
    expect(result).toBe("Today");
  });

  it('debería retornar "1 day ago"', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const result = formatPostedDate(yesterday);
    expect(result).toBe("1 day ago");
  });

  it('debería retornar "X days ago" para hace 5 días', () => {
    const fiveDaysAgo = new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatPostedDate(fiveDaysAgo);
    expect(result).toBe("5 days ago");
  });

  it('debería retornar "1 month ago" para hace 30 días', () => {
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatPostedDate(thirtyDaysAgo);
    expect(result).toBe("1 month ago");
  });

  it("debería manejar un string vacío", () => {
    const result = formatPostedDate("");
    expect(result).toBe("");
  });

  it("debería manejar una fecha inválida", () => {
    const result = formatPostedDate("not-a-date");
    expect(result).toBe("");
  });
});
