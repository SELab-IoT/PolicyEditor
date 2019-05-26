import {
    ACTION_TYPE,
    CONDITION_TYPE,
    edgeTypes, EMPTY_EDGE_TYPE, INPUT_TYPE,
    NODE_KEY,
    nodeTypes, POLICY_TYPE, RESOURCE_TYPE,
    RULE_TYPE, SPECIAL_EDGE_TYPE,
    SUBJECT_TYPE, TARGET_TYPE,
    VALUE_TYPE
} from "./components/graph-config";
import * as at from "./constants/ActionTypes";
import {CONDITION_FUNCTION, INPUT, RULE_FUNCTION} from "./components/ChangeInput";
import axios from "axios";
import fileDownload from "js-file-download";

export const CURRENT = 0;
export const CHECK = 1;


function generateSample(totalNodes) {
    const generatedSample = {
        edges: [],
        nodes: []
    };
    let y = 0;
    let x = 0;

    const numNodes = totalNodes ? totalNodes : 0;
    // generate large array of nodes
    // These loops are fast enough. 1000 nodes = .45ms + .34ms
    // 2000 nodes = .86ms + .68ms
    // implying a linear relationship with number of nodes.
    for (let i = 1; i <= numNodes; i++) {
        if (i % 20 === 0) {
            y++;
            x = 0;
        } else {
            x++;
        }
        generatedSample.nodes.push({
            id: `a${i}`,
            title: `Node ${i}`,
            type: nodeTypes[Math.floor(nodeTypes.length * Math.random())],
            x: 0 + 200 * x,
            y: 0 + 200 * y
        });
    }
    // link each node to another node
    for (let i = 1; i < numNodes; i++) {
        generatedSample.edges.push({
            source: `a${i}`,
            target: `a${i + 1}`,
            type: edgeTypes[Math.floor(edgeTypes.length * Math.random())]
        });
    }
    return generatedSample;
}

function getNodeIndex(graph, searchNode) {
    return graph.nodes.findIndex((node) => {
        return node[NODE_KEY] === searchNode[NODE_KEY];
    });
}

function getNodeIndexById(graph, id) {
    return graph.nodes.findIndex((node) => {
        return node[NODE_KEY] === id;
    });
}

// Helper to find the index of a given edge
function getEdgeIndex(graph, searchEdge) {
    return graph.edges.findIndex((edge) => {
        return edge.source === searchEdge.source && edge.target === searchEdge.target;
    });
}

function getEdgeIndexBySourceId(graph, id) {
    let result = []
    const edges = graph.edges
    for (let i = 0; i < edges.length; i++) {
        if (edges[i].source === id)
            result.push(i)
    }
    return result
}

// Given a nodeKey, return the corresponding node
function getViewNode(graph, nodeKey) {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = getNodeIndex(graph, searchNode);
    return graph.nodes[i];
}

export function makeItLarge(graph, totalNodes) {
    return dispatch => {
        const generatedSample = generateSample(totalNodes);
        graph.nodes = generatedSample.nodes;
        graph.edges = generatedSample.edges;
        dispatch({
            type: at.MAKE_IT_LARGE,
            graph
        })
    }
}

export function onUpdateNode(graph, viewNode, value) {
    return dispatch => {
        console.log('on update node')
        const i = getNodeIndex(graph, viewNode);
        graph.nodes[i] = viewNode;
        dispatch({
            type: at.UPDATE_NODE,
            graph,
            nodeValue: value
        })
    }
}

export function onSelectNode(viewNode) {
    return dispatch => {
        console.log('on select node')
        console.log(viewNode)
        // Deselect events will send Null viewNode
        if (viewNode !== null && viewNode.type === RULE_TYPE) {
            dispatch({
                type: at.RULE_SELECTED,
                ruleEffect: viewNode.effect, nodeType: RULE_FUNCTION, nodeValue: viewNode.function, selected: viewNode
            })
        } else if (viewNode !== null && viewNode.type === CONDITION_TYPE) {
            dispatch({
                type: at.CONDITION_SELECTED,
                nodeType: CONDITION_FUNCTION, nodeValue: viewNode.title, selected: viewNode
            })
        } else {
            dispatch({
                type: at.NODE_SELECTED,
                nodeType: INPUT, selected: viewNode
            })
        }
    }
}

