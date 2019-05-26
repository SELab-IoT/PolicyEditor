import React from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {onChangeText, onRuleFunctionChange} from "../editor-actions";
import GraphView from "../diagraph";


export const INPUT = 0;
export const CONDITION_FUNCTION = 1;
export const RULE_FUNCTION = 2;

class ChangeInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nodeTitle: undefined,
            function: undefined
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.onChangeText = this.onChangeText.bind(this)

    }

    handleTitleChange(event) {
        this.setState(
            {
                nodeTitle: event.target.value || ""
            }
        );
    }

    onChangeText(event) {
        const {graph, selected} = this.props;
        this.props.onChangeText(graph, selected, event.target.value);
    }

    render() {
        const {nodeType, nodeValue, graph, selected, GraphView} = this.props
        return (
            <div>
                <input
                    className="react-bs-table-bordered"
                    type="text"
                    onBlur={this.handleTitleChange}
                    placeholder={this.state.nodeTitle}
                />
                <button
                    className="btn-light"
                    onClick={event => this.props.onChangeText(graph, selected, this.state.nodeTitle, GraphView)}>Change
                    Text
                </button>
            </div>
        )
    }
}

export default connect(s => s.editor, d => bindActionCreators({onRuleFunctionChange, onChangeText}, d))(ChangeInput);
