import { Tuple } from "../types/tuples.types";

export function product<T0>(s0: Iterable<T0>): Iterable<[T0]>;
export function product<T0, T1>(
	s0: Iterable<T0>,
	s1: Iterable<T1>
): Iterable<[T0, T1]>;
export function product<T0, T1, T2>(
	s0: Iterable<T0>,
	s1: Iterable<T1>,
	s2: Iterable<T2>
): Iterable<[T0, T1, T2]>;
export function product<T0, T1, T2, T3>(
	s0: Iterable<T0>,
	s1: Iterable<T1>,
	s2: Iterable<T2>,
	s3: Iterable<T3>
): Iterable<[T0, T1, T2, T3]>;
export function product<T0, T1, T2, T3, T4>(
	s0: Iterable<T0>,
	s1: Iterable<T1>,
	s2: Iterable<T2>,
	s3: Iterable<T3>,
	s4: Iterable<T4>
): Iterable<[T0, T1, T2, T3, T4]>;
export function product<T0, T1, T2, T3, T4, T5>(
	s0: Iterable<T0>,
	s1: Iterable<T1>,
	s2: Iterable<T2>,
	s3: Iterable<T3>,
	s4: Iterable<T4>,
	s5: Iterable<T5>
): Iterable<[T0, T1, T2, T3, T4, T5]>;
export function product<T0, T1, T2, T3, T4, T5, T6>(
	s0: Iterable<T0>,
	s1: Iterable<T1>,
	s2: Iterable<T2>,
	s3: Iterable<T3>,
	s4: Iterable<T4>,
	s5: Iterable<T5>,
	s6: Iterable<T6>
): Iterable<[T0, T1, T2, T3, T4, T5, T6]>;
export function product<T0, T1, T2, T3, T4, T5, T6, T7>(
	s0: Iterable<T0>,
	s1: Iterable<T1>,
	s2: Iterable<T2>,
	s3: Iterable<T3>,
	s4: Iterable<T4>,
	s5: Iterable<T5>,
	s6: Iterable<T6>,
	s7: Iterable<T7>
): Iterable<[T0, T1, T2, T3, T4, T5, T6, T7]>;
export function product<T0, T1, T2, T3, T4, T5, T6, T7, T8>(
	s0: Iterable<T0>,
	s1: Iterable<T1>,
	s2: Iterable<T2>,
	s3: Iterable<T3>,
	s4: Iterable<T4>,
	s5: Iterable<T5>,
	s6: Iterable<T6>,
	s7: Iterable<T7>,
	s8: Iterable<T8>
): Iterable<[T0, T1, T2, T3, T4, T5, T6, T7, T8]>;
export function* product(...sources: Iterable<any>[]): Iterable<any[]> {
	if (sources.length === 1) {
		for (const t of sources[0]) {
			yield [t];
		}
	} else {
		const [first, ...restSources] = sources;
		for (const x of first) {
			// @ts-ignore
			for (const ys of product(...restSources)) {
				yield [x, ...ys];
			}
		}
	}
}

export function combinations<T>(
	source: Iterable<T>,
	n: 0
): Iterable<Tuple<T, 0>>;
export function combinations<T>(
	source: Iterable<T>,
	n: 1
): Iterable<Tuple<T, 1>>;
export function combinations<T>(
	source: Iterable<T>,
	n: 2
): Iterable<Tuple<T, 2>>;
export function combinations<T>(
	source: Iterable<T>,
	n: 3
): Iterable<Tuple<T, 3>>;
export function combinations<T>(
	source: Iterable<T>,
	n: 4
): Iterable<Tuple<T, 4>>;
export function combinations<T>(
	source: Iterable<T>,
	n: 5
): Iterable<Tuple<T, 5>>;
export function combinations<T>(
	source: Iterable<T>,
	n: 6
): Iterable<Tuple<T, 6>>;
export function combinations<T>(
	source: Iterable<T>,
	n: 7
): Iterable<Tuple<T, 7>>;
export function combinations<T>(
	source: Iterable<T>,
	n: 8
): Iterable<Tuple<T, 8>>;
export function combinations<T>(
	source: Iterable<T>,
	n: 9
): Iterable<Tuple<T, 9>>;
export function combinations<T>(source: Iterable<T>, n: number): Iterable<T[]> {
	const li = [...source];
	function* combine(start: number, curr: T[]): Generator<T[]> {
		if (curr.length === n) {
			yield [...curr];
			return;
		}
		for (let i = start; i < li.length; i++) {
			curr.push(li[i]);
			yield* combine(i + 1, curr);
			curr.pop();
		}
	}

	if (n < 0 || n > li.length) return [];

	return (function*() {
		if (n === 0) {
			yield [];
		} else {
			yield* combine(0, []);
		}
	})();
}

export function* concatIterable<T>(...sources: Iterable<T>[]): Iterable<T> {
	for (const src of sources) {
		for (const x of src) {
			yield x;
		}
	}
}

export function forEach<T>(source: Iterable<T>, callback: (x: T) => any): void {
	for (const x of source) {
		callback(x);
	}
}
