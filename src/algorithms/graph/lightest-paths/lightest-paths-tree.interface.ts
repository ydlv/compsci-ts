import { Edge, Graph } from "../../../data-structures/graphs/graph.interface";

export interface LightestPathTree<V> extends ReadonlyMap<V, [V, number]> {}

export interface LightestPathAlgorithm<V, E extends Edge<V> = Edge<V>> {
    (
        g: Graph<V, E>, ego: V, weight: (e: E) => number
    ): LightestPathTree<V>;
}
