import { EdgeMutableGraph } from './graph.interface'

export function addBidirectional<V>(g: EdgeMutableGraph<V>, v: V, u: V) {
  g.setEdge({ from: u, to: v })
  g.setEdge({ from: v, to: u })
}

export function removeBidirectional<V>(g: EdgeMutableGraph<V>, v: V, u: V) {
  g.removeEdge(v, u)
  g.removeEdge(u, v)
}
