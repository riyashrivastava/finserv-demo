import { formatAmount, exportToCSV } from "./csvExporter";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

function assertEqual(actual: string, expected: string, message: string) {
  if (actual === expected) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message} — expected "${expected}", got "${actual}"`);
  }
}

// --- formatAmount tests ---

console.log("\nformatAmount tests:");

assertEqual(formatAmount(0), "0.00", "zero formats correctly");
assertEqual(formatAmount(1), "1.00", "small integer formats correctly");
assertEqual(formatAmount(100.5), "100.50", "decimal value formats correctly");
assertEqual(formatAmount(999999.99), "999999.99", "just under $1M boundary");
assertEqual(formatAmount(1000000), "1000000.00", "$1M exactly");
assertEqual(formatAmount(1000000.00), "1000000.00", "$1M with .00");
assertEqual(formatAmount(1500000), "1500000.00", "$1.5M formats correctly");
assertEqual(formatAmount(10000000), "10000000.00", "$10M formats correctly");
assertEqual(formatAmount(999999999.99), "999999999.99", "near $1B");
assertEqual(formatAmount(1234567890.12), "1234567890.12", "large amount with decimals");
assertEqual(formatAmount(-1500000), "-1500000.00", "negative large amount");
assertEqual(formatAmount(-999999.99), "-999999.99", "negative just under $1M");
assertEqual(formatAmount(0.1), "0.10", "small decimal");
assertEqual(formatAmount(0.001), "0.00", "sub-cent rounds to zero cents");
assertEqual(formatAmount(1000000.005), "1000000.01", "rounding at $1M boundary");
assertEqual(formatAmount(1e7), "10000000.00", "scientific notation input $10M");
assertEqual(formatAmount(1e8), "100000000.00", "scientific notation input $100M");

// Verify no scientific notation in output
const largeResult = formatAmount(1e6);
assert(!largeResult.includes("e"), "$1M output contains no scientific notation");
assert(!largeResult.includes("E"), "$1M output contains no uppercase scientific notation");

const veryLargeResult = formatAmount(1e10);
assert(!veryLargeResult.includes("e"), "$10B output contains no scientific notation");

// --- exportToCSV tests ---

console.log("\nexportToCSV tests:");

const csv1 = exportToCSV([{ id: "TX001", amount: 1500000 }]);
assertEqual(csv1, "id,amount\nTX001,1500000.00", "single $1.5M transaction");

const csv2 = exportToCSV([
  { id: "TX001", amount: 999999.99 },
  { id: "TX002", amount: 1000000.00 },
  { id: "TX003", amount: 10000000.00 },
]);
assertEqual(
  csv2,
  "id,amount\nTX001,999999.99\nTX002,1000000.00\nTX003,10000000.00",
  "multiple transactions including boundary values"
);

const csv3 = exportToCSV([{ id: "TX001", amount: -5000000 }]);
assertEqual(csv3, "id,amount\nTX001,-5000000.00", "negative large amount in CSV");

const csv4 = exportToCSV([]);
assertEqual(csv4, "id,amount", "empty transactions produces header only");

// --- Summary ---
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
if (failed > 0) {
  process.exit(1);
}
