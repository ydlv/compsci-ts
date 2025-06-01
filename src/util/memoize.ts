import { DeepMap } from 'deep-equality-data-structures';

export function memoize<T extends (..._args: any[]) => any>(fn: T): T {
    const cache: DeepMap<Parameters<T>[], ReturnType<T>> = new DeepMap();
    const memoized: T = ((...args: any[]): any => {
        if(cache.has(args)) {
            return cache.get(args)!;
        }
        const result = fn(...args);
        cache.set(args, result);
        return result;
    }) as T;
    return memoized;
}