/**
 * Created by jakubniezgoda on 03/04/2017.
 */

var express = require('express');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var request = require('request');

var router = express.Router();

var configurationFile = require('../../conf/app.json');
var styleTemplateFile = path.resolve(__dirname, '../templates', 'style.ejs');

var DEFAULT_MAIN_COLOR = '#000069';
var DEFAULT_HEADER_TEXT_COLOR = '#d8e3e8';
var DEFAULT_LOGO_URL = '/app/images/Cloudify-logo.png';
var DEFAULT_SIDEBAR_COLOR = '#d8e3e8';
var DEFAULT_SIDEBAR_TEXT_COLOR = '#000000';

function shadeColor(color, percent) {
    var num=parseInt(color.slice(1),16); // Remove the '#'
    var t=percent>0?0:255;
    var p=percent<0?percent*-1:percent;
    var R=num>>16,G=num>>8&0x00FF,B=num&0x0000FF; // extract the RGB
    var newR = Math.round((t-R)*p)+R,newG = Math.round((t-G)*p)+G,newB = Math.round((t-B)*p)+B;
    return "#"+(0x1000000+(newR)*0x10000+(newG)*0x100+(newB)).toString(16).slice(1);
}

router.get('/', function(req, res, next) {
    request.get(req.protocol + '://' + req.headers.host + '/clientConfig/*')
        .on('response', function(response) {
            var responseBody = "";
            response.on("data", function(dataChunk) { responseBody = responseBody + dataChunk; });
            response.on("end", function() {
                var stylesheetTemplate = fs.readFileSync(styleTemplateFile, 'utf8');
                var configFromDb = JSON.parse(responseBody).config;
                var configFromFile = configurationFile.whiteLabel;

                var stylesheet = ejs.render(stylesheetTemplate, {
                    logoUrl: configFromDb.logoUrl || configFromFile.logoUrl || DEFAULT_LOGO_URL,
                    mainColor: configFromDb.mainColor || configFromFile.mainColor || DEFAULT_MAIN_COLOR,
                    headerTextColor: configFromDb.headerTextColor || configFromFile.mainColor || DEFAULT_HEADER_TEXT_COLOR,
                    sidebarColor: configFromDb.sidebarColor || configFromFile.mainColor || DEFAULT_SIDEBAR_COLOR,
                    sideBarHoverActiveColor: shadeColor(configFromDb.sidebarColor || configFromFile.mainColor || DEFAULT_SIDEBAR_COLOR,0.1),
                    sidebarTextColor: configFromDb.sidebarTextColor || configFromFile.mainColor || DEFAULT_SIDEBAR_TEXT_COLOR
                });

                res.contentType('text/css').send(stylesheet);
            });
        });
});

module.exports = router;