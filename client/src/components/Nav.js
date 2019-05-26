import React from 'react';
import Drawer from "./Drawer";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {CHECK, CURRENT, onChangeOriginState, onCreatePolicy} from "../editor-actions";
import PolicyRequest from "./PolicyRequest";
import Popup from "reactjs-popup";
import CombineAlgTable from "./CombineAlgTable";


class Nav extends React.Component {
    render() {
        const {graph, originPolicyCount,
            originTargetCount,
            originSubjectCount,
            originResourceCount,
            originActionCount,
            originRuleCount,
            originConditionCount,
            originInputCount,
            originValueCount} = this.props;
        console.debug(this.props)
        return (
            <nav>
                <Drawer/>
                <span className="title">Policy Editor</span>
                <Popup position="bottom right" disabled={this.props.state===CHECK} trigger={<button hidden={this.props.state === CHECK} className="btn">Check Policy</button>}
                       contentStyle={{width: "330px"}}>
                    <PolicyRequest/>
                </Popup>
                <button className="btn"
                        hidden={this.props.state === CURRENT}
                        onClick={event => this.props.onChangeOriginState(this.props.originGraph,originPolicyCount, originTargetCount, originSubjectCount, originResourceCount, originActionCount, originRuleCount, originConditionCount, originInputCount, originValueCount)}>Back
                </button>
                <button className="btn" onClick={event => this.props.onCreatePolicy(graph, event)}>Make Policy</button>
                <Popup  trigger={<button className="btn">Info</button>} position="bottom center" contentStyle={{width: '500px'}}>
                    <CombineAlgTable />
                </Popup>
            </nav>
        );
    }
}


export default connect(s => s.editor, d => bindActionCreators({onCreatePolicy, onChangeOriginState}, d))(Nav);
