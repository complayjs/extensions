export default class TwoWayDataBind {
    // @example http://jsfiddle.net/Derija93/RkTMD/1/
    sync(options = {}) {

        options.sourceObj = options.sourceObj || this;

        let initial = options.sourceObj[options.sourceKey];
        let initialType = typeof initial;

        let getFormat = (val) => {
            return val;
        };

        let setFormat = (val) => {
            if (val) {
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

        Object.defineProperty(options.sourceObj, options.sourceKey, {
            get: function() {
                return getFormat(options.bindObj[options.bindKey]);
            },
            set: function(val) {
                options.bindObj[options.bindKey] = setFormat(val);
            }
        });

        options.sourceObj[options.sourceKey] = initial;
    }
}