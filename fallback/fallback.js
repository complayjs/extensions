let typeMessagesBroadcasted = [];

export default function(type) {
	return function() {

		let isString = typeof type === 'string';

		if (isString && typeMessagesBroadcasted.indexOf(type) === -1) {
			let msgArray = [
				`Extension for "${type}" is not configured yet.\r\n`,
				`Please pass an extensions through ApplicationFacade constructor options.${type}\r\n`,
				`or directly through Module, Service or Component via options.app.${type}!`
			];

			console.warn(msgArray.join(''));

			typeMessagesBroadcasted.push(type);
		}

		return arguments[0];
	}
}