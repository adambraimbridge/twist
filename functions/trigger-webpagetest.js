/* eslint-disable no-console */
const fetch = require('node-fetch');
const pingbackUrl='https://twist.in.ft.com/receive-webpagetest';

const processRequest = request => {
	const testUrl = (request.queryStringParameters && request.queryStringParameters.url) || 'https://www.ft.com';
	const notificationEmail = (request.queryStringParameters && request.queryStringParameters.email) || 'adam.braimbridge@ft.com';
	const webpagetestUrl = [
		'https://www.webpagetest.org/runtest.php?',
		`url=${testUrl}`,
		`pingback=${pingbackUrl}`,
		`k=${process.env.WEBPAGETEST_API_KEY}`,
		`notify=${notificationEmail}`,
		'location=Dulles_Nexus7',
		'fvonly=1',
		'private=1',
		'lighthouse=1',
		'f=json'
	].join('&');
	return fetch(webpagetestUrl)
		.then(response => response.json());
	};

module.exports.handler = (request, context, callback) => {
	processRequest(request)
		.then(response => {
			callback(null, {
				statusCode:200,
				headers: { 'Content-Type': 'application/json' },
				body:JSON.stringify(response),
			});
		})
		.catch(error => {
			callback(null, {
				statusCode:500,
				body:`Twist: Failed to process request: ${request} | ${error} ${error.stack}`,
			});
		});
};
