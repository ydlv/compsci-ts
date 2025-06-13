import { describe, expect, test } from 'bun:test'
import { Artifact, fractionalKnapsack } from '../../../src/algorithms/greedy/fractional-knapsack'

describe('knapsack', () => {
  test('returns ∅ for ∅', () => {
    const { artifacts, totalWorth } = fractionalKnapsack({ artifacts: [], capacity: 5 })
    expect(artifacts.length).toBe(0)
    expect(totalWorth).toBe(0)
  })

  test('returns {a} for singleton {a} when a can fit in knapsack', () => {
    const artifacts: Artifact[] = [{ price: 10, weight: 5 }]
    const { artifacts: subset, totalWorth } = fractionalKnapsack({ artifacts, capacity: 5 })
    expect(subset).toEqual([
      { price: 10, weight: 5, fraction: 1, fractionalWeight: 5, fractionalPrice: 10 }
    ])
    expect(totalWorth).toEqual(10)
  })

  test('returns singleton if all artifacts outweight knapsack capacity', () => {
    const { artifacts, totalWorth } = fractionalKnapsack({
      artifacts: [
        { price: 100, weight: 11 },
        { price: 200, weight: 12 },
        { price: 50, weight: 13 },
        { price: 900, weight: 11 }
      ],
      capacity: 10
    })
    expect(artifacts.length).toBe(1)
    expect(totalWorth).toBeCloseTo((900 * 10) / 11)
  })

  test('returns entire set when can fit', () => {
    const { artifacts, totalWorth } = fractionalKnapsack({
      artifacts: [
        { price: 100, weight: 11 },
        { price: 200, weight: 12 },
        { price: 50, weight: 25 },
        { price: 900, weight: 65 }
      ],
      capacity: 300
    })
    expect(artifacts.length).toBe(4)
    expect(totalWorth).toEqual(100 + 200 + 50 + 900)
  })

  test('returns optimal solution for non-trivial instance', () => {
    const { artifacts, totalWorth } = fractionalKnapsack({
      artifacts: [
        { weight: 40, price: 120 }, // C: ratio = 3.0
        { weight: 10, price: 60 }, // A: ratio = 6.0
        { weight: 20, price: 100 }, // B: ratio = 5.0
        { weight: 60, price: 90 } // D: ratio = 1.5
      ],
      capacity: 50
    })

    // expecting: all of A, all of B, half of C

    artifacts.sort((x, y) => x.price - y.price) // A, B, C
    expect(totalWorth).toBe(220)
    expect(artifacts).toEqual([
      { weight: 10, price: 60, fraction: 1, fractionalPrice: 60, fractionalWeight: 10 }, // A
      { weight: 20, price: 100, fraction: 1, fractionalPrice: 100, fractionalWeight: 20 }, // B
      { weight: 40, price: 120, fraction: 0.5, fractionalPrice: 60, fractionalWeight: 20 } // C, 1 half
    ])
  })
})
