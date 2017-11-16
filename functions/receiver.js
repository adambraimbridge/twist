/* eslint-disable no-console */

const denodeify = require('denodeify');
const compress = denodeify(require('iltorb').compress);
const gzip = denodeify(require('zlib').gzip);
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID_BEKKEREI,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_BEKKEREI,
});

const processPayload = payload => {
	return Promise.resolve(payload);
};

module.exports.handler = (request, context, callback) => {
	processPayload(request)
		.then(response => {
			console.log(JSON.stringify(response));
			callback(null, {
				statusCode:200,
				body:`Twist: Sucessfully processed payload`,
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
