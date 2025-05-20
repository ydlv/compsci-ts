import { LinkedStack } from '../../../src/data-structures/stacks/linked-stack';
import { Stack } from '../../../src/data-structures/stacks/stack.interface';

import { NoSuchElementError } from '../../../src/errors/no-such-element.error';

describe('Linked', () => {
    it('says it is empty when initialized', () => {
        const stack = new LinkedStack();
        expect(stack.isEmpty()).toBeTruthy();
    });

    it('says it is not empty when elements are inserted', () => {
        const stack: Stack<string> = new LinkedStack();
        stack.push("one");
        expect(stack.isEmpty()).toBeFalsy();
        stack.push("two");
        expect(stack.isEmpty()).toBeFalsy();
    });

    it('says it is not empty when elements still exist', () => {
        const stack: Stack<1 | 2 | 3> = new LinkedStack();
        stack.push(1);
        stack.push(2);
        stack.pop();
        expect(stack.isEmpty()).toBeFalsy();
    });

    it('says it is empty when it was exhausted', () => {
        const stack: Stack<1 | 2 | 3>  = new LinkedStack();
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.pop();
        stack.pop();
        stack.pop();
        expect(stack.isEmpty()).toBeTruthy();
    });

    it('has peek method that returns latest insert, without popping', () => {
        const stack: Stack<string> = new LinkedStack();

        stack.push("hello");
        expect(stack.peek()).toEqual("hello");
        expect(stack.peek()).toEqual("hello");

        stack.push("world");
        expect(stack.peek()).toEqual("world");
        expect(stack.peek()).toEqual("world");
    });

    it('throws when trying to pop empty', () => {
        const stack = new LinkedStack();
        expect(() => stack.pop()).toThrow(NoSuchElementError);
    })

    it('throws when trying to peek empty', () => {
        const stack = new LinkedStack();
        expect(() => stack.peek()).toThrow();
    });
});