/**
 * Created by kinneretzin on 07/09/2016.
 */

import SnapshotsTable from './SnapshotsTable';

Stage.defineWidget({
    id: "snapshots",
    name: "Snapshots list",
    description: 'Snapshots list',
    initialWidth: 4,
    initialHeight: 16,
    color : "blue",
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('snapshots'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],
    fetchUrl: [
        '[manager]/snapshots?_include=id,created_at,status,created_by,private_resource[params]',
        '[manager]/executions?_include=id,workflow_id,status,workflow_id,parameters&status=cancelled&status=force_cancelling&status=started&status=pending&is_system_workflow=true'
    ],
    fetchParams: (widget, toolbox) => 
        toolbox.getContext ().getValue ('onlyMyResources') ? {created_by: toolbox.getManager().getCurrentUsername()} : {},

    render: function(widget,data,error,toolbox) {
        
        let snapshots = data[0];

        if (_.isEmpty(snapshots)) {
            return <Stage.Basic.Loading/>;
        }

        let executionsGroup = _.filter(data[1], item => item.workflow_id === 'create_snapshot');
        executionsGroup = _.groupBy(data[1].items, 'parameters.snapshot_id');
        
        var selectedSnapshot = toolbox.getContext().getValue('snapshotId');
        var formattedData = Object.assign({},snapshots,{
            items: _.map (snapshots.items,(item)=>{
                return Object.assign({},item,{
                    created_at: Stage.Utils.formatTimestamp(item.created_at), //2016-07-20 09:10:53.103579
                    isSelected: selectedSnapshot === item.id,
                    executions: executionsGroup[item.id],
                })
            })
        });
        formattedData.total =  _.get(snapshots, "metadata.pagination.total", 0);

        return (
            <SnapshotsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});