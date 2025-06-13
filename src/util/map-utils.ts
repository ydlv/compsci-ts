import { UnaryOperator } from '../types/functional.types'

export function updateMap<K, V>(map: Map<K, V>, key: K, fn: UnaryOperator<V>) {
  const v = map.get(key)!
  map.set(key, fn(v))
}
