import { describe, expect, test } from 'bun:test'
import { map, range } from 'lodash'
import {
  WeighedActivity,
  weighedActivitySelection
} from '../../../src/algorithms/dynamic-programming/weighed-activity-selection'
import { list } from '../../../src/util/iterables'

describe('weighedActivitySelection', () => {
  test('works for end case empty set', () => {
    const [set, weight] = weighedActivitySelection([])
    expect(set.size).toEqual(0)
    expect(weight).toEqual(0)
  })

  test('works for case with one activity', () => {
    const activity: WeighedActivity = {
      name: 'A',
      end: 1,
      start: 0,
      weight: 3
    }
    const [set, weight] = weighedActivitySelection([activity])
    expect(set.size).toEqual(1)
    expect(weight).toEqual(3)
    const element = set.values().next()
    expect(element.done).toBe(false)
    expect(element.value.name).toEqual('A')
  })

  test('works for case with 5 non-overlapping', () => {
    const activities: WeighedActivity[] = range(5).map(i => ({
      start: i,
      end: i + 1,
      name: 'A' + i,
      weight: i + 1
    }))

    const [set, weight] = weighedActivitySelection(activities)
    expect(set.size).toEqual(5)
    expect(weight).toEqual(15)

    const names = map(activities, a => a.name)
    expect(range(5).every(i => names.includes(`A${i}`)))
  })

  test('works for non-trivial case', () => {
    const activities: WeighedActivity[] = [
      { name: 'A1', start: 0, end: 7, weight: 2 },
      { name: 'A2', start: 3, end: 10, weight: 5 },
      { name: 'A3', start: 4, end: 14, weight: 1 },
      { name: 'A4', start: 12, end: 18, weight: 6 },
      { name: 'A5', start: 14, end: 19, weight: 2 }
    ] // solution: {A2, A4}
    const [set, weight] = weighedActivitySelection(activities)
    expect(weight).toBe(5 + 6)
    expect(set.size).toBe(2)
    const selection = list(set.values())
      .map(x => x.name)
      .sort()
    expect(selection).toEqual(['A2', 'A4'])
  })
})
