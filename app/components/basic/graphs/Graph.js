/**
 * Created by jakubniezgoda on 16/03/2017.
 */

import React, { Component, PropTypes } from 'react';
import {LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
let d3Format = require("d3-format");

// TODO: Update documentation - update data syntax, component properties, add multichart examples
/**
 * Graph is a component to present data in form of line or bar chart
 *
 * Data is array in the following format:
 * ```
 * [
 *     {
 *          <xDataKey>: <X data value 1>,
 *          <yDataKay>: <Y data value 1>,
 *     },
 *     {
 *          <xDataKey>: <X data value 2>,
 *          <yDataKay>: <Y data value 2>,
 *     },
 *     ...
 * ]
 * ```
 *
 * ## Access
 * `Stage.Basic.Graphs.Graph`
 *
 * ## Usage
 *
 * ### Bar chart
 * ![Graph 0](manual/asset/graphs/Graph_0.png)
 *
 * ```
 * let data1 = [
 *      {name: 'Oranges', value: 300},
 *      {name: 'Apples', value: 100},
 *      {name: 'Grapes', value: 80},
 *      {name: 'Pineapples', value: 40},
 *      {name: 'Watermelons', value: 30}
 * ];
 * return (<Graph xDataKey='name' yDataKey='value' data={data1} label='Number of fruits' type={Graph.BAR_CHART_TYPE} />);
 * ```
 *
 * ### Line chart
 * ![Graph 1](manual/asset/graphs/Graph_1.png)
 *
 * ```
 * let data2 = [
 *      {time: '17:30', value: 1},
 *      {time: '17:40', value: 2},
 *      {time: '17:50', value: 1},
 *      {time: '18:00', value: 3},
 *      {time: '18:10', value: 5},
 *      {time: '18:20', value: 8},
 *      {time: '18:30', value: 5}
 * ];
 * return (<Graph yDataKey='value' data={data2} label='CPU load' type={Graph.LINE_CHART_TYPE} />);
 * ```
 */
export default class Graph extends Component {

    /**
     *
     */
    static DEFAULT_X_DATA_KEY = 'time';
    /**
     *
     */
    static LINE_CHART_TYPE = 'line';
    /**
     *
     */
    static BAR_CHART_TYPE = 'bar';

    /**
     * propTypes
     * @property {object[]} data charts input data (see class description for the object details)
     * @property {string} type graph chart type ({@link Graph.LINE_CHART_TYPE} or {@link Graph.BAR_CHART_TYPE})
     * @property {object[]} charts charts configuration (see class description for the object details)
     * @property {string} [xDataKey=Graph.DEFAULT_X_DATA_KEY] X-axis key name, must match key in data object
     */
    static propTypes = {
        data: PropTypes.array.isRequired,
        type: PropTypes.string.isRequired,
        charts: PropTypes.array.isRequired,
        xDataKey: PropTypes.string
    };

    static defaultProps = {
        xDataKey: Graph.DEFAULT_X_DATA_KEY
    };

    render () {
        const CHART_COMPONENTS = { [Graph.LINE_CHART_TYPE] : LineChart, [Graph.BAR_CHART_TYPE] : BarChart};
        const DRAWING_COMPONENTS = { [Graph.LINE_CHART_TYPE] : Line, [Graph.BAR_CHART_TYPE] : Bar};
        const COLORS = ["#000069","#28aae1","#21ba45","#fbbd08","#af41f4"];

        const VALUE_FORMATTER = d3Format.format('.3s');
        const MARGIN = {top: 5, right: 30, left: 20, bottom: 5};
        const INTERPOLATION_TYPE = "monotone";
        const STROKE_DASHARRAY = "3 3";

        // Code copied from re-charts GitHub, see: https://github.com/recharts/recharts/issues/184
        const AxisLabel = ({ vertical, x, y, width, height, children, fill }) => {
            const CX = vertical ? x + 20 : x + (width / 2);
            const CY = vertical ? (height / 2) : y + height;
            const ROTATION = vertical ? `270 ${CX} ${CY}` : 0;
            const STYLE = {fill: fill, stroke: fill};
            return (
                <text x={CX} y={CY} transform={`rotate(${ROTATION})`} textAnchor="middle" style={STYLE}>
                    {children}
                </text>
            );
        };

        let ChartComponent = CHART_COMPONENTS[this.props.type];
        let DrawingComponent = DRAWING_COMPONENTS[this.props.type];
        return (
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={this.props.data} margin={MARGIN}>
                    {
                        _.map(this.props.charts, (chart, index)  => {
                            const COLOR = COLORS[index];
                            const STYLE = {stroke: COLOR};

                            return [
                                <YAxis key={chart.name} dataKey={chart.name} yAxisId={chart.name} width={80}
                                       axisLine={STYLE} tick={STYLE} tickLine={STYLE} tickFormatter={VALUE_FORMATTER}
                                       label={<AxisLabel vertical fill={COLOR}>{chart.unit}</AxisLabel>} />,
                                <DrawingComponent key={chart.name} isAnimationActive={false} name={chart.label} type={INTERPOLATION_TYPE}
                                                  dataKey={chart.name} stroke={COLOR} fill={COLOR} yAxisId={chart.name} />
                            ];
                        })
                    }
                    <CartesianGrid strokeDasharray={STROKE_DASHARRAY} />
                    <XAxis dataKey={this.props.xDataKey} />
                    <Tooltip formatter={VALUE_FORMATTER} />
                    <Legend />
                </ChartComponent>
            </ResponsiveContainer>
        );
    }
};
