import { tap } from '../../src/util/tap';
import { expect, test, describe } from "bun:test";

describe('tap', () => {
 test('returns the given object', () => {
        const x = Symbol("hello");
        expect(tap(x, () => {})).toBe(x);
    });

 test('performs the callback', () => {
        const ref = {done: false};
        tap(0, () => ref.done = true);
        expect(ref.done).toBe(true);
    });

 test('performs the given callback before returning', () => {
        const refA = {value: 0};
        
        const refB = {value: -9};

        const ob = {
            fun() {
                refB.value = refA.value;
            }
        }

        tap(ob, () => refA.value = 2).fun();
        expect(refB.value).toBe(2); // will work if and only if the callback to tap was called before .fun()
    }); 
});