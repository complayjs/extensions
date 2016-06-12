import arrayFrom from '../../helpers/array/from';
function noop() {}

export default class TwoWayDataBind {
    // @example http://jsfiddle.net/Derija93/RkTMD/1/
    sync(options = {}) {

        if (arguments.length > 1) {
            Array.from(arguments).forEach(option => { this.sync(option); });
            return;
        }

        let initial = options.sourceObj[options.sourceKey];
        let initialType = typeof initial;

        let getFormat = (val) => {
            return val;
        };

        let setFormat = (val) => {
            if (typeof val !== 'undefined') {
                return val;
            }

            return '';
        };

        if (initial && initialType === 'object') {
            getFormat = (val) => {
                return JSON.parse(val);
            };

            setFormat = (val) => {
                return JSON.stringify(val);
            };
        }

        if (initialType === 'number') {
            if (isFinite(initial) &&
                Math.floor(initial) === initial) {
                getFormat = (val) => {
                    return parseInt(val, 10);
                };
            } else {
                getFormat = (val) => {
                    return parseFloat(val);
                };
            }
        }

        let saveOption = {
            srcObj: options.sourceObj,
            srcKey: options.sourceKey,
            bindObj: options.bindObj,
            bindKey: options.bindKey
        };

        this.saveOptions = this.saveOptions || [];
        this.saveOptions.push(saveOption);

        Object.defineProperty(options.sourceObj, options.sourceKey, {
            enumerable: true,
            configurable: true,
            get: () => {
                return getFormat(options.bindObj[options.bindKey]);
            },
            set: (val) => {
                options.bindObj[options.bindKey] = setFormat(val);
            }
        });

        options.sourceObj[options.sourceKey] = initial;
    }

    separate(options = {}) {

        if (arguments.length > 1) {
            Array.from(arguments).forEach(option => { this.separate(option); });
            return;
        }

        let saveOptions = [];

        if (options.sourceObj) {
            if (options.sourceKey) {
                // add saved option with sourceObj and sourceKey
                saveOptions = this.saveOptions.filter(saveOption => {
                    return  saveOption.srcObj === options.sourceObj &&
                            saveOption.srcKey === options.sourceKey;
                });
            } else {
                // add all saved options which are related to the passed sourceObj
                saveOptions = this.saveOptions.filter(saveOption => {
                    return saveOption.srcObj === options.sourceObj;
                });
            }
        } else {
            // add all saved options, clone array
            saveOptions = this.saveOptions.slice(0);
            this.saveOptions = [];
        }

        saveOptions.forEach(saveOption => {
            delete saveOption.srcObj[saveOption.srcKey];
        })
    }
}