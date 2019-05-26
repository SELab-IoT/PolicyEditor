import React from 'react';
import Parse from "html-react-parser";
import menuIcon from "../../public/image/menu.svg";

class RightDrawer extends React.Component {
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

export default RightDrawer;
