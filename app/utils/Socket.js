/**
 * Created by Tamer on 13/09/2017.
 */

import io from 'socket.io-client'
import Cookies from 'js-cookie'

/**
 * Socket Client
 * 
 * @export
 * @class Socket
 */
export default class Socket {

    /**
     * connect to sockets
     * 
     * @static
     * @memberof Socket
     */
    static init() {
        Socket.connection = io.connect(`${window.location.origin}`);
        Socket.connection.on('connection', () => console.log('socket connected'));
        // listen for dataChange and distribute data by widgets
        Socket.connection.on('dataChange', function (widgetId, data) {
            let metadata = Socket.metadata[widgetId];
            if(metadata) {
                metadata.callback.call(metadata.context, data);
            }
        });
    }
    
    /**
     * send subscribe event to server allowing to start fetching
     * for current widget
     * 
     * @static
     * @param {any} widgetId 
     * @param {any} list [{url, interval}]
     * @param {any} tenant 
     * @memberof Socket
     */
    static subscribe(widgetId, list, tenant){
        var token = Cookies.get('XSRF-TOKEN');

        console.log(`${widgetId} socket subscribed`);
        Socket.connection.emit('subscribe', widgetId, list, {tenant, token})
    }

    /**
     * send unsubscribe event to server to stop requesting
     * for current widget
     * 
     * @static
     * @param {any} widgetId 
     * @memberof Socket
     */
    static unsubscribe(widgetId){
        console.log(`${widgetId} socket unsubscribe`);
        if(Socket.metadata[widgetId]){
            delete Socket.metadata[widgetId];
        }
        Socket.connection.emit('unsubscribe', widgetId)
    }

    /**
     * register widget listener to be called from dataChange event
     * 
     * @static
     * @param {any} widgetId 
     * @param {any} callback 
     * @param {any} context 
     * @memberof Socket
     */
    static listen(widgetId, callback, context) {
        if(!Socket.metadata){
            Socket.metadata = {};
        }
        Socket.metadata[widgetId] = {callback, context};
    }
}