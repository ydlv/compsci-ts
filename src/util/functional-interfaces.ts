export interface Comparator<T> {
    (left: T, right: T): number;
}
