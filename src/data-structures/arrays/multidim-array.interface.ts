import { NaturalNumber } from "../../types/natural-numbers.types";
import { Coordinates } from "../../types/tuples.types";

export interface MultidimensionalArray<T, N extends NaturalNumber> extends Iterable<T> {
	get(...coordinates: Coordinates<N>): T;
	readonly shape: Coordinates<N>;
	readonly order: N;
	getDimension(dim: number): number;
	coordinates(): Iterable<Coordinates<N>>;
}

export interface MutableMultidemsionalArray<T, N extends NaturalNumber>
	extends MultidimensionalArray<T, N> {
	set(coordinates: Coordinates<N>, element: T): void;
	fill(value: T): void;
	populate(map: (coords: Coordinates<N>) => T): void;

	/**
	 * Element count (product of shape)
	 */
	size: number;
}
