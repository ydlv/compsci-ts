import { NoSuchElementError } from '../../errors/no-such-element.error'
import { EqualityType, map } from '../../util/equality-type'
import { Tensor } from '../arrays/tensor'
import { Edge, EdgeMutableGraph } from './graph.interface'

/**
 * This implementation of a graph is edge-mutable but not vertex-mutable.
 * It allows adding, removing and editing matrices, but not adding or removing vertices.
 * It is implemented via a matrix.
 * If you need adding vertices, you'll need the list based implementation.
 */
export class MatrixGraph<V, E extends Edge<V> = Edge<V>> implements EdgeMutableGraph<V, E> {
  readonly tensor: Tensor<E | undefined, 2>
  readonly vertices: readonly V[]
  readonly nodeCount: number
  private _edgeCount: number = 0
  private readonly inDegrees: number[]
  private readonly outDegrees: number[]
  private readonly index: ReadonlyMap<V, number>
  public readonly nodeEqualityType: EqualityType

  constructor(
    nodes: readonly V[] = [],
    { nodeEqualityType }: { nodeEqualityType: EqualityType } = { nodeEqualityType: 'structural' }
  ) {
    this.nodeEqualityType = nodeEqualityType
    const index: Map<V, number> = map(nodeEqualityType)
    this.vertices = nodes.map((v, i) => {
      index.set(v, i)
      return v
    })
    this.index = index
    this.nodeCount = this.vertices.length
    this.inDegrees = Array(this.nodeCount).fill(0)
    this.outDegrees = Array(this.nodeCount).fill(0)
    this.tensor = new Tensor(this.nodeCount, this.nodeCount)
    this.tensor.fill(undefined)
  }

  public get edgeCount(): number {
    return this._edgeCount
  }

  removeEdge(from: V, to: V): E | undefined {
    this.assertNodeExists(from)
    this.assertNodeExists(to)

    const ret = this.getEdgeIfExists(from, to)
    if (ret === undefined) {
      return undefined
    }
    this._edgeCount--
    this.tensor.set(this.coordsFor(ret), undefined)
    return ret
  }

  setEdge(e: E): void {
    if (this.getEdgeIfExists(e.from, e.to) === undefined) {
      this._edgeCount++
    }
    this.tensor.set(this.coordsFor(e), e)
  }

  nodes(): Iterable<V> {
    return this.vertices
  }

  *edges(): Iterable<E> {
    for (const e of this.tensor) {
      if (e !== undefined) {
        yield e
      }
    }
  }

  hasNode(v: V): boolean {
    return this.index.has(v)
  }

  hasEdge(from: V, to: V): boolean {
    this.assertNodeExists(from)
    this.assertNodeExists(to)

    return this.getEdgeIfExists(from, to) !== undefined
  }

  getEdge(from: V, to: V): E {
    this.assertNodeExists(from)
    this.assertNodeExists(to)

    const e = this.getEdgeIfExists(from, to)
    if (e === undefined) {
      throw new NoSuchElementError('Graph has no edge from ' + from + ' to ' + to)
    }
    return e
  }

  private getEdgeIfExists(from: V, to: V): E | undefined {
    this.assertNodeExists(from)
    this.assertNodeExists(to)

    return this.tensor.get(this.indexOf(from), this.indexOf(to))
  }

  outDegree(v: V): number {
    this.assertNodeExists(v)
    return this.outDegrees[this.indexOf(v)]
  }

  inDegree(v: V): number {
    this.assertNodeExists(v)
    return this.inDegrees[this.indexOf(v)]
  }

  *incomingEdges(v: V): Iterable<E> {
    this.assertNodeExists(v)
    const destIndex = this.indexOf(v)

    for (let srcIndex = 0; srcIndex < this.nodeCount; srcIndex++) {
      const u = this.vertices[srcIndex]
      const e = this.tensor.get(srcIndex, destIndex)
      if (e) {
        yield e
      }
    }
  }

  *outgoingEdges(v: V): Iterable<E> {
    this.assertNodeExists(v)
    const srcIndex = this.indexOf(v)

    for (let destIndex = 0; destIndex < this.nodeCount; destIndex++) {
      const u = this.vertices[destIndex]
      const e = this.tensor.get(srcIndex, destIndex)
      if (e) {
        yield e
      }
    }
  }

  private indexOf(v: V): number {
    this.assertNodeExists(v)
    return this.index.get(v) as number
  }

  private coordsFor(e: E): [number, number] {
    return [this.indexOf(e.from), this.indexOf(e.to)]
  }

  mutableCopy(): EdgeMutableGraph<V, E> {
    const g: MatrixGraph<V, E> = new MatrixGraph(this.vertices, {
      nodeEqualityType: this.nodeEqualityType
    })
    for (const e of this.edges()) {
      g.setEdge(e)
    }
    return g
  }

  private assertNodeExists(v: V) {
    if (!this.index.has(v)) {
      throw new NoSuchElementError('Graph has no such node ' + v)
    }
  }
}
