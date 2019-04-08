import React from 'react';
import axios from 'axios';
import fileDownload from 'js-file-download';
import {GraphView, IEdgeType, INodeType, LayoutEngineType} from 'react-digraph';
import MyGraphView from './MyGraphView';
import RuleEffect from './RuleEffect';
import CombineAlg from './CombineAlg';
import PolicyRequest from './PolicyRequest';
import ChangeInput, {INPUT, CONDITION_FUNCTION, RULE_FUNCTION} from './ChangeInput';

import GraphConfig, {
    edgeTypes,
    EMPTY_EDGE_TYPE,
    NODE_KEY,
    nodeTypes,
    TARGET_TYPE,
    SUBJECT_TYPE,
    SPECIAL_EDGE_TYPE,
    POLICY_TYPE,
    RESOURCE_TYPE,
    ACTION_TYPE,
    RULE_TYPE,
    CONDITION_TYPE,
    VALUE_TYPE, INPUT_TYPE,
} from './graph-config';
import Popup from "reactjs-popup";

// Configures node/edge types

// NOTE: Edges must have 'source' & 'target' attributes
// In a more realistic use case, the graph would probably originate
// elsewhere in the App or be generated from some other state upstream of this component.

const CURRENT = 0;
const CHECK = 1;

const sample = {
    edges: [
        {
            handleText: '',
            source: 'target',
            target: 'subject',
            type: EMPTY_EDGE_TYPE
        },
        {
            handleText: '',
            source: 'policy',
            target: 'target',
            type: SPECIAL_EDGE_TYPE
        },
        {
            handleText: '',
            source: 'target',
            target: 'resource',
            type: EMPTY_EDGE_TYPE
        },
        {
            handleText: '',
            source: 'policy',
            target: 'rule1',
            type: SPECIAL_EDGE_TYPE
        },
        {
            handleText: '',
            source: 'target',
            target: 'action',
            type: EMPTY_EDGE_TYPE
        },
        {
            handleText: '',
            source: 'rule1',
            target: 'condition1',
            type: EMPTY_EDGE_TYPE
        },
        {
            handleText: '',
            source: 'condition1',
            target: 'value1',
            type: EMPTY_EDGE_TYPE
        },
        {
            handleText: '',
            source: 'rule1',
            target: 'condition2',
            type: EMPTY_EDGE_TYPE
        },
        {
            handleText: '',
            source: 'condition2',
            target: 'value2',
            type: EMPTY_EDGE_TYPE
        },
        {
            handleText: '',
            source: 'condition1',
            target: 'input1',
            type: EMPTY_EDGE_TYPE
        },
        {
            handleText: '',
            source: 'condition2',
            target: 'input2',
            type: EMPTY_EDGE_TYPE
        }
    ],
    nodes: [
        {
            id: 'policy',
            title: 'Car',
            combineAlg: 'permit-unless-deny',
            type: POLICY_TYPE,
        },
        {
            id: 'target',
            title: 'target',
            type: TARGET_TYPE,
            x: -223,
            y: 10
        },
        {
            id: 'subject',
            title: 'Father',
            type: SUBJECT_TYPE,
            x: -423,
            y: -90
        },
        {
            id: 'resource',
            title: 'car',
            type: RESOURCE_TYPE,
            x: -423,
            y: 10
        },
        {
            id: 'action',
            title: 'open',
            type: ACTION_TYPE,
            x: -423,
            y: 110
        },
        {
            id: 'rule1',
            title: 'time',
            type: RULE_TYPE,
            effect: true,
            function: 'and',
            x: 250,
            y: 0
        },
        {
            id: 'condition1',
            title: 'greater',
            type: CONDITION_TYPE,
            x: 100,
            y: 150
        },
        {
            id: 'condition2',
            title: 'less',
            type: CONDITION_TYPE,
            x: 350,
            y: 150
        },
        {
            id: 'value1',
            subTitle: 'time',
            title: '15:00',
            type: VALUE_TYPE,
            x: 150,
            y: 300
        },
        {
            id: 'input1',
            subTitle: 'time',
            title: 'current_time',
            type: INPUT_TYPE,
            x: 50,
            y: 300
        },
        {
            id: 'value2',
            subTitle: 'time',
            title: '20:00',
            type: VALUE_TYPE,
            x: 400,
            y: 300
        },
        {
            id: 'input2',
            subTitle: 'time',
            title: 'current_time',
            type: INPUT_TYPE,
            x: 300,
            y: 300
        }
    ]
};

