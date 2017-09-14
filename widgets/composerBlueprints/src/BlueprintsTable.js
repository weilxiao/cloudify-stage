/**
 * @author Oleksii Kachura
 * @date 14 Sep 2017
 */

const { Component, PropTypes } = React;
const { DataTable } = Stage.Basic;

export default class BlueprintsTable extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    onSelectBlueprint(item) {
        var oldSelectedBlueprintId = this.props.toolbox.getContext().getValue('composerBlueprintId');
        this.props.toolbox.getContext().setValue('composerBlueprintId', item.id === oldSelectedBlueprintId ? null : item.id);
    }
    onUploadBlueprint(item) {
        console.log(item);
    }

    render() {
        const tableName = 'blueprintsTable';
        const composerUrl = `${location.protocol}//${location.hostname}/composer`;

        return (
            <DataTable fetchData={this.props.toolbox.refresh}
                       totalSize={this.props.data.total}
                       pageSize={this.props.widget.configuration.pageSize}
                       sortColumn={this.props.widget.configuration.sortColumn}
                       sortAscending={this.props.widget.configuration.sortAscending}
                       selectable={true}
                       className={tableName}>

                <DataTable.Column label="Name" name="name" width="90%"/>
                <DataTable.Column width="10%"/>

                {
                    this.props.data.items.map((item) => {
                        return (
                            <DataTable.Row id={`${tableName}_${item.id}`} key={item.id} selected={item.isSelected} onClick={()=>this.onSelectBlueprint(item)}>
                                <DataTable.Data>{item.name}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <a href={`${composerUrl}/${item.id}/topology`} target="_blank">
                                        <i className="edit icon link bordered" title="Edit in Composer"></i>
                                    </a>
                                    <i className="upload icon link bordered" title="Upload to Manager" onClick={(event)=>{event.stopPropagation();this.onUploadBlueprint(item)}}></i>
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })
                }

            </DataTable>
        );
    }
}
