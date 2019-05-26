import React from 'react';
import menuIcon from "../../public/image/menu.svg";
import Parse from "html-react-parser";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {openSidebar} from "../actions";

class Drawer extends React.Component {

    constructor(props) {
        super(props);
    }

    loadImage(icon) {
        const parsedIcon = Parse(icon); //  parse SVG once
        const Icon = () => parsedIcon; // convert SVG to react component
        return Icon
    }

    onClickSidebar() {
        const {openSidebar} = this.props;

        openSidebar();
    }

    render() {
        return (
            <div className="d-inline">
                <button className="menu" onClick={::this.onClickSidebar}>
                    {this.loadImage(menuIcon)()}
                </button>
            </div>
        )
    }
}

export default connect(s => s.sidebar, d=> bindActionCreators({openSidebar},d))(Drawer);
