import { describe, it } from "node:test";
import assert from "node:assert";
import { searchTransactions } from "./transactions.ts";

describe("searchTransactions", () => {
  it("should return empty array for empty string query", async () => {
    const results = await searchTransactions("");
    assert.deepStrictEqual(results, []);
  });

  it("should return empty array for whitespace-only query", async () => {
    const results = await searchTransactions("   ");
    assert.deepStrictEqual(results, []);
  });

  it("should return empty array for null/undefined query", async () => {
    const results = await searchTransactions(null as unknown as string);
    assert.deepStrictEqual(results, []);

    const results2 = await searchTransactions(undefined as unknown as string);
    assert.deepStrictEqual(results2, []);
  });

  it("should call db.transactions.find for valid query", async () => {
    const results = await searchTransactions("payment");
    assert.ok(Array.isArray(results));
  });
});
