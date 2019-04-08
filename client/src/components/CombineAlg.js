import React from 'react';
import {NODE_KEY, POLICY_TYPE, RULE_TYPE} from "./graph-config";
import Popup from "reactjs-popup";
import CombineAlgTable from './CombineAlgTable'

class CombineAlg extends React.Component {
    constructor(props) {
        console.log(props)
        super(props)

        let defaultAlg = 'permit-unless-deny';
        if (this.props.selected != null && this.props.selected.combineAlg != undefined) {
            defaultAlg = selected.combineAlg
        }
        this.state = {
            alg: defaultAlg
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
        const graph = this.props.graph;
        const selected = this.props.selected;
        const onChange = this.props.onChange;

        if (selected != null && selected.type === POLICY_TYPE) {

            return (
                <div className="d-inline ml-3">
                    <span>Combine Alg: </span>
                    <select
                        name="combine-algorithm"
                        defaultValue={this.state.alg}
                        onChange={event => this.onChange(event, onChange)}
                    >
                        <option value={'permit-unless-deny'}>PermitUnlessDeny</option>
                        <option value={'deny-unless-permit'}>DenyUnlessPermit</option>
                        <option value={'permit-overrides'}>PermitOverrides</option>
                        <option value={'deny-overrides'}>DenyOverrides</option>
                    </select>
                    <Popup trigger={<button className="ml-2">Info</button>} position="bottom center" contentStyle={{width: "500px"}}>
                        <CombineAlgTable alg={this.state.alg} data={this.getRules(selected, graph)}/>
                    </Popup>
                </div>
            )
        } else {
            return null;
        }
    }
}

export default CombineAlg;
