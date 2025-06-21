import { describe, expect, test } from "bun:test";
import { range } from "lodash";
import {
	ArrayMatrix,
	createMatrix
} from "../../../src/data-structures/arrays/array-matrix";

function testNotImplemented() {
	throw new Error("test not implemented");
}

describe("ArrayMatrix", () => {
	test("flatten works", () => {
		const matrix: ArrayMatrix<2, 3> = createMatrix([
			[1, 2, 3],
			[4, 5, 6]
		]);
		expect(matrix.flatten()).toEqual([1, 2, 3, 4, 5, 6]);
	});

	test("rows and columns getters", () => {
		const matrix = new ArrayMatrix(4, 5);
		expect([matrix.rows, matrix.columns]).toEqual([4, 5]);
	});

	test("getDimension", () => {
		const matrix = new ArrayMatrix(4, 5);
		expect(matrix.getDimension(0)).toEqual(4);
		expect(matrix.getDimension(1)).toEqual(5);
		for (const i of [...range(-5, -1), ...range(2, 10)]) {
			const d: 0 | 1 = (i as unknown) as 0 | 1;
			expect(() => matrix.getDimension(d)).toThrow();
		}
	});

	test("equality", () => {
		expect(new ArrayMatrix(4, 5)).toEqual(new ArrayMatrix(4, 5));
	});

	test("reshape", () => {
		const A = createMatrix([
			[1, 2, 3],
			[4, 5, 6]
		]);
		const B = A.reshape(3, 2);
		const C = createMatrix<3, 2>([
			[1, 2],
			[3, 4],
			[5, 6]
		]);
		expect(B).toEqual(C);
	});

	/*
	test("set & get", testNotImplemented);
	test("fill", testNotImplemented);
	test("populate", testNotImplemented);
	test("coordinates", testNotImplemented);
	test("transpose", testNotImplemented);
	test("multiply", testNotImplemented);
	test("iAdd", testNotImplemented);
	test("iSubtract", testNotImplemented);
	test("iMultiplyElementWise", testNotImplemented);
	test("iDivideElementWise", testNotImplemented);
	test("getRow", testNotImplemented);
	test("iMultiplyElementWise", testNotImplemented);
	test("getColumn", testNotImplemented);
	test("add", testNotImplemented);
	test("subtract", testNotImplemented);
	test("multiplyElementWise", testNotImplemented);
	test("divideElementWise", testNotImplemented);
	test("iMultiplyElementWise", testNotImplemented);
	test("determinant", testNotImplemented);
	test("invert", testNotImplemented);
	test("gaussian rank", testNotImplemented);
	*/
});
