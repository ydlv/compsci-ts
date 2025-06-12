import { Edge, Graph } from "../../../data-structures/graphs/graph.interface";
import { bfs } from "../../../data-structures/graphs/traversals";
import { UnaryOperator } from "../../../types/functional.types";
import { list } from "../../../util/iterables";
import { LightestPathTree } from "./lightest-paths-tree.interface";
import { RelaxationTree } from "./relaxation-tree";

/**
 * This uses a topological sort for a lightest path tree for a DAG (Directed Acyclic Graph).
 * This won't work if the graph is not a DAG!
 */
export function DAGLightestPathsTree<V, E extends Edge<V>>(g: Graph<V, E>, ego: V, weight: UnaryOperator<E, number>)
: LightestPathTree<V> {
    const tree = new RelaxationTree(list(g.nodes()), ego);
    for(const src of bfs(g, ego)) {
        for(const e of g.outgoingEdges(src)) {
            tree.relaxIfPossible({...e, weight: weight(e)});
        }
    }
    return tree.toLightestPathTree();
}