export function onChangeText(graph, selected, value, GraphView) {
    return dispatch => {
        if (selected === null) return;
        const g = getNodeIndex(graph, selected);
        graph.nodes[g].title = value;

        if (selected.type === VALUE_TYPE) {
            if (value.match(/\d+:\d+/)) {
                graph.nodes[g].subTitle = 'time';
            } else if (value.match(/\d+/)) {
                graph.nodes[g].subTitle = 'integer';
            } else {
                graph.nodes[g].subTitle = 'string';
            }
        }
        dispatch({
            type: at.CHANGE_TEXT,
            graph,
            nodeValue: value
        })
        GraphView.asyncRenderNode(graph.nodes[g]);
    }
}

export function onChangeConditionFunction(graph, selected, value, GraphView) {
    return dispatch => {
        if (selected === null) return;
        const g = getNodeIndex(graph, selected);
        graph.nodes[g].function = value;
        switch (value) {
            case "equal":
                graph.nodes[g].title = "==";
                break;
            case "less":
                graph.nodes[g].title = "<";
                break;
            case "greater":
                graph.nodes[g].title = ">";
                break;
        }

        dispatch({
            type: at.CHANGE_TEXT,
            graph,
            nodeValue: value
        });

        GraphView.asyncRenderNode(graph.nodes[g]);
    }
}

export function onSelectEdge(viewEdge) {
    return dispatch => {
        dispatch({
            type: at.EDGE_SELECTED,
            selected: viewEdge
        })
    }
}

export function onCreateNode(x, y) {
    return dispatch => {
        // This is just an example - any sort of logic
        // could be used here to determine node type
        // There is also support for subtypes. (see 'sample' above)
        // The subtype geometry will underlay the 'type' geometry for a node
        const type = SUBJECT_TYPE;

        const viewNode = {
            id: Date.now(),
            title: '',
            type,
            x,
            y
        };

        dispatch({
            type: at.CREATE_NODE,
            node: viewNode
        })
    }
}

export function onDeleteNode(graph, viewNode, nodeId, nodeArr) {
    return dispatch => {
        console.log("on delete node")
        // Delete any connected edges
        const newEdges = graph.edges.filter((edge, i) => {
            return edge.source !== viewNode[NODE_KEY] && edge.target !== viewNode[NODE_KEY];
        });
        graph.nodes = nodeArr;
        graph.edges = newEdges;
        dispatch({
            type: at.DELETE_NODE,
            graph,
            selected: null
        })
    }
}

export function onCreateEdge(graph, sourceViewNode, targetViewNode) {
    console.debug(graph, sourceViewNode, targetViewNode)
    return dispatch => {
        // This is just an example - any sort of logic
        // could be used here to determine edge type
        const type = sourceViewNode.type === POLICY_TYPE ? SPECIAL_EDGE_TYPE : EMPTY_EDGE_TYPE;

        const viewEdge = {
            source: sourceViewNode[NODE_KEY],
            target: targetViewNode[NODE_KEY],
            type
        };

        // Only add the edge when the source node is not the same as the target
        if (viewEdge.source !== viewEdge.target) {
            graph.edges = [...graph.edges, viewEdge];
            dispatch({
                type: at.CREATE_EDGE,
                graph,
                selected: viewEdge
            })
        }
    }
}

export function onSwapEdge(graph, sourceViewNode, targetViewNode, viewEdge) {
    return dispatch => {
        const i = getEdgeIndex(graph, viewEdge);
        const edge = JSON.parse(JSON.stringify(graph.edges[i]));

        edge.source = sourceViewNode[NODE_KEY];
        edge.target = targetViewNode[NODE_KEY];
        graph.edges[i] = edge;
        // reassign the array reference if you want the graph to re-render a swapped edge
        graph.edges = [...graph.edges];

        dispatch({
            type: at.SWAP_EDGE,
            graph,
            selected: edge
        });
    }
}

