import React from 'react';
import axios from 'axios';
import {GraphView} from '../diagraph';
import RuleEffect from './RuleEffect';
import CombineAlg from './CombineAlg';
import ChangeInput, {INPUT, CONDITION_FUNCTION, RULE_FUNCTION} from './ChangeInput';

import GraphConfig, {
    EMPTY_EDGE_TYPE,
    NODE_KEY,
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
import NodeSelect from "./NodeSelect";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {nodeSelect} from "../actions";
import {
    addActionNode,
    addConditionNode,
    addInputNode,
    addPolicyNode,
    addResourceNode,
    addRuleNode,
    addSubjectNode,
    addTargetNode,
    addValueNode,
    handleChangeCombineAlg,
    makeItLarge,
    onChangeOriginState,
    onChangeText,
    onCopySelected,
    onCreateEdge,
    onCreateNode,
    onDeleteEdge,
    onDeleteNode,
    onRuleEffectChange,
    onRuleFunctionChange,
    onSelectEdge,
    onSelectNode,
    onSwapEdge,
    onUpdateNode
} from "../editor-actions";
import RightSidebar from "./RightSidebar";
import {onValueEditorOpen} from "../value-editor-actions";

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

class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.GraphView = React.createRef();
        this.onPasteSelected = this.onPasteSelected.bind(this)
    }

    // Helper to find the index of a given node
    // Helper to find the index of a given edge

    // Given a nodeKey, return the corresponding node

    /*
     * Handlers/Interaction
     */

    // Called by 'drag' handler, etc..
    // to sync updates from D3 with the graph
    // Node 'mouseUp' handler


    // Edge 'mouseUp' handler

    // Updates the graph with a new node

    // Deletes a node from the graph

    // Creates a new node between two edges

    // Called when an edge is reattached to a different target.

    // Called when an edge is deleted

    onUndo() {
        // Not implemented
        console.warn('Undo is not currently implemented in the example.');
        // Normally any add, remove, or update would record the action in an array.
        // In order to undo it one would simply call the inverse of the action performed. For instance, if someone
        // called onDeleteEdge with (viewEdge, i, edges) then an undelete would be a splicing the original viewEdge
        // into the edges array at position i.
    }

    onPasteSelected() {
        if (!this.props.copiedNode) {
            console.warn('No node is currently in the copy queue. Try selecting a node and copying it with Ctrl/Command-C');
        }
        const graph = this.props.graph;
        const newNode = {...this.props.copiedNode, id: Date.now()};
        graph.nodes = [...graph.nodes, newNode];
        this.forceUpdate();
    }


    /*
     * Render
     */

    render() {
        const {nodes, edges} = this.props.graph;
        const selected = this.props.selected;
        console.debug(this.props)
        const {NodeTypes, NodeSubtypes, EdgeTypes} = GraphConfig;
        return (

            <div id="graph" style={{height: '100%'}}>
                <RightSidebar GraphView={this.GraphView}/>
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
                        onSelectNode={this.props.onSelectNode}
                        onCreateNode={this.props.onCreateNode}
                        onUpdateNode={this.props.onUpdateNode}
                        onDeleteNode={this.props.onDeleteNode}
                        onSelectEdge={this.props.onSelectEdge}
                        onCreateEdge={this.props.onCreateEdge}
                        onSwapEdge={this.props.onSwapEdge}
                        onDeleteEdge={this.props.onDeleteEdge}
                        onUndo={this.onUndo}
                        onCopySelected={this.props.onCopySelected}
                        onPasteSelected={this.onPasteSelected}
                        nodeSelect={this.props.nodeSelect}
                    />
                </div>
                <NodeSelect/>
            </div>
        );
    }
}

export default connect(s => s.editor,
    d => bindActionCreators({
        nodeSelect,
        onRuleFunctionChange,
        onChangeOriginState,
        onRuleEffectChange,
        addInputNode,
        addValueNode,
        addConditionNode,
        addRuleNode,
        addActionNode,
        addResourceNode,
        addSubjectNode,
        addTargetNode,
        addPolicyNode,
        handleChangeCombineAlg,
        onCopySelected,
        onDeleteEdge,
        onSwapEdge,
        onCreateEdge,
        onDeleteNode,
        onCreateNode,
        onSelectEdge,
        onChangeText,
        onSelectNode,
        onUpdateNode,
        makeItLarge,
        onValueEditorOpen,
    }, d))(Editor);
