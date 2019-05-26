import * as at from "../constants/ActionTypes";
import {
    ACTION_TYPE, CONDITION_TYPE,
    EMPTY_EDGE_TYPE, INPUT_TYPE,
    POLICY_TYPE,
    RESOURCE_TYPE, RULE_TYPE,
    SPECIAL_EDGE_TYPE,
    SUBJECT_TYPE,
    TARGET_TYPE, VALUE_TYPE
} from "../components/graph-config";
import {CONDITION_FUNCTION, INPUT, RULE_FUNCTION} from "../components/ChangeInput";
import {CHECK, CURRENT} from "../editor-actions";

const sample = {
    nodes: [
        {
            id: "policy1",
            title: "Car",
            combineAlg: "deny-unless-permit",
            type: "policy",
            x: 0,
            y: 0,
            child: {
                target: [
                    {
                        "id": "target1",
                        "title": "target",
                        "type": "target",
                        "x": -200,
                        "y": 0,
                        "child": {
                            "subject": [{
                                "id": "subject1",
                                "title": ["Son"],
                                "type": "subject",
                                "x": -400,
                                "y": 100,
                                "child": {}
                            }],
                            "resource": [{
                                "id": "resource1",
                                "title": [["car"]],
                                "type": "resource",
                                "x": -400,
                                "y": 0,
                                "child": {}
                            }],
                            "action": [{
                                "id": "action1",
                                "title": [["open"]],
                                "type": "action",
                                "x": -400,
                                "y": -100,
                                "child": {}
                            }]
                        }
                    }],
                "rule": [{
                    "id": "rule1",
                    "title": "time",
                    "type": "rule",
                    "effect": false,
                    "x": 2.3333911895751953,
                    "y": -178.60060119628906,
                    "function": "and",
                    "child": {
                        "condition": [{
                            "id": "condition1",
                            "title": ">",
                            "function": "greater",
                            "type": "condition",
                            "x": -96.83541107177734,
                            "y": -324.5204162597656,
                            "child": {
                                "value": [{
                                    "id": "value1",
                                    "title": "15:00",
                                    "subTitle": "time",
                                    "type": "value",
                                    "x": -57.16788864135742,
                                    "y": -435.02276611328125,
                                    "child": {}
                                }],
                                "input": [{
                                    "id": "input1",
                                    "title": "current_time",
                                    "type": "input",
                                    "x": -153.5032958984375,
                                    "y": -433.6060791015625,
                                    "child": {}
                                }]
                            }
                        }, {
                            "id": "condition2",
                            "title": "<",
                            "function": "less",
                            "type": "condition",
                            "x": 91.58531188964844,
                            "y": -327.3537902832031,
                            "child": {
                                "value": [{
                                    "id": "value2",
                                    "title": "20:00",
                                    "subTitle": "time",
                                    "type": "value",
                                    "x": 141.16970825195312,
                                    "y": -429.3559875488281,
                                    "child": {}
                                }],
                                "input": [{
                                    "id": "input2",
                                    "title": "current_time",
                                    "type": "input",
                                    "x": 47.66769790649414,
                                    "y": -432.18939208984375,
                                    "child": {}
                                }]
                            }
                        }]
                    }
                }, {
                    "id": "rule2",
                    "title": "rule",
                    "type": "rule",
                    "effect": true,
                    "x": 250,
                    "y": 0,
                    "child": {
                        "condition": [{
                            "id": "condition3",
                            "title": "==",
                            "function": "equal",
                            "type": "condition",
                            "x": 250,
                            "y": 150,
                            "child": {
                                "value": [{
                                    "id": "value3",
                                    "title": "Son",
                                    "subTitle": "string",
                                    "type": "value",
                                    "x": 300,
                                    "y": 300,
                                    "child": {}
                                }],
                                "input": [{
                                    "id": "input3",
                                    "title": "subject",
                                    "type": "input",
                                    "x": 200,
                                    "y": 300,
                                    "child": {}
                                }]
                            }
                        }]
                    }
                }, {
                    "id": "rule3",
                    "title": "assist",
                    "type": "rule",
                    "effect": true,
                    "x": -1.4600398540496826,
                    "y": 173.5009765625,
                    "child": {
                        "condition": [{
                            "id": "condition4",
                            "title": "==",
                            "function": "equal",
                            "type": "condition",
                            "x": -16.82066535949707,
                            "y": 309.8265380859375,
                            "child": {
                                "value": [{
                                    "id": "value4",
                                    "title": "Father",
                                    "subTitle": "string",
                                    "type": "value",
                                    "x": 36.94152069091797,
                                    "y": 438.4717712402344,
                                    "child": {}
                                }],
                                "input": [{
                                    "id": "input4",
                                    "title": "assist",
                                    "type": "input",
                                    "x": -86.90351104736328,
                                    "y": 438.4717712402344,
                                    "child": {}
                                }]
                            }
                        }]
                    }
                }]
            }
        }, {
            "id": "target1",
            "title": "target",
            "type": "target",
            "x": -200,
            "y": 0,
            "child": {
                "subject": [{
                    "id": "subject1",
                    "title": ["Son"],
                    "type": "subject",
                    "x": -400,
                    "y": 100,
                    "child": {}
                }],
                "resource": [{
                    "id": "resource1",
                    "title": [["car"]],
                    "type": "resource",
                    "x": -400,
                    "y": 0,
                    "child": {}
                }],
                "action": [{"id": "action1", "title": [["open"]], "type": "action", "x": -400, "y": -100, "child": {}}]
            }
        }, {"id": "subject1", "title": ["Son"], "type": "subject", "x": -400, "y": 100, "child": {}}, {
            "id": "resource1",
            "title": [["car"]],
            "type": "resource",
            "x": -400,
            "y": 0,
            "child": {}
        }, {"id": "action1", "title": [["open"]], "type": "action", "x": -400, "y": -100, "child": {}}, {
            "id": "rule1",
            "title": "time",
            "type": "rule",
            "effect": false,
            "x": 2.3333911895751953,
            "y": -178.60060119628906,
            "function": "and",
            "child": {
                "condition": [{
                    "id": "condition1",
                    "title": ">",
                    "function": "greater",
                    "type": "condition",
                    "x": -96.83541107177734,
                    "y": -324.5204162597656,
                    "child": {
                        "value": [{
                            "id": "value1",
                            "title": "15:00",
                            "subTitle": "time",
                            "type": "value",
                            "x": -57.16788864135742,
                            "y": -435.02276611328125,
                            "child": {}
                        }],
                        "input": [{
                            "id": "input1",
                            "title": "current_time",
                            "type": "input",
                            "x": -153.5032958984375,
                            "y": -433.6060791015625,
                            "child": {}
                        }]
                    }
                }, {
                    "id": "condition2",
                    "title": "<",
                    "function": "less",
                    "type": "condition",
                    "x": 91.58531188964844,
                    "y": -327.3537902832031,
                    "child": {
                        "value": [{
                            "id": "value2",
                            "title": "20:00",
                            "subTitle": "time",
                            "type": "value",
                            "x": 141.16970825195312,
                            "y": -429.3559875488281,
                            "child": {}
                        }],
                        "input": [{
                            "id": "input2",
                            "title": "current_time",
                            "type": "input",
                            "x": 47.66769790649414,
                            "y": -432.18939208984375,
                            "child": {}
                        }]
                    }
                }]
            }
        }, {
            "id": "condition1",
            "title": ">",
            "function": "greater",
            "type": "condition",
            "x": -96.83541107177734,
            "y": -324.5204162597656,
            "child": {
                "value": [{
                    "id": "value1",
                    "title": "15:00",
                    "subTitle": "time",
                    "type": "value",
                    "x": -57.16788864135742,
                    "y": -435.02276611328125,
                    "child": {}
                }],
                "input": [{
                    "id": "input1",
                    "title": "current_time",
                    "type": "input",
                    "x": -153.5032958984375,
                    "y": -433.6060791015625,
                    "child": {}
                }]
            }
        }, {
            "id": "value1",
            "title": "15:00",
            "subTitle": "time",
            "type": "value",
            "x": -57.16788864135742,
            "y": -435.02276611328125,
            "child": {}
        }, {
            "id": "input1",
            "title": "current_time",
            "type": "input",
            "x": -153.5032958984375,
            "y": -433.6060791015625,
            "child": {}
        }, {
            "id": "condition2",
            "title": "<",
            "function": "less",
            "type": "condition",
            "x": 91.58531188964844,
            "y": -327.3537902832031,
            "child": {
                "value": [{
                    "id": "value2",
                    "title": "20:00",
                    "subTitle": "time",
                    "type": "value",
                    "x": 141.16970825195312,
                    "y": -429.3559875488281,
                    "child": {}
                }],
                "input": [{
                    "id": "input2",
                    "title": "current_time",
                    "type": "input",
                    "x": 47.66769790649414,
                    "y": -432.18939208984375,
                    "child": {}
                }]
            }
        }, {
            "id": "value2",
            "title": "20:00",
            "subTitle": "time",
            "type": "value",
            "x": 141.16970825195312,
            "y": -429.3559875488281,
            "child": {}
        }, {
            "id": "input2",
            "title": "current_time",
            "type": "input",
            "x": 47.66769790649414,
            "y": -432.18939208984375,
            "child": {}
        }, {
            "id": "rule2",
            "title": "rule",
            "type": "rule",
            "effect": true,
            "x": 250,
            "y": 0,
            "child": {
                "condition": [{
                    "id": "condition3",
                    "title": "==",
                    "function": "equal",
                    "type": "condition",
                    "x": 250,
                    "y": 150,
                    "child": {
                        "value": [{
                            "id": "value3",
                            "title": "Son",
                            "subTitle": "string",
                            "type": "value",
                            "x": 300,
                            "y": 300,
                            "child": {}
                        }],
                        "input": [{
                            "id": "input3",
                            "title": "subject",
                            "type": "input",
                            "x": 200,
                            "y": 300,
                            "child": {}
                        }]
                    }
                }]
            }
        }, {
            "id": "condition3",
            "title": "==",
            "function": "equal",
            "type": "condition",
            "x": 250,
            "y": 150,
            "child": {
                "value": [{
                    "id": "value3",
                    "title": "Son",
                    "subTitle": "string",
                    "type": "value",
                    "x": 300,
                    "y": 300,
                    "child": {}
                }], "input": [{"id": "input3", "title": "subject", "type": "input", "x": 200, "y": 300, "child": {}}]
            }
        }, {
            "id": "value3",
            "title": "Son",
            "subTitle": "string",
            "type": "value",
            "x": 300,
            "y": 300,
            "child": {}
        }, {"id": "input3", "title": "subject", "type": "input", "x": 200, "y": 300, "child": {}}, {
            "id": "rule3",
            "title": "assist",
            "type": "rule",
            "effect": true,
            "x": -1.4600398540496826,
            "y": 173.5009765625,
            "child": {
                "condition": [{
                    "id": "condition4",
                    "title": "==",
                    "function": "equal",
                    "type": "condition",
                    "x": -16.82066535949707,
                    "y": 309.8265380859375,
                    "child": {
                        "value": [{
                            "id": "value4",
                            "title": "Father",
                            "subTitle": "string",
                            "type": "value",
                            "x": 36.94152069091797,
                            "y": 438.4717712402344,
                            "child": {}
                        }],
                        "input": [{
                            "id": "input4",
                            "title": "assist",
                            "type": "input",
                            "x": -86.90351104736328,
                            "y": 438.4717712402344,
                            "child": {}
                        }]
                    }
                }]
            }
        }, {
            "id": "condition4",
            "title": "==",
            "function": "equal",
            "type": "condition",
            "x": -16.82066535949707,
            "y": 309.8265380859375,
            "child": {
                "value": [{
                    "id": "value4",
                    "title": "Father",
                    "subTitle": "string",
                    "type": "value",
                    "x": 36.94152069091797,
                    "y": 438.4717712402344,
                    "child": {}
                }],
                "input": [{
                    "id": "input4",
                    "title": "assist",
                    "type": "input",
                    "x": -86.90351104736328,
                    "y": 438.4717712402344,
                    "child": {}
                }]
            }
        }, {
            "id": "value4",
            "title": "Father",
            "subTitle": "string",
            "type": "value",
            "x": 36.94152069091797,
            "y": 438.4717712402344,
            "child": {}
        }, {
            "id": "input4",
            "title": "assist",
            "type": "input",
            "x": -86.90351104736328,
            "y": 438.4717712402344,
            "child": {}
        }], "edges":
        [{"source": "policy1", "target": "target1", "type": "specialEdge"}, {
            "source": "target1",
            "target": "subject1",
            "type": "emptyEdge"
        }, {"source": "target1", "target": "resource1", "type": "emptyEdge"}, {
            "source": "target1",
            "target": "action1",
            "type": "emptyEdge"
        }, {"source": "policy1", "target": "rule1", "type": "specialEdge"}, {
            "source": "rule1",
            "target": "condition1",
            "type": "emptyEdge"
        }, {"source": "rule1", "target": "condition2", "type": "emptyEdge"}, {
            "source": "condition1",
            "target": "value1",
            "type": "emptyEdge"
        }, {"source": "condition1", "target": "input1", "type": "emptyEdge"}, {
            "source": "condition2",
            "target": "value2",
            "type": "emptyEdge"
        }, {"source": "condition2", "target": "input2", "type": "emptyEdge"}, {
            "source": "policy1",
            "target": "rule2",
            "type": "specialEdge"
        }, {"source": "rule2", "target": "condition3", "type": "emptyEdge"}, {
            "source": "condition3",
            "target": "value3",
            "type": "emptyEdge"
        }, {"source": "condition3", "target": "input3", "type": "emptyEdge"}, {
            "source": "policy1",
            "target": "rule3",
            "type": "specialEdge"
        }, {"source": "rule3", "target": "condition4", "type": "emptyEdge"}, {
            "source": "condition4",
            "target": "value4",
            "type": "emptyEdge"
        }, {"source": "condition4", "target": "input4", "type": "emptyEdge"}]
};

