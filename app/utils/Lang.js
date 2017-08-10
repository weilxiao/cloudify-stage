/**
 * Created by Alex Laktionow on 8/7/17.
 */

import locale_en from '../locale/locale_en';

export default class Lang {
    currentLang;

    constructor(lang = 'en'){
        this.currentLang = lang;
        Object.assign(this, locale_en);
    }
}