const fetch = require('node-fetch');
const log = message => {

	// Add context to every event in the buffer
	const context = {
		host: 'serverless',
		source: `lambda:${process.env.AWS_LAMBDA_FUNCTION_NAME}`,
		sourcetype: '_json'
	};

	return fetch(process.env.SPLUNK_HEC_URL, {
		method: 'POST',
		headers: {
			Authorization: `Splunk ${process.env.SPLUNK_HEC_TOKEN}`,
		},
		body: JSON.stringify(Object.assign({}, message, context))
	});
};

module.exports = log;
