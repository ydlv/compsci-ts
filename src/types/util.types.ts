export type Mutable<T> = T extends ReadonlyArray<infer P>
	? P[]
	: T extends ReadonlyMap<infer K, infer V>
	? Map<K, V>
	: T extends ReadonlySet<infer P>
	? Set<P>
	: T extends object
	? { -readonly [K in keyof T]: Mutable<T[K]> }
	: T;

export type DeepMutable<T> = T extends ReadonlyArray<infer P>
	? DeepMutable<P>[]
	: T extends ReadonlyMap<infer K, infer V>
	? Map<DeepMutable<K>, DeepMutable<V>>
	: T extends ReadonlySet<infer P>
	? Set<DeepMutable<P>>
	: T extends object
	? { -readonly [K in keyof T]: DeepMutable<T[K]> }
	: T;
