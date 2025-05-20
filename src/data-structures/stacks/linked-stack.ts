import { NoSuchElementError } from "../../errors/no-such-element.error";
import { LinkedNode } from "../node-types";
import { Stack } from "./stack.interface";

export class LinkedStack<T> implements Stack<T> {
    private top?: LinkedNode<T>;

    constructor() {
        this.top = undefined;
    }

    push(value: T): void {
        this.top = {
            value: value,
            next: this.top
        };
    }

    isEmpty(): boolean {
        return this.top == undefined;
    }

    peek(): T {
        this.assertNonEmpty();
        return this.top!.value;
    }

    pop(): T {
        this.assertNonEmpty();
        const ret = this.top!.value;
        this.top = this.top!.next;
        return ret;
    }

    private assertNonEmpty() {
        if (this.isEmpty()) {
            throw new NoSuchElementError("stack is empty");
        }
    }
}