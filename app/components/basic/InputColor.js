/**
 * Created by jakubniezgoda on 11/04/2017.
 */

import { CompactPicker } from 'react-color';
import React, { Component, PropTypes } from 'react';

export default class InputColor extends Component {

    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired
    };

    render() {
        let tinycolor = require('tinycolor2');
        let color = tinycolor(this.props.value);

        return (
            <CompactPicker color={color.toHsl()} onChangeComplete={this.props.onChange} />
        );
    }
}
