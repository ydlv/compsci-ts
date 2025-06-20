import { minBy } from "lodash";
import { Edge, Graph } from "../../../data-structures/graphs/graph.interface";
import { IllegalOperationError } from "../../../errors/illegal-operation.error";
import { removeElement } from "../../../util/crud/remove";
import { list } from "../../../util/iterables";
import { LightestPathTree } from "./lightest-paths-tree.interface";
import { RelaxationTree } from "./relaxation-tree";

export function dijkstra<V, E extends Edge<V> = Edge<V>>(
	g: Graph<V, E>,
	ego: V,
	weight: (e: E) => number
): LightestPathTree<V> {
	const tree = new RelaxationTree(list(g.nodes()), ego);
	const Q = list(g.nodes());

	while (Q.length > 0) {
		const u = minBy(Q, v => tree.distance(v))!;
		removeElement(Q, u);
		for (const e of g.outgoingEdges(u)) {
			const w = weight(e);
			if (w < 0) {
				throw new IllegalOperationError(
					"Dijkstra algorithm cannot operate on a " +
						"graph with negative edges, but " +
						e +
						" has weight " +
						w
				);
			}
			tree.relaxIfPossible({ ...e, weight: w });
		}
	}

	return tree.toLightestPathTree();
}
