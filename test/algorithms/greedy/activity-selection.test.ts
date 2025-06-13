import { describe, expect, test } from 'bun:test'
import { Activity, activitySelection } from '../../../src/algorithms/greedy/activity-selection'

// example from https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/
const activities: Activity[] = [
  { name: 'A', start: 1, end: 2 },
  { name: 'B', start: 3, end: 4 },
  { name: 'C', start: 0, end: 6 },
  { name: 'D', start: 5, end: 7 },
  { name: 'E', start: 8, end: 9 },
  { name: 'F', start: 5, end: 9 }
]

describe(activitySelection, () => {
  test('returns correct selection count', () => {
    expect(activitySelection(activities)).toHaveLength(4)
  })

  test('returns correct selection', () => {
    expect(activitySelection(activities).map(x => x.name)).toEqual(['A', 'B', 'D', 'E'])
  })

  test("doesn't mutate parameter", () => {
    const a = [...activities]
    const b = [...a]
    activitySelection(a)
    expect(a).toEqual(b)
  })
})
