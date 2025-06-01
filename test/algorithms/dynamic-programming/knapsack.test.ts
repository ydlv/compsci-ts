import { knapsack, Artifact } from '../../../src/algorithms/dynamic-programming/knapsack';

describe("knapsack", () => {
    it("returns ∅ for ∅", () => {
        const [artifacts, price] = knapsack({artifacts: [], capacity: 5});
        expect(artifacts.length).toBe(0);
        expect(price).toBe(0);
    });

    it("returns {a} for singleton {a} when a can fit in knapsack", () => {
        const artifacts: Artifact[] = [{price: 10, weight: 5}];
        const [subset, price] = knapsack({artifacts, capacity: 5});
        expect(subset).toEqual([{price: 10, weight: 5}]);
        expect(price).toEqual(10);
    });

    it("returns ∅ if all artifacts outweight knapsack capacity", () => {
        const [subset, price] = knapsack({ artifacts: [
            { price: 100, weight: 11},
            { price: 200, weight: 12},
            { price: 50, weight: 13},
            { price: 900, weight: 11 }
        ], capacity: 10});
        expect(subset.length).toBe(0);
        expect(price).toBe(0);
    });

    it("returns only viable solution if there is only one", () => {
        const [subset, price] = knapsack({ artifacts: [
            { price: 100, weight: 11 },
            { price: 200, weight: 12 },
            { price: 50, weight: 25 },
            { price: 900, weight: 65 }
        ], capacity: 11+12});
        expect(subset.length).toBe(2);
        expect(price).toEqual(300);
    });

    it("returns entire set when can fit", () => {
        const [subset, price] = knapsack({ artifacts: [
            { price: 100, weight: 11 },
            { price: 200, weight: 12 },
            { price: 50, weight: 25 },
            { price: 900, weight: 65 }
        ], capacity: 300}); // memoization table will be 300*4 elements
        expect(subset.length).toBe(4);
        expect(price).toEqual(100 + 200 + 50 + 900);
    });

    it("returns optimal solution for non-trivial instance", () => {
        const [subset, price] = knapsack({
            artifacts: [
                { weight: 6, price: 80 }, // <- in optimal
                { weight: 3, price: 50 }, // <- in optimal
                { weight: 4, price: 40 },
                { weight: 2, price: 10 }
            ],
            capacity: 10
        });
        subset.sort((x, y) => x.price - y.price);
        expect(price).toBe(130);
        expect(subset).toEqual([
            {weight: 3, price: 50},
            {weight: 6, price: 80}
        ]);
    });
});