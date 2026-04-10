import { formatAmount, exportToCSV } from "./csvExporter";

describe("formatAmount", () => {
  it("should format amounts below $1M correctly", () => {
    expect(formatAmount(999999.99)).toBe("999999.99");
  });

  it("should format exactly $1M correctly", () => {
    expect(formatAmount(1000000.0)).toBe("1000000.00");
  });

  it("should format $1.5M correctly without scientific notation", () => {
    expect(formatAmount(1500000.0)).toBe("1500000.00");
  });

  it("should format large amounts near $1B correctly", () => {
    expect(formatAmount(999999999.99)).toBe("999999999.99");
  });

  it("should format zero correctly", () => {
    expect(formatAmount(0)).toBe("0.00");
  });

  it("should format small amounts correctly", () => {
    expect(formatAmount(0.01)).toBe("0.01");
  });

  it("should always produce two decimal places", () => {
    expect(formatAmount(100)).toBe("100.00");
    expect(formatAmount(1234.5)).toBe("1234.50");
  });
});

describe("exportToCSV", () => {
  it("should export transactions with correctly formatted amounts", () => {
    const transactions = [
      { id: "TXN001", amount: 999999.99 },
      { id: "TXN002", amount: 1000000.0 },
      { id: "TXN003", amount: 1500000.0 },
      { id: "TXN004", amount: 999999999.99 },
    ];

    const csv = exportToCSV(transactions);
    const lines = csv.split("\n");

    expect(lines[0]).toBe("id,amount");
    expect(lines[1]).toBe("TXN001,999999.99");
    expect(lines[2]).toBe("TXN002,1000000.00");
    expect(lines[3]).toBe("TXN003,1500000.00");
    expect(lines[4]).toBe("TXN004,999999999.99");
  });

  it("should not produce scientific notation for any amount", () => {
    const transactions = [
      { id: "TXN001", amount: 1e6 },
      { id: "TXN002", amount: 1e7 },
      { id: "TXN003", amount: 1e8 },
      { id: "TXN004", amount: 1e9 },
    ];

    const csv = exportToCSV(transactions);
    expect(csv).not.toMatch(/\de[+\-]\d/i);
  });

  it("should preserve transaction IDs unchanged", () => {
    const transactions = [
      { id: "ABC-123", amount: 5000000 },
    ];

    const csv = exportToCSV(transactions);
    const lines = csv.split("\n");
    expect(lines[1]).toBe("ABC-123,5000000.00");
  });
});
