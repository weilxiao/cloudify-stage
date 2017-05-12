/**
 * Created by jakubniezgoda on 12/05/2017.
 */

import fetch from 'isomorphic-fetch';

export default class ClientConfigLoader {
    static load() {
        return fetch('/clientConfig/*')
            .then(response => response.json())
            .catch((e)=>{
                console.log('Error fetching client configuration',e);
            });
    }
}