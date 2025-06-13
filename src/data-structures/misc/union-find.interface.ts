export interface UnionFind<T, TADTReference = T> {
	makeSet(x: T): TADTReference;
	union(x: TADTReference, y: TADTReference): void;
	find(x: TADTReference): TADTReference;
	areSameSet(x: TADTReference, y: TADTReference): boolean;
}
