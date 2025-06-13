import { range } from "lodash";
import { MutableMatrix } from "./matrix.interface";

export class ArrayMatrix<R extends number, C extends number> implements MutableMatrix<R, C> {
	readonly shape: [R, C];
	readonly size: number;
	private readonly array: number[][];
	readonly order: 2 = 2;

	constructor(public readonly rows: R, public readonly columns: C) {
		this.shape = [rows, columns];
		this.size = rows * columns;
		this.array = range(rows).map(() => Array(columns).fill(0));
	}

	map(mapper: (value: number, row: number, column: number) => number): MutableMatrix<R, C> {
		const ret: ArrayMatrix<R, C> = new ArrayMatrix(this.rows, this.columns);
		for (const coords of this.coordinates()) {
			ret.set(coords, mapper(this.get(...coords), ...coords));
		}
		return ret;
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
	getDimension(dim: 0 | 1): R | C {
		return this.shape[dim];
	}

	set([row, column]: [number, number], element: number): void {
		this.array[row][column] = element;
	}

	fill(value: number): void {
		this.array.map(row => row.fill(value));
	}

	populate(map: (coords: [number, number]) => number): void {
		for (const [row, column] of this.coordinates()) {
			this.array[row][column] = map([row, column]);
		}
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
}
