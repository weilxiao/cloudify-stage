/**
 * Created by jakubniezgoda on 16/03/2017.
 */

import React, { Component, PropTypes } from 'react';
import {LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

// TODO: Update documentation
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
 * ```
 *
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
    static MAX_NUMBER_OF_CHARTS = 5;
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
     * @property {object[]} data graph input data
     * @property {string} type graph chart type ({@link Graph.LINE_CHART_TYPE} or {@link Graph.BAR_CHART_TYPE})
     * @property {string[]} yDataKeys Y-axis key names, must match keys used in data object
     * @property {string} [xDataKey=Graph.DEFAULT_X_DATA_KEY] X-axis key name, must match key in data object
     */
    static propTypes = {
        data: PropTypes.array.isRequired,
        type: PropTypes.string.isRequired,
        yDataKeys: PropTypes.array.isRequired,
        xDataKey: PropTypes.string
    };

    render () {
        const MARGIN = {top: 5, right: 30, left: 20, bottom: 5};
        const INTERPOLATION_TYPE = "monotone";
        const STROKE_DASHARRAY = "3 3";
        const COLORS = ["#252ad8","#52f441","#cff400","#f40024","#af41f4"];

        let numberOfMetrics = _.isArray(this.props.yDataKeys) && this.props.yDataKeys.length || 1;
        if (numberOfMetrics > Graph.MAX_NUMBER_OF_CHARTS) {
            numberOfMetrics = Graph.MAX_NUMBER_OF_CHARTS;
        }
        let graphComponents = [];
        for(let i = 0; i < numberOfMetrics; i++) {
            const STROKE = COLORS[i];
            const Y_AXIS_FORMAT = {stroke: COLORS[i]};
            let yDataKey = this.props.yDataKeys[i];

            graphComponents.push(<YAxis key={yDataKey} dataKey={yDataKey} yAxisId={yDataKey}
                              axisLine={Y_AXIS_FORMAT} tick={Y_AXIS_FORMAT} tickLine={Y_AXIS_FORMAT} />);
            if (this.props.type == Graph.LINE_CHART_TYPE) {
                graphComponents.push(<Line key={yDataKey} isAnimationActive={false} name={yDataKey} type={INTERPOLATION_TYPE}
                                           dataKey={yDataKey} stroke={STROKE} yAxisId={yDataKey} />)
            } else {
                graphComponents.push(<Bar key={yDataKey} isAnimationActive={false} name={yDataKey} type={INTERPOLATION_TYPE}
                                           dataKey={yDataKey} fill={STROKE} yAxisId={yDataKey} />)
            }
        }

        return (
            <ResponsiveContainer width="100%" height="100%">
                {
                    this.props.type == Graph.LINE_CHART_TYPE
                    ?
                        <LineChart data={this.props.data}
                                   margin={MARGIN}>
                            <XAxis dataKey={this.props.xDataKey} />
                            {graphComponents}
                            <CartesianGrid strokeDasharray={STROKE_DASHARRAY} />
                            <Tooltip />
                            <Legend />
                        </LineChart>
                    :
                        <BarChart data={this.props.data}
                                  margin={MARGIN}>
                            <XAxis dataKey={this.props.xDataKey} />
                            {graphComponents}
                            <CartesianGrid strokeDasharray={STROKE_DASHARRAY} />
                            <Tooltip />
                            <Legend />
                        </BarChart>
                }
            </ResponsiveContainer>
        );
    }
};
