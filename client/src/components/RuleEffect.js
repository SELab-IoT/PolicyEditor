import React from 'react'
import Parse from "html-react-parser";
import InformationIcon from '../../public/image/information.svg';
import Popup from "reactjs-popup";
import RuleEffectTable from "./RuleEffectTable";

class RuleEffect extends React.Component {


    loadImage(icon) {
        const parsedIcon = Parse(icon); //  parse SVG once
        const Icon = () => parsedIcon; // convert SVG to react component
        return Icon
    }


    render() {
        const {graphView, graph, selected, effect, onRuleEffectChange} = this.props;

        return (
            <div>
                <Popup
                    modal={true}
                    position="bottom right"
                    trigger={
                        <button className="info-button">
                            {this.loadImage(InformationIcon)()}
                        </button>}
                    contentStyle={{width: '500px'}}
                >
                    <RuleEffectTable/>
                </Popup>

                <span>Effect: </span>
                <span> Permit </span>
                <input type="radio" name="effect" checked={effect === true} value={true}
                       onChange={event => onRuleEffectChange(graph, selected, event, graphView)}/>
                <span> Deny </span>
                <input type="radio" name="effect" checked={effect === false} value={false}
                       onChange={event => onRuleEffectChange(graph, selected, event, graphView)}/>
            </div>
        )
    }
}

export default RuleEffect;