const sample2 = {
    nodes: [
        {
            id: "policy1",
            title: "car",
            combineAlg: "deny-unless-permit",
            type: "policy",
            x: 0,
            y: 0,
        },
        {
            "id": "target1",
            "title": "target",
            "type": "target",
            "x": -200,
            "y": 0,
        },
        {
            "id": "subject1",
            "title": ["son"],
            "type": "subject",
            "x": -400,
            "y": 100,
        },
        {
            "id": "resource1",
            "title": [["car"]],
            "type": "resource",
            "x": -400,
            "y": 0,
            "child": {}
        },
        {
            "id": "action1",
            "title": [["open"]],
            "type": "action",
            "x": -400,
            "y": -100,
        },
        {
            "id": "rule1",
            "title": "time",
            "type": "rule",
            "effect": false,
            "x": 250,
            "y": 0,
            "function": "and",
        }, {
            "id": "condition1",
            "title": "=",
            "function": "equal",
            "type": "condition",
            "x": 250,
            "y": 150,
        },
        {
            "id": "value1",
            "title": "father",
            "subTitle": "string",
            "type": "value",
            "x": 350,
            "y": 250,
        },
        {
            "id": "input1",
            "title": "assist",
            "type": "input",
            "x": 150,
            "y": 250,
        },
    ],
    "edges":
        [
            {
                "source": "policy1",
                "target": "target1",
                "type": "specialEdge"
            },
            {
                "source": "target1",
                "target": "subject1",
                "type": "emptyEdge"
            },
            {
                "source": "target1",
                "target": "resource1",
                "type": "emptyEdge"
            },
            {
                "source": "target1",
                "target": "action1",
                "type": "emptyEdge"
            },
            {
                "source": "policy1",
                "target": "rule1",
                "type": "specialEdge"
            },
            {
                "source": "rule1",
                "target": "condition1",
                "type": "emptyEdge"
            },
            {
                "source": "condition1",
                "target": "value1",
                "type": "emptyEdge"
            },
            {
                "source": "condition1",
                "target": "input1",
                "type": "emptyEdge"
            },
        ]
};

