import { example0 } from '../../../examples/graphs';
import { EdgeMutableGraph, Edge } from "../../../../src/data-structures/graphs/graph.interface";
import { MatrixGraph } from "../../../../src/data-structures/graphs/matrix-graph";
import { dijkstra } from '../../../../src/algorithms/graph/lightest-paths/dijkstra';
import { expect, test, describe } from "bun:test";

describe("dijkstra", () => {
 test("returns correct lightest path tree", () => {
        const g = example0();
        const tree = dijkstra(g, "A", w => w.weight);

        expect(tree.get("A")).toEqual(["A", 0]);
        expect(tree.get("B")![1]).toEqual(3);
        expect(tree.get("B")![0]).toMatch(/^[AC]$/);
        expect(tree.get("C")).toEqual(["A", 2]);
        expect(tree.get("D")).toEqual(["E", 3]);
        expect(tree.get("E")).toEqual(["A", 1]);
        expect(tree.get("F")).toEqual(["D", 4]);
    });

 test("throws when graph has negative edge", () => {
        const g = example0();
        g.setEdge({from: "A", to: "B", weight: -1});
        expect(() => dijkstra(g, "A", w => w.weight)).toThrow(/^.*negative.*-1.*$/ig);
    });
});