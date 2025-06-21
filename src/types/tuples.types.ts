import { NaturalNumber, PrevOf } from "./natural-numbers.types";

// Recursive tuple type
export type Tuple<
	T,
	N extends NaturalNumber,
	Depth extends unknown[] = []
> = Depth["length"] extends 20 // Limit instantiation depth
	? T[] // fallback to generic array
	: N extends 0
	? []
	: [T, ...Tuple<T, PrevOf<N>, [0, ...Depth]>];
export type Pair<X, Y = X> = [X, Y];

export type Coordinates<N extends NaturalNumber> = Tuple<number, N>;
