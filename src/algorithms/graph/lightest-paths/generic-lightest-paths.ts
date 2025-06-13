import { Edge, Graph } from "../../../data-structures/graphs/graph.interface";
import { UnaryOperator } from "../../../types/functional.types";
import { list } from "../../../util/iterables";
import { LightestPathTree } from "./lightest-paths-tree.interface";
import { RelaxationTree } from "./relaxation-tree";

/**
 * Mathemtically correct, but it's
 */
export function genericLightestPath<V, E extends Edge<V>>(
	g: Graph<V, E>,
	ego: V,
	weight: UnaryOperator<E, number>
): LightestPathTree<V> {
	const tree = new RelaxationTree<V>(list(g.nodes()), ego);

	let anyRelaxed: boolean = true;
	while (anyRelaxed) {
		anyRelaxed = false;
		for (const e of g.edges()) {
			const ew = { ...e, weight: weight(e) };
			if (tree.canRelax(ew)) {
				anyRelaxed = true;
				tree.relax(ew);
			}
		}
	}
	return tree.toLightestPathTree();
}
