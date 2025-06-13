import { memoize } from "../../util/memoize";

export interface SubsetSumProblem {
    elements: readonly number[];
    sum: number;
}

/**
 * returns indices of elements that solve the problem, if a solution exists
 */
export function subsetSumPositiveIntegers({ elements, sum }: SubsetSumProblem): readonly number[] | undefined {
    
    const fn = memoize(function(headLength: number, partialSum: number): readonly number[] | undefined {
        if(headLength === 0) {
            return partialSum === 0 ? [] : undefined;
        }

        const last = elements[headLength - 1];

        if(last > partialSum) {
            return fn(headLength - 1, partialSum);
        }

        const withCurrent = fn(headLength - 1, partialSum - last);
        if(withCurrent !== undefined) {
            return [...withCurrent, headLength - 1];
        }

        const withoutElement = fn(headLength - 1, partialSum);
        if(withoutElement !== undefined) {
            return withoutElement;
        }

        return undefined;
    });

    return fn(elements.length, sum);
}
