import { formatAmount, exportToCSV } from "./csvExporter";

describe("formatAmount", () => {
  it("should format zero correctly", () => {
    expect(formatAmount(0)).toBe("0.00");
  });

  it("should format small amounts correctly", () => {
    expect(formatAmount(1.5)).toBe("1.50");
    expect(formatAmount(99.99)).toBe("99.99");
  });

  it("should format amounts just below $1M correctly", () => {
    expect(formatAmount(999999.99)).toBe("999999.99");
  });

  it("should format exactly $1M correctly", () => {
    expect(formatAmount(1000000)).toBe("1000000.00");
  });

  it("should format amounts above $1M correctly without scientific notation", () => {
    expect(formatAmount(1500000)).toBe("1500000.00");
    expect(formatAmount(10000000)).toBe("10000000.00");
    expect(formatAmount(123456789.12)).toBe("123456789.12");
  });

  it("should format negative amounts correctly", () => {
    expect(formatAmount(-100)).toBe("-100.00");
    expect(formatAmount(-1500000)).toBe("-1500000.00");
  });

  it("should always produce two decimal places", () => {
    expect(formatAmount(1000)).toBe("1000.00");
    expect(formatAmount(0.1)).toBe("0.10");
    expect(formatAmount(0.123)).toBe("0.12");
  });
});

describe("exportToCSV", () => {
  it("should produce correct CSV with header", () => {
    const transactions = [
      { id: "tx1", amount: 1500000 },
      { id: "tx2", amount: 999999.99 },
      { id: "tx3", amount: 0 },
    ];
    const csv = exportToCSV(transactions);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("id,amount");
    expect(lines[1]).toBe("tx1,1500000.00");
    expect(lines[2]).toBe("tx2,999999.99");
    expect(lines[3]).toBe("tx3,0.00");
  });

  it("should handle empty transaction list", () => {
    const csv = exportToCSV([]);
    expect(csv).toBe("id,amount");
  });

  it("should not produce scientific notation for large amounts", () => {
    const transactions = [{ id: "tx1", amount: 1e7 }];
    const csv = exportToCSV(transactions);
    expect(csv).not.toContain("e+");
    expect(csv).toContain("10000000.00");
  });
});
