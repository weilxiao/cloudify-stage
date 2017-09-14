/**
 * @author Oleksii Kachura
 * @date 13 Sep 2017
 */

import Internal from './Internal';

export default class Composer extends Internal {

    constructor(managerData) {
        super(managerData);
    }

    _buildActualUrl(url,data) {
        return super._buildActualUrl(`../composer${url}`, data);
    }
}
