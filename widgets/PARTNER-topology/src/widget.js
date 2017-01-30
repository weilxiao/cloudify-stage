/**
 * Created by kinneretzin on 30/01/2017.
 */

import Topology from './Topology';

Stage.defineWidget({
    id: 'PARTNER-topology',
    name: 'Dashboard topology',
    description: 'Shows dashboard topology for Partner',
    initialWidth: 6,
    initialHeight: 5,
    color : 'blue',
    isReact: true,
    hasStyle : true,
    fetchUrl: '/widgets/PARTNER-topology/data.json',
    render: function(widget, data, error, toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }


        return (
            <Topology widget={widget} data={data} toolbox={toolbox}/>
        );
    }
});
