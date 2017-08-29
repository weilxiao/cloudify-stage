/**
 * Created by kinneretzin on 07/09/2016.
 */

import PluginsTable from './PluginsTable';

Stage.defineWidget({
    id: "plugins",
    name: "Plugins list",
    description: 'Plugins list',
    initialWidth: 8,
    initialHeight: 20,
    color : "blue",
    isReact: true,
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        Stage.GenericConfig.PAGE_SIZE_CONFIG()
    ],
    fetchUrl: [
        '[manager]/plugins?_include=id,package_name,package_version,supported_platform,distribution,distribution_release,uploaded_at,created_by,private_resource[params]',
        '[manager]/executions?_include=id,workflow_id,status,workflow_id,parameters&status=cancelled&status=force_cancelling&status=started&status=pending&is_system_workflow=true'
     ], 

    fetchParams: (widget, toolbox) => 
        toolbox.getContext ().getValue ('onlyMyResources') ? {created_by: toolbox.getManager().getCurrentUsername()} : {},
        
    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let plugins = data[0];
        let executionsGroup = _.filter(data[1], item => ['install_plugin', 'uninstall_plugin'].includes(item.workflow_id));
        executionsGroup = _.groupBy(data[1].items, 'parameters.plugin.package_name');

        var selectedPlugin = toolbox.getContext().getValue('pluginId');
        var formattedData = Object.assign({},plugins,{
            items: _.map (plugins.items,(item)=>{
                return Object.assign({},item,{
                    uploaded_at: Stage.Utils.formatTimestamp(item.uploaded_at), //2016-07-20 09:10:53.103579
                    isSelected: selectedPlugin === item.id,
                    executions: executionsGroup[item.package_name],
                })
            })
        });
        formattedData.total =  _.get(plugins, "metadata.pagination.total", 0);

        return (
            <PluginsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});