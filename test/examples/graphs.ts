import { EdgeMutableGraph, Edge } from "../../src/data-structures/graphs/graph.interface";
import { MatrixGraph } from "../../src/data-structures/graphs/matrix-graph";
import { dijkstra } from '../../src/algorithms/graph/lightest-paths/dijkstra';
import { UppercaseLetter } from "./types";

type V = UppercaseLetter;
type E = Edge<V> & {weight: number};

export function example0() {
    const edges: string[] = [
        "AB3", "AC2", "AD4", "AE1",
        "BF7",
        "BC10", "CD5",
        "DB10", "DF1",
        "EF5", "ED2",
        "FE1"
    ];
    const g: EdgeMutableGraph<V, E> = 
        new MatrixGraph<V, E>(["A", "B", "C", "D", "E", "F"]);

    for(const s of edges) {
        const u = s.charAt(0) as UppercaseLetter;
        const v = s.charAt(1) as UppercaseLetter;
        const w = +(s.substring(2));
        g.setEdge({from: u, to: v, weight: w});
    }
    
    return g;
}