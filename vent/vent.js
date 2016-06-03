let targets = [];
let events = {};

export default function Vent(newTarget){
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
	}

	/**
	 *  On: listen to events
	 */
	target.on = function(type, func, ctx){
		(events[targets[index].uid][type] = events[targets[index].uid][type] || []).push([func, ctx]);
	}
	/**
	 *  Off: stop listening to event / specific callback
	 */
	target.off = function(type, func){
		type || (events[targets[index].uid] = {})
		let list = events[targets[index].uid][type] || empty,
				i = list.length = func ? list.length : 0;
		while(i--) func == list[i][0] && list.splice(i,1)
	}
	/** 
	 * Trigger: send event, callbacks will be triggered
	 */
	target.trigger = function(type){
		let list = events[targets[index].uid][type] || empty, i=0, j;
		while(j=list[i++]) j[0].apply(j[1], empty.slice.call(arguments, 1))
	};

	return targets[index];
}