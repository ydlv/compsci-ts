import { NaturalNumber, PrevOf } from './natural-numbers.types'

// Recursive tuple type
export type Tuple<T, N extends NaturalNumber> = N extends 0 ? [] : [T, ...Tuple<T, PrevOf<N>>]
export type Coordinates<N extends NaturalNumber> = Tuple<number, N>

export type Pair<X, Y = X> = [X, Y]
