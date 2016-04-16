import getGlobalObject from '../../../helpers/environment/get-global-object';
import Plite from 'plite';

let glob = getGlobalObject();

// shim promises
!glob.Promise && (glob.Promise = Plite);

function makeRequestPromise(options) {

	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest(options);
		
		xhr.open(this.resource.method, this.resource.url);
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve({res: this.parse(xhr.response), service: options._this});
			} else {
				reject({
					status: xhr.status,
					statusText: xhr.statusText
				});
			}
		};

		xhr.onerror = function () {
			reject({
				status: xhr.status,
				statusText: xhr.statusText
			});
		};

		xhr.send();
	});
}

export default (function ajaxExtension() {

	let _resource = {};

	return {

		get resource() {
			return _resource;
		},

		set resource(res) {
			_resource = res;
		},

		fetch(resource) {

			this.resource = resource || this.resource;

			if (!this.resource.method) {
				this.resource.method = 'GET';
			}

			return makeRequestPromise.call(this, {_this: this});
		},

		parse(rawData) {
			// override this!
			return arguments[0];
		},

		save(resource) {

			this.resource = resource || this.resource;

			if (!this.resource.method) {
				this.resource.method = 'POST';
			}

			return makeRequestPromise.call(this, {_this: this});
		}	
	}	
}());