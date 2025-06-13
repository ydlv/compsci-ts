import { Predicate } from "../../types/functional.types";

export function removeElement<T>(
	array: T[],
	element: T,
	{ count }: { count: number } = { count: 1 }
): void {
	while (count !== 0) {
		// note: works for either positive count, or any value that may represent "until exhastued".
		const i = array.indexOf(element);
		if (i >= 0) {
			array.splice(i, 1);
		} else {
			break;
		}
		count--;
	}
}

export function removeWhere<T>(
	array: T[],
	predicate: Predicate<T>,
	{ count }: { count: number } = { count: 1 }
): void {
	while (count !== 0) {
		// note: works for either positive count, or any value that may represent "until exhastued".
		const i = array.findIndex(predicate);
		if (i >= 0) {
			array.splice(i, 1);
		} else {
			break;
		}
		count--;
	}
}
