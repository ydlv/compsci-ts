import { NaturalNumber } from "../../types/natural-numbers.types";
import { Coordinates } from "../../types/tuples.types";
import {
	MultidimensionalArray,
	MutableMultidemsionalArray
} from "./multidim-array.interface";

export interface Matrix<R extends number = number, C extends number = number>
	extends MultidimensionalArray<number, 2> {
	get(row: number, column: number): number;
	readonly shape: [R, C];
	readonly order: 2;
	getDimension(dim: 0): R;
	getDimension(dim: 1): C;
	readonly rows: R;
	readonly columns: C;
	coordinates(): Iterable<[number, number]>;
	map(
		mapper: (value: number, row: number, column: number) => number
	): Matrix<R, C>;

	reshape<R2 extends number = number, C2 extends number = number>(
		rows: R2,
		column: C2
	): Matrix<R2, C2>;
	reshape<K extends Exclude<NaturalNumber, 2>>(
		...newShape: Coordinates<K>
	): never;

	copy(): Matrix<R, C>;

	transpose(): Matrix<C, R>; // Transpose (not in place)
	scale(scalar: number): Matrix<R, C>; // Scalar multiplication
	multiply<K extends number>(other: Matrix<C, K>): Matrix<R, K>; // Matrix multiplication (R x C) * (C x K) -> (R x K)
	flatten(): number[]; // Flatten to a 1D array
	getRow(index: number): number[]; // Get a specific row
	getColumn(index: number): number[]; // Get a specific column

	// Arithmetic methods
	add(other: Matrix<R, C>): Matrix<R, C>; // Element-wise addition
	subtract(other: Matrix<R, C>): Matrix<R, C>; // Element-wise subtraction
	multiplyElementWise(other: Matrix<R, C>): Matrix<R, C>; // Element-wise multiplication
	divideElementWise(other: Matrix<R, C>): Matrix<R, C>; // Element-wise division

	// Method for square matrices (R == C)
	determinant(): R extends C ? number : never;
	invert(): R extends C ? Matrix<R, C> : never;

	gaussianRank(): Iterable<RowOperation>;
}

export interface MutableMatrix<
	R extends number = number,
	C extends number = number
> extends Matrix<R, C>, MutableMultidemsionalArray<number, 2> {
	getDimension(dim: 0): R;
	getDimension(dim: 1): C;
	readonly shape: [R, C];

	reshape<R2 extends number = number, C2 extends number = number>(
		rows: R2,
		column: C2
	): MutableMatrix<R2, C2>;
	reshape<K extends Exclude<NaturalNumber, 2>>(
		...newShape: Coordinates<K>
	): never;

	set(coordinates: [number, number], element: number): void;
	fill(value: number): void;
	map(
		mapper: (value: number, row: number, column: number) => number
	): MutableMatrix<R, C>;

	imap(
		mapper: (value: number, row: number, column: number) => number
	): MutableMatrix<R, C>;

	copy(): MutableMatrix<R, C>;

	transpose(): MutableMatrix<C, R>; // Transpose (not in place)

	// Arithmetic methods (in-place)
	iAdd(other: Matrix<R, C>): MutableMatrix<R, C>; // In-place addition
	iSubtract(other: Matrix<R, C>): MutableMatrix<R, C>; // In-place subtraction
	iScale(scalar: number): MutableMatrix<R, C>;
	iMultiplyElementWise(other: Matrix<R, C>): MutableMatrix<R, C>; // In-place element-wise multiplication
	iDivideElementWise(other: Matrix<R, C>): MutableMatrix<R, C>; // In-place element-wise division

	// Arithmetic methods (in-place)
	add(other: Matrix<R, C>): MutableMatrix<R, C>; // In-place addition
	subtract(other: Matrix<R, C>): MutableMatrix<R, C>; // In-place subtraction
	scale(scalar: number): MutableMatrix<R, C>;
	multiplyElementWise(other: Matrix<R, C>): MutableMatrix<R, C>; // In-place element-wise multiplication
	divideElementWise(other: Matrix<R, C>): MutableMatrix<R, C>; // In-place element-wise division
}

export interface RowSwitch {
	operation: "row-switch";
	firstRow: number;
	secondRow: number;
}

export interface RowScale {
	operation: "row-scale";
	row: number;
	scalar: number;
}

export interface RowAddition {
	operation: "row-addition";
	addedRow: number;
	mutatedRow: number;
	scalar: number;
}

export type RowOperation = RowSwitch | RowScale | RowAddition;
