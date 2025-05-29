
export type UnaryOperator<X, Y=X> = (x: X) => Y;
export type Predicate<T> = UnaryOperator<T, boolean>;
export type Supplier<T> = () => T;

export interface Comparator<T> {
    (left: T, right: T): number;
}
