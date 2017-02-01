/**
 * Created by kinneretzin on 30/01/2017.
 */

/*var svgWidth = 0;
var svgHeight = 0;
var maxWidth = svgWidth;
var maxHeight = svgHeight;

function scaleSvg() {
    var svg = d3.select('svg');
    var container = $('.partnerTopologyContainer');
    svgWidth = container.innerWidth();
    svgHeight = container.innerHeight();

    svg.attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('viewBox','0 0 '+svgWidth+' '+svgHeight)
        .attr('preserveAspectRatio', 'xMinYMin slice');

    // Calculate height and width according to offset and scale
    var gridMaxWidth = maxWidth > svgWidth ? maxWidth : svgWidth;
    var gridMaxHeight = maxHeight > svgHeight ? maxHeight : svgHeight;

    var gridScaledWidth = gridMaxWidth*scale;
    var gridScaledHeight = gridMaxHeight*scale;

    if (gridScaledWidth - gridXOffset < svgWidth) {
        gridMaxWidth = (svgWidth + gridXOffset)/ scale;
    }
    if (gridScaledHeight - gridYOffset < svgHeight) {
        gridMaxHeight = (svgHeight + gridYOffset) / scale;
    }
}

function calculateSvgMaxSizes(data) {
    // Calculate max width and height:

    maxWidth = svgWidth;
    maxHeight = svgHeight;

    _.each(data, function (node) {
        maxWidth = maxWidth > node.x + node.width  + 10 ? maxWidth : node.x + node.width  + 10;
        maxHeight = maxHeight > node.y + node.height  + 10 ? maxHeight : node.y + node.height  + 10;
    });
}

function fitToScreen(data) {
    var maxX = 0, maxY= 0;

    _.each(data, function (node) {
        maxX = maxX > node.x + node.width  + 10 ? maxX : node.x + node.width  + 10;
        maxY = maxY > node.y + node.height  + 10 ? maxY : node.y + node.height  + 10;
    });

    var xScale = svgWidth/(maxX+10);
    var yScale = svgHeight/(maxY+10);

    performScale(xScale < yScale ? xScale : yScale,0,0);
}

function performScale(_scale,_x,_y) {
    var grid = d3.select('.partnerTopologyContainer');
    return d3.transition().duration(350).tween("zoom", function () {
        var newTranslate = d3.interpolate(zoom.translate(), [-_x,-_y]);
        var newScale = d3.interpolate(zoom.scale(), _scale);
        return function (t) {
            zoom
                .scale(newScale(t))
                .translate(newTranslate(t));
            grid.attr("transform",
                "translate(" + zoom.translate() + ")" +
                "scale(" + zoom.scale() + ")"
            );

            scale = newScale(t);
            gridXOffset = -zoom.translate()[0];
            gridYOffset = -zoom.translate()[1];
            scaleSvg();
        };
    });
}*/

function calcLinePoints(x1,y1, x2, y2) {
    return  [
        [x1,y1],
        [x1 + ((x2-x1)/2), y1],
        [x1 + ((x2-x1)/2), y2],
        [x2,y2]
    ];
}


export default class Topology extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
        };
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        var svg = d3.select('svg');

        // Calc locations
        var numOfA = _.filter(this.props.data,{type:'a'}).length;
        var aY = 30;
        var bY = 30 + (numOfA*60) / 2 - 20; // gap from top + (middle height of all A) - half of own size;
        bY = _.max([bY,30+40]);
        var cY = 30 + (numOfA*60) / 2 - 35;
        var dY = 30 + (numOfA*60) / 2 - 35;

        var data = this.props.data.map((node)=>{
            var dim;

            switch (node.type) {
                case 'a':
                    dim = {
                        x: 30,
                        y: aY,
                        width: 40,
                        height: 40
                    };
                    aY += 60;
                    break;
                case 'b':
                    dim = {
                        x: 130,
                        y: bY,
                        width: 40,
                        height: 40
                    };
                    break;
                case 'c':
                    dim = {
                        x: 210,
                        y: cY,
                        width: 60,
                        height: 70
                    };
                    break;
                case 'd':
                    dim = {
                        x: 310,
                        y: dY,
                        width: 70,
                        height: 70
                    };
                    break;
            }

            return Object.assign({},node,dim);
        });


        var newNodes =
            svg.selectAll('.pNode')
            .data(data, function (d) {
                return d.name;
            })
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

        //newNodes.filter('.a').append('svg:circle')
        //    .attr('cx',(d)=>20)
        //    .attr('cy',(d)=>20)
        //    .attr('r',20);

        newNodes.filter('.a').append('svg:image')
            .attr('x',0)
            .attr('y',0)
            .attr('href','/widgets/PARTNER-topology/images/site.png')
            .attr('width',d=>d.width)
            .attr('height',d=>d.height);

        //newNodes.filter('.b').append('svg:rect')
        //    .attr('x',0)
        //    .attr('y',0)
        //    .attr('width',d=>d.width)
        //    .attr('height',d=>d.height)
        //    .attr('rx', 2)
        //    .attr('ry', 2);

        newNodes.filter('.b').append('svg:image')
            .attr('x',0)
            .attr('y',0)
            .attr('width',d=>d.width)
            .attr('height',d=>d.height)
            .attr('href','/widgets/PARTNER-topology/images/router.png');

        //newNodes.filter('.c').append('svg:rect')
        //    .attr('x',0)
        //    .attr('y',0)
        //    .attr('width',d=>d.width)
        //    .attr('height',d=>d.height);
        //
        //newNodes.filter('.d').append('svg:rect')
        //    .attr('x',0)
        //    .attr('y',0)
        //    .attr('width',d=>d.width)
        //    .attr('height',d=>d.height);

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

        var types = _.groupBy(data,'type');
        var connectors = [];

        var bType = types.b[0];
        var cType = types.c[0];
        var dType = types.d[0];

        var i=0;
        _.each(types.a,(aType)=> {
            var points = calcLinePoints(aType.x + aType.width,aType.y + aType.height/2,bType.x,bType.y + bType.height/2);
            connectors.push({id: i++,type: 'a2b',side1: aType,side2: bType, points: points});
        });

        connectors.push({id: i++,type:'b2c',side1: bType, side2: cType});
        connectors.push({id: i++,type:'c2d',side1: cType, side2: dType});


        var newConnectors =
            svg.selectAll('.pConn')
                .data(connectors, function (d) {
                    return d.id;
                })
                .enter()
                .append('svg:g')
                .attr('class', function (d) {
                    return 'pConn ' + d.type;
                });

        newConnectors.filter(':not(.a2b)').append('svg:line')
            .attr('x1',d=>d.side1.x + d.side1.width)
            .attr('y1',d=>d.side1.y + d.side1.height/2)
            .attr('x2',d=>d.side2.x)
            .attr('y2',d=>d.side2.y + d.side2.height/2)

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

        //var currConnector = selection.data([d],function(data){return data.id;});
        //currConnector.selectAll('path')
        //    .datum(d.points)
        //    .attr('d', line);
    }

    render() {
        let ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div className='partnerTopologyWidget'>
                <ErrorMessage error={this.state.error}/>
                <div className='partnerTopologyContainer'>
                    <svg className='partnerTopology'/>
                </div>
            </div>

        );
    }
};