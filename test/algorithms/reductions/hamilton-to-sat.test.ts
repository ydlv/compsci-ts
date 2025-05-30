import { random, remove, shuffle } from 'lodash';
import { HamiltonToSat } from '../../../src/algorithms/reductions/hamilton-to-sat';
import { createReduction } from '../../../src/algorithms/reductions/reduction';
import { EdgeMutableGraph, Graph } from '../../../src/data-structures/graphs/graph.interface';
import { addBidirectional } from '../../../src/data-structures/graphs/graph-utils';
import { MatrixGraph } from '../../../src/data-structures/graphs/matrix-graph';
import { range } from '../../../src/util/range';
import { solve } from '../../../src/util/sat-utils';
import { tap } from '../../../src/util/tap';
import { UnaryOperator } from '../../../src/types/functional.types';
import { product } from '../../../src/util/iteration-utils';
import { set } from '../../../src/util/equality-type';

describe("Hamilton to SAT reduction", () => {
    it("Finds a correct solution for a Dirac graph", () => {
        const N = 20;
        const g: EdgeMutableGraph<number> = new MatrixGraph(range(N));
        
        // generate a Hamiltonian graph by Dirac theorem - forall v, rank(v) >= N/2
        for(const v of range(N)) {
            const rank = random(Math.ceil(N / 2), N - 1, false);
            const neighbors = range(N);
            remove(neighbors, u => u == v);
            shuffle(neighbors);
            for(const u of range(rank)) {
                g.setEdge({from: v, to: u});
                g.setEdge({from: u, to: v});
            }
        }

        const path = new HamiltonToSat<number>().solveUsing(g, solve);
        expect(path).toHaveLength(N);

        for(const v of range(N)) {
            expect(path).toContain(v);   
        }

        for(const i of range(N)) {
            const u = path[i];
            const v = path[(i+1) % N];
            expect(g.hasEdge(u, v)).toBeTruthy();
        }
    });

    it("returns empty for graph without Hamiltonian path", () => {
         const N = 20;
        const g: EdgeMutableGraph<number | string> = new MatrixGraph([...range(N), "A", "B", "C"]);
        
        // generate a Hamiltonian graph by Dirac theorem - forall v, rank(v) >= N/2
        for(const v of range(N)) {
            const rank = random(Math.ceil(N / 2), N - 1, false);
            const neighbors = range(N);
            remove(neighbors, u => u == v);
            shuffle(neighbors);
            for(const u of range(rank)) {
                addBidirectional(g, v, u);
            }
        }

        // add three vertices each with rank 1, so no Hamilton path possible.
        const e: [number, string][] = [[2, "A"], [3, "B"], [4, "C"]];
        for(const [v, sym] of e) {
            addBidirectional(g, v, sym);
        }

        
        const path = new HamiltonToSat<number>().solveUsing(g, solve);
        expect(path).toHaveLength(0);
    });
});