import { Predicate } from "../../types/functional.types";
import { Edge } from "./graph.interface";

export function edgesMatch<V>(e1: Edge<V>, e2: Edge<V>) {
    return e1.from == e2.from && e1.to == e2.to;
}

export function edgeMatcher<V>(edge: Edge<V>): Predicate<Edge<V>> {
    return e_ => edgesMatch(e_, edge);
}