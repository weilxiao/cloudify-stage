/**
 * Created by kinneretzin on 30/01/2017.
 */

import TopologyDrawer from './TopologyDrawer';
import TopologyDataParser from './TopologyDataParser';


export default class Topology extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            topologyData: TopologyDataParser.parse(this.props.data)
        };
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        TopologyDrawer.draw(this.state.topologyData,this._onContextMenuItemClick,this._onNodeClicked);
        TopologyDrawer.fitToScreen(this.state.topologyData);

        $(window).resize(()=>TopologyDrawer.fitToScreen(this.state.topologyData));
    }

    componentWillUnmount() {
        $(window).off('resize');
    }
    componentWillReceiveProps (nextProps) {
        this.setState({
            topologyData: TopologyDataParser.parse(nextProps.data)
        })
    }
    componentDidUpdate(){
        TopologyDrawer.draw(this.state.topologyData,this._onContextMenuItemClick,this._onNodeClicked);
        TopologyDrawer.fitToScreen(this.state.topologyData);
    }


    _onContextMenuItemClick(item,node) {
        console.log('Menu item clicked - '+item +' for node ',node);
    }

    _onNodeClicked(node){
        console.log('Node clicked ',node);

    }

    render() {
        let ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div className='partnerTopologyWidget'>
                <ErrorMessage error={this.state.error}/>
                <div className='partnerTopologyContainer'>
                    <svg className='partnerTopology'>
                        <g className='content'/>
                    </svg>
                </div>

                <div className="contextMenuContainer" style={{display:'none'}}>
                    <div className="ui vertical menu">
                        <div className="item" data-value='edit'>
                            edit
                        </div>
                        <div className="item" data-value='delete'>
                            delete
                        </div>
                        <div className="item" data-value='something'>
                            something else
                        </div>
                     </div>
                </div>
            </div>

        );
    }
};