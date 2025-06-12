import { describe, expect, test } from "bun:test";
import { LinkedQueue } from '../../../src/data-structures/queues/linked-queue';
import { Queue } from '../../../src/data-structures/queues/queue.interface';

import { NoSuchElementError } from '../../../src/errors/no-such-element.error';

describe('LinkedQueue', () => {
 test('is empty when initialized', () => {
        const queue: Queue<string> = new LinkedQueue();
        expect(queue.isEmpty()).toBe(true);
    });

 test('is not empty when an element is queued', () => {
        const queue: Queue<string> = new LinkedQueue();
        queue.enqueue('a');
        expect(queue.isEmpty()).toBe(false);
    });

 test('has top method return first when has one elements', () => {
        const queue: Queue<string> = new LinkedQueue();
        queue.enqueue('a');
        expect(queue.top()).toEqual('a');
    });

 test('has dequeuq method return first when has one elements', () => {
        const queue: Queue<string> = new LinkedQueue();
        queue.enqueue('a');
        expect(queue.dequeue()).toEqual('a');
    });

 test('has isEmpty return false when more than one', () => {
        const queue: Queue<string> = new LinkedQueue();
        queue.enqueue('a');
        queue.enqueue('b');
        expect(queue.isEmpty()).toBe(false);
    });

 test('has FIFO behavior', () => {
        const queue: Queue<'first' | 'second' | 'third'> = new LinkedQueue();
        queue.enqueue('first');
        queue.enqueue('second');

        expect(queue.top()).toEqual('first');
        queue.enqueue('third');
        expect(queue.top()).toEqual('first');
        expect(queue.dequeue()).toEqual('first');

        expect(queue.top()).toEqual('second');
        expect(queue.dequeue()).toEqual('second');

        expect(queue.top()).toEqual('third');
        expect(queue.dequeue()).toEqual('third');

        expect(queue.isEmpty()).toBe(true);
    });

 test('throws trying to see top when empty', () => {
        const queue: Queue<number> = new LinkedQueue();
        expect(() => queue.top()).toThrow(NoSuchElementError);
        queue.enqueue(1);
        queue.enqueue(2);
        queue.dequeue();
        queue.dequeue();
        expect(() => queue.top()).toThrow(NoSuchElementError);
    });

 test('throws trying to see dequeue when empty', () => {
        const queue: Queue<number> = new LinkedQueue();
        expect(() => queue.dequeue()).toThrow(NoSuchElementError);
        queue.enqueue(1);
        queue.enqueue(2);
        queue.dequeue();
        queue.dequeue();
        expect(() => queue.dequeue()).toThrow(NoSuchElementError);
    });

    
 test('has correct length', () => {
            const operations: ('+' | '-')[] = "+-++-+-+--".split("")  as ('+' | '-')[];
            var expectedLength = 0;
            const stack: Queue<1> = new LinkedQueue();
            for(const op of operations) {
                if(op === '+') {
                    stack.enqueue(1);
                    expectedLength++;
                } else {
                    stack.dequeue();
                    expectedLength--;
                }
    
                expect(stack.length).toEqual(expectedLength);
            }
        });
});