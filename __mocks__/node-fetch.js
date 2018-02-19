/* global jest */
const jsonResultResponse = require('./fixtures/json-result');
const runtestResponse = require('./fixtures/runtest');

const fixtures = [
	{ method: 'POST', url: process.env.SLACK_WEBHOOK, data: { ok: true, text: () => 'ok' } },
	{ method: 'POST', url: process.env.SPLUNK_HEC_URL, data: { ok: true, text: () => 'ok' } },
	{ method: 'GET', url: 'https://www.webpagetest.org/runtest.php', data: { ok: true, json: () => runtestResponse } },
	{ method: 'GET', url: 'http://www.webpagetest.org/jsonResult.php', data: { ok: true, json: () => jsonResultResponse } },
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
