import { MultidimensionalArray, MutableMultidemsionalArray } from './multidim-array.interface'

export interface Matrix<R extends number, C extends number>
  extends MultidimensionalArray<number, 2> {
  get(row: number, column: number): number
  readonly shape: [R, C]
  readonly order: 2
  getDimension(dim: 0): R
  getDimension(dim: 1): C
  readonly rows: R
  readonly columns: C
  coordinates(): Iterable<[number, number]>
  map(mapper: (value: number, row: number, column: number) => number): Matrix<R, C>
}

export interface MutableMatrix<R extends number = number, C extends number = number>
  extends Matrix<R, C>,
    MutableMultidemsionalArray<number, 2> {
  getDimension(dim: 0): R
  getDimension(dim: 1): C
  readonly shape: [R, C]

  set(coordinates: [number, number], element: number): void
  fill(value: number): void
  populate(map: (coords: [number, number]) => number): void
  map(mapper: (value: number, row: number, column: number) => number): MutableMatrix<R, C>
}
