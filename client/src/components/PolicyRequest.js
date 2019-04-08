import React from 'react';
import _ from 'lodash';
class PolicyRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newId: '',
            ids: [],
            values:[],
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

    render() {
        return (
            <div>
                {_.map(this.state.ids, (id)=> {
                    return (
                        <div><span>{id}: <input name={id} onChange={event => this.updateInput(id, event)}/></span></div>
                    );
                })}
                <div>
                    <input name="add" value={this.state.newId} onChange={this.updateNewId} />
                    <button onClick={this.addNewInput}>+</button>
                    <button onClick={event => this.props.onRequestPolicyAdvice(this.state.data)}>Send Request</button>
                </div>
            </div>
        )
    }
}

export default PolicyRequest;
