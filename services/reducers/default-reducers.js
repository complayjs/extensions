export default class DefaultReducers {

	static reduce(cb, start = 0) {

		let arr = this.toArray(this, !!(this.Model));

		return arr.reduce(cb, start);
	}

	static filter(cb) {

		let arr = this.toArray(this, !!(this.Model));

		return arr.filter(cb);
	}

	static where(characteristics, returnIndexes = false) {

		let results = [];
		let originalIndexes = [];
		let arr = this.toArray(this, !!(this.Model));

		arr.forEach((item, i) => {

			let originalItem = item;

			item = !!(this.Model) ? item.data : item;

			if (typeof characteristics === 'function' && characteristics(item)) {
				originalIndexes.push(i);
				results.push(originalItem);
			} else if (typeof characteristics === 'object') {

				let hasCharacteristics = false;

				for (let key in characteristics) {
					if (item[key] === characteristics[key]) {
						hasCharacteristics = true;
					}
				}

				if (hasCharacteristics) {
					originalIndexes.push(i);
					results.push(originalItem);
				}
			}
		});

		if (returnIndexes) {
			return [results, originalIndexes];	
		} else {
			return results;
		}
		
	}

	static findByIndexes(item) {

		if (isNumber(item)) {
			
			item = [item];
		}

		return ServiceReducers.filter((val, index) => {
			item = !!(this.Model) ? item.data : item;
			return ~item.indexOf(index);
		});
	}
}