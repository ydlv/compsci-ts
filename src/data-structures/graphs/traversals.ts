import { LinkedQueue } from "../queues/linked-queue";
import { Queue } from "../queues/queue.interface";
import { LinkedStack } from "../stacks/linked-stack";
import { Stack } from "../stacks/stack.interface";
import { Edge, Graph } from "./graph.interface";

export function *bfs<V, E extends Edge<V>>(g: Graph<V, E>, starting: V): Iterable<V> {
    const q: Queue<V> = new LinkedQueue();
    const seen: Set<V> = new Set();
    q.enqueue(starting);
    while(!q.isEmpty()) {
        const v = q.dequeue();
        seen.add(v);
        yield v;
        for(const {to} of g.outgoingEdges(v)) {
            if(!seen.has(to)) {
                q.enqueue(to);
            }
        }
    }
}


export function *dfs<V, E extends Edge<V>>(g: Graph<V, E>, starting: V): Iterable<V> {
    const s: Stack<V> = new LinkedStack();
    const seen: Set<V> = new Set();
    s.push(starting);
    while(!s.isEmpty()) {
        const v = s.pop();
        if(seen.has(v)) {
            continue;
        }
        seen.add(v);
        yield v;
        for(const {to} of g.outgoingEdges(v)) {
            s.push(to);
        }
    }
}

