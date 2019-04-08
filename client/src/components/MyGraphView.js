import React from 'react';
import {GraphView, Node} from 'react-digraph';

class MyGraphView extends GraphView {
    constructor(props) {
        super(props);
        this.getNodeComponent = this.getNodeComponent.bind(this)
    }
    getNodeComponent(id, node) {
        const {nodeTypes, nodeSubtypes, nodeSize, renderNode, renderNodeText, nodeKey} = this.props;
        return (
            <div
                key={id}
                id={id}
                data={node}
                nodeTypes={nodeTypes}
                nodeSize={nodeSize}
                nodeKey={nodeKey}
                nodeSubtypes={nodeSubtypes}
                onNodeMouseEnter={this.handleNodeMouseEnter}
                onNodeMouseLeave={this.handleNodeMouseLeave}
                onNodeMove={this.handleNodeMove}
                onNodeUpdate={this.handleNodeUpdate}
                onNodeSelected={this.handleNodeSelected}
                renderNode={renderNode}
                renderNodeText={renderNodeText}
                isSelected={this.state.selectedNodeObj.node === node}
                layoutEngine={this.layoutEngine}
                viewWrapperElem={this.viewWrapper.current}
            />
        );
    }
}

export default MyGraphView;
