

export type Edge<V, TSateliteData = {}> = {
    readonly from: V;
    readonly to: V;
} & TSateliteData;

export interface Graph<V, E extends Edge<V> = Edge<V>> {
    nodes(): Iterable<V>;
    edges(): Iterable<E>;

    readonly nodeCount: number;
    readonly edgeCount: number;
    
    hasNode(v: V): boolean;
    hasEdge(from: V, to: V): boolean;

    /**
     * @throws if edge doesn't exist
     */
    getEdge(from: V, to: V): E;

    /**
     * @throws if does not contain node
     */
    outDegree(v: V): number;

    /**
     * @throws if does not contain node
     */
    inDegree(v: V): number; 
    
    /**
     * @throws if does not contain node
     */
    outgoingEdges(v: V): Iterable<E>;

    /**
     * @throws if does not contain node
     */
    incomingEdges(v: V): Iterable<E>;


    mutableCopy(): EdgeMutableGraph<V, E>;
}

export interface EdgeMutableGraph<V, E extends Edge<V>> extends Graph<V, E> {
    removeEdge(from: V, to: V): E;
    setEdge(e: E): void;
}

export interface VertexMutableGraph<V, E extends Edge<V>> extends EdgeMutableGraph<V, E> {
    addVertex(v: V): boolean;
    removeVertex(v: V): boolean;

    mutableCopy(): VertexMutableGraph<V, E>;
}