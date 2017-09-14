/**
 * @author Oleksii Kachura
 * @date 13 Sep 2017
 */

import BlueprintsTable from './BlueprintsTable';

Stage.defineWidget({
    id: "composerBlueprints",
    name: "Composer Blueprints",
    description: 'A widget that shows the list of blueprints the logged in user has in the composer',
    initialWidth: 8,
    initialHeight: 20,
    showHeader: true,
    showBorder: true,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('composerBlueprints'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.OTHERS],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],
    fetchData(widget, toolbox) {
        return toolbox.getComposer().doGet('/backend/blueprints/readAll');
    },
    _processData(data, toolbox) {
        var selectedBlueprint = toolbox.getContext().getValue('composerBlueprintId');

        return {
            items: _.map(data, (item) => Object.assign({}, item, {
                isSelected: selectedBlueprint === item.id
            })),
            total: data.length
        }
    },
    render: function (widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var formattedData = this._processData(data, toolbox);
        return (
            <div>
                <BlueprintsTable widget={widget} data={formattedData} toolbox={toolbox}/>
            </div>
        );
    }
});
