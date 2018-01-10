module.exports.handler = (event, context, callback) => {
	callback(null, {
		statusCode: 200,
		headers: { 'content-type': 'text/html' },
		body: `<html>
<head><title>https://twist.in.ft.com</title><style type="text/css">input { width:99% } </style></head>
<body style="width:400px;margin:10em auto;font-family: sans-serif;">
<h1>🛳 Twist</h1>
<form action="/trigger-webpagetest" style="border-top: 1px solid; border-bottom: 1px solid; padding-bottom: 1em;">
<p><strong>Trigger a Google Lighthouse report</strong></p>
<p>URL: <input name="url" type="text" value="https://www.ft.com"></p>
<p>Notification email: <input name="email" type="text" value="adam.braimbridge@ft.com"></p>
<button type="submit">Engage</button>
</form>
<ul style="font-size: small; font-family: monospace;">
<li>View reports via the <a target="_blank" href="https://financialtimes.splunkcloud.com/en-US/app/search/twist">dashboard</a></li>
<li>Developer <a href="https://docs.google.com/a/ft.com/document/d/15xuDCvPfPODKTJJbAC8yAA1Mr9VaJdwWRqKCNPXASkY" target="_blank">field notes</a></li>
<li>Github <a href="https://github.com/Financial-Times/twist" target="_blank">repository</a></li>
<li><a href="https://github.com/Financial-Times/twist/blob/master/lib/test-urls.js" target="_blank">Add your app to the twist list!</a></li>
</ul>
</body></html>`
	});
};
