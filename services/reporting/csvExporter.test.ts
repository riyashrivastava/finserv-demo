import { formatAmount, exportToCSV } from "./csvExporter";

describe("formatAmount", () => {
  it("should format small amounts with two decimal places", () => {
    expect(formatAmount(100)).toBe("100.00");
  });

  it("should format amounts just below $1M boundary", () => {
    expect(formatAmount(999999.99)).toBe("999999.99");
  });

  it("should format exactly $1,000,000 without scientific notation", () => {
    expect(formatAmount(1000000)).toBe("1000000.00");
  });

  it("should format $1,500,000 without scientific notation", () => {
    expect(formatAmount(1500000)).toBe("1500000.00");
  });

  it("should format $10,000,000 without scientific notation", () => {
    expect(formatAmount(10000000)).toBe("10000000.00");
  });

  it("should format $100,000,000 without scientific notation", () => {
    expect(formatAmount(100000000)).toBe("100000000.00");
  });

  it("should format zero correctly", () => {
    expect(formatAmount(0)).toBe("0.00");
  });

  it("should format fractional cents by rounding to two decimals", () => {
    expect(formatAmount(1234.5678)).toBe("1234.57");
  });

  it("should not include thousand-separator commas", () => {
    const result = formatAmount(1500000);
    expect(result).not.toContain(",");
  });
});

describe("exportToCSV", () => {
  it("should produce correct CSV header and rows", () => {
    const transactions = [
      { id: "tx-001", amount: 1500000 },
      { id: "tx-002", amount: 999999.99 },
      { id: "tx-003", amount: 10000000 },
    ];
    const csv = exportToCSV(transactions);
    const lines = csv.split("\n");

    expect(lines[0]).toBe("id,amount");
    expect(lines[1]).toBe("tx-001,1500000.00");
    expect(lines[2]).toBe("tx-002,999999.99");
    expect(lines[3]).toBe("tx-003,10000000.00");
  });

  it("should not include scientific notation in any row", () => {
    const transactions = [
      { id: "tx-big", amount: 1e8 },
    ];
    const csv = exportToCSV(transactions);
    expect(csv).not.toMatch(/\de[+\-]\d/);
    expect(csv).toContain("100000000.00");
  });

  it("should handle empty transaction list", () => {
    const csv = exportToCSV([]);
    expect(csv).toBe("id,amount");
  });
});
