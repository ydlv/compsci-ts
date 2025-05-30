import { DAGLightestPathsTree } from '../../../../src/algorithms/graph/lightest-paths/dag-lightest-paths';
import { weighedDAGExample } from '../../../examples/graphs';

describe("DAGLightestPathsTree", () => {
    it("works on a DAG", () => {
        const g = weighedDAGExample();
        const tree = DAGLightestPathsTree(g, "S", w => w.weight);
        expect(tree.get("S")!).toEqual(["S", 0]);

        expect(tree.get("A")!).toEqual(["D", 13]);
        expect(tree.get("B")!).toEqual(["C", 6]);
        expect(tree.get("C")!).toEqual(["D", 1]);
        expect(tree.get("D")!).toEqual(["S", 3]);
    });
})