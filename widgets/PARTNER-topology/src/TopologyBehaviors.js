/**
 * Created by kinneretzin on 02/02/2017.
 */

export default class TopologyBehaviors {
    static addContextMenuBehavior (svg,selection,onMenuItemClick) {

        selection.on("contextmenu", function(d) {

            d3.select('.contextMenuContainer').style('display', 'none');

            var point = d3.mouse(svg.node());

            d3.select('.contextMenuContainer')
                .style('position', 'absolute')
                .style('left', point[0] + "px")
                .style('top', point[1] + "px")
                .style('display', 'inline-block')
                .on('mouseleave', function() {
                    d3.select('.contextMenuContainer').style('display', 'none');
                });

            d3.selectAll('.contextMenuContainer .item')
                    .on('click',function(){
                        onMenuItemClick($(this).data('value'),d);
                    });
            d3.event.preventDefault();

        });

        svg.on("click", function() {
            d3.select('.contextMenuContainer').style('display', 'none');
        });
    }

    static addClickBehavior(selection,onClick) {
        selection.on('click',function(d){
            if (d3.event.defaultPrevented) { return; }

            onClick(d);
        });
    }
}
