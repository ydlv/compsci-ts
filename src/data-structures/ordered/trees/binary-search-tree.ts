import { BinaryTreeNode } from "../../node-types";
import { DynamicOrderedList } from "../dynamic-ordered-list.interface";

export class BinarySearchTree<T> implements DynamicOrderedList<T, BinaryTreeNode<T>> {
    root?: BinaryTreeNode<T>;
    
    constructor(
        public readonly compare: Comparator<T>
    ) {}

    insert(element: T): BinaryTreeNode<T> {
        const ret: BinaryTreeNode<T> = { value: element };
        this.root = this._insert(this.root, ret);
        return ret;
    }

    private _insert(target: BinaryTreeNode<T> | undefined, insertee: BinaryTreeNode<T>): BinaryTreeNode<T> {
        if(!target) {
            return insertee;
        }

        const comparison = this.compare(insertee.value, target?.value);
        if(comparison == 0) {
            throw new Error("elmenet already in tree");
        }
        const direction: "left" | "right" = comparison > 0 ? "right" : "left";
        target[direction] = this._insert(target[direction], insertee);
        return target;
    }

    delete(ref: BinaryTreeNode<T>): void {
        this.root = this._delete(this.root, ref);
    }

    _delete(target: BinaryTreeNode<T> | undefined, ref: BinaryTreeNode<T>): BinaryTreeNode<T> | undefined {
        if(!target) {
            return undefined;
        }

        const comparison = this.compare(ref.value, target?.value);
        
    }

    minimum(): BinaryTreeNode<T> | undefined {
        let ret = this.root;
        while(ret?.left) {
            ret = ret.left;
        }
        return ret;
    }

    
    maximum(): BinaryTreeNode<T> | undefined {
        let ret = this.root;
        while(ret?.right) {
            ret = ret.right;
        }
        return ret;
    }

    succesor(ref: BinaryTreeNode<T>): BinaryTreeNode<T> | undefined {
        return this._succesor(this.root, ref);
    }
    _succesor(root: BinaryTreeNode<T> | undefined, ref: BinaryTreeNode<T>): BinaryTreeNode<T> | undefined {
        throw new Error("Method not implemented.");
    }

    predecessor(ref: BinaryTreeNode<T>): BinaryTreeNode<T> | undefined {
        return this._predecessor(this.root, ref);
    }
    _predecessor(root: BinaryTreeNode<T> | undefined, ref: BinaryTreeNode<T>): BinaryTreeNode<T> | undefined {
        throw new Error("Method not implemented.");
    }


    search(value: T): BinaryTreeNode<T> | undefined {
        let node = this.root;
        while(node) {
            const comparison = this.compare(value, node.value);
            if(comparison == 0) {
                return node;
            } else if (comparison > 0) {
                node = node.right;
            } else {
                node = node.left;
            }
        }
        return undefined;
    }

    
}