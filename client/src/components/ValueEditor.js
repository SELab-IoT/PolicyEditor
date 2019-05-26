import React from 'react';
import CombineAlg from "./CombineAlg";
import ChangeInput from "./ChangeInput";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    handleChangeCombineAlg,
    onChangeConditionFunction,
    onRuleEffectChange,
    onRuleFunctionChange
} from "../editor-actions";
import RuleEffect from "./RuleEffect";

class ValueEditor extends React.Component {

    render() {
        if (this.props.selected === null) return null;
        const type = this.props.selected.type;
        if (type === 'policy') {
            return (
                <div className="value-editor-content">
                    <CombineAlg
                        graphView={this.props.GraphView}
                        selected={this.props.node}
                        onChange={this.props.handleChangeCombineAlg}
                        graph={this.props.graph}/>
                    <ChangeInput GraphView={this.props.GraphView}/>
                </div>
            )
        } else if (type === 'rule') {
            return (
                <div className="value-editor-content">
                    <RuleEffect
                        graphView={this.props.GraphView}
                        graph={this.props.graph}
                        selected={this.props.node}
                        effect={this.props.ruleEffect}
                        onRuleEffectChange={this.props.onRuleEffectChange}
                    />
                    <div>
                        <span>Function: </span>
                        <span> AND </span>
                        <input type="radio" name="function" checked={this.props.selected.function === 'and'} value="and"
                               onChange={event => this.props.onRuleFunctionChange(this.props.graph, this.props.selected, event.target.value, this.props.GraphView)}/>
                        <span> OR </span>
                        <input type="radio" name="function" checked={this.props.selected.function === 'or'} value="or"
                               onChange={event => this.props.onRuleFunctionChange(this.props.graph, this.props.selected, event.target.value, this.props.GraphView)}/>
                    </div>
                    <ChangeInput GraphView={this.props.GraphView}/>
                </div>
            )
        } else if (type === 'condition') {
            return (
                <div>
                    <select
                        name="condition-function"
                        defaultValue={this.props.selected.function}
                        onChange={event => this.props.onChangeConditionFunction(this.props.graph, this.props.selected, event.target.value, this.props.GraphView)}
                    >
                        <option value={'equal'}>==</option>
                        <option value={'greater'}>&#62;</option>
                        <option value={'less'}>&#60;</option>
                    </select>
                </div>
            )
        } else {
            return (
                <ChangeInput GraphView={this.props.GraphView}/>
            )
        }
    }
}

export default connect(s => s.editor, d => bindActionCreators(
    {
        onRuleEffectChange,
        handleChangeCombineAlg,
        onRuleFunctionChange,
        onChangeConditionFunction
    }, d))(ValueEditor);
