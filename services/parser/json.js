export default class JsonParserExtension {
	
	parse(rawData) {
		return JSON.parse(rawData);
	}

	stringify(jsonData) {
		return JSON.stringify(jsonData);
	}
}