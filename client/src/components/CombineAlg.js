import React from 'react';
import {NODE_KEY, POLICY_TYPE, RULE_TYPE} from "./graph-config";
import Popup from "reactjs-popup";
import CombineAlgTable from './CombineAlgTable'

class CombineAlg extends React.Component {
    constructor(props) {
        console.debug(props)
        super(props)
        this.state = {
            alg: 'permit-unless-deny'
        }

        this.onChange = this.onChange.bind(this)
    }

    getNodeIndexById(graph, id) {
        return graph.nodes.findIndex((node) => {
            return node[NODE_KEY] === id;
        });
    }

    getRules(selected, graph) {
        let rules = [];
        const edges = graph.edges;
        edges.forEach(edge => {
            if (edge.source === selected.id) {
                const target = graph.nodes[this.getNodeIndexById(graph, edge.target)]
                if (target.type === RULE_TYPE)
                    rules.push(target)
            }
        });
        return rules;
    }

    onChange(event, onChange) {
        this.setState({alg: event.target.value})
        onChange(event)
    }

    render() {
        const onChange = this.props.onChange;
        const {graph, selected, graphView} = this.props;

        if (selected != null && selected.type === POLICY_TYPE) {

            return (
                <div className="mb-3">
                    <span>Combine Alg: </span>
                    <select
                        className="custom-select-sm"
                        name="combine-algorithm"
                        defaultValue={this.props.selected.combineAlg}
                        onChange={event => onChange(graph, selected, event, graphView)}
                    >
                        <option value={'permit-unless-deny'}>PermitUnlessDeny</option>
                        <option value={'deny-unless-permit'}>DenyUnlessPermit</option>
                        <option value={'permit-overrides'}>PermitOverrides</option>
                        <option value={'deny-overrides'}>DenyOverrides</option>
                    </select>
                </div>
            )
        } else {
            return null;
        }
    }
}

export default CombineAlg;
