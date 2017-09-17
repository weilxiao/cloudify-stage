/**
 * Created by kinneretzin on 13/09/2017.
 */

import MonitoringGraphs from './MonitoringGraphs';

const NO_DATA = 'noData';

Stage.defineWidget({
    name: "Hackathon Monitoring widget",
    description: '',
    initialWidth: 12,
    initialHeight: 25,
    color: "purple",
    isReact: true,
    hasStyle: true,
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(60),
        {
            id: 'vmFieldName',
            name: 'vm field name',
            default: 'host',
            placeHolder: 'Enter the vm field name for the influx measurements tables',
            description: 'The vm field name in the influx table',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'isManager',
            name: 'shuld show manager own info',
            default: false,
            //placeHolder: 'Enter the vm field name for the influx measurements tables',
            description: 'Should we show manager information or all other vms information',
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchData(widget,toolbox/*,params*/) {
        var vms = [];
        var selectedMeasurement = toolbox.getContext().getValue('selectedMeasurement');
        var selectedVm = toolbox.getContext().getValue('selectedVm');

        if (!selectedMeasurement && !selectedVm) {
            selectedMeasurement = 'mem';
        }

        var startDate = toolbox.getContext().getValue('filterStateDate');
        var endDate = toolbox.getContext().getValue('filterEndDate');

        var filterStartTime = startDate ? `${moment(startDate).unix()}s` : 'now()-1h';
        var filterEndTime  = endDate ? `${moment(endDate).unix()}s` :'now()';

        var measurementsList = toolbox.getConfig().monitoringGraphs;
        var vmFieldName = widget.configuration.vmFieldName;
        var isManager = widget.configuration.isManager;

        if (isManager) {
            selectedVm = 'Manager';
            selectedMeasurement = null;
        }

        return toolbox.getInternal().doGet('/monitor/query1', {q:
        `SHOW TAG values FROM ${selectedMeasurement || 'mem'} with key=${vmFieldName} ` +
        `where tenant='${toolbox.getManager().getSelectedTenant()}' `})
            .then(vmsList=>{

                vms = _.map(vmsList,'value');

                var queries = [];

                if (isManager) {
                    _.each(measurementsList,(measurementData,measurement)=>{

                        var fieldsSelect = _.join(_.map(measurementData.fields,f=>{
                            return `mean(${f}) as ${f}`;
                        }),',');

                        queries.push(
                            `select ${fieldsSelect} from ${measurement} `+
                            `where time > ${filterStartTime} and time < ${filterEndTime} ` +
                            `and tenant='manager' ` +
                            `group by time(1m)`
                        )
                    })

                } else if (selectedMeasurement) {
                    var graphsConfig = measurementsList[selectedMeasurement];
                    var fieldsSelect = _.join(_.map(graphsConfig.fields,f=>{
                        return `mean(${f}) as ${f}`;
                    }),',');

                    _.each(vms,vm=>{
                        queries.push(
                            `select ${fieldsSelect} from ${selectedMeasurement} ` +
                            `where time > ${filterStartTime} and time < ${filterEndTime} ` +
                            `and ${vmFieldName}='${vm}' ` +
                            `group by time(1m)`);
                    });
                } else {
                    _.each(measurementsList,(measurementData,measurement)=>{

                        var fieldsSelect = _.join(_.map(measurementData.fields,f=>{
                            return `mean(${f}) as ${f}`;
                        }),',');

                        queries.push(
                            `select ${fieldsSelect} from ${measurement} `+
                            `where time > ${filterStartTime} and time < ${filterEndTime} ` +
                            `and ${vmFieldName}='${selectedVm}' ` +
                            `group by time(1m)`
                        )
                    })
                }

                console.debug(queries);

                var query = _.join(queries,';');
                if (_.isEmpty(query)) {
                    return Promise.resolve([]);
                } else {
                    return toolbox.getInternal().doGet('/monitor/query1', {q: query});
                }
            })
            .then(results=>{
                var data = [];
                if (isManager || selectedVm) {
                    if (measurementsList.length === 1) {
                        results = [results];
                    }
                    var index=0;
                    _.each(measurementsList,(measurementData,measurement)=>{
                        if (data.length < 9 && results[index].length > 0) {
                            data.push({
                                measurement,
                                result: results[index]
                            });
                        }
                        index++;
                    })
                } else {
                    if (vms.length === 1) {
                        results = [results];
                    }

                    _.each(vms,(vm,index)=>{
                        if (data.length < 9 && results[index].length > 0) {
                            data.push({
                                vm,
                                result: results[index]
                            });
                        }
                    });
                }

                return {
                    vms,
                    selectedMeasurement,
                    selectedVm,
                    measurementsList,
                    filterStartTime,
                    filterEndTime,
                    isManager,
                    data
                }
            });
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        console.log('Influx response is: ',data);

        return <MonitoringGraphs data={data} toolbox={toolbox}/>;
    }

});