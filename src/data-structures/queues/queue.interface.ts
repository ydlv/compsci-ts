export interface Queue<T> {
    enqueue(value: T): void;
    isEmpty(): boolean;
    top(): T;
    dequeue(): T;
    readonly length: number;
}