/* eslint-disable no-console */
const fetch = require('node-fetch');
const slack = require('../lib/slack');
const logToSplunk = require('../lib/log-to-splunk');

const logResults = json => {
	const matchingKeys = Object.keys(json.data.median.firstView).filter(key => {
		return ['userTime.', 'lighthouse.', 'chromeUserTiming.'].find(needle => {
			return key.includes(needle);
		});
	});

	const data = matchingKeys.reduce((accumulator, key) => {
		accumulator[key] = json.data.median.firstView[key];
		return accumulator;
	}, {});

	const webpagetestResultsLog = Object.assign({},{
		'id': json.data.id,
		'summary': json.data.summary,
		'testUrl': json.data.testUrl,
		'lighthouse': {
			'generatedTime': json.data.lighthouse.generatedTime,
			'score': json.data.lighthouse.score,
			'report': `http://www.webpagetest.org/lighthouse.php?test=${json.data.id}#performance`
		},
		data
	});

	if (json.error && json.error) {
		webpagetestResultsLog.error = json.error;
	}

	return logToSplunk(webpagetestResultsLog)
		.then(response => {
			console.log(response);
		})
		.catch(error => {
			console.error(error);
		});
};

const processPayload = payload => {
	const testID = payload.queryStringParameters.id;
	return fetch(`http://www.webpagetest.org/jsonResult.php?test=${testID}`)
		.then(response => {
			if (response.ok !== true) {
				throw new Error(`Bad response from http://www.webpagetest.org: ${response}`);
			}
			return response;
		})
		.then(response => response.json())
		.then(json => {
			const messageToUser = slack.getSlackMessage(json.data);
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
				'log':'Twist: Sucessfully processed the webpagetools notification payload',
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
				body:`Twist: Failed to process payload: ${error} ${error.stack}`
			});
		});
};
