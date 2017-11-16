/* global jest */

const webpagetestResponse = {
	'statusCode': 200,
	'statusText': 'Ok',
	'data': {
		'testId': '171116_QW_768975393ffe36d0fd0f76ac9f1ab902',
		'ownerKey': 'b9afe179626d357669c333b374be9566ef4e7a7d',
		'jsonUrl': 'https://www.webpagetest.org/jsonResult.php?test=171116_QW_768975393ffe36d0fd0f76ac9f1ab902',
		'xmlUrl': 'https://www.webpagetest.org/xmlResult/171116_QW_768975393ffe36d0fd0f76ac9f1ab902/',
		'userUrl': 'https://www.webpagetest.org/result/171116_QW_768975393ffe36d0fd0f76ac9f1ab902/',
		'summaryCSV': 'https://www.webpagetest.org/result/171116_QW_768975393ffe36d0fd0f76ac9f1ab902/page_data.csv',
		'detailCSV': 'https://www.webpagetest.org/result/171116_QW_768975393ffe36d0fd0f76ac9f1ab902/requests.csv'
	}
};

const fixtures = [
	{ method: 'POST', url: process.env.SLACK_WEBHOOK, data: { ok: true, text: () => 'ok' } },
	{ method: 'GET', url: 'https://www.webpagetest.org', data: { ok: true, json: () => webpagetestResponse } },
];

const fetch = jest.fn((url, object) => {
	const method = object && object.method || 'GET';
	try {
		const data = fixtures.find(fixture => fixture.method === method && url.includes(fixture.url)).data;
		return Promise.resolve(data);
	}
	catch(error) {
		throw new Error(`Jest "node-fetch" mock: Could not find data for given url. ${error}`);
	}
});

module.exports = fetch;
