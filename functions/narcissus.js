// Mirror the request data in order to discover what the receiver can expect.
module.exports.handler = (request, context, callback) => {
	console.log(JSON.stringify(request));
	callback(null, {
		statusCode: 200,
		headers: { 'content-type': 'application/json' },
		body: request
	});
};
