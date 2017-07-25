/**
 * Created by jakubniezgoda on 24/07/2017.
 */

import {Table, Icon} from 'semantic-ui-react';
import GenericField from './GenericField';
import Popup from '../Popup';
import React, { Component, PropTypes } from 'react';

/**
 *
 *
 * ## Access
 *
 * ## Usage
 * ![](manual/asset/form/  _0.png)
 *
 * ```
 * ```
 *
 */
export default class EdiTable extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = EdiTable.initialState(props);
    }

    /**
     * propTypes
     * @property
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        rows: PropTypes.number.isRequired,
        columns: PropTypes.array.isRequired,
        onChange: PropTypes.func
    };

    static defaultProps = {
    }

    static initialState = (props) => {
        var fields = [];

        for (let rowIndex = 0; rowIndex < props.rows; rowIndex++) {
            fields[rowIndex] = {};
            for (let columnIndex = 0; columnIndex < props.columns.length; columnIndex++) {
                let columnName = props.columns[columnIndex].name;
                fields[rowIndex][columnName] = props.value && props.value[rowIndex]
                                               ? props.value[rowIndex][columnName]
                                               : '';
            }
        }

        return {fields};
    };

    _handleInputChange(proxy, field) {
        let [row,column] = _.split(field.name, '|');
        let value = GenericField.formatValue(field.genericType, field.genericType === Stage.Basic.GenericField.BOOLEAN_TYPE ? field.checked : field.value);

        // Component state update
        let fields = Object.assign({}, this.state.fields, {[row]: {...this.state.fields[row], [column]: value}});
        this.setState({fields});

        // Serialize table data
        let ediTableField = {
            name: this.props.name,
            genericType: GenericField.EDITABLE_TABLE_TYPE,
            value: fields
        }

        // Parent component update
        this.props.onChange(proxy, ediTableField);
    }

    render() {
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell key='-1' textAlign="center">No.</Table.HeaderCell>
                        {
                            _.map(this.props.columns, (column, index) =>
                                <Table.HeaderCell key={index} textAlign="center">
                                    <label>{column.label}&nbsp;
                                        {
                                            column.description &&
                                            <Popup>
                                                <Popup.Trigger><Icon name="help circle outline"/></Popup.Trigger>
                                                {column.description}
                                            </Popup>
                                        }
                                    </label>
                                </Table.HeaderCell>
                            )
                        }
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        _.times(this.props.rows, (index) =>
                            <Table.Row key={index}>
                                <Table.Cell key={`${index}|no`} textAlign="center">{index + 1}</Table.Cell>
                                {
                                    _.map(this.props.columns, (column) =>
                                        <Table.Cell key={`${index}|${column.name}`}>
                                            <GenericField {...column} type={column.type} description='' label=''
                                                          name={`${index}|${column.name}`}
                                                          value={this.state.fields[index][column.name]}
                                                          onChange={this._handleInputChange.bind(this)} />
                                        </Table.Cell>
                                    )
                                }
                            </Table.Row>
                        )
                    }
                </Table.Body>
            </Table>
        );
    }
}
