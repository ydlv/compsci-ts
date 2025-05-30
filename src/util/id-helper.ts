import { NoSuchElementError } from "../errors/no-such-element.error";
import { DeepMap } from 'deep-equality-data-structures';

export interface IdHelper<T, TId extends number | string = string> {
    getId(x: T): TId;
    fromId(id: TId): T;
    contains(x: T): boolean;
    readonly size: number;
}

const sentinel = Symbol("sentinel");

export class ReferenceIdHelper<T, TId extends number | string = string> implements IdHelper<T, TId> {
    private readonly id2obj: T[];
    private readonly obj2id: Map<T, TId>;
    private readonly isString: TId extends string ? true : false;
    private readonly prefix?: string;

    constructor(type: StringConstructor, prefix?: string)
    constructor(type: NumberConstructor)
    constructor(type: StringConstructor | NumberConstructor = String, prefix?: string) {
        this.id2obj = [sentinel as T];
        this.obj2id = new Map();
        this.isString = (type === String) as any;
        this.prefix = prefix;
    }

    getId(x: T): TId {
        if(!this.contains(x)) {
            const len = this.id2obj.length;
            this.id2obj.push(x);
            let id: TId = (this.isString ? len.toString() : len) as any;
            if(this.prefix) {
                id = (this.prefix + id) as TId;
            }
            this.obj2id.set(x, id);
            return id;
        }
        return this.obj2id.get(x)!;
    }

    fromId(id: TId): T {
        if(this.prefix) {
            if(typeof(id) === "string" && id.startsWith(this.prefix)) {
                id = (id.substring(this.prefix.length)) as TId;
            }
        }
        const i = +id;
        if(i <= 0) {
            throw "id can't be <= 0 but was " + id; 
        }
        if(i < this.size) {
            throw new NoSuchElementError("No element with id " +id);
        }
        return this.id2obj[i]!;
    }

    get size(): number {
        return this.id2obj.length - 1;
    }

    contains(x: T) {
        return this.obj2id.has(x);
    }
}


export class DeepIdHelper<T, TId extends string | number = string> implements IdHelper<T, TId> {
     private readonly id2obj: T[];
    private readonly obj2id: DeepMap<T, TId>;
    private readonly isString: TId extends string ? true : false;
    private readonly prefix?: string;

    constructor(type: StringConstructor, prefix?: string)
    constructor(type: NumberConstructor)
    constructor(type: StringConstructor | NumberConstructor = String, prefix?: string) {
        this.id2obj = [sentinel as T];
        this.obj2id = new DeepMap();
        this.isString = (type === String) as any;
        this.prefix = prefix;
    }

    getId(x: T): TId {
        if(!this.contains(x)) {
            const len = this.id2obj.length;
            this.id2obj.push(x);
            let id: TId = (this.isString ? len.toString() : len) as any;
            if(this.prefix) {
                id = (this.prefix + id) as TId;
            }
            this.obj2id.set(x, id);
            return id;
        }
        return this.obj2id.get(x)!;
    }

    fromId(id: TId): T {
        if(this.prefix) {
            if(typeof(id) === "string" && id.startsWith(this.prefix)) {
                id = (id.substring(this.prefix.length)) as TId;
            }
        }
        const i = +id;
        if(i <= 0) {
            throw "id can't be <= 0 but was " + id; 
        }
        if(i > this.size) {
            throw new NoSuchElementError("No element with id " +id);
        }
        return this.id2obj[i]!;
    }

    get size(): number {
        return this.id2obj.length - 1;
    }

    contains(x: T) {
        return this.obj2id.has(x);
    }
}

