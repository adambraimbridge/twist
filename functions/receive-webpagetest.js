/* eslint-disable no-console */
const fetch = require('node-fetch');
const slack = require('../lib/slack');

const logResults = json => {
	const webpagetestResultsLog = {
		'id': json.data.id,
		'summary': json.data.summary,
		'testUrl': json.data.testUrl,
		'lighthouse': {
			'generatedTime': json.data.lighthouse.generatedTime,
			'score': json.data.lighthouse.score,
			'report': `http://www.webpagetest.org/lighthouse.php?test=${json.data.id}#performance`
		}
	};
	if (json.error && json.error) {
		webpagetestResultsLog.error = json.error;
	}
	console.log(JSON.stringify(webpagetestResultsLog));
	return Promise.resolve(webpagetestResultsLog);
};

const processPayload = payload => {
	const testID = payload.queryStringParameters.id;
	return fetch(`http://www.webpagetest.org/jsonResult.php?test=${testID}`)
		.then(response => {
			if (response.ok !== true) {
				throw new Error(`Bad response from http://www.webpagetest.org: ${response.ok}`);
			}
			return response;
		})
		.then(response => response.json())
		.then(json => {
			const messageToUser = slack.getSlackMessage(json);
			return slack.send(messageToUser)
				.then(response => {
					return Object.assign(json, { response });
				})
				.catch(error => {
					return Object.assign(json, { error });
				});
		})
		.then(json => logResults(json));
};

module.exports.handler = (request, context, callback) => {
	processPayload(request)
		.then(response => {
			const output = {
				'log':'Twist: Sucessfully processed Webpagetools Notification payload',
				'results': response
			};
			callback(null, {
				statusCode:200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(output)
			});
		})
		.catch(error => {
			callback(null, {
				statusCode:500,
				headers: { 'Content-Type': 'application/json' },
				body:`Twist: Failed to process payload: ${JSON.stringify(error)}`
			});
		});
};
