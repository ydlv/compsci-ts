import { NaturalNumber } from "../types/natural-numbers.types";
import { Tuple } from "../types/tuples.types";

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

export interface TreeNode<T> {
	value: T;
	children: TreeNode<T>[];
}

export interface TreeNodeWithParent<T> extends TreeNode<T> {
	parent?: TreeNodeWithParent<T>;
}
