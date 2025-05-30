import { and, atMostOne, exactlyOne, ExactlyOneFormula, Formula, Solution, variableBits } from "logic-solver";
import { Graph } from "../../data-structures/graphs/graph.interface";
import { AbstractReduction } from "./reduction";
import { DeepIdHelper, IdHelper } from "../../util/id-helper";
import { product } from "../../util/iteration-utils";
import { range } from "../../util/range";
import { DeepMap } from "deep-equality-data-structures";

export class HamiltonToSat<V> extends AbstractReduction<Graph<V>, ReadonlyArray<V>, Formula, Solution>  {

    private readonly id: IdHelper<[V, number]> = new DeepIdHelper(String, "SATVar");

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
        const exactlyOneForEachNode = and(
            ...(nodes.map(v => exactlyOneForNode(v)))
        );

        const exactlyOneForNumber = (i: number) => exactlyOne(...(nodes.map(v => this.variableFor([v, i]))));

        const exactlyOneForEachNumber = and(
            ...(range(N).map(i => exactlyOneForNumber(i)))
        );

        const edgeForEveryPair: Formula[] = [];
        for(const [i, from, to] of product(range(N), nodes, nodes)) {
            if(!g.hasEdge(from, to)) {
                edgeForEveryPair.push(
                    atMostOne(this.variableFor([from, i]), this.variableFor([to, (i+1)%N]))
                )
            }
        }
        
        return and(exactlyOneForEachNode, exactlyOneForEachNumber, edgeForEveryPair);
    }

    convertOutput(sol: Solution): readonly V[] {
        if(sol == null || !sol) {
            return [];
        }
        const asMap: DeepMap<number, V> = new DeepMap();
        for(const var_ of sol.getTrueVars()) {
            const [v, i] = this.id.fromId(var_);
            asMap.set(i, v);
        }
        return range(asMap.size).map(i => asMap.get(i)!);
    }

    private variableFor([v, i]: [V, number]): string {
        return this.id.getId([v, i]);
    }
}