export function onDeleteEdge(graph, viewEdge, edges) {
    return dispatch => {
        graph.edges = edges;
        dispatch({
            type: at.DELETE_EDGE,
            graph,
            selected: null
        });
    }
}

export function onCopySelected(selected) {
    return dispatch => {
        if (selected.source) {
            console.warn('Cannot copy selected edges, try selecting a node instead.');
            return;
        }
        const x = selected.x + 10;
        const y = selected.y + 10;
        dispatch({
            type: at.COPY_SELECTED,
            copiedNode: {...selected, x, y}
        });
    }
}

export function handleChangeCombineAlg(graph, selected, event, GraphView) {
    console.debug(graph, selected, event, GraphView);
    return dispatch => {
        if (selected.type === POLICY_TYPE) {
            const i = getNodeIndex(graph, selected);
            graph.nodes[i].combineAlg = event.target.value;
            dispatch({
                type: at.CHANGE_COMBINE_ALG,
                graph
            })
            GraphView.asyncRenderNode(graph.nodes[i]);
        }
    }
}

export function addPolicyNode(graph, policyCount) {
    return dispatch => {
        console.log("add policy node");
        // using a new array like this creates a new memory reference
        // this will force a re-render
        policyCount++;
        console.debug(graph.nodes)
        graph.nodes = [
            {
                id: 'policy' + policyCount,
                title: 'policy',
                combineAlg: 'permit-unless-deny',
                type: POLICY_TYPE,
                x: 0,
                y: 0
            },
            ...graph.nodes
        ];
        dispatch({
            type: at.ADD_POLICY_NODE,
            graph,
            policyCount
        });
    }
}

export function addTargetNode(graph, targetCount) {
    return dispatch => {
        targetCount++;
        graph.nodes = [
            {
                id: 'target' + targetCount,
                title: 'target',
                type: TARGET_TYPE,
                x: 0,
                y: 0
            },
            ...graph.nodes
        ];
        dispatch({
            type: at.ADD_TARGET_NODE,
            graph,
            targetCount
        });
    }
}

export function addSubjectNode(graph, subjectCount) {
    return dispatch => {
        subjectCount++;
        graph.nodes = [
            {
                id: 'subject' + subjectCount,
                title: 'subject',
                type: SUBJECT_TYPE,
                x: 0,
                y: 0
            },
            ...graph.nodes
        ];
        dispatch({
            type: at.ADD_SUBJECT_NODE,
            graph,
            subjectCount
        });
    }
}

export function addResourceNode(graph, resourceCount) {
    return dispatch => {
        resourceCount++;
        graph.nodes = [
            {
                id: 'resource' + resourceCount,
                title: 'resource',
                type: RESOURCE_TYPE,
                x: 0,
                y: 0
            },
            ...graph.nodes
        ];
        dispatch({
            type: at.ADD_RESOURCE_NODE,
            graph,
            resourceCount
        });
    }
}

export function addActionNode(graph, actionCount) {
    return dispatch => {
        actionCount++;
        graph.nodes = [
            {
                id: 'action' + actionCount,
                title: 'action',
                type: ACTION_TYPE,
                x: 0,
                y: 0
            },
            ...graph.nodes
        ];
        dispatch({
            type: at.ADD_ACTION_NODE,
            graph,
            actionCount
        });
    }
}

export function addRuleNode(graph, ruleCount) {
    return dispatch => {
        ruleCount++;
        graph.nodes = [
            {
                id: 'rule' + ruleCount,
                title: 'rule',
                type: RULE_TYPE,
                x: 0,
                y: 0
            },
            ...graph.nodes
        ];
        dispatch({
            type: at.ADD_RULE_NODE,
            graph,
            ruleCount
        });
    }
}

export function addConditionNode(graph, conditionCount) {
    return dispatch => {
        console.debug(conditionCount)
        conditionCount++;
        graph.nodes = [
            {
                id: 'condition' + conditionCount,
                title: 'condition',
                type: CONDITION_TYPE,
                x: 0,
                y: 0
            },
            ...graph.nodes
        ];
        dispatch({
            type: at.ADD_CONDITION_NODE,
            graph,
            conditionCount
        });
    }
}

