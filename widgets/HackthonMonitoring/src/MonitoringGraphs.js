/**
 * Created by kinneretzin on 13/09/2017.
 */

import SingleGraphModal from './SingleGraphModal';
import MonitoringGraphsFilter from './MonitoringGraphsFilter';

const measurementOptions = [
    {text: 'Memory', value: 'mem'},
    {text: 'CPU', value: 'cpu'},
    {text: 'Processes', value: 'processes'},
    {text: 'Disk', value: 'disk'},
    {text: 'Swap', value: 'swap'},
    {text: 'System', value: 'system'}
];

const graphSizesOptions = {
    'XL' : { size: 1 , height: '350px'},
    'L' : { size: 2 , height: '300px'},
    'M' : { size: 3 , height: '250px'},
    'S' : { size: 4 , height: '200px'}
};

const NO_DATA = 'noData';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            showSingleGraphModal: false,
            selectedGraph: {},
            graphSizes:'M'
        };

        this._onChartClicked = this._onChartClicked.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _onChartClicked(graphData,chartConfig) {
        if (this.props.data.selectedMeasurement) {
            var measurementOption = _.find(measurementOptions,{value:this.props.data.selectedMeasurement});
            var measurementTitle = measurementOption ? measurementOption.text : 'NA';

            this.setState({
                showSingleGraphModal: true,
                selectedGraph: graphData,
                measurementTitle: measurementTitle,
                selectedChartConfig: chartConfig
            })
        } else if (this.props.data.selectedVm){
            var measurementOption = _.find(measurementOptions,{value:graphData.measurement});
            var measurementTitle = measurementOption ? measurementOption.text : 'NA';

            this.setState({
                showSingleGraphModal: true,
                selectedGraph: graphData,
                measurementTitle: measurementTitle,
                selectedChartConfig: chartConfig
            })

        }
    }

    _buildGraphs () {
        let {Grid,Popup,Message, Icon} = Stage.Basic;
        let {Graph} = Stage.Basic.Graphs;
        var graphHeight = graphSizesOptions[this.state.graphSizes].height;

        if (this.props.data.selectedMeasurement) {
            var graphsConfig = this.props.data.measurementsList[this.props.data.selectedMeasurement];
            var chartConfig = [{
                name: graphsConfig.name,
                label: graphsConfig.name,
                axisLabel: '',
                fieldNames: graphsConfig.fields
            }];

            return _.map(this.props.data.data,graphData=>{
                return (
                    <Grid.Column key={graphData.vm} style={{height: graphHeight}}>
                        <div className='monitoringVmTitle'>
                            <Popup>
                                <Popup.Trigger><span>{graphData.vm}</span></Popup.Trigger>
                                {'Shows monitoring graph for vm: ' + graphData.vm}
                            </Popup>
                        </div>

                        <Graph type={Stage.Basic.Graphs.Graph.AREA_CHART_TYPE}
                               data={graphData.result}
                               syncId='myGraph'
                               onClick={_.partial(this._onChartClicked,graphData,chartConfig)}
                               charts={chartConfig}
                               showLegend={true}
                               xAxisTimeFormat={'HH:mm'}
                            />
                    </Grid.Column>
                );
            })
        } else if (this.props.data.selectedVm){
            return _.map(this.props.data.data,graphData=>{
                var graphsConfig = this.props.data.measurementsList[graphData.measurement];
                var chartConfig = [{
                    name: graphsConfig.name,
                    label: graphsConfig.name,
                    axisLabel: '',
                    fieldNames: graphsConfig.fields
                }];

                return (
                    <Grid.Column key={graphData.measurement} style={{height: graphHeight}}>
                        <div className='monitoringVmTitle'>
                            <Popup>
                                <Popup.Trigger><span>{graphData.measurement}</span></Popup.Trigger>
                                {'Shows monitoring graph for measurement: ' + graphData.measurement}
                            </Popup>
                        </div>

                        <Graph type={Stage.Basic.Graphs.Graph.AREA_CHART_TYPE}
                               data={graphData.result}
                               syncId='myGraph'
                               onClick={_.partial(this._onChartClicked,graphData,chartConfig)}
                               charts={chartConfig}
                               showLegend={true}
                               xAxisTimeFormat={'HH:mm'}
                            />
                    </Grid.Column>
                );
            });
        } else {
            return (
                <Message>
                    <Icon name="ban" />
                            <span>
                            You have to select either a VM or a Measurement
                            </span>
                </Message>
            );
        }
    }

    render() {
        let {Grid,Message,Icon} = Stage.Basic;

        var columns = graphSizesOptions[this.state.graphSizes].size; //this.props.data.data.length <3 ? this.props.data.data.length : 3;

        return (

            <div>
                <MonitoringGraphsFilter isManager={this.props.data.isManager}
                                        toolbox={this.props.toolbox}
                                        vms={this.props.data.vms}
                                        measurements={measurementOptions}
                                        selectedMeasurement={this.props.data.selectedMeasurement}
                                        selectedVm={this.props.data.selectedVm}
                                        graphSizes={this.state.graphSizes}
                                        onGraphSizesChanges={(newSize)=>this.setState({graphSizes:newSize})}/>
                {
                    _.isEmpty(this.props.data.data) ?
                        <Message>
                            <Icon name="ban" />
                            <span>
                            There is no available graph data for the selected configuration or time frame
                            </span>
                        </Message>
                        :
                        <Grid columns={columns}>
                            {this._buildGraphs()}
                        </Grid>
                }


                <SingleGraphModal open={this.state.showSingleGraphModal}
                                  onHide={()=>this.setState({showSingleGraphModal : false})}
                                  toolbox={this.props.toolbox}
                                  graph={this.state.selectedGraph}
                                  measurementTitle={this.state.measurementTitle}
                                  vmTitle={this.props.data.selectedVm ? this.props.data.selectedVm : this.state.selectedGraph.vm}
                                  chartConfig={this.state.selectedChartConfig}/>

            </div>

        );
    }
}