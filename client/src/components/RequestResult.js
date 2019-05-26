import React from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class RequestResult extends React.Component {

    render() {
        const {testResult} = this.props;
        return (
            <div className="result">
                {_.map(Object.keys(testResult).reverse(), key => {
                    return (
                        <section className="result-panel">
                            <h3 className="request-header">Result: {key}</h3>
                            <ul className="result-list">
                                <li className="result-column">
                                    <span>PolicyName</span>
                                    <span>Decision</span>
                                </li>
                                {_.map(Object.keys(testResult[key]), policyName => {
                                    return (
                                        <li className="result-column">
                                            <span>{policyName}</span>
                                            <span>{testResult[key][policyName]}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </section>
                    )
                })}
            </div>
        );
    }
}

export default connect(s => s.request, null)(RequestResult);
