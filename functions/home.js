module.exports.handler = (event, context, callback) => {
	callback(null, {
		statusCode: 200,
		headers: { 'content-type': 'text/html' },
		body: `
<!DOCTYPE html><html><head>
	<title>https://twist.in.ft.com</title>
	<style type="text/css">input { width:100% } </style>
</head>
<body  style="width:400px; margin:10em auto;">
<form action="/trigger-webpagetest">
	<p><strong>Trigger a Google Lighthouse report</strong></p>
	<p>URL: <input name="url" type="text" value="https://www.ft.com"/></p>
	<p>Notification email: <input name="email" type="text" value="adam.braimbridge@ft.com"/></p>
	<button type="submit">Engage</button>
</form>
</body></html>`
	});
};
