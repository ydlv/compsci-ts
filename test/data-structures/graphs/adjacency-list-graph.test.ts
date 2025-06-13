import { describe, expect, test } from 'bun:test'
import { AdjacencyListMatrix } from '../../../src/data-structures/graphs/adjacency-list-graph'
import { Edge } from '../../../src/data-structures/graphs/graph.interface'
import { list } from '../../../src/util/iterables'
import { sortByString } from '../../../src/util/sort-by-string'

type LabeledEdge<V> = Edge<V> & { label: string }
const a = Symbol('a'),
  b = Symbol('b'),
  c = Symbol('c')

describe('AdjacencyListMatrix', () => {
  test('can be constructed', () => {
    expect(() => new AdjacencyListMatrix()).not.toThrow()
  })

  test('has correct node count', () => {
    const g = new AdjacencyListMatrix([1, 2, 3])
    expect(g.nodeCount).toBe(3)
    g.removeVertex(1)
    expect(g.nodeCount).toBe(2)
    g.addVertex(5)
    expect(g.nodeCount).toBe(3)
    g.addVertex(6)
    expect(g.nodeCount).toBe(4)
  })

  test('has correct edge count', () => {
    const g = new AdjacencyListMatrix([1, 2, 3])
    expect(g.edgeCount).toBe(0)

    g.setEdge({ from: 1, to: 2 })
    expect(g.edgeCount).toBe(1)

    g.setEdge({ from: 2, to: 1 })
    expect(g.edgeCount).toBe(2)

    // add already existing
    g.setEdge({ from: 2, to: 1 })
    expect(g.edgeCount).toBe(2)

    // remove edge
    g.removeEdge(2, 1)
    expect(g.edgeCount).toBe(1)
  })

  test('has correct iterator for nodes', () => {
    const g = new AdjacencyListMatrix([a, b, c])
    const asList = list(g.nodes())
    expect(asList).toHaveLength(3)
    sortByString(asList, x => x.toString())
    expect(asList[0]).toBe(a)
    expect(asList[1]).toBe(b)
    expect(asList[2]).toBe(c)
  })

  test('has correct iterator for edges', () => {
    const g: AdjacencyListMatrix<symbol, LabeledEdge<symbol>> = new AdjacencyListMatrix([a, b, c])
    const ab: LabeledEdge<symbol> = { from: a, to: b, label: 'ab' },
      bc: LabeledEdge<symbol> = { from: b, to: c, label: 'bc' }
    g.setEdge(bc)
    g.setEdge(ab)
    const edges = list(g.edges())
    sortByString(edges, e => e.label.toString())
    expect(edges[0]).toBe(ab)
    expect(edges[1]).toBe(bc)
  })
})
