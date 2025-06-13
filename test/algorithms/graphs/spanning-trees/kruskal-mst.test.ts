import { describe, expect, test } from "bun:test";
import { range } from "lodash";
import { kruskalMST } from "../../../../src/algorithms/graph/spanning-trees/kruskal-mst";
import { Edge } from "../../../../src/data-structures/graphs/graph.interface";
import { MatrixGraph } from "../../../../src/data-structures/graphs/matrix-graph";
import { query } from "../../../../src/util/query";

describe("kruskalMST", () => {
	test("finds MST", () => {
		// example from https://www.geeksforgeeks.org/dsa/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/
		const g = new MatrixGraph<
			number,
			Edge<number> & { readonly weight: number }
		>(range(9));

		const edges: [number, number, number][] = [
			[0, 1, 4],
			[0, 7, 8],
			[1, 2, 8],
			[1, 7, 11],
			[2, 3, 7],
			[2, 5, 4],
			[2, 8, 2],
			[3, 4, 9],
			[3, 5, 14],
			[4, 5, 10],
			[5, 6, 2],
			[6, 7, 1],
			[6, 8, 6],
			[7, 8, 7]
		];

		for (const [v, u, w] of edges) {
			g.setEdge({ from: v, to: u, weight: w });
			g.setEdge({ from: u, to: v, weight: w });
		}

		const mst = query(kruskalMST(g, e => e.weight))
			.select(({ from, to, weight }) => [
				Math.min(from, to),
				Math.max(from, to),
				weight
			])
			.select(([from, to, weight]) => `${from}--${to}:${weight}`)
			.sort()
			.toArray();

		expect(mst.length).toBe(8);
		expect(mst).toContain("0--1:4");
		expect(mst).toContain("0--7:8");
		expect(mst).toContain("2--5:4");
	});
});