export function addValueNode(graph, valueCount) {
    return dispatch => {
        valueCount++;
        graph.nodes = [
            {
                id: 'value' + valueCount,
                title: 'value',
                type: VALUE_TYPE,
                x: 0,
                y: 0
            },
            ...graph.nodes
        ];
        dispatch({
            type: at.ADD_VALUE_NODE,
            graph,
            valueCount
        });
    }
}

export function addInputNode(graph, inputCount) {
    return dispatch => {
        inputCount++;
        graph.nodes = [
            {
                id: 'input' + inputCount,
                title: 'input',
                type: INPUT_TYPE,
                x: 0,
                y: 0
            },
            ...graph.nodes
        ];
        dispatch({
            type: at.ADD_INPUT_NODE,
            graph,
            inputCount
        });
    }
}

export function onRuleEffectChange(graph, selected, event, GraphView) {
    console.debug(graph, selected, event, GraphView)
    return dispatch => {
        const node = selected;
        if (node != null && node.type === RULE_TYPE) {
            const i = getNodeIndex(graph, node);
            graph.nodes[i].effect = event.target.value === "true";
            dispatch({
                type: at.CHANGE_RULE_EFFECT,
                graph,
                ruleEffect: graph.nodes[i].effect
            });

            GraphView.asyncRenderNode(graph.nodes[i])
        }
    }
}


export function onChangeOriginState(originGraph, originPolicyCount, originTargetCount, originSubjectCount, originResourceCount, originActionCount, originRuleCount, originConditionCount, originInputCount, originValueCount) {
    return dispatch => {
        console.debug(originPolicyCount, originTargetCount, originSubjectCount, originResourceCount, originActionCount, originRuleCount, originConditionCount, originInputCount, originValueCount)
        dispatch({
            type: at.CHANGE_ORIGIN_GRAPH,
            graph: originGraph,
            policyCount: originPolicyCount,
            targetCount: originTargetCount,
            subjectCount: originSubjectCount,
            resourceCount: originResourceCount,
            actionCount: originActionCount,
            ruleCount: originRuleCount,
            conditionCount: originConditionCount,
            inputCount: originInputCount,
            valueCount: originValueCount,
            state: CURRENT
        })
    }
}

export function onRuleFunctionChange(graph, selected, value, GraphView) {
    return dispatch => {
        console.log(value)
        if (selected === null) return;
        const g = getNodeIndex(graph, selected);
        graph.nodes[g].function = value;

        dispatch({
            type: at.CHANGE_RULE_FUNCTION,
            graph,
            nodeValue: value
        });
        GraphView.asyncRenderNode(graph.nodes[g])
    }
}


function getSubGraph(graph, node, result) {
    const subEdges = getEdgeIndexBySourceId(graph, node.id)
    result['child'] = {}
    subEdges.forEach(index => {
        let child = graph.nodes[getNodeIndexById(graph, graph.edges[index].target)]
        child = getSubGraph(graph, child, child)
        if (result['child'][child.type] === undefined) {
            result['child'][child.type] = []
        }
        result['child'][child.type].push(child)
    });
    return result
}

function parseTarget(target, requestJson) {
    target.forEach(t => {
        let targetJson = {}
        if (t.child.subject !== undefined) {
            targetJson['subject'] = []
            t.child.subject.forEach(subject => {
                targetJson['subject'].push(subject.title);
            });
        }
        if (t.child.resource !== undefined) {
            targetJson['resource'] = []
            t.child.resource.forEach(resource => {
                targetJson['resource'].push(resource.title);
            });
        }
        if (t.child.action !== undefined) {
            targetJson['action'] = []
            t.child.action.forEach(action => {
                targetJson['action'].push(action.title);
            });
        }
        requestJson['target'].push(targetJson)
    })
}

