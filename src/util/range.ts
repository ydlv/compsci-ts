export function range(n: number, lazy: {lazy: true}): Iterable<number>
export function range(n: number, lazy?: {lazy: false}): number[] 
export function range(n: number, lazy?: {lazy: boolean}) {
    if(lazy?.lazy) {
        return lazyRange(n);
    }
    return Array(n).fill(true).map((_, i) => i);
}

function *lazyRange(n: number) {
    for(let i = 0; i < n; i++) {
        yield i;
    }
}