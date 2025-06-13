/**
 * A list over a data type T which is comparable.
 * With the exception of the search method, all
 * methods require to pass a TRef object which is returned
 * from the insert method, that the user is responsible for
 * retaining. If not applicable, implemntor may choose to TRef = T
 * (also the default).
 */
export interface DynamicOrderedList<T, TRef = T> extends Iterable<T> {
	compare(left: T, right: T): number;

	insert(element: T): TRef;
	delete(ref: TRef): void;

	minimum(): TRef | undefined;
	maximum(): TRef | undefined;

	succesor(ref: TRef): TRef | undefined;
	predecessor(ref: TRef): TRef | undefined;

	search(value: T): TRef | undefined;
}
