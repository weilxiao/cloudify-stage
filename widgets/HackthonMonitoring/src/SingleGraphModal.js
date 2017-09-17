/**
 * Created by kinneretzin on 13/09/2017.
 */


export default class SingleGraphModal extends React.Component {

    constructor(props,context) {
        super(props, context);

        this.state = {open: false}
    }

    static defaultProps = {
        onHide: ()=>{}
    };

    onCancel () {
        this.props.onHide();
        return true;
    }

    render() {
        let {Modal, CancelButton} = Stage.Basic;
        let {Graph} = Stage.Basic.Graphs;

        return (
            <Modal open={this.props.open} size='fullscreen'>
                <Modal.Header>
                    {this.props.measurementTitle} graph for {this.props.vmTitle}
                </Modal.Header>

                <Modal.Content>
                    <div style={{width: '100%',height:'450px'}}>
                        {
                            this.props.graph && this.props.graph.result &&
                            <Graph type={Stage.Basic.Graphs.Graph.AREA_CHART_TYPE}
                                   data={this.props.graph.result}
                                   charts={this.props.chartConfig}
                                   xAxisTimeFormat={'HH:mm'}
                                   showBrush={true}
                                   customXAxisTick={<CustomizedAxisTick/>}/>
                        }
                    </div>

                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                </Modal.Actions>
            </Modal>
        );
    }
};

const CustomizedAxisTick = React.createClass({
    render () {
        const {x, y, stroke, payload} = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
            </g>
        );
    }
});
