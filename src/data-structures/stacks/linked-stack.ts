import { NoSuchElementError } from "../../errors/no-such-element.error";
import { LinkedNode } from "../node-types";
import { Stack } from "./stack.interface";

export class LinkedStack<T> implements Stack<T> {
	private top?: LinkedNode<T>;
	private _length: number;

	constructor() {
		this.top = undefined;
		this._length = 0;
	}

	public get length(): number {
		return this._length;
	}

	push(value: T): void {
		this.top = {
			value: value,
			next: this.top
		};
		this._length++;
	}

	isEmpty(): boolean {
		return this.top === undefined;
	}

	peek(): T {
		this.assertNonEmpty();
		return this.top!.value;
	}

	pop(): T {
		this.assertNonEmpty();
		const ret = this.top!.value;
		this.top = this.top!.next;
		this._length--;
		return ret;
	}

	private assertNonEmpty() {
		if (this.isEmpty()) {
			throw new NoSuchElementError("stack is empty");
		}
	}
}
