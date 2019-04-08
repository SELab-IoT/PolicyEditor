import React from 'react';


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
        console.log(event.target.value)
        this.setState(
            {
                nodeTitle: event.target.value || "value"
            }
        );
    }

    onChangeText(event) {
        console.log(event.target.value)
        this.props.onChangeText(event.target.value);
    }

    render() {
        const type = this.props.type;
        const value = this.props.default;
        console.log(value)
        if (type === INPUT) {
            return (
                <div className="d-inline">
                    <input
                        type="text"
                        onBlur={this.handleTitleChange}
                        placeholder={this.state.nodeTitle}
                    />
                    <button onClick={event => this.props.onChangeText(this.state.nodeTitle)}>Change Text</button>
                </div>
            )
        } else if (type === CONDITION_FUNCTION) {
            console.log(value)
            return (
                <div className="d-inline">
                    <select
                        name="condition-function"
                        defaultValue={value}
                        onChange={event => this.onChangeText(event)}
                    >
                        <option value={'equal'}>equal</option>
                        <option value={'greater'}>greater</option>
                        <option value={'less'}>less</option>
                    </select>
                </div>
            )
        } else if (type === RULE_FUNCTION) {
            return <div className="d-inline">
                <span>Function: </span>
                <span> AND </span>
                <input type="radio" name="function" checked={value === 'and'} value="and"
                       onChange={event => this.props.onRuleFunctionChange(event.target.value)}/>
                <span> OR </span>
                <input type="radio" name="function" checked={value === 'or'} value="or"
                       onChange={event => this.props.onRuleFunctionChange(event.target.value)}/>
            </div>
        }
    }
}

export default ChangeInput;
