import React from 'react';
import _ from "lodash";
import '../../public/css/right-sidebar.scss'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {handleChangeCombineAlg, onRuleEffectChange} from "../editor-actions";
import ValueEditor from "./ValueEditor";

class RightSidebar extends React.Component {
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

    loadClassName() {
        const isShow = this.props.editor.selected !== null &&
        (this.props.editor.selected.type !== 'specialEdge' &&
            this.props.editor.selected.type !== 'emptyEdge'
        ) ? 'show' : 'collapsed';
        if (this.props.editor.selected !== null) {
            console.debug(this.props.editor.selected)
            return 'right-sidebar ' + isShow + ' ' + this.props.editor.selected.type;
        } else {
            return 'right-sidebar'
        }
    }

    loadBackGroundClassName() {
        if (this.props.editor.selected === null) return "";
        return "node " + this.props.editor.selected.type;
    }

    render() {
        return (
            <div className={this.loadClassName()}>
                <div className={this.loadBackGroundClassName()}>
                    <div className="value-editor-content">
                        <ValueEditor GraphView={this.props.GraphView} node={this.props.editor.selected}/>
                    </div>
                </div>
            </div>
        );
    }


}

function mapStateToProps(state) {
    return {sidebar: state.rightSidebar, editor: state.editor}
}

export default connect(mapStateToProps, d => bindActionCreators({
    onRuleEffectChange,
    handleChangeCombineAlg
}, d))(RightSidebar);
