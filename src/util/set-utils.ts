import { DeepSet } from 'deep-equality-data-structures'
import { minBy } from 'lodash'
import { concatIterable, forEach } from './iteration-utils'
import { tap } from './tap'

export function union<T>(...sets: ReadonlySet<T>[]): DeepSet<T> {
  return tap(new DeepSet(), set => {
    for (const k of concatIterable(...sets.map(x => x.keys()))) {
      set.add(k)
    }
  })
}

export function intersect<T>(...sets: ReadonlySet<T>[]): DeepSet<T> {
  if (sets.length === 0) return new DeepSet()

  const smallest = minBy(sets, s => s.size)
  const ret: DeepSet<T> = new DeepSet()
  for (const k of smallest) {
    if (sets.every(s => s.has(k))) {
      ret.add(k)
    }
  }

  return ret
}

export function without<T>(left: ReadonlySet<T>, right: ReadonlySet<T>): DeepSet<T> {
  const ret: DeepSet<T> = new DeepSet()
  for (const k of left.keys()) {
    if (!right.has(k)) {
      ret.add(k)
    }
  }
  return ret
}

export function set<T>(source: Iterable<T>): DeepSet<T> {
  return tap(new DeepSet(), set => forEach(source, x => set.add(x)))
}
