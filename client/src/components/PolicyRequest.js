import React from 'react';
import _ from 'lodash';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {CHECK, onRequestPolicyAdvice} from "../editor-actions";
import deleteIcon from "../../public/image/delete.svg";
import Parse from "html-react-parser";

class PolicyRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newId: '',
            ids: [],
            values: [],
            data: {}
        };

        this.updateNewId = this.updateNewId.bind(this);
        this.addNewInput = this.addNewInput.bind(this);
    }

    addNewInput() {
        const ids = [
            ...this.state.ids,
            this.state.newId
        ];
        this.setState({ids})
    }

    updateNewId(event) {
        this.setState({newId: event.target.value})
    }


    updateInput(id, event) {
        const data = this.state.data;
        data[id] = event.target.value;
        this.setState({data});
    }

    deleteRequestKey = (id) => {
        const data = this.state.data;
        delete data[id];
        let ids = this.state.ids;
        const index = ids.indexOf(id)
        ids.splice(index, 1)
        this.setState({data, ids})
    }

    loadImage(icon) {
        const parsedIcon = Parse(icon); //  parse SVG once
        const Icon = () => parsedIcon; // convert SVG to react component
        return Icon
    }

    render() {
        const {policyCount, targetCount, subjectCount, resourceCount, actionCount, ruleCount, conditionCount, inputCount, valueCount} = this.props;
        console.debug(conditionCount);
        return (
            <div>
                <section className="request">
                    <h3 className="request-header">Target</h3>
                    <ul className="request-list">
                        {_.map(this.state.ids, id => {
                            return (
                                <li className="request-column">
                                    <span>{id}</span>
                                    <input name={id}
                                           onChange={event => this.updateInput(id, event)}/>
                                    <button onClick={event => this.deleteRequestKey(id)}
                                            className="btn-light request-delete">
                                        {this.loadImage(deleteIcon)()}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </section>
                <div className="request-attribute-add">
                    <span>New Id</span>
                    <input name="add" value={this.state.newId} onChange={this.updateNewId}/>
                    <button className="btn-light" onClick={this.addNewInput}>+</button>
                </div>
                <button className="btn-light mt-3" onClick={event => {
                    console.debug(conditionCount)
                    this.props.onRequestPolicyAdvice(this.props.graph, this.state.data, policyCount, targetCount, subjectCount, resourceCount, actionCount, ruleCount, conditionCount, inputCount, valueCount)
                }}>Send
                    Request
                </button>
            </div>
        )
    }
}

export default connect(s => s.editor, d => bindActionCreators({onRequestPolicyAdvice}, d))(PolicyRequest);
