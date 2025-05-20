export interface LinkedNode<T> {
    value: T;
    next?: LinkedNode<T>;
}

export interface DoublyLinkedNode<T> extends LinkedNode<T> {
    next?: DoublyLinkedNode<T>;
    prev?: DoublyLinkedNode<T>;
}