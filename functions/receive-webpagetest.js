/* eslint-disable no-console */

// Todo: Send notification to slack

const processPayload = payload => {
	const testID = payload.queryStringParameters.id;
	const webpagetestResults = {
		resultsSummary:`http://www.webpagetest.org/result/${testID}/`,
		lighthouseReport:`http://www.webpagetest.org/lighthouse.php?test=${testID}#performance`
	};
	return Promise.resolve(webpagetestResults);
};

module.exports.handler = (request, context, callback) => {
	processPayload(request)
		.then(response => {
			console.log(JSON.stringify(response));
			callback(null, {
				statusCode:200,
				body:`Twist: Sucessfully processed Webpagetools Notification payload: ${response}`,
			});
		})
		.catch(error => {
			console.error(error);
			callback(null, {
				statusCode:500,
				body:`Twist: Failed to process payload: ${error} ${error.stack}`,
			});
		});
};
