import { NoSuchElementError } from "../../errors/no-such-element.error";
import { removeElement, removeWhere } from "../../util/array-utils";
import { upsert } from "../../util/crud/upsert";
import { updateMap } from "../../util/map-utils";
import { Edge, EdgeMutableGraph, VertexMutableGraph } from "./graph.interface";

export class AdjacencyListMatrix<V, E extends Edge<V>> implements VertexMutableGraph<V, E> {

    private readonly outgoing: Map<V, E[]>;
    private readonly incoming: Map<V, E[]>;
    private readonly _outDegree: Map<V, number>;
    private readonly _inDegree: Map<V, number>;
    private readonly _vertices: Set<V>;
    private _edgeCount = 0;
        
    constructor() {
        this._outDegree = new Map();
        this._inDegree = new Map();
        this.incoming = new Map();
        this.outgoing = new Map();
        this._vertices = new Set();
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

        removeWhere(this.outgoing.get(from)!, e_ => e_.from == from && e_.to == to);
        removeWhere(this.incoming.get(to)!, e_ => e_.from == from && e_.to == to)
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
        }
        
        upsert(this.incoming.get(e.to)!, {
            find: e_ => e_.from == e.from,
            insert: () => e,
            update: () => e
        });

        upsert(this.incoming.get(e.from)!, {
            find: e_ => e_.to == e.to,
            insert: () => e,
            update: () => e
        });
    }

    nodes(): Iterable<V> {
        throw new Error("Method not implemented.");
    }

    edges(): Iterable<E> {
        throw new Error("Method not implemented.");
    }

    
    hasNode(v: V): boolean {
        throw new Error("Method not implemented.");
    }

    hasEdge(from: V, to: V): boolean {
        throw new Error("Method not implemented.");
    }

    getEdge(from: V, to: V): E {
        throw new Error("Method not implemented.");
    }

    outDegree(v: V): number {
        throw new Error("Method not implemented.");
    }

    inDegree(v: V): number {
        throw new Error("Method not implemented.");
    }

    outgoingEdges(v: V): Iterable<E> {
        throw new Error("Method not implemented.");
    }

    incomingEdges(v: V): Iterable<E> {
        throw new Error("Method not implemented.");
    }

    mutableCopy(): EdgeMutableGraph<V, E> {
        throw new Error("Method not implemented.");
    }
    
    get nodeCount() {
        return this.nodes.length;
    }   
}