let policyCount = 1, targetCount = 1, subjectCount = 1, resourceCount = 1, actionCount = 1, ruleCount = 1,
    conditionCount = 2, valueCount = 2, inputCount = 2;

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

class Editor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            copiedNode: null,
            graph: sample,
            layoutEngineType: undefined,
            selected: null,
            totalNodes: sample.nodes.length,
            originGraph: sample,
            state: CURRENT,
            nodeType: INPUT,
            nodeValue: undefined
        };
        this.GraphView = React.createRef();
        this.getNodeIndex = this.getNodeIndex.bind(this)
        this.getEdgeIndex = this.getEdgeIndex.bind(this)
        this.getViewNode = this.getViewNode.bind(this)
        this.makeItLarge = this.makeItLarge.bind(this)
        this.addStartNode = this.addStartNode.bind(this)
        this.deleteStartNode = this.deleteStartNode.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.onUpdateNode = this.onUpdateNode.bind(this)
        this.onSelectNode = this.onSelectNode.bind(this)
        this.onSelectEdge = this.onSelectEdge.bind(this)
        this.onCreateNode = this.onCreateNode.bind(this)
        this.onDeleteNode = this.onDeleteNode.bind(this)
        this.onCreateEdge = this.onCreateEdge.bind(this)
        this.onSwapEdge = this.onSwapEdge.bind(this)
        this.onDeleteEdge = this.onDeleteEdge.bind(this)
        this.onCopySelected = this.onCopySelected.bind(this)
        this.onPasteSelected = this.onPasteSelected.bind(this)
        this.handleChangeCombineAlg = this.handleChangeCombineAlg.bind(this)

        this.onChangeText = this.onChangeText.bind(this)
        this.onCreatePolicy = this.onCreatePolicy.bind(this)
        this.addPolicyNode = this.addPolicyNode.bind(this)
        this.addTargetNode = this.addTargetNode.bind(this)
        this.addSubjectNode = this.addSubjectNode.bind(this)
        this.addResourceNode = this.addResourceNode.bind(this)
        this.addActionNode = this.addActionNode.bind(this)
        this.addRuleNode = this.addRuleNode.bind(this)
        this.addConditionNode = this.addConditionNode.bind(this)
        this.addValueNode = this.addValueNode.bind(this)
        this.addInputNode = this.addInputNode.bind(this)
        this.onRuleEffectChange = this.onRuleEffectChange.bind(this)
        this.getSubGraph = this.getSubGraph.bind(this)
        this.onRequestPolicyAdvice = this.onRequestPolicyAdvice.bind(this)
        this.onChangeOriginState = this.onChangeOriginState.bind(this)
        this.onRuleFunctionChange = this.onRuleFunctionChange.bind(this)
    }

    // Helper to find the index of a given node
    getNodeIndex(searchNode) {
        return this.state.graph.nodes.findIndex((node) => {
            return node[NODE_KEY] === searchNode[NODE_KEY];
        });
    }

    getNodeIndexById(id) {
        return this.state.graph.nodes.findIndex((node) => {
            return node[NODE_KEY] === id;
        });
    }

    // Helper to find the index of a given edge
    getEdgeIndex(searchEdge) {
        return this.state.graph.edges.findIndex((edge) => {
            return edge.source === searchEdge.source && edge.target === searchEdge.target;
        });
    }

    getEdgeIndexBySourceId(id) {
        let result = []
        const edges = this.state.graph.edges
        for (let i = 0; i < edges.length; i++) {
            if (edges[i].source === id)
                result.push(i)
        }
        return result
    }

    // Given a nodeKey, return the corresponding node
    getViewNode(nodeKey) {
        const searchNode = {};
        searchNode[NODE_KEY] = nodeKey;
        const i = this.getNodeIndex(searchNode);
        return this.state.graph.nodes[i];
    }

    makeItLarge() {
        const graph = this.state.graph;
        const generatedSample = generateSample(this.state.totalNodes);
        graph.nodes = generatedSample.nodes;
        graph.edges = generatedSample.edges;
        this.setState(this.state);
    };

    addStartNode() {
        console.log('add start node')

        const graph = this.state.graph;
        // using a new array like this creates a new memory reference
        // this will force a re-render
        graph.nodes = [
            {
                id: Date.now(),
                title: 'Node A',
                type: POLICY_TYPE,
                x: 0,
                y: 0
            },
            ...this.state.graph.nodes
        ];
        this.setState({
            graph
        });
    }

    deleteStartNode() {
        console.log('delete start node')

        const graph = this.state.graph;
        console.log(graph.nodes)
        const node = graph.nodes[0];
        console.log(node)
        graph.nodes.splice(0, 1);

        // using a new array like this creates a new memory reference
        // this will force a re-render
        graph.nodes = [...this.state.graph.nodes];
        console.log(graph.nodes)

        this.setState({
            graph
        });
    }

    handleChange(event) {
        this.setState(
            {
                totalNodes: parseInt(event.target.value || '0', 10)
            },
            this.makeItLarge
        );
    }


    /*
     * Handlers/Interaction
     */

    // Called by 'drag' handler, etc..
    // to sync updates from D3 with the graph
    onUpdateNode(viewNode, value) {
        console.log('on update node')

        const graph = this.state.graph;
        const i = this.getNodeIndex(viewNode);

        graph.nodes[i] = viewNode;
        this.setState({graph, nodeValue: value});
    }

    // Node 'mouseUp' handler
    onSelectNode(viewNode) {
        console.log('on select node')
        console.log(viewNode)
        // Deselect events will send Null viewNode
        if (viewNode !== null && viewNode.type === RULE_TYPE) {
            this.setState({ruleEffect: viewNode.effect, nodeType: RULE_FUNCTION, nodeValue: viewNode.function})
        } else if (viewNode !== null && viewNode.type === CONDITION_TYPE) {
            this.setState({nodeType: CONDITION_FUNCTION, nodeValue: viewNode.title})
        } else {
            this.setState({nodeType:INPUT})
        }
        this.setState({selected: viewNode});
    }

    getSubGraph(node, result) {
        const graph = this.state.graph;
        const subEdges = this.getEdgeIndexBySourceId(node.id)
        result['child'] = {}
        subEdges.forEach(index => {
            let child = graph.nodes[this.getNodeIndexById(graph.edges[index].target)]
            child = this.getSubGraph(child, child)
            if (result['child'][child.type] === undefined) {
                result['child'][child.type] = []
            }
            result['child'][child.type].push(child)
        });
        return result
    }

    onChangeText(value) {
        const selected = this.state.selected;
        if (selected === null) return;
        const g = this.getNodeIndex(selected);
        let graph = this.state.graph;
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
        this.setState({graph, selected:{}});
        this.onUpdateNode(graph.nodes[g], value)
    }

    // Edge 'mouseUp' handler
    onSelectEdge(viewEdge) {
        this.setState({selected: viewEdge});
    }

    // Updates the graph with a new node
    onCreateNode(x, y) {
        const graph = this.state.graph;

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

        graph.nodes = [...graph.nodes, viewNode];
        this.setState({graph});
    }

    // Deletes a node from the graph
    onDeleteNode(viewNode, nodeId, nodeArr) {
        console.log("on delete node")
        const graph = this.state.graph;
        // Delete any connected edges
        const newEdges = graph.edges.filter((edge, i) => {
            return edge.source !== viewNode[NODE_KEY] && edge.target !== viewNode[NODE_KEY];
        });
        graph.nodes = nodeArr;
        graph.edges = newEdges;

        this.setState({graph, selected: null});
    }

    // Creates a new node between two edges
    onCreateEdge(sourceViewNode, targetViewNode) {
        const graph = this.state.graph;
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
            this.setState({
                graph,
                selected: viewEdge
            });
        }
    }

    // Called when an edge is reattached to a different target.
    onSwapEdge(sourceViewNode, targetViewNode, viewEdge) {
        const graph = this.state.graph;
        const i = this.getEdgeIndex(viewEdge);
        const edge = JSON.parse(JSON.stringify(graph.edges[i]));

        edge.source = sourceViewNode[NODE_KEY];
        edge.target = targetViewNode[NODE_KEY];
        graph.edges[i] = edge;
        // reassign the array reference if you want the graph to re-render a swapped edge
        graph.edges = [...graph.edges];

        this.setState({
            graph,
            selected: edge
        });
    }

    // Called when an edge is deleted
    onDeleteEdge(viewEdge, edges) {
        const graph = this.state.graph;
        graph.edges = edges;
        this.setState({
            graph,
            selected: null
        });
    }

    onUndo() {
        // Not implemented
        console.warn('Undo is not currently implemented in the example.');
        // Normally any add, remove, or update would record the action in an array.
        // In order to undo it one would simply call the inverse of the action performed. For instance, if someone
        // called onDeleteEdge with (viewEdge, i, edges) then an undelete would be a splicing the original viewEdge
        // into the edges array at position i.
    }

    onCopySelected() {
        if (this.state.selected.source) {
            console.warn('Cannot copy selected edges, try selecting a node instead.');
            return;
        }
        const x = this.state.selected.x + 10;
        const y = this.state.selected.y + 10;
        this.setState({
            copiedNode: {...this.state.selected, x, y}
        });
    }

    onPasteSelected() {
        if (!this.state.copiedNode) {
            console.warn('No node is currently in the copy queue. Try selecting a node and copying it with Ctrl/Command-C');
        }
        const graph = this.state.graph;
        const newNode = {...this.state.copiedNode, id: Date.now()};
        graph.nodes = [...graph.nodes, newNode];
        this.forceUpdate();
    }

    handleChangeCombineAlg(event) {
        if (this.state.selected.type === POLICY_TYPE) {
            const graph = this.state.graph;
            const i = this.getNodeIndex(this.state.selected);
            graph.nodes[i].combineAlg = event.target.value;
            this.setState({graph})
        }
    }

    parseTarget(target, requestJson) {
        target.forEach(t => {
            let targetJson = {}
            targetJson['subject'] = []
            targetJson['resource'] = []
            targetJson['action'] = []
            t.child.subject.forEach(subject => {
                targetJson['subject'].push(subject.title);
            });
            t.child.resource.forEach(resource => {
                targetJson['resource'].push(resource.title);
            });
            t.child.action.forEach(action => {
                targetJson['action'].push(action.title);
            });
            requestJson['target'].push(targetJson)
        })
    }

    parseCondition(rule, conditions, conditionJson) {
        console.log(conditions)
        if (conditions.length == 2) {
            conditionJson['apply'] = {
                'function': 'and',
                'type': 'boolean',
                'value': {
                    'first': {
                        'function': conditions[0].title,
                        'type': conditions[0].child.value[0].subTitle,
                        'value': conditions[0].child.value[0].title,
                        'inputId': conditions[0].child.input[0].title
                    },
                    'second': {
                        'function': conditions[1].title,
                        'type': conditions[1].child.value[0].subTitle,
                        'value': conditions[1].child.value[0].title,
                        'inputId': conditions[1].child.input[0].title
                    }
                }
            }
        } else {
            conditionJson['apply'] = {
                'function': conditions[0].title,
                'type': 'string',
                'value': conditions[0].child.value[0].title,
                'inputId': conditions[0].child.input[0].title
            }
        }
    }

    parseRules(rules, requestJson) {
        rules.forEach(rule => {
            let ruleJson = {}
            ruleJson['name'] = rule.title;
            ruleJson['effect'] = rule.effect;
            ruleJson['condition'] = {}
            this.parseCondition(rule, rule.child.condition, ruleJson['condition']);
            requestJson['rules'].push(ruleJson)
        })
    }

    onCreatePolicy(event) {
        const graph = this.state.graph
        let request = {}
        request['policy'] = []
        graph.nodes.forEach((v, i, t) => {
            if (v.type === 'policy') {
                let requestJson = {}
                requestJson['target'] = [];
                requestJson['rules'] = [];
                requestJson['name'] = v.title;
                requestJson['combineAlg'] = v.combineAlg;
                const policy = this.getSubGraph(v, v)
                const target = policy.child.target;
                const rules = policy.child.rule;
                this.parseTarget(target, requestJson)
                this.parseRules(rules, requestJson);
                request['policy'].push(requestJson)
            }
        });
        axios.post("http://localhost:8080/convert", request)
            .then(result => {
                // this.setState({convertPolicy: result.data})
                console.log(result)
                fileDownload(result.data, 'policy-response.xml');
            })
        console.log(request)
        console.log(JSON.stringify(request, null, 4))
    }

    addPolicyNode() {
        console.log("add policy node");
        const graph = this.state.graph;
        // using a new array like this creates a new memory reference
        // this will force a re-render
        policyCount++;
        graph.nodes = [
            {
                id: 'policy' + policyCount,
                title: 'policy',
                combineAlg: 'permit-unless-deny',
                type: POLICY_TYPE,
                x: 0,
                y: 0
            },
            ...this.state.graph.nodes
        ];
        this.setState({
            graph
        });
    }

    createPolicyNode(title, combineAlg, x, y) {
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

    addTargetNode() {
        const graph = this.state.graph;
        targetCount++;
        graph.nodes = [
            {
                id: 'target' + targetCount,
                title: 'target',
                type: TARGET_TYPE,
                x: 0,
                y: 0
            },
            ...this.state.graph.nodes
        ];
        this.setState({
            graph
        });
    }

    createTargetNode(x, y) {
        targetCount++;
        return {
            id: 'target' + targetCount,
            title: 'target',
            type: TARGET_TYPE,
            x: x,
            y: y
        }
    }

    addSubjectNode() {
        const graph = this.state.graph;
        subjectCount++;
        graph.nodes = [
            {
                id: 'subject' + subjectCount,
                title: 'subject',
                type: SUBJECT_TYPE,
                x: 0,
                y: 0
            },
            ...this.state.graph.nodes
        ];
        this.setState({
            graph
        });
    }

    createSubjectNode(title, x, y) {
        subjectCount++;
        return {
            id: 'subject' + subjectCount,
            title: title,
            type: SUBJECT_TYPE,
            x: x,
            y: y
        }
    }

    addResourceNode() {
        const graph = this.state.graph;
        resourceCount++;
        graph.nodes = [
            {
                id: 'resource' + resourceCount,
                title: 'resource',
                type: RESOURCE_TYPE,
                x: 0,
                y: 0
            },
            ...this.state.graph.nodes
        ];
        this.setState({
            graph
        });
    }

    createResourceNode(title, x, y) {
        resourceCount++;
        return {
            id: 'resource' + resourceCount,
            title: title,
            type: RESOURCE_TYPE,
            x: x,
            y: y
        }
    }

    addActionNode() {
        const graph = this.state.graph;
        actionCount++;
        graph.nodes = [
            {
                id: 'action' + actionCount,
                title: 'action',
                type: ACTION_TYPE,
                x: 0,
                y: 0
            },
            ...this.state.graph.nodes
        ];
        this.setState({
            graph
        });
    }

    createActionNode(title, x, y) {
        actionCount++;
        return {
            id: 'action' + actionCount,
            title: title,
            type: ACTION_TYPE,
            x: x,
            y: y
        }
    }

    addRuleNode() {
        const graph = this.state.graph;
        ruleCount++;
        graph.nodes = [
            {
                id: 'rule' + ruleCount,
                title: 'rule',
                type: RULE_TYPE,
                x: 0,
                y: 0
            },
            ...this.state.graph.nodes
        ];
        this.setState({
            graph
        });
    }

    createRuleNode(title, effect, x, y) {
        ruleCount++;
        return {
            id: 'rule' + ruleCount,
            title: title,
            type: RULE_TYPE,
            effect: effect,
            x: x,
            y: y
        }
    }

    addConditionNode() {
        const graph = this.state.graph;
        conditionCount++;
        graph.nodes = [
            {
                id: 'condition' + conditionCount,
                title: 'condition',
                type: CONDITION_TYPE,
                x: 0,
                y: 0
            },
            ...this.state.graph.nodes
        ];
        this.setState({
            graph
        });
    }

    createConditionNode(title, x, y) {
        conditionCount++;
        return {
            id: 'condition' + conditionCount,
            title: title,
            type: CONDITION_TYPE,
            x: x,
            y: y
        }
    }

    addValueNode() {
        const graph = this.state.graph;
        valueCount++;
        graph.nodes = [
            {
                id: 'value' + valueCount,
                title: 'value',
                type: VALUE_TYPE,
                x: 0,
                y: 0
            },
            ...this.state.graph.nodes
        ];
        this.setState({
            graph
        });
    }

    createValueNode(title, type, x, y) {
        valueCount++;
        return {
            id: 'value' + valueCount,
            title: title,
            subTitle: type,
            type: VALUE_TYPE,
            x: x,
            y: y
        }
    }

    addInputNode() {
        const graph = this.state.graph;
        inputCount++;
        graph.nodes = [
            {
                id: 'input' + inputCount,
                title: 'input',
                type: INPUT_TYPE,
                x: 0,
                y: 0
            },
            ...this.state.graph.nodes
        ];
        this.setState({
            graph
        });
    }

    createInputNode(title, x, y) {
        inputCount++;
        return {
            id: 'input' + inputCount,
            title: title,
            type: INPUT_TYPE,
            x: x,
            y: y
        }
    }

    onRuleEffectChange(event) {
        console.log(event);
        const node = this.state.selected;
        const graph = this.state.graph;
        if (node != null && node.type === RULE_TYPE) {
            const i = this.getNodeIndex(node);
            console.log(event.target.value);
            console.log(event.target.value === "true");
            graph.nodes[i].effect = event.target.value === "true";
            this.setState({graph, ruleEffect: graph.nodes[i].effect})
        }
    }

    onRequestPolicyAdvice(data) {
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

        axios.post("http://localhost:8080/check", data)
            .then(result => {
                // this.setState({convertPolicy: result.data})
                console.log(result);
                const resultJson = result.data;
                let baseX = 0, baseY = 0;
                const originGraph = this.state.graph;
                this.setState({originGraph, graph: {nodes: [], edges: []}});
                let nodes = [];
                resultJson.forEach(policy => {
                    const name = policy['name'];
                    const alg = policy['combineAlg'];
                    const rules = policy['rules'];
                    const target = policy['target'];
                    const policyNode = this.createPolicyNode(name, alg, baseX, baseY);
                    nodes.push(policyNode);
                    target.forEach(t => {
                        const targetNode = this.createTargetNode(baseX - 200, baseY);
                        nodes.push(targetNode);
                        this.onCreateEdge(policyNode, targetNode);
                        Object.keys(t).forEach(key => {
                            let node;
                            switch (key) {
                                case "subject":
                                    node = this.createSubjectNode(t[key], baseX - 400, baseY + 100);
                                    break;
                                case "resource":
                                    node = this.createResourceNode(t[key], baseX - 400, baseY);
                                    break;
                                case "action":
                                    node = this.createActionNode(t[key], baseX - 400, baseY - 100);
                                    break;
                            }
                            nodes.push(node);
                            this.onCreateEdge(targetNode, node);
                        })
                    });

                    rules.forEach(rule => {
                        const name = rule['name']
                        const effect = rule['effect']
                        const ruleNode = this.createRuleNode(name, effect, baseX + 250, baseY);
                        nodes.push(ruleNode)
                        this.onCreateEdge(policyNode, ruleNode)
                        const apply = rule['condition']['apply']
                        switch (apply['function']) {
                            case "and":
                            case "or":
                                const first = apply['value']['first'];
                                const second = apply['value']['second'];
                                let functionName = apply['function'];
                                ruleNode['function'] = functionName;
                                const firstConditionNode = this.createConditionNode(first['function'], baseX + 100, baseY + 150);
                                const firstValueNode = this.createValueNode(first['value'], first['type'], baseX + 150, baseY + 300);
                                const firstInputNode = this.createInputNode(first['inputId'], baseX + 50, baseY + 300);
                                const secondConditionNode = this.createConditionNode(second['function'], baseX + 350, baseY + 150);
                                const secondValueNode = this.createValueNode(second['value'], second['type'], baseX + 400, baseY + 300);
                                const secondInputNode = this.createInputNode(second['inputId'], baseX + 300, baseY + 300);
                                nodes.push(firstConditionNode);
                                nodes.push(firstValueNode);
                                nodes.push(firstInputNode);
                                nodes.push(secondConditionNode);
                                nodes.push(secondValueNode);
                                nodes.push(secondInputNode);
                                this.onCreateEdge(ruleNode, firstConditionNode);
                                this.onCreateEdge(ruleNode, secondConditionNode);
                                this.onCreateEdge(firstConditionNode, firstValueNode);
                                this.onCreateEdge(firstConditionNode, firstInputNode);
                                this.onCreateEdge(secondConditionNode, secondValueNode);
                                this.onCreateEdge(secondConditionNode, secondInputNode);
                                break;
                            case "equal":
                                functionName = apply['function']
                                const value = apply['value']
                                const valueType = apply['type']
                                const inputId = apply['inputId']
                                const conditionNode = this.createConditionNode(functionName, baseX + 250, baseY + 150);
                                const valueNode = this.createValueNode(value, valueType, baseX + 300, baseY + 300);
                                const inputNode = this.createInputNode(inputId, baseX + 200, baseY + 300);
                                nodes.push(conditionNode)
                                nodes.push(valueNode)
                                nodes.push(inputNode);
                                this.onCreateEdge(ruleNode, conditionNode)
                                this.onCreateEdge(conditionNode, valueNode)
                                this.onCreateEdge(conditionNode, inputNode)
                                break;
                        }
                    });
                    baseX += 1000
                })
                const graph = this.state.graph
                graph.nodes = nodes
                this.setState({graph, state: CHECK})
            })

        console.log(data)
        console.log(this.state.graph)
    }

    onChangeOriginState() {
        const originGraph = this.state.originGraph
        this.setState({graph: originGraph, state: CURRENT})
    }

    onRuleFunctionChange(value) {
        console.log(value)
        const selected = this.state.selected;
        if (selected === null) return;
        const g = this.getNodeIndex(selected);
        let graph = this.state.graph;
        graph.nodes[g].function = value;

        this.setState({graph});
        this.onUpdateNode(graph.nodes[g], value)
    }


    /*
     * Render
     */

    render() {
        const {nodes, edges} = this.state.graph;
        const selected = this.state.selected;
        const {NodeTypes, NodeSubtypes, EdgeTypes} = GraphConfig;

        return (

            <div id="graph" style={{height: '100%'}}>
                <div className="graph-header">
                    <ChangeInput type={this.state.nodeType}
                                 onChangeText={this.onChangeText}
                                 default={this.state.nodeValue}
                                 onRuleFunctionChange={this.onRuleFunctionChange}
                    />

                    <button onClick={this.onCreatePolicy}>Make Policy</button>
                    <Popup trigger={<button>Check Policy</button>} contentStyle={{width: "300px"}}>
                        <PolicyRequest onRequestPolicyAdvice={this.onRequestPolicyAdvice}></PolicyRequest>
                    </Popup>
                    <RuleEffect checked={this.state.selected} effect={this.state.ruleEffect}
                                onRuleEffectChange={this.onRuleEffectChange}/>
                    <CombineAlg selected={this.state.selected}
                                onChange={this.handleChangeCombineAlg}
                                graph={this.state.graph}/>
                    <button hidden={this.state.state === CURRENT} onClick={this.onChangeOriginState}>Back</button>
                    <div>
                        <button onClick={this.addPolicyNode}>Policy Node</button>
                        <button onClick={this.addTargetNode}>Target Node</button>
                        <button onClick={this.addSubjectNode}>Subject Node</button>
                        <button onClick={this.addResourceNode}>Resource Node</button>
                        <button onClick={this.addActionNode}>Action Node</button>
                        <button onClick={this.addRuleNode}>Rule Node</button>
                        <button onClick={this.addConditionNode}>Condition Node</button>
                        <button onClick={this.addValueNode}>Value Node</button>
                        <button onClick={this.addInputNode}>Input Node</button>
                    </div>
                </div>
                <div style={{height: '100%'}}>
                    <GraphView
                        ref={(el) => (this.GraphView = el)}
                        nodeKey={NODE_KEY}
                        nodes={nodes}
                        edges={edges}
                        selected={selected}
                        nodeTypes={NodeTypes}
                        nodeSubtypes={NodeSubtypes}
                        edgeTypes={EdgeTypes}
                        onSelectNode={this.onSelectNode}
                        onCreateNode={this.onCreateNode}
                        onUpdateNode={this.onUpdateNode}
                        onDeleteNode={this.onDeleteNode}
                        onSelectEdge={this.onSelectEdge}
                        onCreateEdge={this.onCreateEdge}
                        onSwapEdge={this.onSwapEdge}
                        onDeleteEdge={this.onDeleteEdge}
                        onUndo={this.onUndo}
                        onCopySelected={this.onCopySelected}
                        onPasteSelected={this.onPasteSelected}
                        layoutEngineType={this.state.layoutEngineType}
                    />
                </div>
            </div>
        );
    }
}

export default Editor;
