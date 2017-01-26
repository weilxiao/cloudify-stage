/**
 * Created by kinneretzin on 02/10/2016.
 */
import UploadModal from './UploadSnapshotModal';
import CreateModal from './CreateSnapshotModal';

import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete: false
        }
    }

    _selectSnapshot (item){
        var oldSelectedSnapshotId = this.props.toolbox.getContext().getValue('snapshotId');
        this.props.toolbox.getContext().setValue('snapshotId',item.id === oldSelectedSnapshotId ? null : item.id);
    }

    _deleteSnapshotConfirm(item,event){
        event.stopPropagation();

        this.setState({
            confirmDelete: true,
            item: item
        });
    }

    _restoreSnapshot(item,event) {
        event.stopPropagation();

        var actions = new Actions(this.props.toolbox);
        actions.doRestore(item).then(()=>{
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({error:err.message});
        });
    }

    _downloadSnapshot(item,event) {
        event.stopPropagation();

        let actions = new Actions(this.props.toolbox);
        actions.doDownload(item)
               .catch((err) => {this.setState({error: err.error})});
    }

    _deleteSnapshot() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no snapshot was selected for delete'});
            return;
        }

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.item).then(()=>{
            this.setState({confirmDelete: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({confirmDelete: false, error: err.message});
        });
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('snapshots:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('snapshots:refresh',this._refreshData);
    }

    fetchGridData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    render() {
        var Confirm = Stage.Basic.Confirm;
        var ErrorMessage = Stage.Basic.ErrorMessage;
        var Table = Stage.Basic.Table;

        return (
            <div className="snapshotsTableDiv">
                <ErrorMessage error={this.state.error}/>

                <Table fetchData={this.fetchGridData.bind(this)}
                            totalSize={this.props.data.total}
                            pageSize={this.props.widget.configuration.pageSize}
                            selectable={true}
                            className="snapshotsTable">

                    <Table.Column label="Id" name="id" width="40%"/>
                    <Table.Column label="Created at" name="created_at" width="25%"/>
                    <Table.Column label="Status" name="status" width="20%"/>
                    <Table.Column width="15%"/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <Table.Row key={item.id} selected={item.isSelected} onClick={this._selectSnapshot.bind(this, item)}>
                                    <Table.Data><a className='snapshotName' href="javascript:void(0)">{item.id}</a></Table.Data>
                                    <Table.Data>{item.created_at}</Table.Data>
                                    <Table.Data>{item.status}</Table.Data>
                                    <Table.Data className="center aligned rowActions">
                                        <i className="undo icon link bordered" title="Restore" onClick={this._restoreSnapshot.bind(this,item)}></i>
                                        <i className="download icon link bordered" title="Download" onClick={this._downloadSnapshot.bind(this,item)}></i>
                                        <i className="trash icon link bordered" title="Delete" onClick={this._deleteSnapshotConfirm.bind(this,item)}></i>
                                    </Table.Data>
                                </Table.Row>
                            );
                        })
                    }

                    <Table.Action>
                        <CreateModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>

                        <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                    </Table.Action>

                </Table>

                <Confirm title='Are you sure you want to remove this snapshot?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deleteSnapshot.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />

            </div>

        );
    }
};
