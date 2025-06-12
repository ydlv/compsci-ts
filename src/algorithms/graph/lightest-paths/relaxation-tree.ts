import { ArrayMatrix } from "../../../data-structures/arrays/array-matrix";
import { MutableMatrix } from "../../../data-structures/arrays/matrix.interface";
import { Edge } from "../../../data-structures/graphs/graph.interface";
import { NoSuchElementError } from "../../../errors/no-such-element.error";
import { LightestPathTree } from "./lightest-paths-tree.interface";

export type WeighedEdge<V> = Edge<V> & {weight: number};

export class RelaxationTree<V> {
    private readonly _parent: Map<V, V>;
    private readonly _distance: Map<V, number>;
    private readonly vertices: readonly V[];
    public readonly nodeCount: number;

    constructor(vertices: readonly V[], readonly ego: V) {
        this.nodeCount = vertices.length;
        this._distance = new Map();
        this._parent = new Map();
        this.vertices = vertices.map((v) => {
            this._distance.set(v, Infinity);
            this._parent.set(v, v);
            return v;
        });
        this._distance.set(ego, 0);
    }
    
    parent(v: V): V {
        this.assertVertexExists(v);
        return this._parent.get(v)!;
    }

    distance(v: V): number {
        this.assertVertexExists(v);
        return this._distance.get(v)!;
    }

    canRelax({from, to, weight}: {from: V, to: V, weight: number}) {
        // is d[to] > w(from, to) + d[from]
        return this.distance(to) > weight + this.distance(from);
    }

    relax({from, to, weight}: {from: V, to: V, weight: number}) {
        this._distance.set(to, weight + this.distance(from));
        this._parent.set(to, from);
    }

    relaxIfPossible(e: WeighedEdge<V>) {
        if(this.canRelax(e)) {
            this.relax(e);
        }
    }

    toLightestPathTree(): LightestPathTree<V> {
        const ret: Map<V, [V, number]> = new Map();
        for(const v of this.vertices) {
            ret.set(v, [this._parent.get(v)!, this._distance.get(v)!]);
        }
        return ret;
    }

    private assertVertexExists(v: V) {
        if(!this._parent.has(v)) {
            throw new NoSuchElementError("RelaxationTree has no node " + v);
        }
    }
}