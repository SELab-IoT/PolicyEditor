import * as React from 'react';

const sidebarClass = {
    CLOSED: 'closed',
    OPEN: 'open'
};

const directionOpposites = {
    down: 'up',
    left: 'right',
    right: 'left',
    up: 'down'
};

const defaultProps = {
    direction: 'left',
    size: '130px'
};

export default class Sidebar extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            direction: 'left',
            size: '130px',
            sidebarClass: sidebarClass.OPEN,
        };
    }

    toggleContainer() {
        const originalValue = this.state.sidebarClass;
        let newValue = sidebarClass.CLOSED;
        if (originalValue === newValue) {
            newValue = sidebarClass.OPEN;
        }
        this.setState({
            sidebarClass: newValue,
        });
    }

    classNames(...args) {
        let className = '';
        for (const arg of args) {
            if (typeof arg === 'string' || typeof arg === 'number') {
                className += ` ${arg}`;
            } else if (typeof arg === 'object' && !Array.isArray(arg) && arg !== null) {
                Object.keys(arg).forEach((key) => {
                    if (Boolean(arg[key])) {
                        className += ` ${key}`;
                    }
                });
            } else if (Array.isArray(arg)) {
                className += ` ${arg.join(' ')}`;
            }
        }

        return className.trim();
    }

    getContainerClasses() {
        const classes = ['sidebar-main-container'];
        classes.push(this.state.sidebarClass || '');
        return this.classNames(classes);
    }

    getContainerStyle(size, direction) {
        if (direction === 'up' || direction === 'down') {
            return {height: `${size}`, maxHeight: `${size}`};
        }
        return {width: `${size}`, maxWidth: `${size}`};
    }

    getArrowIconClasses(direction) {
        const classes = ['icon'];
        if (this.state.sidebarClass === sidebarClass.CLOSED) {
            classes.push(`icon_${directionOpposites[direction]}-arrow`);
        } else {
            classes.push(`icon_${direction}-arrow`);
        }
        return this.classNames(classes);
    }

    renderToggleBar(direction) {
        return (
            <div
                className="sidebar-toggle-bar"
                onClick={this.toggleContainer}
            >
                <i className={this.getArrowIconClasses(direction)} />
            </div>
        );
    }

    render() {
        const {children, direction, size} = this.props;
        const sidebarClassName = this.classNames('sidebar', direction);
        return (
            <div className={sidebarClassName}>
                <div
                    className={this.getContainerClasses()}
                    style={this.getContainerStyle(size, direction)}
                >
                    {children}
                </div>
                <div
                    className="sidebar-toggle-bar"
                    onClick={this.toggleContainer}
                >
                    <i className={this.getArrowIconClasses(direction)} />
                </div>
            </div>
        );
    }
}
