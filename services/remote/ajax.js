import getGlobalObject from '../../../helpers/environment/get-global-object';
import Plite from 'plite';

let glob = getGlobalObject();

// shim promises
!glob.Promise && (glob.Promise = Plite);

export default class AjaxExtensions {

	get resource() {
		return this._resource;
	}

	set resource(res) {
		this._resource = res;
	}

	makeRequestPromise(options) {

		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest(options);
			
			xhr.open(this.resource.method, this.resource.url);
			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(this.parse(xhr.response));
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

	fetch(resource) {

		this.resource = resource || this.resource;

		if (!this.resource.method) {
			this.resource.method = 'GET';
		}

		return this.makeRequestPromise();
	}

	parse(rawData) {
		// override this!
		return arguments[0];
	}

	save(resource) {

		this.resource = resource || this.resource;

		if (!this.resource.method) {
			this.resource.method = 'POST';
		}

		return this.makeRequestPromise();
	}	
}