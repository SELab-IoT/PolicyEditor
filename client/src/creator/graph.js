import {POLICY_TYPE} from "../components/graph-config";

function createPolicyNode(title, combineAlg, x, y, policyCount) {
    policyCount++;
    return {
        id: 'policy' + policyCount,
        title: title,
        combineAlg: combineAlg,
        type: POLICY_TYPE,
        x: x,
        y: y
    }
}
