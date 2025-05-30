export function product<T0>(s0: Iterable<T0>): Iterable<[T0]>
export function product<T0, T1>(s0: Iterable<T0>, s1: Iterable<T1>): Iterable<[T0, T1]>
export function product<T0, T1, T2>(s0: Iterable<T0>, s1: Iterable<T1>, s2: Iterable<T2>): Iterable<[T0, T1, T2]>
export function product<T0, T1, T2, T3>(s0: Iterable<T0>, s1: Iterable<T1>, s2: Iterable<T2>, s3: Iterable<T3>): Iterable<[T0, T1, T2, T3]>
export function product<T0, T1, T2, T3, T4>(s0: Iterable<T0>, s1: Iterable<T1>, s2: Iterable<T2>, s3: Iterable<T3>, s4: Iterable<T4>): Iterable<[T0, T1, T2, T3, T4]>
export function product<T0, T1, T2, T3, T4, T5>(s0: Iterable<T0>, s1: Iterable<T1>, s2: Iterable<T2>, s3: Iterable<T3>, s4: Iterable<T4>, s5: Iterable<T5>): Iterable<[T0, T1, T2, T3, T4, T5]>
export function product<T0, T1, T2, T3, T4, T5, T6>(s0: Iterable<T0>, s1: Iterable<T1>, s2: Iterable<T2>, s3: Iterable<T3>, s4: Iterable<T4>, s5: Iterable<T5>, s6: Iterable<T6>): Iterable<[T0, T1, T2, T3, T4, T5, T6]>
export function product<T0, T1, T2, T3, T4, T5, T6, T7>(s0: Iterable<T0>, s1: Iterable<T1>, s2: Iterable<T2>, s3: Iterable<T3>, s4: Iterable<T4>, s5: Iterable<T5>, s6: Iterable<T6>, s7: Iterable<T7>): Iterable<[T0, T1, T2, T3, T4, T5, T6, T7]>
export function product<T0, T1, T2, T3, T4, T5, T6, T7, T8>(s0: Iterable<T0>, s1: Iterable<T1>, s2: Iterable<T2>, s3: Iterable<T3>, s4: Iterable<T4>, s5: Iterable<T5>, s6: Iterable<T6>, s7: Iterable<T7>, s8: Iterable<T8>): Iterable<[T0, T1, T2, T3, T4, T5, T6, T7, T8]>
export function *product(...sources: Iterable<any>[]): Iterable<any[]> {
    if(sources.length == 1) {
        for(const t of sources[0]) {
            yield [t];
        }
    } else {
        const [first, ...restSources] = sources;
        for(const x of first) {
            // @ts-ignore
            for(const ys of product(...restSources)) {
                yield [x, ...ys];
            }
        }
    }
}
