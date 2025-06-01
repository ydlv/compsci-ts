import { memoize } from "../../util/memoize";


export interface Artifact {
    price: number;
    weight: number;
}

export interface KnapsackProblem {
    artifacts: Artifact[];
    capacity: number;
}

interface KnapsackProblemSolution {
    artifacts: Artifact[];
    totalPrice: number;
}


/**
 * Note: this variant of the knapsack problem requires
 * the weights of the artifacts and the knapsack capacity
 * to be integers.
 * The solution is O(capacity * N), which is NOT polynomial.
 * This also means that if you want to use it well, divide
 * all weights and the knapsack's capacity by their gcd, if
 * it is not 1.
 */
export function knapsack({artifacts, capacity}: KnapsackProblem): [Artifact[], number] {
    const N = artifacts.length;
    
    // subproblem: for j, W, let opt(j, W) be the solution for artifacts[0..<j], W
    const opt: (j: number, W: number) => KnapsackProblemSolution = memoize(
        function(j, W) {
            if(j == 0) {
                return {
                    artifacts: [], totalPrice: 0
                };
            }
            
            const { price: p_j, weight: w_j } = artifacts[j-1];
            if(w_j > W) {
                return opt(j - 1, W);
            }

            const dontPick = opt(j - 1, W);
            const subsolution = opt(j - 1, W - w_j);
            const pick: KnapsackProblemSolution = {
                artifacts: [...(subsolution.artifacts), artifacts[j - 1]],
                totalPrice: subsolution.totalPrice + p_j
            }

            if(dontPick.totalPrice > pick.totalPrice) {
                return dontPick;
            }

            return pick;
        }
    );

    const {artifacts: subset, totalPrice} = opt(artifacts.length, capacity);
    return [subset, totalPrice];
}
