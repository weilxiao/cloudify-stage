/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

export default class Manager extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired
    };

    componentWillMount() {
        this.props.fetchManagerStatus(this.props.manager);
    }

    renderStatusIcon(status) {
        if (!status) return <i className="circle icon statusIcon"/>;
        if (status === 'running') return <i className="circle icon green statusIcon"/>;
        return <i className="circle icon red statusIcon"/>;
    }
    render() {
        return (
            <div className='manager'>
                {this.props.manager.ip}
                {this.renderStatusIcon(this.props.manager.status)}
            </div>
        );
    }
}

