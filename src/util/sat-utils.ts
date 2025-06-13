import { Formula, Solution, Solver } from 'logic-solver'

export function solve(formula: Formula): Solution {
  const solver = new Solver()
  solver.require(formula)
  return solver.solve()
}
