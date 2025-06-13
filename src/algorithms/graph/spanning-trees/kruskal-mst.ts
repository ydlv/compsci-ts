import { DeepSet } from "deep-equality-data-structures";
import { Edge, Graph } from "../../../data-structures/graphs/graph.interface";
import { TreesUnionFind } from "../../../data-structures/misc/trees-union-find";
import { UnaryOperator } from "../../../types/functional.types";
import { query } from "../../../util/query";

export function kruskalMST<V, E extends Edge<V> = Edge<V>>(g: Graph<V, E>, weight: UnaryOperator<E, number>): DeepSet<E> {
    const weighedEdges: readonly (E & {readonly weight: number})[] = (
        query(g.edges()).
        select(e => ({...e, weight: weight(e)})).
        sortBy(e => e.weight).
        toArray()
    );
    
    const tree: DeepSet<E> = new DeepSet();
    const unionFind = new TreesUnionFind<V>();
    const sets = query(g.nodes()).toMap(s => unionFind.makeSet(s));

    for(const e of weighedEdges) {
        const srcSet = sets.get(e.from)!;
        const dstSet = sets.get(e.to)!;
        if(unionFind.areSameSet(srcSet, dstSet)) {
            continue;
        }

        unionFind.union(srcSet, dstSet);
        tree.add(e);

        if (tree.size === g.nodeCount - 1) break; // spans all and is thus MST
    }

    return tree;
}