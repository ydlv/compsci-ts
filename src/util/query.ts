import { DeepMap } from "deep-equality-data-structures";
import { forEach, isFunction, orderBy } from "lodash";
import { IllegalOperationError } from "../errors/illegal-operation.error";
import { NoSuchElementError } from "../errors/no-such-element.error";
import { Predicate, UnaryOperator } from "../types/functional.types";
import { EqualityType, set } from "./equality-type";
import { list } from "./iterables";
import { tap } from "./tap";

export class Query<T> implements Iterable<T> {
	private source: Iterable<T>;

	private constructor(source: Iterable<T>);
	private constructor(source: () => Iterable<T>);
	private constructor(source: Iterable<T> | (() => Iterable<T>)) {
		this.source = isFunction(source) ? source() : source;
	}

	toIterable(): Iterable<T> {
		return {
			[Symbol.iterator]: () => this.source[Symbol.iterator]()
		};
	}

	toArray(): T[] {
		return list(this.toIterable());
	}

	toSet(equalityType: EqualityType = "structural") {
		return tap(set(equalityType), s => forEach(this.toIterable(), x => s.add(x)));
	}

	toMap<V>(value: UnaryOperator<T, V>): DeepMap<T, V> {
		const map: DeepMap<T, V> = new DeepMap();
		for (const k of this) {
			map.set(k, value(k));
		}
		return map;
	}

	[Symbol.iterator]() {
		return this.source[Symbol.iterator]();
	}

	where(predicate: Predicate<T>) {
		const self = this;
		function* gen() {
			for (const x of self) {
				if (predicate(x)) {
					yield x;
				}
			}
		}
		return new Query(gen);
	}

	select<R>(map: UnaryOperator<T, R>) {
		const self = this;
		function* gen() {
			for (const x of self) {
				yield map(x);
			}
		}
		return new Query(gen);
	}

	tap(callback: (x: T) => void) {
		return this.select(x => tap(x, callback));
	}

	forEach(callback: (x: T) => any) {
		for (const x of this) {
			callback(x);
		}
	}

	take(n: number) {
		const self = this;
		return query(function*() {
			let count = 0;
			for (const x of self) {
				if (count >= n) {
					break;
				}
				yield x;
				count++;
			}
		});
	}

	takeWhile(predicate: Predicate<T>) {
		const self = this;
		return query(function*() {
			for (const x of self) {
				if (!predicate(x)) {
					break;
				}
				yield x;
			}
		});
	}

	skip(n: number) {
		const self = this;
		return query(function*() {
			let count = 0;
			for (const x of self) {
				if (count < n) {
					continue;
				}
				yield x;
				count++;
			}
		});
	}

	skipWhile(predicate: Predicate<T>) {
		const self = this;
		return query(function*() {
			let foundFirstContradiction = false;
			for (const x of self) {
				foundFirstContradiction = foundFirstContradiction || !predicate(x);
				if (foundFirstContradiction) {
					yield x;
				}
			}
		});
	}

	count(predicate: Predicate<T>): number;
	count(): number;
	count(predicate?: Predicate<T>): number {
		let ret = 0;
		for (const x of this) {
			if (!predicate || predicate(x)) {
				ret++;
			}
		}
		return ret;
	}

	first<TFallback = T>(props: { fallbackValue: TFallback }): T | TFallback;
	first<TFallback = T>(props: { fallbackFactory: () => TFallback }): T | TFallback;
	first(props: { ifNoneThrow: () => Error }): T;
	first(): T;
	first<TFallback = T>(props?: {
		fallbackValue?: TFallback;
		fallbackFactory?: () => TFallback;
		ifNoneThrow?: () => Error;
	}) {
		for (const x of this) {
			return x;
		}

		if (props === undefined) {
			throw new NoSuchElementError("Query was empty");
		}

		if (props.ifNoneThrow) {
			throw props.ifNoneThrow();
		}

		return props.fallbackFactory ? props.fallbackFactory() : props.fallbackValue;
	}

	single<TFallback = T>(props: { fallbackValue: TFallback }): T | TFallback;
	single<TFallback = T>(props: { fallbackFactory: () => TFallback }): T | TFallback;
	single(props: { ifNoneThrow: () => Error }): T;
	single(): T;
	single<TFallback = T>(props?: {
		fallbackValue?: TFallback;
		fallbackFactory?: () => TFallback;
		ifNoneThrow?: () => Error;
	}) {
		let found = false;
		let value: T | undefined = undefined;
		for (const x of this) {
			if (found) {
				throw new IllegalOperationError(
					"single was called on a Query that has two or more elements: " + [x, value]
				);
			} else {
				found = true;
				value = x;
			}
		}

		if (found) {
			return value;
		}

		if (props === undefined) {
			throw new NoSuchElementError("Query was empty");
		}

		if (props.ifNoneThrow) {
			throw props.ifNoneThrow();
		}

		return props.fallbackFactory ? props.fallbackFactory() : props.fallbackValue;
	}

	sortBy<K = T>(key: UnaryOperator<T, K>, order: "ascending" | "descending" = "ascending") {
		return query(() => {
			const arr = orderBy(this.toArray(), key, [order === "ascending" ? "asc" : "desc"]);
			return query(arr);
		});
	}

	sort(order: "ascending" | "descending" = "ascending") {
		return this.sortBy(x => x, order);
	}

	any(): boolean;
	any(predicate: Predicate<T>): boolean;
	any(predicate?: Predicate<T>): boolean {
		for (const x of this) {
			if (!predicate || predicate(x)) {
				return true;
			}
		}
		return false;
	}

	all(predicate: Predicate<T>): boolean {
		for (const x of this) {
			if (!predicate(x)) {
				return false;
			}
		}
		return true;
	}
}

export function query<T>(source: Iterable<T> | (() => Iterable<T>)): Query<T> {
	// @ts-ignore
	return new Query(source);
}
