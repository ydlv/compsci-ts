import { DeepMap } from "deep-equality-data-structures";
import { and, atMostOne, exactlyOne, Formula, Solution } from "logic-solver";
import { Graph } from "../../data-structures/graphs/graph.interface";
import { IdHelper } from "../../util/id-helper";
import { product } from "../../util/iteration-utils";
import { range } from "../../util/range";
import { AbstractReduction } from "./reduction";

export class HamiltonToSat<V> extends AbstractReduction<
	Graph<V>,
	ReadonlyArray<V>,
	Formula,
	Solution
> {
	private readonly id: IdHelper<[V, number]> = new IdHelper(String, {
		prefix: "SATVar",
		equalityType: "structural"
	});

	public constructor() {
		super();
	}

	convertInput(g: Graph<V>): Formula {
		const N = g.nodeCount;
		const nodes = [...g.nodes()];

		const exactlyOneForNode = (v: V) => {
			const terms = range(N).map(i => this.variableFor([v, i]));
			return exactlyOne(...terms);
		};
		const exactlyOneForEachNode = and(...nodes.map(v => exactlyOneForNode(v)));

		const exactlyOneForNumber = (i: number) =>
			exactlyOne(...nodes.map(v => this.variableFor([v, i])));

		const exactlyOneForEachNumber = and(...range(N).map(i => exactlyOneForNumber(i)));

		const edgeForEveryPair: Formula[] = [];
		for (const [i, from, to] of product(range(N), nodes, nodes)) {
			if (!g.hasEdge(from, to)) {
				edgeForEveryPair.push(
					atMostOne(this.variableFor([from, i]), this.variableFor([to, (i + 1) % N]))
				);
			}
		}

		return and(exactlyOneForEachNode, exactlyOneForEachNumber, edgeForEveryPair);
	}

	convertOutput(sol: Solution | null): readonly V[] {
		if (sol === null || !sol) {
			return [];
		}
		const asMap: DeepMap<number, V> = new DeepMap();
		for (const variable of sol.getTrueVars()) {
			const [v, i] = this.id.fromId(variable);
			asMap.set(i, v);
		}
		return range(asMap.size).map(i => asMap.get(i)!);
	}

	private variableFor([v, i]: [V, number]): string {
		return this.id.getId([v, i]);
	}
}
