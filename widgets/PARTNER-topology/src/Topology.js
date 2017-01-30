/**
 * Created by kinneretzin on 30/01/2017.
 */

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
        var bY = 30 + (numOfA*40) / 2 - 20; // gap from top + (middle height of all A) - half of own size;
        bY = _.max([bY,30+40]);
        var cY = bY;
        var dY = bY;

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
                    aY += 40;
                    break;
                case 'b':0
                    dim = {
                        x: 80,
                        y: bY,
                        width: 4,
                        height: 40
                    };
                    break;
                case 'c':
                    dim = {
                        x: 110,
                        y: cY,
                        width: 60,
                        height: 40
                    };
                    break;
                case 'd':
                    dim = {
                        x: 140,
                        y: dY,
                        width: 60,
                        height: 40
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

        newNodes.append('svg:circle')
            .attr('cx',(d)=>d.x + 20)
            .attr('cy',(d)=>d.y + 20)
            .attr('r',20)
            .style('stroke','blue');
    }

    render() {
        let ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <svg className='partnerTopology'/>
            </div>

        );
    }
};