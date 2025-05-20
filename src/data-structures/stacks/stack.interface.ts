export interface Stack<T> {
    push(value: T): void;
    isEmpty(): boolean;
    peek(): T;
    pop(): T;
}