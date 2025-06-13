import {
	Predicate,
	Supplier,
	UnaryOperator
} from "../../types/functional.types";

type UpsertParams<T> = {
	find: Predicate<T>;
	update: UnaryOperator<T>;
	insert: Supplier<T>;
};

export function upsert<T>(
	array: T[],
	{ find, update, insert }: UpsertParams<T>
): T {
	const i = array.findIndex(find);
	let ret: T;
	if (i < 0) {
		ret = insert();
		array.push(ret);
	} else {
		ret = array[i] = update(array[i]);
	}
	return ret;
}
