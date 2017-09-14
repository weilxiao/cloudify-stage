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
    isAdmin: true,
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],
    // socket only work with manager urls and could be an array
    fetchSocket: 'snapshots?_include=id,created_at,status,created_by,private_resource[params]',
    fetchParams: (widget, toolbox) => 
    toolbox.getContext ().getValue ('onlyMyResources') ? {created_by: toolbox.getManager().getCurrentUsername()} : {},


    render: function(widget,data,error,toolbox, socket) {

        if (_.isEmpty(socket)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedSnapshot = toolbox.getContext().getValue('snapshotId');
        var formattedData = Object.assign({},socket,{
            items: _.map (socket.items,(item)=>{
                return Object.assign({},item,{
                    created_at: Stage.Utils.formatTimestamp(item.created_at), //2016-07-20 09:10:53.103579
                    isSelected: selectedSnapshot === item.id
                })
            })
        });
        formattedData.total =  _.get(socket, "metadata.pagination.total", 0);

        return (
            <SnapshotsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});