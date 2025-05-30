import { DeepMap, DeepSet } from 'deep-equality-data-structures';
import { identity } from 'lodash';
export type EqualityType = "identity" | "structural";

export function map<K, V>(equalityType: "identity"): Map<K, V>
export function map<K, V>(equalityType: "structural"): DeepMap<K, V>
export function map<K, V>(equalityType: EqualityType): Map<K, V>
export function map<K, V>(equalityType: EqualityType): Map<K, V> {
    return equalityType == "identity" ? new Map() : new DeepMap();
}

export function set<T>(equalityType: "identity"): Set<T>
export function set<T>(equalityType: "structural"): DeepSet<T>
export function set<T>(equalityType: EqualityType): Set<T>
export function set<T>(equalityType: EqualityType): Set<T> {
    return equalityType == "identity" ? new Set(): new DeepSet();
}