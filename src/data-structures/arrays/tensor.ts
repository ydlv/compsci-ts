import { IllegalOperationError } from "../../errors/illegal-operation.error";
import { NaturalNumber } from "../../types/natural-numbers.types";
import { Coordinates, Tuple } from "../../types/tuples.types";
import { MutableMultidemsionalArray } from "./multidim-array.interface";

export class Tensor<T, N extends NaturalNumber> implements MutableMultidemsionalArray<T, N> {
    
    public readonly shape: Tuple<number, N>;
    private readonly array: T[];
    public readonly size: number;
    public readonly order: N;
    private initialized: boolean[];

    public constructor(
         ...shape: Tuple<number, N>
    ) {
        this.shape = shape;
        this.order = shape.length as N;
        this.size = (shape as number[]).reduce((x, y) => x * y, 1);
        this.array = Array(this.size).fill(true);
        this.initialized = Array(this.size).fill(false);
    }


    [Symbol.iterator](): Iterator<T, any, any> {
        return this.array[Symbol.iterator]();
    }

    getDimension(dim: number): number {
        return this.shape[dim];
    }

    *coordinates(): Iterable<Tuple<number, N>> {
        for(let i = 0; i < this.size; i++) {
            yield this.toCoords(i);
        }
    }

    get(...coordinates: Coordinates<N>): T {
        const index = this.fromCoords(coordinates);
        this.assertInitialized(coordinates, index);
        return this.array[index];
    }


    set(coordinates: Coordinates<N>, element: T): void {
        const index = this.fromCoords(coordinates);
        this.initialized[index] = true;
        this.array[index] = element;
    }

    fill(value: T): void {
        this.initialized.fill(true);
        this.array.fill(value);
    }

    populate(map: (coords: Coordinates<N>) => T): void {
        this.array.map((_, i) => {
            const coords = this.toCoords(i);
            this.initialized[i] = true;
            this.array[i] = map(coords);
        });
    }

    private assertInitialized(coords: Coordinates<N>, index: number) {
        if(!this.initialized[index]) {
            throw new IllegalOperationError(`Tensor not initialized in coordinates: (${coords.join(", ")})`);
        }
    }

    private toCoords(n: number): Coordinates<N> {
        const ret: number[] = Array(this.order).fill(0);
        for(var i = 0; i < n; i++) {
            ret[i] = n % this.shape[i];
            n /= this.shape[i];
        }
        return ret as Coordinates<N>;
    }

    private fromCoords(coords: Coordinates<N>): number {
        let n = 0;
        let multiplier = 1;

        for (let i = 0; i < this.order; i++) {
            n += coords[i] * multiplier;
            multiplier *= this.shape[i];
        }

        return n;
    }
}
