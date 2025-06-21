/**
 * Wraps in a new iterable, for security reasons.
 * Proxies to the given object and is not frozen - the iterator
 * returns will be taken from source upon request.
 * If you need a frozen copy, you need to return a ReadonlyArray<T> from clone
 */
export function iterable<T>(source: Iterable<T>): Iterable<T> {
	return {
		[Symbol.iterator]: () => source[Symbol.iterator]()
	};
}

export function list<T>(source: Iterable<T>): T[] {
	return [...source];
}

export function fromIterator<T>(source: Iterator<T>): T[] {
	const iterable: Iterable<T> = {
		[Symbol.iterator]: () => source
	};
	return list(iterable);
}

export function zipIterables<T1, T2>(
	src1: Iterable<T1>,
	src2: Iterable<T2>
): Iterable<[T1, T2]>;
export function zipIterables<T>(...sources: Iterable<T>[]): Iterable<T[]> {
	return _zipIterables(false, sources);
}

export function zipIterablesStrict<T1, T2>(
	src1: Iterable<T1>,
	src2: Iterable<T2>
): Iterable<[T1, T2]>;
export function zipIterablesStrict<T>(
	...sources: Iterable<T>[]
): Iterable<T[]> {
	return _zipIterables(true, sources);
}

function* _zipIterables<T>(
	strict: boolean,
	sources: Iterable<T>[]
): Iterable<T[]> {
	const iterators = sources.map(src => src[Symbol.iterator]());

	while (true) {
		const results = iterators.map(it => it.next());

		if (strict && results.some(res => res.done !== results[0].done)) {
			throw new Error("Iterables have different lengths in strict mode.");
		}

		if (results.some(res => res.done)) {
			break;
		}

		yield results.map(res => res.value);
	}
}