function parseCondition(rule, conditions, conditionJson) {
    console.log(conditions)
    if (conditions.length === 2) {
        conditionJson['apply'] = {
            'function': 'and',
            'type': 'boolean',
            'value': {
                'first': {
                    'function': conditions[0].function,
                    'type': conditions[0].child.value[0].subTitle,
                    'value': conditions[0].child.value[0].title,
                    'inputId': conditions[0].child.input[0].title
                },
                'second': {
                    'function': conditions[1].function,
                    'type': conditions[1].child.value[0].subTitle,
                    'value': conditions[1].child.value[0].title,
                    'inputId': conditions[1].child.input[0].title
                }
            }
        }
    } else {
        conditionJson['apply'] = {
            'function': conditions[0].function,
            'type': conditions[0].child.value[0].subTitle,
            'value': conditions[0].child.value[0].title,
            'inputId': conditions[0].child.input[0].title
        }
    }
}

function parseRules(rules, requestJson) {
    rules.forEach(rule => {
        let ruleJson = {}
        ruleJson['name'] = rule.title;
        ruleJson['effect'] = rule.effect;
        ruleJson['condition'] = {}
        parseCondition(rule, rule.child.condition, ruleJson['condition']);
        requestJson['rules'].push(ruleJson)
    })
}

export function onCreatePolicy(graph, event) {
    return dispatch => {
        console.debug(graph);
        let request = {}
        request['policy'] = []
        graph.nodes.forEach((v, i, t) => {
            if (v.type === 'policy') {
                let requestJson = {}
                requestJson['target'] = [];
                requestJson['rules'] = [];
                requestJson['name'] = v.title;
                requestJson['combineAlg'] = v.combineAlg;
                const policy = getSubGraph(graph, v, v)
                const target = policy.child.target;
                const rules = policy.child.rule;
                parseTarget(target, requestJson)
                parseRules(rules, requestJson);
                request['policy'].push(requestJson)
            }
        });

        axios.post("http://localhost:8080/convert", request)
            .then(result => {
                console.log(result)
                fileDownload(result.data, 'policy-response.xml');
            })
        console.log(request)
        console.log(JSON.stringify(request, null, 4))
    }
}

function createPolicyNode(title, combineAlg, x, y, policyCount) {
    return {
        id: 'policy' + policyCount,
        title: title,
        combineAlg: combineAlg,
        type: POLICY_TYPE,
        x: x,
        y: y
    }
}


function createTargetNode(x, y, targetCount) {
    return {
        id: 'target' + targetCount,
        title: 'target',
        type: TARGET_TYPE,
        x: x,
        y: y
    }
}


function createSubjectNode(title, x, y, subjectCount) {
    return {
        id: 'subject' + subjectCount,
        title: title,
        type: SUBJECT_TYPE,
        x: x,
        y: y
    }
}

function createResourceNode(title, x, y, resourceCount) {
    return {
        id: 'resource' + resourceCount,
        title: title,
        type: RESOURCE_TYPE,
        x: x,
        y: y
    }
}

function createActionNode(title, x, y, actionCount) {
    return {
        id: 'action' + actionCount,
        title: title,
        type: ACTION_TYPE,
        x: x,
        y: y
    }
}


function createRuleNode(title, effect, x, y, ruleCount) {
    return {
        id: 'rule' + ruleCount,
        title: title,
        type: RULE_TYPE,
        effect: effect,
        x: x,
        y: y
    }
}

function createConditionNode(title, f, x, y, conditionCount) {
    return {
        id: 'condition' + conditionCount,
        title: title,
        function: f,
        type: CONDITION_TYPE,
        x: x,
        y: y
    }
}


function createValueNode(title, type, x, y, valueCount) {
    return {
        id: 'value' + valueCount,
        title: title,
        subTitle: type,
        type: VALUE_TYPE,
        x: x,
        y: y
    }
}


function createInputNode(title, x, y, inputCount) {
    return {
        id: 'input' + inputCount,
        title: title,
        type: INPUT_TYPE,
        x: x,
        y: y
    }
}

function createEdge(graph, sourceViewNode, targetViewNode) {
    const type = sourceViewNode.type === POLICY_TYPE ? SPECIAL_EDGE_TYPE : EMPTY_EDGE_TYPE;

    const viewEdge = {
        source: sourceViewNode[NODE_KEY],
        target: targetViewNode[NODE_KEY],
        type
    };

    // Only add the edge when the source node is not the same as the target
    if (viewEdge.source !== viewEdge.target) {
        graph.edges = [...graph.edges, viewEdge];
        return graph;
    }
}

