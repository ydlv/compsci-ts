import { NoSuchElementError } from "../errors/no-such-element.error";
import { EqualityType, map } from "./equality-type";


const sentinel = Symbol("sentinel");

export class IdHelper<T, TId extends string | number = string> implements IdHelper<T, TId> {
     private readonly id2obj: T[];
    private readonly obj2id: Map<T, TId>;
    private readonly isString: TId extends string ? true : false;
    private readonly prefix?: string;

    constructor(type: StringConstructor, options: {prefix?: string, equalityType: EqualityType})
    constructor(type: NumberConstructor, options: {equalityType: EqualityType})
    constructor(type: StringConstructor | NumberConstructor = String,
         {prefix, equalityType}: {prefix?: string, equalityType: EqualityType}) {
        this.id2obj = [sentinel as T];
        this.obj2id = map(equalityType);
        this.isString = (type  ===  String) as any;
        this.prefix = prefix;
    }

    get size(): number {
        return this.obj2id.size;
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
            if(typeof(id)  ===  "string" && id.startsWith(this.prefix)) {
                id = (id.substring(this.prefix.length)) as TId;
            }
        }
        const i = +id;
        if(i <= 0) {
            throw new Error("id can't be <= 0 but was " + id); 
        }
        if(i > this.size) {
            throw new NoSuchElementError("No element with id " +id);
        }
        return this.id2obj[i]!;
    }

    contains(x: T) {
        return this.obj2id.has(x);
    }
}

