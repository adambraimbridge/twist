/* eslint-disable no-console */
const fetch = require('node-fetch');
const pingbackUrl='https=//sqg4xkxx63.execute-api.eu-west-1.amazonaws.com/prod/receive-webpagetest';
const notificationEmail = 'adam.braimbridge@ft.com';

const processRequest = request => {
	const webpagetestUrl = [
		'https://www.webpagetest.org/runtest.php?',
		`url=${request.queryStringParameters.url}`,
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