export function onRequestPolicyAdvice(graph, data, policyCount, targetCount, subjectCount, resourceCount, actionCount, ruleCount, conditionCount, inputCount, valueCount) {
    return dispatch => {
        console.debug(conditionCount)
        console.debug(graph, data, policyCount, targetCount);
        const originPolicyCount = policyCount;
        const originTargetCount = targetCount;
        const originSubjectCount = subjectCount;
        const originResourceCount = resourceCount;
        const originActionCount = actionCount;
        const originRuleCount = ruleCount;
        const originConditionCount = conditionCount;
        const originInputCount = inputCount;
        const originValueCount = valueCount;
        policyCount = 0, targetCount = 0, subjectCount = 0, resourceCount = 0, actionCount = 0, ruleCount = 0,
            conditionCount = 0, valueCount = 0, inputCount = 0;
        Object.keys(data).forEach(key => {
            if (!['subject', 'resource', 'action'].includes(key)) {
                if (data[key].match(/\d+:\d+/)) {
                    data[key] = {type: 'time', value: data[key]}
                } else if (data[key].match(/\d+/)) {
                    data[key] = {type: 'integer', value: data[key]}
                } else {
                    data[key] = {type: 'string', value: data[key]}
                }
            }
        });

        const originGraph = graph;

        axios.post("http://localhost:8080/check", data)
            .then(result => {
                // this.setState({convertPolicy: result.data})
                console.log(result);
                const resultJson = result.data;
                let baseX = 0, baseY = 0;
                let graph = {nodes: [], edges: []};
                let nodes = [];
                resultJson.forEach(policy => {
                    const name = policy['name'];
                    const alg = policy['combineAlg'];
                    const rules = policy['rules'];
                    const target = policy['target'];
                    const policyNode = createPolicyNode(name, alg, baseX, baseY, ++policyCount);
                    nodes.push(policyNode);
                    target.forEach(t => {
                        const targetNode = createTargetNode(baseX - 200, baseY, ++targetCount);
                        nodes.push(targetNode);
                        createEdge(graph, policyNode, targetNode);
                        Object.keys(t).forEach(key => {
                            let node;
                            switch (key) {
                                case "subject":
                                    node = createSubjectNode(t[key], baseX - 400, baseY + 100, ++subjectCount);
                                    break;
                                case "resource":
                                    node = createResourceNode(t[key], baseX - 400, baseY, ++resourceCount);
                                    break;
                                case "action":
                                    node = createActionNode(t[key], baseX - 400, baseY - 100, ++actionCount);
                                    break;
                            }
                            nodes.push(node);
                            createEdge(graph, targetNode, node);
                        })
                    });
                    let originY = baseY;
                    if (rules.length > 1) originY -= 500;
                    rules.forEach(rule => {
                        console.debug(rule)
                        const name = rule['name']
                        const effect = rule['effect']
                        const ruleNode = createRuleNode(name, effect, baseX + 250, originY, ++ruleCount);
                        nodes.push(ruleNode)
                        createEdge(graph, policyNode, ruleNode);
                        const apply = rule['condition']['apply']
                        switch (apply['function']) {
                            case "and":
                            case "or":
                                const first = apply['value']['first'];
                                const second = apply['value']['second'];
                                let functionName = apply['function'];
                                ruleNode['function'] = functionName;
                                if (first['function'] === 'greater') first['title'] = '>';
                                else if (first['function'] === 'less') first['title'] = '<';
                                else if (first['function'] === 'equal') first['title'] = '==';
                                if (second['function'] === 'greater') second['title'] = '>';
                                else if (second['function'] === 'less') second['title'] = '<';
                                else if (second['function'] === 'equal') second['title'] = '==';
                                const firstConditionNode = createConditionNode(first['title'], first['function'], baseX + 100, originY + 150, ++conditionCount);
                                const firstValueNode = createValueNode(first['value'], first['type'], baseX + 150, originY + 300, ++valueCount);
                                const firstInputNode = createInputNode(first['inputId'], baseX + 50, originY + 300, ++inputCount);
                                const secondConditionNode = createConditionNode(second['title'], second['function'], baseX + 350, originY + 150, ++conditionCount);
                                const secondValueNode = createValueNode(second['value'], second['type'], baseX + 400, originY + 300, ++valueCount);
                                const secondInputNode = createInputNode(second['inputId'], baseX + 300, originY + 300, ++inputCount);
                                nodes.push(firstConditionNode);
                                nodes.push(firstValueNode);
                                nodes.push(firstInputNode);
                                nodes.push(secondConditionNode);
                                nodes.push(secondValueNode);
                                nodes.push(secondInputNode);
                                createEdge(graph, ruleNode, firstConditionNode);
                                createEdge(graph, ruleNode, secondConditionNode);
                                createEdge(graph, firstConditionNode, firstValueNode);
                                createEdge(graph, firstConditionNode, firstInputNode);
                                createEdge(graph, secondConditionNode, secondValueNode);
                                createEdge(graph, secondConditionNode, secondInputNode);
                                break;
                            case "equal":
                                functionName = apply['function']
                                const value = apply['value']
                                const valueType = apply['type']
                                const inputId = apply['inputId']
                                const conditionNode = createConditionNode("==", "equal", baseX + 250, originY + 150, ++conditionCount);
                                const valueNode = createValueNode(value, valueType, baseX + 300, originY + 300, ++valueCount);
                                const inputNode = createInputNode(inputId, baseX + 200, originY + 300, ++inputCount);
                                nodes.push(conditionNode)
                                nodes.push(valueNode)
                                nodes.push(inputNode);
                                createEdge(graph, ruleNode, conditionNode)
                                createEdge(graph, conditionNode, valueNode)
                                createEdge(graph, conditionNode, inputNode)
                                break;
                        }
                        originY += 500;
                    });
                    baseX += 1000
                });
                graph.nodes = nodes
                dispatch({
                    type: at.REQUST_POLICY_ADVICE,
                    originGraph,
                    graph,
                    state: CHECK,
                    originPolicyCount,
                    originTargetCount,
                    originSubjectCount,
                    originResourceCount,
                    originActionCount,
                    originRuleCount,
                    originConditionCount,
                    originInputCount,
                    originValueCount,
                    policyCount,
                    targetCount,
                    resourceCount,
                    actionCount,
                    ruleCount,
                    conditionCount,
                    valueCount,
                    inputCount
                })
            });
    }
}

