/**
 * Wraps in a new iterable, for security reasons.
 * Proxies to the given object and is not frozen - the iterator
 * returns will be taken from source upon request.
 * If you need a frozen copy, you need to return a ReadonlyArray<T> from clone
 */
export function iterable<T>(source: Iterable<T>): Iterable<T> {
  return {
    [Symbol.iterator]: () => source[Symbol.iterator]()
  }
}

export function list<T>(source: Iterable<T>): T[] {
  return [...source]
}
