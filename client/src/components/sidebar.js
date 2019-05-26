import * as React from 'react';
import '../../public/css/sidebar.css'
import {connect} from "react-redux";
import _ from "lodash";
import {bindActionCreators} from "redux";
import {onTestRequest} from "../editor-actions";

import minimizeIcon from '../../public/image/minimize.svg'
import maximizeIcon from '../../public/image/maximize.svg'
import deleteIcon from '../../public/image/delete.svg'
import Parse from "html-react-parser";
import RequestResult from "./RequestResult";

class Sidebar extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            newId: '',
            newIds: {},
            requests: {'request1': {'subject': 'Father'}},
            newRequestName: '',
            isCollapsed: []
        };


        this.updateNewId = this.updateNewId.bind(this);
        this.addNewInput = this.addNewInput.bind(this);
    }

    updateNewRequestName = (event) => {
        const newRequestName = event.target.value;
        this.setState({newRequestName})
    };

    addNewRequest = () => {
        const requests = this.state.requests;
        requests[this.state.newRequestName] = {};
        this.setState({requests})
    };

    addNewInput(id) {
        const newId = this.state.newIds[id];
        const requests = this.state.requests[id]
        requests[newId] = {}
        this.setState(requests)
    }

    updateNewId(id, event) {
        const newIds = this.state.newIds;
        newIds[id] = event.target.value;
        this.setState({newIds})
    }


    updateInput(key, requestKey, event) {
        const requests = this.state.requests;
        requests[key][requestKey] = event.target.value;
        this.setState({requests});
    }

    deleteRequestKey(key, requestKey) {
        const requests = this.state.requests
        delete requests[key][requestKey];
        this.setState({requests})
    }

    loadClassName() {
        const isShow = this.props.sidebar.isShow ? 'show' : 'collapsed';
        return 'sidebar ' + isShow;
    }

    minimize = (key) => {
        const isCollapsed = this.state.isCollapsed;
        if (isCollapsed.includes(key)) {
            const i = isCollapsed.indexOf(key)
            isCollapsed.splice(i, 1)
        } else {
            isCollapsed.push(key)
        }
        this.setState({isCollapsed})
    };

    loadRequestClassName(origin, key) {
        const isCollapsed = this.state.isCollapsed;
        if (isCollapsed.includes(key)) {
            return origin + " request-collapsed"
        } else {
            return origin + " request-show"
        }
    }

    loadImage(icon) {
        const parsedIcon = Parse(icon); //  parse SVG once
        const Icon = () => parsedIcon; // convert SVG to react component
        return Icon
    }

    loadToggleImage(key) {
        const isCollapsed = this.state.isCollapsed;
        if (isCollapsed.includes(key)) {
            return this.loadImage(maximizeIcon)()
        } else {
            return this.loadImage(minimizeIcon)()
        }
    }

    makeRequestInput(key) {
        const requests = this.state.requests;
        const requestKeys = Object.keys(requests[key]);
        return (
            <div className="request">
                <button className="btn-light minimize" onClick={event => this.minimize(key)}>
                    {this.loadToggleImage(key)}
                </button>
                <section>
                    <h3 className="request-header">Request: {key}</h3>
                    <ul className={this.loadRequestClassName("request-list", key)}>
                        {_.map(requestKeys, requestKey => {
                            return (
                                <li className="request-column">
                                    <span>{requestKey}</span>
                                    <input name={requestKey}
                                           onChange={event => this.updateInput(key, requestKey, event)}/>
                                    <button onClick={event => this.deleteRequestKey(key, requestKey)}
                                            className="btn-light request-delete">
                                        {this.loadImage(deleteIcon)()}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </section>
                <div className={this.loadRequestClassName('request-attribute-add', key)}>
                    <span>new Id: </span>
                    <input name="add" value={this.state.newIds[key]}
                           onChange={event => this.updateNewId(key, event)}/>
                    <button className="btn-light" onClick={event => this.addNewInput(key)}>+</button>
                </div>
            </div>
        )

    }

    render() {
        const requests = this.state.requests;
        const keys = Object.keys(requests);

        return (
            <div className={this.loadClassName()}>
                {_.map(keys, key => {
                    return this.makeRequestInput(key)

                })}
                <div>
                    <div className="request-add">
                        <span>Name: </span>
                        <input name="add" value={this.state.newRequestName} onChange={this.updateNewRequestName}/>
                        <button className="btn-light" onClick={this.addNewRequest}>+</button>

                    </div>
                    <div className="request-test">
                        <button
                            className="btn-light"
                            onClick={event => this.props.onTestRequest(this.props.editor.graph, this.state.requests)}>Test
                            Request
                        </button>
                    </div>
                </div>
                <RequestResult />
            </div>
        );
    }


}

function mapStateToProps(state) {
    return {sidebar: state.sidebar, editor: state.editor}
}

export default connect(mapStateToProps, d => bindActionCreators({onTestRequest}, d))(Sidebar);
