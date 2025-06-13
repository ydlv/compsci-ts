import { areEqual, DeepMap, DeepSet } from "deep-equality-data-structures";
export { areEqual } from "deep-equality-data-structures";
export type EqualityType = "identity" | "structural";

export function map<K, V>(equalityType: "identity"): Map<K, V>;
export function map<K, V>(equalityType: "structural"): DeepMap<K, V>;
export function map<K, V>(): DeepMap<K, V>;
export function map<K, V>(equalityType: EqualityType): Map<K, V>;
export function map<K, V>(equalityType: EqualityType = "structural"): Map<K, V> {
	return equalityType === "identity" ? new Map() : new DeepMap();
}

export function set<T>(equalityType: "identity"): Set<T>;
export function set<T>(equalityType: "structural"): DeepSet<T>;
export function set<T>(): DeepSet<T>;
export function set<T>(equalityType: EqualityType): Set<T>;
export function set<T>(equalityType: EqualityType = "structural"): Set<T> {
	return equalityType === "identity" ? new Set() : new DeepSet();
}

export function equalUnderEqualityType<T>(left: T, right: T, type: EqualityType) {
	return type === "identity" ? left === right : areEqual([left, right]);
}

export function equalityChecker<T>(type: EqualityType) {
	return type === "identity" ? (x: T, y: T) => x === y : (x: T, y: T) => areEqual([x, y]);
}

export function copySet<T>(src: ReadonlySet<T>, dst: Set<T>): Set<T> {
	for (const x of src.keys()) {
		dst.add(x);
	}
	return dst;
}

export function copyMap<K, V>(src: ReadonlyMap<K, V>, dst: Map<K, V>): Map<K, V> {
	for (const [k, v] of src.entries()) {
		dst.set(k, v);
	}
	return dst;
}
