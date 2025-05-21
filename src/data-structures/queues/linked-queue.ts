import { NoSuchElementError } from "../../errors/no-such-element.error";
import { tap } from "../../util/tap";
import { LinkedNode } from "../node-types";
import { Queue } from "./queue.interface";

export class LinkedQueue<T> implements Queue<T> {
    private first?: LinkedNode<T>;
    private last?: LinkedNode<T>;
    private _length: number = 0;

    constructor() {
        this.first = undefined;
        this.last = undefined;
    }

    
    public get length(): number {
        return this._length;
    }
    

    enqueue(value: T): void {
        const newLast: LinkedNode<T> = { value: value };
        if (this.first) {
            this.last!.next = newLast;
        } else {
            this.first = newLast;
        }
        this.last = newLast;
        this._length++;
    }

    isEmpty(): boolean {
        return this.first == undefined;
    }

    top(): T {
        this.assertNotEmpty();
        return this.first!.value;
    }

    dequeue(): T {
        return tap(this.top(), () => {
            this.first = this.first?.next;
            this._length--;
        });
    }


    private assertNotEmpty() {
        if (this.isEmpty()) {
            throw new NoSuchElementError("queue is empty");
        }
    }
}