export function onTestRequest(graph, data) {
    return dispatch => {
        console.debug(data)
        const requestData = {}
        Object.keys(data).forEach(key => {
            requestData[key] = {}
            Object.keys(data[key]).forEach(attributeKey => {
                if (!['subject', 'resource', 'action'].includes(attributeKey)) {
                    if (data[key][attributeKey].match(/\d+:\d+/)) {
                        requestData[key][attributeKey] = {type: 'time', value: data[key][attributeKey]}
                    } else if (data[key][attributeKey].match(/\d+/)) {
                        console.debug(data[key][attributeKey]);
                        requestData[key][attributeKey] = {type: 'integer', value: data[key][attributeKey]}
                    } else {
                        requestData[key][attributeKey] = {type: 'string', value: data[key][attributeKey]}
                    }
                } else {
                    requestData[key][attributeKey] = data[key][attributeKey]
                }
            })
        });
        let request = {}
        request['policy'] = []
        graph.nodes.forEach((v, i, t) => {
            if (v.type === 'policy') {
                let requestJson = {}
                requestJson['target'] = [];
                requestJson['rules'] = [];
                requestJson['name'] = v.title;
                requestJson['combineAlg'] = v.combineAlg;
                const policy = getSubGraph(graph, v, v)
                const target = policy.child.target;
                const rules = policy.child.rule;
                parseTarget(target, requestJson)
                parseRules(rules, requestJson);
                request['policy'].push(requestJson)
            }
        });
        axios.post("http://localhost:8080/policy/test", {policy: request, data: requestData})
            .then(result => {
                dispatch({
                    type: at.TEST_REQUEST,
                    data: result.data
                })
            });
    }
}
