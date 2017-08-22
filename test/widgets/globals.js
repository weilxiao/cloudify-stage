import React from 'React';

global.React = React;

/**
 * mock fetch function
 * usage: global.fetchMock.register('GET.plugins.json', __dirname);
 * filename: METHOD.filename and put it beside the plugin test
 * 
 * @class fetchMock
 */
const fetchMockLib = require ('fetch-mock');
const path = require ('path');
const fs = require ('fs');

class fetchMock {
  static debug = false;
  static metadata = [];
  static initialize () {
    // fetchMock_mock.get('*', fakeData);
    fetchMockLib.once ('*', fetchMock.response);
  }

  static register (file, dir) {
    fetchMock.metadata[file] = dir;

    file = path.join (dir, file);
    if (fs.existsSync (file)) {
      let data = fs.readFileSync (file).toString ();
      return JSON.parse (data);
    }
  }

  static response (matcher, response, options) {
    let resp = {};
    resp.status = 200;
    resp.sendAsJson = response.headers['content-type'] === 'application/json';

    let file = `${String (response.method).toUpperCase ()}.${path.basename (matcher)}`;
    if (fetchMock.metadata[file]) {
      file = path.join (fetchMock.metadata[file], file);
      if (fs.existsSync (file)) {
        fetchMock.debug &&
          console.log (`\x1b[33m [Fetched]: file ${file} \x1b[0m`);
        let body = fs.readFileSync (file).toString ();
        try {
          resp.body = resp.sendAsJson ? JSON.parse (body) : body;
        } catch (e) {
          resp.body = body;
        }
      } else {
        resp.status = 404;
        resp.body = {error: `file ${file} not found.`};
        console.log (`\x1b[31m [Error]: file ${file} not found. \x1b[0m`);
      }
    } else {
      resp.status = 500;
      resp.body = {error: 'you should register fetchMock file.'};
    }

    return resp;
  }
}

fetchMock.initialize ();

global.fetchMock = fetchMock;

/**
 * fake widget renderer
 * 
 * @class Widgets
 */

// toolbox imports
import configureMockStore from 'redux-mock-store';

class Widgets {
  static metadata = {};
  static defineWidget (widgetData) {
    Widgets.metadata[widgetData.id] = widgetData;
  }
  static render (id) {
    let current = Widgets.metadata[id];

    let configuredWidget = Widgets.configure (current);
    let toolbox = Widgets.toolbox (current);

    // TODO: handle params
    let params = {};
    let error = Widgets.error (current);
    let data = {};

    return new Promise ((resolve, reject) => {
      if (current.fetchData) {
        current.fetchData (configuredWidget, toolbox, params).then (data => {
          data = JSON.parse (data); // reparse json
          let widget = current.render (configuredWidget, data, error, toolbox);
          resolve (widget);
        });
      } else {
        // TODO: handle auto fetch if exists and [check params with fetch-mock]
        let widget = current.render (configuredWidget, data, error, toolbox);
        resolve (widget);
      }
    });
  }

  static configure (widget) {
    if (widget.initialConfiguration) {
      widget.configuration = {};
      widget.initialConfiguration.forEach (conf => {
        widget.configuration[conf.id] = conf.default || null;
      });
    }
    return widget;
  }

  static error (widget) {
    return null;
  }

  static toolbox (widget) {
    let {createToolbox, getToolbox} = require ('../../app/utils/Toolbox');
    const mockStore = configureMockStore ();

    var initialState = {
      templates: {
        tmp1: {
          name: 'tmp1',
          widgets: [{name: 'some widget', definition: widget.id}],
        },
      },
      manager: {
        ip: '1.1.1.1',
      },
      conetxt: {},
      config: {},
      widgetDefinitions: [{id: widget.id}],
    };

    const store = mockStore (initialState);
    createToolbox (store);
    let toolbox = getToolbox (() => {});
    return toolbox;
  }
}

global.Stage = {defineWidget: Widgets.defineWidget, ...global.Stage};
global.WidgetParser = Widgets;

/**
 * fix unhandledRejection for promises like no catch applied
 */
process.on ('unhandledRejection', (reason, p) => {
  // console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

// global.requestAnimationFrame = () => {}

(function (window) {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date ().getTime ();
      var timeToCall = Math.max (0, 16 - (currTime - lastTime));
      var id = window.setTimeout (function () {
        callback (currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout (id);
    };
  }
}) (global);
