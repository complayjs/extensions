export default function(type) {
	return function() {
		let msgArray = [
			`Extension for "${type}" is not configured yet.\r\n`, 
			`Please pass an extensions through ApplicationFacade constructor options.${type}\r\n`, 
			`or directly through Module, Service or Component via options.app.${type}!`
		];
		console.warn(msgArray.join(''));
		return arguments[0];
	}
}