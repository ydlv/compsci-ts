import { query } from '../../util/query'

export interface Artifact {
  price: number
  weight: number
}

export interface KnapsackProblem {
  artifacts: Artifact[]
  capacity: number
}

export interface FractionalKnapsakProblem extends KnapsackProblem {}

export interface FractionalKnapsakArtifact extends Artifact {
  fraction: number
  fractionalWeight: number
  fractionalPrice: number
}

export interface FractionalKnapsakProblemSolution {
  artifacts: FractionalKnapsakArtifact[]
  totalWorth: number
}

export function fractionalKnapsack({
  artifacts,
  capacity
}: FractionalKnapsakProblem): FractionalKnapsakProblemSolution {
  const sorted = query(artifacts)
    .sortBy(a => a.price / a.weight, 'descending')
    .toArray()
  const taken: FractionalKnapsakArtifact[] = []
  let totalWorth: number = 0
  for (const artifact of sorted) {
    if (artifact.weight < capacity) {
      taken.push({
        ...artifact,
        fraction: 1,
        fractionalWeight: artifact.weight,
        fractionalPrice: artifact.price
      })
      totalWorth += artifact.price
      capacity -= artifact.weight
    } else {
      const fraction = capacity / artifact.weight
      taken.push({
        ...artifact,
        fractionalWeight: capacity,
        fraction: fraction,
        fractionalPrice: artifact.price * fraction
      })
      totalWorth += artifact.price * fraction
      break
    }
  }
  return {
    artifacts: taken,
    totalWorth: totalWorth
  }
}
