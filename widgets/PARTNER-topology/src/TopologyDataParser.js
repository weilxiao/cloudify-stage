/**
 * Created by kinneretzin on 02/02/2017.
 */

function calcLinePoints(x1,y1, x2, y2) {
    return  [
        [x1,y1],
        [x1 + ((x2-x1)/2), y1],
        [x1 + ((x2-x1)/2), y2],
        [x2,y2]
    ];
}

export default class TopologyDataParser {

    static parse(data) {

        // Calc locations
        var numOfA = _.filter(data,{type:'a'}).length;
        var aY = 30;
        var bY = 30 + (numOfA*60) / 2 - 20; // gap from top + (middle height of all A) - half of own size;
        bY = _.max([bY,30+40]);
        var cY = 30 + (numOfA*60) / 2 - 35;
        var dY = 30 + (numOfA*60) / 2 - 35;

        var nodes = data.map((node)=>{
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


        var types = _.groupBy(nodes,'type');
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

        return {
            nodes: nodes,
            connectors: connectors
        };
    }
}