/* eslint-disable no-console */
const fetch = require('node-fetch');

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
	console.log(JSON.stringify(webpagetestResultsLog));
	return webpagetestResultsLog;
};

const sendToSlack = json => {
	return Promise.resolve('Sent to slack');
};

const processPayload = payload => {
	const testID = payload.queryStringParameters.id;
	return fetch(`http://www.webpagetest.org/jsonResult.php?test=${testID}`)
		.then(response => {
			if (response.ok !== true) {
				throw(`Bad response from http://www.webpagetest.org: ${response.ok}`);
			}
			return response;
		})
		.then(response => response.json())
		.then(json => sendToSlack(json)
			.then(() => logResults(json))
		)
		.catch(error => {throw error;});
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
				body:`Twist: Failed to process payload: ${error} ${error.stack}`,
			});
		});
};
