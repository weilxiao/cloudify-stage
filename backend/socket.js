/**
 * Created by Tamer on 13/09/2017.
 */

var md5 = require('blueimp-md5');
var ManagerHandler = require('./handler/ManagerHandler');
var request = require('request');
var fs = require('fs');
var _ = require('lodash');

const CACHE_DIR = 'cache';

/**
 * Socket Server
 * 
 * @class Socket
 */
class Socket {

  /**
   * start ws server
   * 
   * @static
   * @param {any} io 
   * @memberof Socket
   */
  static init(io) {
    // create cache directory
    if(!fs.existsSync(CACHE_DIR)){
      fs.mkdirSync(CACHE_DIR)
    }

    // listen for new app connection and add event listeners
    io.on('connection', function (socket) {
      Socket.addClient(socket);
      
      socket.on('subscribe', function (widgetId, list, options) {
        Socket.subscribe(socket, widgetId, list, options);
      });

      socket.on('unsubscribe', function (widgetId) {
        Socket.unsubscribe(socket, widgetId);
      });

      socket.on('disconnect', function () {
        Socket.removeClient(socket);
      });
    });
  }

   /**
    * subscribe widget events to current socket
    * and start making requests
    * 
    * @static
    * @param {any} socket 
    * @param {any} widgetId 
    * @param {any} list       ex: [{url, interval}]
    * @param {any} options    ex: {tenant, token}
    * @memberof Socket
    */
  static subscribe(socket, widgetId, list, options) {
    console.log(`${widgetId} socket subscribed`);

    if(!Socket.events[socket.id][widgetId]){
      Socket.events[socket.id][widgetId] = []
    }

    list.forEach(item => {
      Socket.makeRequest(socket, widgetId, item.url, options, true);
      let interval = setInterval(() => {
        Socket.makeRequest(socket, widgetId, item.url, options);
      }, item.interval);

      Socket.events[socket.id][widgetId].push(interval);
    })
  }

  /**
   * unsubscribe widget events and stop requesting
   * 
   * @static
   * @param {any} socket 
   * @param {any} widgetId 
   * @memberof Socket
   */
  static unsubscribe(socket, widgetId) {
    console.log(`${widgetId || 'all client ' + socket.id} socket unsubscribed`);
    
    if(widgetId) {
      Socket.clear(socket.id, widgetId);
    }else{
      Socket.events[socket.id] && Object.keys(Socket.events[socket.id]).forEach(widgetId => {
        Socket.clear(socket.id, widgetId);
      })
    }
  }

  /**
   * clear and stop request interval
   * 
   * @static
   * @param {any} userId 
   * @param {any} widgetId 
   * @memberof Socket
   */
  static clear(userId, widgetId){
    if (Socket.events[userId][widgetId]) {
      Socket.events[userId][widgetId].forEach(interval => {
        clearInterval(interval);
      })
      Socket.events[userId][widgetId] = [];
    }
  }

  // ---------------------------------------
  // - Client Manager
  // ---------------------------------------

  /**
   * add client and register events structure
   * 
   * @static
   * @param {any} socket 
   * @memberof Socket
   */
  static addClient(socket) {
    console.info('Client connected (id=' + socket.id + ').');

    // create clients list if not exists
    if (!Socket.clients) {
      Socket.clients = [];
    }

    // create events structure like
    // Socket.events = {
    //   userId: {
    //     widgetId: [{ url, interval }] // timeout => {url, interval}
    //   }
    // }
    if (!Socket.events) {
      Socket.events = {};
    }

    // create the user container inside event list
    if (!Socket.events[socket.id]) {
      Socket.events[socket.id] = {};
    }

    // adding the client
    Socket.clients.push(socket);
  }

  /**
   * remove clients and unsubscribe related events to stop requesting
   * 
   * @static
   * @param {any} socket 
   * @memberof Socket
   */
  static removeClient(socket) {
    console.info('Client gone (id=' + socket.id + ').');
    Socket.unsubscribe(socket);
    var index = Socket.clients.indexOf(socket);
    if (index !== -1) {
      Socket.clients.splice(index, 1);
    }
  }

  /*
   * making the request
   */

  /**
   * make requests and compare them with cache before emit
   * 
   * @static
   * @param {any} socket 
   * @param {any} widgetId 
   * @param {any} url 
   * @param {any} options 
   * @param {boolean} [initial=false] 
   * @memberof Socket
   */
  static makeRequest(socket, widgetId, url, options, initial=false) {

    var headers = {};
    ManagerHandler.updateOptions(headers, 'GET', false, {
      'Authentication-Token': options.token,
      'tenant': options.tenant
    });

    url = ManagerHandler.getUrl() + '/' + url;
    console.warn(`Requesting -> ${url}`);
    
    request(url, headers, function (error, response, body) { // you should send at least once
      if(!error) {
        let shouldUpdate = initial;
        let filename = CACHE_DIR + '/' + md5(widgetId+url);

        if(fs.existsSync(filename)){
          let cache = fs.readFileSync(filename).toString();
          if(!_.isEqual(cache, body)){
            console.log('not equal')
            console.log(body, cache);
            fs.writeFileSync(filename, body);
            shouldUpdate = true;
          }
        }else{
          fs.writeFileSync(filename, body);
          shouldUpdate = true;
        }
        shouldUpdate && socket.emit('dataChange', widgetId, JSON.parse(body));
      }
    })
  }

}

module.exports = Socket;
