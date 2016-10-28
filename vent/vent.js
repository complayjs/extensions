let targets = [];
let events = {};
let config = {};

export default function Vent(newTarget, respondWithObject = false, isDebug = false){
	let empty = [];
	let index = targets.indexOf(newTarget);
	let target = targets[index];

	if (index === -1 || !target) {
		target = newTarget || this;

		if (!target.uid) {
			target.uid = Math.random() + '';
		}

		targets.push(target);
		index = targets.length - 1;

		events[targets[index].uid] = {};
		config[targets[index].uid] = {
			respondWithObject
		};

		target.registeredVents = events[targets[index].uid];
	}

	/**
	 *  On: listen to events
	 */
	target.on = function(type, func, ctx){
		(events[targets[index].uid][type] = events[targets[index].uid][type] || []).push([func, ctx]);
	};
	/**
	 *  Off: stop listening to event / specific callback
	 */
	target.off = function(type, func) {
		let list;
		let i;

		type || (events[targets[index].uid] = {});
		list = events[targets[index].uid][type] || empty;
		i = list.length = func ? list.length : 0;

		while(i--) {
			func == list[i][0] && list.splice(i,1);
		}
	};
	/** 
	 * Trigger: send event, callbacks will be triggered
	 */
	target.trigger = function(...args) {
		let type = args.shift();
		let list = events[targets[index].uid][type] || empty;
		let i = 0;
		let j;
		let eventParams = [];

		if (config[targets[index].uid].respondWithObject) {
			eventParams.push({
				type,
				data: args.shift()
			});
		} else {
			eventParams = args;
		}

		while(j = list[i++]) {
			j[0].apply(j[1], eventParams);
		}
	};

    target.cleanCustomEvents = function() {
        if (!isNaN(index) && targets[index] && targets[index].uid && events[targets[index].uid]) {
            delete events[targets[index].uid];
        }

        if (!isNaN(index)) {
            targets.splice(index,1);
        }
    };

	return targets[index];
}