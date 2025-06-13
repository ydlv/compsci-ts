export function sortByString<T>(array: T[], by: (item: T) => string): void {
	array.sort((a, b) => by(a).localeCompare(by(b)));
}
