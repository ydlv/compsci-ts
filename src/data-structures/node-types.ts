export interface LinkedNode<T> {
    value: T;
    next?: LinkedNode<T>;
}

export interface DoublyLinkedNode<T> extends LinkedNode<T> {
    next?: DoublyLinkedNode<T>;
    prev?: DoublyLinkedNode<T>;
}

export interface BinaryTreeNode<T> {
    readonly value: T;
    left?: BinaryTreeNode<T>;
    right?: BinaryTreeNode<T>;
}

export interface BinaryTreeNodeWithParent<T> extends BinaryTreeNode<T> {
    parent?: BinaryTreeNode<T>;
}