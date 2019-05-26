import React from 'react';
import '../../public/css/node-bar.scss'
import policyIcon from '../../public/image/policy.svg'
import targetIcon from '../../public/image/target.svg'
import subjectIcon from '../../public/image/subject.svg'
import resourceIcon from '../../public/image/resource.svg'
import actionIcon from '../../public/image/action.svg'
import ruleIcon from '../../public/image/rule.svg'
import conditionIcon from '../../public/image/condition.svg'
import valueIcon from '../../public/image/value.svg'
import inputIcon from '../../public/image/input.svg'
import collapseIcon from '../../public/image/collapse.svg'
import Parse from "html-react-parser";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {nodeSelect} from "../actions";
import {
    addActionNode, addConditionNode, addInputNode,
    addPolicyNode,
    addResourceNode,
    addRuleNode,
    addSubjectNode,
    addTargetNode, addValueNode
} from "../editor-actions";

class NodeSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            height: '0px'
        }
    }

    loadImage(icon) {
        const parsedIcon = Parse(icon); //  parse SVG once
        const Icon = () => parsedIcon; // convert SVG to react component
        return Icon
    }


    render() {
        console.debug(this.props)
        const loadClassName = () => {
            const name = this.props.node.isShow ? 'show' : ''
            return "button " + name;
        };

        const loadSelectViewClass = () => {
            const show = this.props.node.isShow ? 'show' : 'collapsed';
            return 'select-control ' + show;
        }
        const {graph, policyCount, targetCount, subjectCount, resourceCount, actionCount, ruleCount, conditionCount, valueCount, inputCount} = this.props.editor;
        return (
            <div className={loadSelectViewClass()}>
                <div className='select-view'>
                    <button className={loadClassName()} onClick={event => this.props.addPolicyNode(graph, policyCount)}>
                        {this.loadImage(policyIcon)()}
                    </button>
                    <button className={loadClassName()} onClick={event => this.props.addTargetNode(graph, targetCount)}>
                        {this.loadImage(targetIcon)()}
                    </button>
                    <button className={loadClassName()}
                            onClick={event => this.props.addSubjectNode(graph, subjectCount)}>
                        {this.loadImage(subjectIcon)()}
                    </button>
                    <button className={loadClassName()}
                            onClick={event => this.props.addResourceNode(graph, resourceCount)}>
                        {this.loadImage(resourceIcon)()}
                    </button>
                    <button className={loadClassName()} onClick={event => this.props.addActionNode(graph, actionCount)}>
                        {this.loadImage(actionIcon)()}
                    </button>
                    <button className={loadClassName()} onClick={event => this.props.addRuleNode(graph, ruleCount)}>
                        {this.loadImage(ruleIcon)()}
                    </button>
                    <button className={loadClassName()}
                            onClick={event => this.props.addConditionNode(graph, conditionCount)}>
                        {this.loadImage(conditionIcon)()}
                    </button>
                    <button className={loadClassName()} onClick={event => this.props.addValueNode(graph, valueCount)}>
                        {this.loadImage(valueIcon)()}
                    </button>
                    <button className={loadClassName()} onClick={event => this.props.addInputNode(graph, inputCount)}>
                        {this.loadImage(inputIcon)()}
                    </button>
                    <button onClick={this.props.nodeSelect} className="select-collapse-btn">
                        {this.loadImage(collapseIcon)()}
                    </button>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {node, editor} = state;
    return {node: node, editor: editor}
}

export default connect(s => mapStateToProps(s),
    d => bindActionCreators({
        nodeSelect,
        addPolicyNode,
        addTargetNode,
        addSubjectNode,
        addResourceNode,
        addActionNode,
        addRuleNode,
        addConditionNode,
        addValueNode,
        addInputNode
    }, d))(NodeSelect);
