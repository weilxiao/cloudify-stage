/**
 * Created by kinneretzin on 02/02/2017.
 */

import TopologyBehaviors from './TopologyBehaviors';

export default class TopologyDrawer {
    static draw (topologyData,onMenuItemClicked,onNodeClick) {
        var svg = d3.select('.partnerTopology');
        var svgContent = d3.select('.partnerTopology .content');

        //var topologyData = parseData(this.props.data);

        var topologyNodes = svgContent.selectAll('.pNode')
            .data(topologyData.nodes, function (d) {
                return d.name;
            });

        // Remove old ones (existed before but after data changed we notice that they are deleted
        topologyNodes.exit().remove();

        // Currently do nothing on existing nodes (update?)

        // Create new nodes
        var newNodes =
                topologyNodes
                .enter()
                .append('svg:g')
                .attr('class', function (d) {
                    return 'pNode ' + d.type;
                })
                .style('width', function (d) {
                    return d.width;
                })
                .style('height', function (d) {
                    return d.height;
                })
                .attr('transform', function (d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                });

        newNodes.filter('.a').append('svg:image')
            .attr('x',0)
            .attr('y',0)
            .attr('href','/widgets/PARTNER-topology/images/site.png')
            .attr('width',d=>d.width)
            .attr('height',d=>d.height);

        newNodes.filter('.b').append('svg:image')
            .attr('x',0)
            .attr('y',0)
            .attr('width',d=>d.width)
            .attr('height',d=>d.height)
            .attr('href','/widgets/PARTNER-topology/images/router.png');

        newNodes.filter('.c').append('svg:image')
            .attr('x',0)
            .attr('y',0)
            .attr('width',d=>d.width)
            .attr('height',d=>d.height)
            .attr('href','/widgets/PARTNER-topology/images/firewall.png');

        newNodes.filter('.d').append('svg:image')
            .attr('x',0)
            .attr('y',0)
            .attr('width',d=>d.width)
            .attr('height',d=>d.height)
            .attr('href','/widgets/PARTNER-topology/images/cloud.png');

        // Build the connectors
        TopologyBehaviors.addContextMenuBehavior(svg,newNodes,onMenuItemClicked);
        TopologyBehaviors.addClickBehavior(newNodes,onNodeClick);

        var topologyConnectors = svgContent.selectAll('.pConn')
            .data(topologyData.connectors, function (d) {
                return d.id;
            });

        // Remove delete connectors
        topologyConnectors.exit().remove();

        // Currently do nothing with existing ones

        // Create new connectors
        var newConnectors =
                topologyConnectors
                .enter()
                .append('svg:g')
                .attr('class', function (d) {
                    return 'pConn ' + d.type;
                });

        newConnectors.filter(':not(.a2b)').append('svg:line')
            .attr('x1',d=>d.side1.x + d.side1.width)
            .attr('y1',d=>d.side1.y + d.side1.height/2)
            .attr('x2',d=>d.side2.x)
            .attr('y2',d=>d.side2.y + d.side2.height/2);

        newConnectors.filter('.a2b').append('svg:path').datum(d=>d.points).attr('d',d3.svg.line());


        newConnectors.append('svg:circle')
            .attr('cx',d=>d.side1.x + d.side1.width + 3)
            .attr('cy',d=>d.side1.y + d.side1.height/2)
            .attr('r',3)
            .attr('class','connNob');
        newConnectors.append('svg:circle')
            .attr('cx',d=>d.side2.x -3)
            .attr('cy',d=>d.side2.y + d.side2.height/2)
            .attr('r',3)
            .attr('class','connNob');
    }


    static fitToScreen(data) {
        // Set SVG dimentions
        var container = $('.partnerTopologyContainer');
        var svgWidth = container.innerWidth();
        var svgHeight = container.innerHeight();

        d3.select('.partnerTopology')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .attr('viewBox','0 0 '+svgWidth+' '+svgHeight)
            .attr('preserveAspectRatio', 'xMinYMin slice');



        var maxWidth = 0;
        var maxHeight = 0;

        _.each(data.nodes, function (node) {
            maxWidth = maxWidth > node.x + node.width  + 10 ? maxWidth : node.x + node.width  + 10;
            maxHeight = maxHeight > node.y + node.height  + 10 ? maxHeight : node.y + node.height  + 10;
        });

        var xScale = svgWidth/(maxWidth+10);
        var yScale = svgHeight/(maxHeight+10);

        var scale = _.min([xScale,yScale]);
        // Scale content
        var topology = $('.partnerTopology .content');

        topology.attr("transform",
            "translate(0,0) " +
            "scale(" + scale + ")"
        );
    }
}