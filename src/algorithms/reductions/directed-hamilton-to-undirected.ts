import { AssertionError } from 'assert'
import { addBidirectional } from '../../data-structures/graphs/graph-utils'
import { Edge, EdgeMutableGraph, Graph } from '../../data-structures/graphs/graph.interface'
import { MatrixGraph } from '../../data-structures/graphs/matrix-graph'
import { list } from '../../util/iterables'
import { product } from '../../util/iteration-utils'
import { AbstractReduction } from './reduction'

type N = 1 | 2 | 3

export class DirectedHamiltonToUndirected<V, E extends Edge<V> = Edge<V>> extends AbstractReduction<
  Graph<V, E>,
  readonly V[],
  Graph<[V, N]>,
  readonly [V, N][]
> {
  convertInput(g: Graph<V, E>): Graph<[V, N], { readonly from: [V, N]; readonly to: [V, N] }> {
    const nodes = list(g.nodes())
    const reducedNode: [V, N][] = [...product(nodes, [1, 2, 3] as N[])]
    const g2: EdgeMutableGraph<[V, N]> = new MatrixGraph(reducedNode, {
      nodeEqualityType: 'structural'
    })

    for (const v of nodes) {
      addBidirectional(g2, [v, 1], [v, 2])
      addBidirectional(g2, [v, 2], [v, 3])
    }

    for (const { from, to } of g.edges()) {
      addBidirectional(g2, [from, 3], [to, 1])
    }

    return g2
  }

  convertOutput(y: [V, N][]): readonly V[] {
    if (y.length % 3 !== 0) {
      throw new AssertionError({
        message:
          'length of Hamilton path in undirected reduction grpah should be divisible but 3, but was ' +
          y.length,
        actual: y.length
      })
    }

    // first, find direction; all will be 1>2>3 or 3>2>1.
    const firstIndexOfAMiddleVertex = y.findIndex(([_, n]) => n === 2)

    // the next one must be either 1 or 3.
    if (y[(firstIndexOfAMiddleVertex + 1) % y.length][1] !== 3) {
      y = y.reverse()
    }

    // next, we need to find the first 1.
    const firstIndexOfA1 = y.findIndex(([_, n]) => n === 1)
    const ret: V[] = []
    for (let i = firstIndexOfA1; i < y.length; i += 3) {
      ret.push(y[i][0])
    }
    return ret
  }
}
