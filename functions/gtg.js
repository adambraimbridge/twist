module.exports.handler = (event, context, callback) => {
	callback(null, {
		statusCode: 200,
		headers: { 'content-type': 'text/html' },
		body: 'OK'
	});
};
