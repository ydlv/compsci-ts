import { range } from "lodash";
import { IllegalOperationError } from "../../errors/illegal-operation.error";
import { NaturalNumber } from "../../types/natural-numbers.types";
import { Coordinates, Tuple } from "../../types/tuples.types";
import { zipIterablesStrict } from "../../util/iterables";
import { tap } from "../../util/tap";
import { Matrix, MutableMatrix, RowOperation } from "./matrix.interface";
import { Tensor } from "./tensor";

export class ArrayMatrix<R extends number, C extends number>
	implements MutableMatrix<R, C> {
	readonly shape: [R, C];
	readonly size: number;
	private readonly array: number[][];
	readonly order: 2 = 2;

	constructor(public readonly rows: R, public readonly columns: C) {
		this.shape = [rows, columns];
		this.size = rows * columns;
		this.array = range(rows).map(() => Array(columns).fill(0));
	}

	populate(map: (coords: [number, number]) => number): void {
		this.imap((_, i, j) => map([i, j]));
	}

	reshape<R2 extends number = number, C2 extends number = number>(
		rows: R2,
		column: C2
	): MutableMatrix<R2, C2>;
	reshape<K extends Exclude<NaturalNumber, 2>>(
		...newShape: Coordinates<K>
	): never;
	reshape<R2 extends number = number, C2 extends number = number>(
		rows: R2,
		columns: C2
	): MutableMatrix<R2, C2> {
		if (rows * columns != this.rows * this.columns) {
			throw new Error(
				`Cannot reshape from ${this.shape} (${this.size} elements) -> ${[
					rows,
					columns
				]} (${rows * columns} elements)`
			);
		}
		let k = 0;
		const ret = new ArrayMatrix(rows, columns);
		for (const [cSrc, cDst] of zipIterablesStrict(
			this.coordinates(),
			ret.coordinates()
		)) {
			ret.set(cDst, this.get(...cSrc));
		}
		return ret;
	}

	iScale(scalar: number): ArrayMatrix<R, C> {
		for (const [i, j] of this.coordinates()) {
			this.array[i][j] *= scalar;
		}
		return this;
	}

	map(
		mapper: (value: number, row: number, column: number) => number
	): ArrayMatrix<R, C> {
		const ret = this.copy();
		ret.imap(mapper);
		return ret;
	}

	imap(
		mapper: (value: number, row: number, column: number) => number
	): ArrayMatrix<R, C> {
		for (const coords of this.coordinates()) {
			this.set(coords, mapper(this.get(...coords), ...coords));
		}
		return this;
	}

	copy(): ArrayMatrix<R, C> {
		const ret = new ArrayMatrix(this.rows, this.columns);
		for (const coords of this.coordinates()) {
			this.set(coords, this.get(...coords));
		}
		return this;
	}

	[Symbol.iterator](): Iterator<number, any, any> {
		return this.iterate()[Symbol.iterator]();
	}

	private *iterate(): Iterable<number> {
		for (const [row, column] of this.coordinates()) {
			yield this.get(row, column);
		}
	}

	getDimension(dim: 0): R;
	getDimension(dim: 1): C;
	getDimension(dim: 0 | 1): R | C;
	getDimension(dim: 0 | 1): R | C {
		if (dim != 0 && dim != 1) {
			throw new Error(`dim must be 0 | 1 but was ${dim}`);
		}
		return this.shape[dim];
	}

	set([row, column]: [number, number], element: number): void {
		this.array[row][column] = element;
	}

	fill(value: number): void {
		this.array.map(row => row.fill(value));
	}

	get(row: number, column: number): number {
		return this.array[row][column];
	}

	*coordinates(): Iterable<[number, number]> {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				yield [i, j];
			}
		}
	}

	transpose(): ArrayMatrix<C, R> {
		return new ArrayMatrix(this.columns, this.rows).map((_, i, j) =>
			this.get(j, i)
		);
	}

	scale(scalar: number): ArrayMatrix<R, C> {
		return this.copy().iScale(scalar);
	}

	multiply<K extends number>(other: Matrix<C, K>): ArrayMatrix<R, K> {
		const ret = new ArrayMatrix(this.rows, other.columns);
		ret.imap((i, k) =>
			range(this.columns)
				.map(j => this.array[i][j] * other.get(j, k))
				.reduce((x, y) => x + y, 0)
		);
		return ret;
	}

	iAdd(other: Matrix<R, C>): ArrayMatrix<R, C> {
		return this.imap((aij, i, j) => aij + other.get(i, j));
	}

	iSubtract(other: Matrix<R, C>): ArrayMatrix<R, C> {
		return this.imap((aij, i, j) => aij - other.get(i, j));
	}

	iMultiplyElementWise(other: Matrix<R, C>): ArrayMatrix<R, C> {
		return this.imap((aij, i, j) => aij * other.get(i, j));
	}

	iDivideElementWise(other: Matrix<R, C>): ArrayMatrix<R, C> {
		return this.imap((aij, i, j) => aij / other.get(i, j));
	}

	flatten(): number[] {
		return this.array.flatMap(x => x);
	}

	getRow(index: number): number[] {
		return [...this.array[index]];
	}

	getColumn(index: number): number[] {
		return range(this.rows).map(j => this.array[index][j]);
	}

	add(other: Matrix<R, C>): ArrayMatrix<R, C> {
		return this.copy().iAdd(other);
	}

	subtract(other: Matrix<R, C>): ArrayMatrix<R, C> {
		return this.copy().iSubtract(other);
	}

	multiplyElementWise(other: Matrix<R, C>): ArrayMatrix<R, C> {
		return this.copy().iMultiplyElementWise(other);
	}

	divideElementWise(other: Matrix<R, C>): ArrayMatrix<R, C> {
		return this.copy().iDivideElementWise(other);
	}

	determinant(): R extends C ? number : never {
		if ((this.rows as number) !== (this.columns as number)) {
			throw new IllegalOperationError(
				`Determinant is only valid for square matrix but was ${this.rows} x ${this.columns}`
			);
		}

		throw new Error("Method not implemented");
	}

	invert(): R extends C ? ArrayMatrix<R, C> : never {
		throw new Error("Method not implemented");
	}

	*gaussianRank(): Iterable<RowOperation> {
		throw new Error("Method not implemented");
	}

	toTensor(): Tensor<number, 2> {
		return tap(new Tensor(this.rows, this.columns), t => {
			for (const [i, j] of this.coordinates()) {
				t.set([i, j], this.array[i][j]);
			}
		});
	}

	static fromTensor(tensor: Tensor<number, 2>): Matrix {
		const [rows, columns] = tensor.shape;
		return new ArrayMatrix(rows, columns).imap((_, i, j) => tensor.get(i, j));
	}
}

