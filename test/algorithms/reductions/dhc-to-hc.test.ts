import { random, range, remove, shuffle } from 'lodash';
import { HamiltonToSat } from '../../../src/algorithms/reductions/hamilton-to-sat';
import { DirectedHamiltonToUndirected } from '../../../src/algorithms/reductions/directed-hamilton-to-undirected';
import { createReduction } from '../../../src/algorithms/reductions/reduction';
import { EdgeMutableGraph, Graph } from '../../../src/data-structures/graphs/graph.interface';
import { addBidirectional } from '../../../src/data-structures/graphs/graph-utils';
import { MatrixGraph } from '../../../src/data-structures/graphs/matrix-graph';
import { solve } from '../../../src/util/sat-utils';
import { tap } from '../../../src/util/tap';
import { UnaryOperator } from '../../../src/types/functional.types';
import { product } from '../../../src/util/iteration-utils';
import { set } from '../../../src/util/equality-type';

function edges(): [number, number][] {
    return [
        [0, 1], [1, 2], [2, 3], [3, 4], [3, 1], [4, 5], [4, 0], [4, 1], [4, 2], [5, 6], [5, 0], [5, 3], [6, 7], [6, 2], [6, 1], [6, 0], [7, 0], [7, 3], [7, 2], [7, 4], 

    ]
}

function solveDirectedHamilton<V>(g: Graph<V>): readonly V[] {
    return new HamiltonToSat<V>().solveUsing(g, solve);
}

describe("Directed Hamilton circuit to Undirected Hamilton circuit reduciton", () => {
    it("finds a correct solution", () => {
        const N = 8;
        const G = new MatrixGraph(range(N));
        edges().forEach(([from, to]) => G.setEdge({from, to}));
        const solution = new DirectedHamiltonToUndirected<number>().solveUsing(G, solveDirectedHamilton);
        
        expect(solution).toHaveLength(N);

        for(let i = 0; i < N; i++) {
            expect(G.hasEdge(solution[i], solution[(i+1)%N])).toBeTruthy();
        }
    });
});

