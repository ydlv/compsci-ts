import { NoSuchElementError } from "../../errors/no-such-element.error";
import { DeepMutable } from "../../types/util.types";
import { removeElement, removeWhere } from "../../util/array-utils";
import { upsert } from "../../util/crud/upsert";
import { iterable } from "../../util/iterables";
import { updateMap } from "../../util/map-utils";
import { edgeMatcher } from "./edge-matches";
import { Edge, EdgeMutableGraph, VertexMutableGraph } from "./graph.interface";

export class AdjacencyListMatrix<V, E extends Edge<V> = Edge<V>> implements VertexMutableGraph<V, E> {

    private readonly outgoing: Map<V, E[]>;
    private readonly incoming: Map<V, E[]>;
    private readonly _outDegree: Map<V, number>;
    private readonly _inDegree: Map<V, number>;
    private readonly _vertices: Set<V>;
    private _edgeCount = 0;
        
    constructor(initialVertices: V[] = []) {
        this._outDegree = new Map();
        this._inDegree = new Map();
        this.incoming = new Map();
        this.outgoing = new Map();
        this._vertices = new Set();
        initialVertices.forEach(v => this.addVertex(v));
    }

    get edgeCount(): number {
        return this._edgeCount;
    }

    addVertex(v: V): boolean {
        if(this._vertices.has(v)) {
            return false;
        }

        this._inDegree.set(v, 0);
        this._outDegree.set(v, 0);
        this.incoming.set(v, []);
        this.outgoing.set(v, []);
        this._vertices.add(v);
        return true;
    }

    removeVertex(v: V): boolean {
        if(!this._vertices.has(v)) {
            return false;
        }

        this.incoming.delete(v);
        this.outgoing.delete(v);
        this._inDegree.delete(v);
        this._outDegree.delete(v);
        this._vertices.delete(v);
        return true;
    }

    removeEdge(from: V, to: V): E {
        this.nodeMustExist(from);
        this.nodeMustExist(to);
        if(!this.hasEdge(from, to)) {
            throw new NoSuchElementError(`Graph has no edge ${from} -> ${to}`);
        }
        const e = this.outgoing.get(from)!.find(e => e.from == from)!;

        removeWhere(this.outgoing.get(from)!, edgeMatcher({from, to}));
        removeWhere(this.incoming.get(to)!, edgeMatcher({from, to}));
        this._edgeCount--;
        updateMap(this._inDegree, to, d => d--);
        updateMap(this._outDegree, from, d => d--);
        return e;
    }

    private nodeMustExist(v: V) {
        if(!this.hasNode(v)) {
            throw new NoSuchElementError(`Graph has no node ${v}`);
        }
    }

    setEdge(e: E): void {
        this.nodeMustExist(e.from);
        this.nodeMustExist(e.to);

        if(!this.hasEdge(e.from, e.to)) {
            updateMap(this._inDegree, e.to, d => d++);
            updateMap(this._outDegree, e.from, d => d++);
            this._edgeCount++;
        }
        
        upsert(this.incoming.get(e.to)!, {
            find: e_ => e_.from == e.from,
            insert: () => e,
            update: () => e
        });

        upsert(this.outgoing.get(e.from)!, {
            find: e_ => e_.to == e.to,
            insert: () => e,
            update: () => e
        });
    }

    nodes(): Iterable<V> {
        return iterable(this._vertices);
    }

    *edges(): Iterable<E> {
        for(const v of this._vertices) {
            for(const e of this.outgoing.get(v)!) {
                yield e;
            }
        }
    }

    hasNode(v: V): boolean {
        return this._vertices.has(v);
    }

    hasEdge(from: V, to: V): boolean {
        this.nodeMustExist(from);
        this.nodeMustExist(to);
        return this.outgoing.get(from)!.some(edgeMatcher({from, to}));
    }

    getEdge(from: V, to: V): E {
        this.nodeMustExist(from);
        this.nodeMustExist(to);
        return this.outgoing.get(from)!.find(edgeMatcher({from, to}))!;
    }

    outDegree(v: V): number {
        this.nodeMustExist(v);
        return this._outDegree.get(v)!;
    }

    inDegree(v: V): number {
        this.nodeMustExist(v);
        return this._inDegree.get(v)!;
    }

    outgoingEdges(v: V): Iterable<E> {
        this.nodeMustExist(v);
        return iterable(this.outgoing.get(v)!);
    }

    incomingEdges(v: V): Iterable<E> {
        this.nodeMustExist(v);
        return iterable(this.incoming.get(v)!);
    }

    mutableCopy(): VertexMutableGraph<V, E> {
        const g: VertexMutableGraph<V, E> = new AdjacencyListMatrix();
        for(const v of this._vertices) {
            g.addVertex(v);
        }
        for(const e of this.edges()) {
            g.setEdge(e);
        }
        return g;
    }
    
    get nodeCount() {
        return this._vertices.size;
    }   
}