const defaultState = {
    graph: sample,
    copiedNode: null,
    layoutEngineType: undefined,
    selected: null,
    totalNodes: sample.nodes.length,
    originGraph: sample,
    state: CURRENT,
    nodeType: INPUT,
    nodeValue: undefined,
    isShow: false,

    policyCount: 1,
    targetCount: 1,
    subjectCount: 1,
    resourceCount: 1,
    actionCount: 1,
    ruleCount: 1,
    conditionCount: 2,
    valueCount: 2,
    inputCount: 2,

    originPolicyCount: 0,
    originTargetCount: 0,
    originSubjectCount: 0,
    originResourceCount: 0,
    originActionCount: 0,
    originRuleCount: 0,
    originConditionCount: 0,
    originInputCount: 0,
    originValueCount: 0
};

export default function (state = defaultState, action) {
    switch (action.type) {
        case at.CREATE_POLICY:
            console.log("--", action);
            return state;

        case at.MAKE_IT_LARGE:
            return {
                ...state,
                graph: action.graph
            };
        case at.UPDATE_NODE:
            console.debug("--", action);
            return {
                ...state,
                graph: action.graph,
                nodeValue: action.value
            };
        case at.RULE_SELECTED:
            console.log("--", action);
            return {
                ...state,
                ruleEffect: action.ruleEffect,
                nodeType: action.nodeType,
                nodeValue: action.nodeValue,
                selected: action.selected
            };
        case at.CONDITION_SELECTED:
            console.log("--", action);
            return {
                ...state,
                nodeType: action.nodeType,
                nodeValue: action.nodeValue,
                selected: action.selected
            };
        case at.NODE_SELECTED:
            console.log("--", action);
            return {
                ...state,
                nodeType: action.nodeType,
                selected: action.selected
            };
        case at.CHANGE_TEXT:
            return {
                ...state,
                graph: action.graph,
                nodeValue: action.nodeValue
            };
        case at.EDGE_SELECTED:
            return {
                ...state,
                selected: action.selected
            };
        case at.CREATE_NODE:
            return {
                ...state,
                node: action.node
            };
        case at.DELETE_NODE:
            return {
                ...state,
                graph: action.graph,
                selected: action.selected
            };
        case at.CREATE_EDGE:
            return {
                ...state,
                graph: action.graph,
                selected: action.selected
            };
        case at.SWAP_EDGE:
            return {
                ...state,
                graph: action.graph,
                selected: action.selected
            };
        case at.DELETE_EDGE:
            return {
                ...state,
                graph: action.graph,
                selected: action.selected
            };
        case at.COPY_SELECTED:
            return {
                ...state,
                copiedNode: action.copiedNode
            };
        case at.CHANGE_COMBINE_ALG:
            return {
                ...state,
                graph: action.graph
            };
        case at.ADD_POLICY_NODE:
            return {
                ...state,
                graph: action.graph,
                policyCount: action.policyCount
            };
        case at.ADD_TARGET_NODE:
            return {
                ...state,
                graph: action.graph,
                targetCount: action.targetCount
            };
        case at.ADD_SUBJECT_NODE:
            return {
                ...state,
                graph: action.graph,
                subjectCount: action.subjectCount
            };
        case at.ADD_RESOURCE_NODE:
            return {
                ...state,
                graph: action.graph,
                resourceCount: action.resourceCount
            };
        case at.ADD_ACTION_NODE:
            return {
                ...state,
                graph: action.graph,
                actionCount: action.actionCount
            };
        case at.ADD_RULE_NODE:
            return {
                ...state,
                graph: action.graph,
                ruleCount: action.ruleCount
            };
        case at.ADD_CONDITION_NODE:
            return {
                ...state,
                graph: action.graph,
                conditionCount: action.conditionCount
            };
        case at.ADD_VALUE_NODE:
            return {
                ...state,
                graph: action.graph,
                valueCount: action.valueCount
            };
        case at.ADD_INPUT_NODE:
            return {
                ...state,
                graph: action.graph,
                inputCount: action.inputCount
            };
        case at.CHANGE_RULE_EFFECT:
            return {
                ...state,
                graph: action.graph,
                ruleEffect: action.ruleEffect
            };
        case at.CHANGE_ORIGIN_GRAPH:
            return {
                ...state,
                graph: action.graph,
                state: action.state,
                policyCount: action.policyCount,
                targetCount: action.targetCount,
                resourceCount: action.resourceCount,
                actionCount: action.actionCount,
                ruleCount: action.ruleCount,
                conditionCount: action.conditionCount,
                valueCount: action.valueCount,
                inputCount: action.inputCount
            };
        case at.CHANGE_RULE_FUNCTION:
            return {
                ...state,
                graph: action.graph,
                nodeValue: action.nodeValue
            };
        case at.REQUST_POLICY_ADVICE:
            console.debug("--", action);
            return {
                ...state,
                originGraph: action.originGraph,
                graph: action.graph,
                state: action.state,
                originPolicyCount: action.originPolicyCount,
                originTargetCount: action.originTargetCount,
                originSubjectCount: action.originSubjectCount,
                originResourceCount: action.originResourceCount,
                originActionCount: action.originActionCount,
                originRuleCount: action.originRuleCount,
                originConditionCount: action.originConditionCount,
                originInputCount: action.originInputCount,
                originValueCount: action.originValueCount,
                policyCount: action.policyCount,
                targetCount: action.targetCount,
                resourceCount: action.resourceCount,
                actionCount: action.actionCount,
                ruleCount: action.ruleCount,
                conditionCount: action.conditionCount,
                valueCount: action.valueCount,
                inputCount: action.inputCount
            };
        default:
            return state;
    }
};
