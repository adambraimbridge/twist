const fetch = require('node-fetch');

// Post message to Slack - https://api.slack.com/incoming-webhooks
const send = message => {
	return new Promise((resolve,reject) => {
		if (!process.env.SLACK_WEBHOOK) {
			return reject('Cound not send message to slack recipient. SLACK_WEBHOOK not found.');
		}
		else {

			// Expect process.env.SLACK_WEBHOOK to be different in dev and prod environments. See: `next-vault`.
			return fetch(process.env.SLACK_WEBHOOK, {
				method:'POST',
				headers:{'Content-Type': 'application/json'},
				body:JSON.stringify(message),
			})
			.then(response => {
				if (response.ok) {
					return resolve(response.text());
				} else {
					return reject(`Slack API responded with "${response.text()} (${response.status})`);
				}
			});
		}
	});
};

const getSlackMessage = payload => {
	const message = {
		'channel':'CHANNEL',
		'text':'A new lighthouse report',
		'attachments': [
			{
				'color':'good',
				'title': 'Next steps:',
				'title_link': 'GITHUB_COMMIT_URL',
				'text': ''
			}
		]
	};
	return message;
};

module.exports = {
	getSlackMessage:getSlackMessage,
	send:send
};
