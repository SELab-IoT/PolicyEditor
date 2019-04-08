import React from 'react'
import {RULE_TYPE} from "./graph-config";

export default ({checked, effect, onRuleEffectChange}) => {
    if (checked !== null && checked.type === RULE_TYPE) {
        return (
            <div className="d-inline ml-3">
                <span>Effect: </span>
                <span> Permit </span>
                <input type="radio" name="effect" checked={effect === true} value={true}
                       onChange={event => onRuleEffectChange(event)}/>
                <span> Deny </span>
                <input type="radio" name="effect" checked={effect === false} value={false}
                       onChange={event => onRuleEffectChange(event)}/>
            </div>)
            ;
    } else {
        return (
            <div className="d-inline"/>
        )
    }
}


