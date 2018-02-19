const fetch = require('node-fetch');
const log = event => {
	return fetch(process.env.SPLUNK_HEC_URL, {
		method: 'POST',
		headers: {
			Authorization: `Splunk ${process.env.SPLUNK_HEC_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: {
			host: 'serverless',
			source: `lambda:${process.env.AWS_LAMBDA_FUNCTION_NAME}`,
			sourcetype: '_json',
			event: event
		}
	});
};

module.exports = log;
