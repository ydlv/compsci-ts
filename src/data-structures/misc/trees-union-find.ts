import { UnionFind } from './union-find.interface'

export interface TreesUnionFindNode<T> {
  data: T
  parent: TreesUnionFindNode<T>

  /**
   * Do not confuse this for the size of the set.
   * It is an *estimation* of the *depth of a subtree*.
   */
  rank: number
}

export class TreesUnionFind<T> implements UnionFind<T, TreesUnionFindNode<T>> {
  makeSet(x: T): TreesUnionFindNode<T> {
    // @ts-expect-error
    const ret: TreesUnionFindNode<T> = {
      data: x,
      rank: 0
    }
    ret.parent = ret
    return ret
  }

  find(x: TreesUnionFindNode<T>): TreesUnionFindNode<T> {
    if (x.parent !== x) {
      x.parent = this.find(x.parent)
    }
    return x.parent
  }

  union(x: TreesUnionFindNode<T>, y: TreesUnionFindNode<T>): void {
    const rootX = this.find(x)
    const rootY = this.find(y)

    if (rootX == rootY) {
      return // no action needed
    }

    if (rootX.rank < rootY.rank) {
      rootX.parent = rootY
    } else if (rootX.rank > rootY.rank) {
      rootY.parent = rootX
    } else {
      rootY.parent = rootX
      rootX.rank++
    }
  }

  areSameSet(x: TreesUnionFindNode<T>, y: TreesUnionFindNode<T>): boolean {
    return this.find(x) === this.find(y)
  }
}
