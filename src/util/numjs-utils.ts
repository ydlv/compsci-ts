import { NdArray, NdType, empty } from 'numjs';
import { ArgumentError } from '../errors/argument-error';

/* tslint:disable:variable-name */

export function matmul(A: NdArray, B: NdArray, dtype?: NdType<number>): NdArray {
    if (A.shape.length !== 2) {
        throw new ArgumentError(`A shape was ${A.shape}, which is not a matrix`);
    }
    if (B.shape.length !== 2) {
        throw new ArgumentError(`B shape was ${B.shape}, which is not a matrix`);
    }

    const [n, m] = A.shape;
    const [m_, k] = B.shape;

    if (m_ !== m) {
        throw new ArgumentError(`Matrix dimensions don't match: ${A.shape} x ${B.shape}`);
    }

    const C = empty([n, k], dtype);

    for (let i = 0; i < n; i++) {
        const A_row = A.slice([i, i + 1]).reshape(m); 
        for (let j = 0; j < k; j++) {
            const B_col = B.slice(null, [j, j + 1]).reshape(m); 
            const value = A_row.dot(B_col).get(0); 
            C.set(i, j, value);
        }
    }

    return C;
}
