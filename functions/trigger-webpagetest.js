/* eslint-disable no-console */
const fetch = require('node-fetch');
const pingbackUrl = 'https://twist.in.ft.com/receive-webpagetest';
const defaultTestUrls = require('../lib/test-urls');

const triggerWebpagetests = urls => {
	return Promise.all(urls.map(url => {
		return fetch(url)
			.then(response => response.json());
	}));
};

const processRequest = request => {
	const testUrls = (request.queryStringParameters && request.queryStringParameters.url) ? [request.queryStringParameters.url] : defaultTestUrls;
	const notificationEmail = (request.queryStringParameters && request.queryStringParameters.email) || 'adam.braimbridge@ft.com';
	return triggerWebpagetests(testUrls.map(testUrl => [
		'https://www.webpagetest.org/runtest.php?',
		`url=${testUrl}`,
		`pingback=${pingbackUrl}`,
		`k=${process.env.WEBPAGETEST_API_KEY}`,
		`notify=${notificationEmail}`,
		'location=Dulles_Nexus7',
		'private=1',
		'lighthouse=1',
		'f=json'
	].join('&')));
};

module.exports.handler = (request, context, callback) => {
	processRequest(request)
		.then(response => {
			callback(null, {
				statusCode: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(response),
			});
		})
		.catch(error => {
			callback(null, {
				statusCode: 500,
				body: `Twist: Failed to process request: ${request} | ${error} ${error.stack}`,
			});
		});
};
