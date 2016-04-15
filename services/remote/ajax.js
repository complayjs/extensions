import getGlobalObject from '../../../helpers/environment/get-global-object';
import Plite from 'plite';

let glob = getGlobalObject();

// shim promises
!glob.Promise && (glob.Promise = Plite);

export default (function ajaxExtension() {

	let _resource = {};

	return {

		get resource() {
			return _resource;
		},

		set resource(res) {
			_resource = res;
		},

		fetch(res) {

			this.resource = res || this.resource;

			return new Promise((resolve, reject) => {
				let xhr = new XMLHttpRequest();
				
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
		},

		parse() {
			// override this!
			return arguments[0];
		},

		save() {
		}	
	}	
}());