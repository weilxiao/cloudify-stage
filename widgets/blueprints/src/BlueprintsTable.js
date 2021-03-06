/**
 * Created by kinneretzin on 08/01/2017.
 */

import UploadModal from './UploadBlueprintModal';

let PropTypes = React.PropTypes;

export default class BlueprintsTable extends React.Component{
    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        fetchGridData: PropTypes.func,
        onSelectBlueprint: PropTypes.func,
        onDeleteBlueprint: PropTypes.func,
        onCreateDeployment: PropTypes.func,
        onSetVisibility: PropTypes.func,
        allowedSettingTo: PropTypes.array
    };

    static defaultProps = {
        fetchGridData: ()=>{},
        onSelectBlueprint: ()=>{},
        onDeleteBlueprint: ()=>{},
        onCreateDeployment: ()=>{},
        onSetVisibility: ()=>{},
        allowedSettingTo: ['Tenant']
    };

    render(){
        var {DataTable, Image, ResourceVisibility} = Stage.Basic;
        let tableName = 'blueprintsTable';

        return (
            <DataTable fetchData={this.props.fetchGridData}
                       totalSize={this.props.data.total}
                       pageSize={this.props.widget.configuration.pageSize}
                       sortColumn={this.props.widget.configuration.sortColumn}
                       sortAscending={this.props.widget.configuration.sortAscending}
                       selectable={true}
                       className={tableName}>

                <DataTable.Column label="Name" name="id" width="20%"/>
                <DataTable.Column label="Created" name="created_at" width="15%"/>
                <DataTable.Column label="Updated" name="updated_at" width="15%"/>
                <DataTable.Column label="Creator" name='created_by' width="15%"/>
                <DataTable.Column label="Main Blueprint File" name='main_file_name' width="15%"/>
                <DataTable.Column label="# Deployments" width="10%"/>
                <DataTable.Column width="10%"/>

                {
                    this.props.data.items.map((item)=>{
                        return (
                            <DataTable.Row id={`${tableName}_${item.id}`} key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectBlueprint(item)}>
                                <DataTable.Data>
                                    <Image src={Stage.Utils.url(`/ba/image/${item.id}`)} width="30px" height="auto" inline/> <a className='blueprintName' href="javascript:void(0)">{item.id}</a>
                                    <ResourceVisibility visibility={item.visibility} onSetVisibility={(visibility)=>this.props.onSetVisibility(item.id, visibility)} allowedSettingTo={this.props.allowedSettingTo} className="rightFloated"/>
                                </DataTable.Data>
                                <DataTable.Data>{item.created_at}</DataTable.Data>
                                <DataTable.Data>{item.updated_at}</DataTable.Data>
                                <DataTable.Data>{item.created_by}</DataTable.Data>
                                <DataTable.Data>{item.main_file_name}</DataTable.Data>
                                <DataTable.Data><div className="ui green horizontal label">{item.depCount}</div></DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <i className="rocket icon link bordered" title="Create deployment" onClick={(event)=>{event.stopPropagation();this.props.onCreateDeployment(item)}}></i>
                                    <i className="trash icon link bordered" title="Delete blueprint" onClick={(event)=>{event.stopPropagation();this.props.onDeleteBlueprint(item)}}></i>
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })
                }

                <DataTable.Action>
                    <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                </DataTable.Action>

            </DataTable>

        );
    }
}