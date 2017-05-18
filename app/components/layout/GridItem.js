/**
 * Created by kinneretzin on 13/12/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class GridItem extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        x: PropTypes.number,
        y: PropTypes.number,
        width : PropTypes.number,
        height: PropTypes.number,
        className: PropTypes.string,
        onItemAdded: PropTypes.func,
        onItemRemoved: PropTypes.func,
        onItemMinimized: PropTypes.func,
        maximized: PropTypes.bool,
        minimized: PropTypes.bool,
        savedHeight: PropTypes.number
    };

    static defaultProps = {
        x: undefined,
        y: undefined,
        width: 1,
        height: 1,
        className: '',
        maximized: false,
        minimized: false,
        onItemAdded: ()=>{},
        onItemRemoved:  ()=>{},
        onItemMinimized:  ()=>{}
    };

    componentDidMount() {
        this.props.onItemAdded(this.props.id);
    }

    componentWillUnmount() {
        this.props.onItemRemoved(this.props.id);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.minimized !== prevProps.minimized) {
            this.props.onItemMinimized(this.props.id, this.props.minimized, this.props.savedHeight);
        }
    }

    render() {
        return (
            <div id={this.props.id} ref='item'
                 className={`grid-stack-item ${this.props.maximized?'maximize':''} ${this.props.minimized?'minimize':''} ${this.props.className}`}
                 data-gs-auto-position={!(this.props.x !== undefined && this.props.y !== undefined)}
                 data-gs-x={this.props.x}
                 data-gs-y={this.props.y}
                 data-gs-width={this.props.width}
                 data-gs-height={this.props.height}>

                <div className='grid-stack-item-content'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

