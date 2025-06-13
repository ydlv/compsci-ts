import { describe, expect, test } from "bun:test";
import { subsetSumPositiveIntegers } from "../../../src/algorithms/dynamic-programming/subset-sum";

describe("subsetSumPositiveIntegers", () => {
	test("subsetSum: positive case — solution exists", () => {
		const result = subsetSumPositiveIntegers({ elements: [3, 34, 4, 12, 5, 2], sum: 9 });
		expect(result).toBeDefined();

		const values = result!.map(i => [3, 34, 4, 12, 5, 2][i]);
		const total = values.reduce((a, b) => a + b, 0);
		expect(total).toBe(9);
	});

	test("subsetSum: negative case — no solution", () => {
		const result = subsetSumPositiveIntegers({ elements: [3, 34, 4, 12, 5, 2], sum: 30 });
		expect(result).toBeUndefined();
	});

	test("subsetSum: trivial case — empty set", () => {
		const result = subsetSumPositiveIntegers({ elements: [], sum: 0 });
		expect(result).toEqual([]);
	});

	test("subsetSum: trivial case — singleton equals sum", () => {
		const result = subsetSumPositiveIntegers({ elements: [7], sum: 7 });
		expect(result).toEqual([0]);
	});

	test("subsetSum: trivial case — singleton not equal to sum", () => {
		const result = subsetSumPositiveIntegers({ elements: [8], sum: 7 });
		expect(result).toBeUndefined();
	});

	test("subsetSum: trivial case — sum is zero", () => {
		const result = subsetSumPositiveIntegers({ elements: [1, 2, 3], sum: 0 });
		expect(result).toEqual([]);
	});
});
