/**
 * Created by jakubniezgoda on 27/01/2017.
 */

let PropTypes = React.PropTypes;

export default class ActiveExecutionStatus extends React.Component {

    constructor(props,context) {
        super(props, context);

        this.state = {
            item: this.props.item,
            cancelClicked: false
        };

        if (_.isNumber(props.refreshInterval) && !_.isEmpty(props.toolbox)) {
            let actions = new Stage.Common.ExecutionActions(props.toolbox);
            let utils = Stage.Common.ExecutionUtils;
            this.poller = setInterval(() => {
                actions.getExecution(this.state.item).then((response) => {
                    this.setState({item: response});
                    if (!utils.isActiveExecution(response)) {
                        clearInterval(this.poller);
                        props.toolbox.refresh();
                    }
                });
            }, this.props.refreshInterval * 1000);
        }
    }

    static propTypes = {
        item: PropTypes.object.isRequired,
        onCancelExecution: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired,
        refreshInterval: PropTypes.number.isRequired
    };

    componentWillUnmount() {
        clearInterval(this.poller);
    }

    _actionClick(event, {name}) {
        this.setState({cancelClicked: true});
        this.props.onCancelExecution(this.state.item, name);
    }

    render () {
        let {PopupMenu, Menu, Label, Icon} = Stage.Basic;
        let {ExecutionUtils} = Stage.Common;

        let execution = this.state.item;
        let activeExecutionStatus = execution.workflow_id + ' ' + execution.status;
        let cancelClicked = this.state.cancelClicked;

        return (
            <Label>
                <Icon name="spinner" loading />
                {activeExecutionStatus}
                <PopupMenu disabled={cancelClicked} icon='delete' >
                    <Menu pointing vertical>
                        <Menu.Item content='Cancel' name={ExecutionUtils.CANCEL_ACTION}
                                   onClick={this._actionClick.bind(this)}/>
                        <Menu.Item content='Force Cancel' name={ExecutionUtils.FORCE_CANCEL_ACTION}
                                   onClick={this._actionClick.bind(this)}/>
                    </Menu>
                </PopupMenu>
            </Label>
        )
    }
}