export function zeroes<R extends number, C extends number>(rows: R, column: C) {
	return new ArrayMatrix(rows, column);
}

export function ones<R extends number, C extends number>(rows: R, column: C) {
	return tap(new ArrayMatrix(rows, column), m => m.fill(1));
}

export function eye<R extends number, C extends number>(rows: R, column: C) {
	return new ArrayMatrix(rows, column).imap((i, j) => (i == j ? 1 : 0));
}

export function createMatrix<R extends number, C extends number>(
	data: number[][]
): ArrayMatrix<R, C>;

export function createMatrix<R extends NaturalNumber, C extends NaturalNumber>(
	data: Tuple<Tuple<number, C>, R>
): ArrayMatrix<R, C>;

export function createMatrix<R extends number, C extends number>(
	data: number[][]
) {
	const rows = data.length;
	if (rows == 0) {
		throw new Error("can't have 0 rows");
	}
	const columnCounts = data.map(x => x.length);
	const columns = columnCounts[0];
	if (columnCounts.some(x => x != columns)) {
		throw new Error(
			`Inconsistent number of elements in rows: rows lengths are ${columnCounts}`
		);
	}
	if (columns == 0) {
		throw new Error("can't have 0 columns");
	}
	return tap(new ArrayMatrix(rows, columns), m =>
		m.populate(([i, j]) => data[i][j])
	);
}

export function createFromMap(
	rows: number,
	column: number,
	mapper: (row: number, column: number) => number
) {
	return tap(new ArrayMatrix(rows, column), m =>
		m.populate(([i, j]) => mapper(i, j))
	);
}
