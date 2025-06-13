import { UnaryOperator } from '../../types/functional.types'

export function createReduction<X1, Y1, X2, Y2 = Y1>({
  inputConverter,
  outputConverter,
  reductionSolver
}: {
  inputConverter: UnaryOperator<X1, X2>
  outputConverter: UnaryOperator<Y2, Y1>
  reductionSolver: UnaryOperator<X2, Y2>
}): UnaryOperator<X1, Y1> {
  return x1 => outputConverter(reductionSolver(inputConverter(x1)))
}

export abstract class AbstractReduction<X1, Y1, X2, Y2 = Y1> {
  abstract convertInput(x: X1): X2

  abstract convertOutput(y: Y2): Y1

  solveUsing(x: X1, reductionSolver: UnaryOperator<X2, Y2>) {
    const xConverter = this.convertInput(x)
    const reducedY = reductionSolver(xConverter)
    return this.convertOutput(reducedY)
  }

  createSolver(reductionSolver: UnaryOperator<X2, Y2>) {
    return createReduction({
      inputConverter: this.convertInput.bind(this),
      outputConverter: this.convertOutput.bind(this),
      reductionSolver: reductionSolver
    })
  }
}

export class Reduction<X1, Y1, X2, Y2 = Y1> extends AbstractReduction<X1, Y1, X2, Y2> {
  private readonly inputConverter: UnaryOperator<X1, X2>
  private readonly outputConverter: UnaryOperator<Y2, Y1>

  public constructor({
    inputConverter,
    outputConverter
  }: {
    inputConverter: UnaryOperator<X1, X2>
    outputConverter: UnaryOperator<Y2, Y1>
  }) {
    super()
    this.inputConverter = inputConverter
    this.outputConverter = outputConverter
  }

  convertInput(x: X1): X2 {
    return this.inputConverter(x)
  }

  convertOutput(y: Y2): Y1 {
    return this.outputConverter(y)
  }
}
