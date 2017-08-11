/**
 * Created by jakubniezgoda on 15/03/2017.
 */

Stage.defineWidget({
    id: 'graph',
    name: 'Deployment metric graph',
    description: 'Display graph with deployment metric data',
    initialWidth: 6,
    initialHeight: 20,
    showHeader: true,
    showBorder: true,
    isReact: true,
    color: "blue",
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        {id: "deploymentId", name: Stage.Lang.DEPLOYMENT_ID_NAME, placeHolder: Stage.Lang.DEPLOYMENT_ID_PLACEHOLDER, default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "metric", name: Stage.Lang.METRIC_NAME, placeHolder: Stage.Lang.METRIC_PLACEHOLDER, default: "memory_MemFree", type: Stage.Basic.GenericField.EDITABLE_LIST_TYPE,
         items: [{name: "cpu_total_system", value: "cpu_total_system"}, {name: "cpu_total_user", value: "cpu_total_user"},
                 {name: "memory_MemFree", value: "memory_MemFree"}, {name: "memory_SwapFree", value: "memory_SwapFree"},
                 {name: "loadavg_processes_running", value: "loadavg_processes_running"}]},
        {id: "from", name: Stage.Lang.TIME_RANGE_START_NAME, placeHolder: Stage.Lang.TIME_RANGE_START_PLACEHOLDER, default: "now() - 15m", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name:'last 15 minutes', value:'now() - 15m'}, {name:'last hour', value:'now() - 1h'}, {name:'last day', value: 'now() - 1d'}]},
        {id: "to", name: Stage.Lang.TIME_RANGE_END_NAME, placeHolder: Stage.Lang.TIME_RANGE_END_PLACEHOLDER, default: "now()", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name:'now', value:'now()'}]},
        {id: "resolution", name: Stage.Lang.TIME_RESOLUTION_VALUE_NAME,  placeHolder: Stage.Lang.TIME_RESOLUTION_VALUE_NAME, default: "1", type: Stage.Basic.GenericField.NUMBER_TYPE,
         min: Stage.Common.TimeConsts.MIN_TIME_RESOLUTION_VALUE, max: Stage.Common.TimeConsts.MAX_TIME_RESOLUTION_VALUE},
        {id: "unit", name: Stage.Lang.TIME_RESOLUTION_UNIT_NAME, placeHolder: Stage.Lang.TIME_RESOLUTION_UNIT_NAME, default: "m", type: Stage.Basic.GenericField.LIST_TYPE,
            items: Stage.Common.TimeConsts.TIME_RESOLUTION_UNITS},
        {id: "query", name: Stage.Lang.DATABASE_QUERY_NAME, placeHolder: Stage.Lang.DATABASE_QUERY_PLACEHOLDER, default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "type", name: Stage.Lang.GRAPH_TYPE_NAME, items: [{name:'Line chart', value:Stage.Basic.Graphs.Graph.LINE_CHART_TYPE}, {name:'Bar chart', value:Stage.Basic.Graphs.Graph.BAR_CHART_TYPE}],
         default: Stage.Basic.Graphs.Graph.LINE_CHART_TYPE, type: Stage.Basic.GenericField.LIST_TYPE},
        {id: "label", name: Stage.Lang.GRAPH_LABEL_NAME,  placeHolder: Stage.Lang.GRAPH_LABEL_PLACEHOLDER, default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "dataUnit", name: Stage.Lang.GRAPH_DATA_UNIT_NAME,  placeHolder: Stage.Lang.GRAPH_DATA_UNIT_PLACEHOLDER, default: "", type: Stage.Basic.GenericField.STRING_TYPE}
    ],

    _prepareData: function(data, xDataKey, yDataKey, yDataUnit) {
        const TIME_FORMAT = "HH:mm:ss";
        const MAX_NUMBER_OF_POINTS = 500;

        // Data optimization (show no more than MAX_NUMBER_OF_POINTS points on the graph)
        if (data.length > MAX_NUMBER_OF_POINTS) {
            let optimizedData = [];
            let delta = parseFloat(data.length / MAX_NUMBER_OF_POINTS);
            for (let i = 0; i < data.length; i = i + delta) {
                optimizedData.push(data[Math.floor(i)]);
            }
            data = optimizedData;
        }

        // Convert data to recharts format
        data = _.map(data, (element) => ({
            [xDataKey]: Stage.Utils.formatTimestamp(element[0], TIME_FORMAT, null),
            [yDataKey]: element[1]
        }));

        return data;
    },

    fetchParams: function(widget, toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId') || widget.configuration.deploymentId;

        let timeFilter = toolbox.getContext().getValue('timeFilter') || {};

        let timeStart = timeFilter.start;
        timeStart = timeStart ? `${moment(timeStart).unix()}s` : widget.configuration.from;

        let timeEnd = timeFilter.end;
        timeEnd = timeEnd ? `${moment(timeEnd).unix()}s` : widget.configuration.to;

        let timeResolutionValue = timeFilter.resolution;
        let timeResolutionUnit = timeFilter.unit;
        let timeGroup = timeResolutionValue && timeResolutionUnit
            ? `${timeResolutionValue}${timeResolutionUnit}`
            : `${widget.configuration.resolution}${widget.configuration.unit}`;

        return { deploymentId, timeStart, timeEnd, timeGroup };
    },

    fetchData: function(widget, toolbox, params) {
        let query = widget.configuration.query;
        let actions = new Stage.Common.InfluxActions(toolbox);

        if (!_.isEmpty(query)) {
            return actions.doRunQuery(query).then((data) => Promise.resolve({metrics: data}))
        } else {
            let deploymentId = params.deploymentId;
            let metric = widget.configuration.metric;
            if (!_.isEmpty(deploymentId) && !_.isEmpty(metric)) {
                let from = params.timeStart;
                let to = params.timeEnd;
                let timeGroup = params.timeGroup;
                return actions.doGetMetric(deploymentId, metric, from, to, timeGroup).then((data) => Promise.resolve({metrics: data}))
            } else {
                return Promise.resolve({metrics: []});
            }
        }
    },

    render: function(widget,data,error,toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId') || widget.configuration.deploymentId;
        let metric = widget.configuration.metric;
        let query = widget.configuration.query;
        if ((_.isEmpty(deploymentId) || _.isEmpty(metric)) && _.isEmpty(query)) {
            let {Message, Icon} = Stage.Basic;
            return (
                <Message>
                    <Icon name="ban" />
                    <span>{Stage.Lang.WARN_INVALID_CONFIG}</span>
                </Message>
            );
        }

        if (_.isEmpty(data) || _.isEmpty(data.metrics)) {
            return <Stage.Basic.Loading/>;
        }

        let {Graph} = Stage.Basic.Graphs;
        let label = widget.configuration.label;
        let type = widget.configuration.type;
        let dataUnit = widget.configuration.dataUnit;
        let preparedData = this._prepareData(data.metrics[0].points, Graph.DEFAULT_X_DATA_KEY, metric, dataUnit);

        return (
            <Graph yDataKey={metric} yDataUnit={dataUnit} data={preparedData} label={label} type={type} />
        );

    }
});