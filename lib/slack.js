const fetch = require('node-fetch');
const slackMessageTemplate = require('./slack-message-template');
const moment = require('moment');

const getTwistBotUsername = () => {
	const list = [
		'TwistBot 3000',
		'Let\'s Twist Again',
		'Round the Twist',
		'Merry Twistmas',
		'Twistopia',
		'Twisted Sister',
		'Twister was a really good movie',
		'Well if you twist my arm',
		'A better twist than The Sixth Sense ',
		'FT Twist Robot',
		'A twist in our midst',
		'This twist can\'t be missed',
		'TwistBot FTW',
		'A-list twists',
		'Twissistant: Your personal Twist assistant',
		'Twist time is tea time ☕️'
	];
	return list[Math.floor((Math.random()*list.length))];
};

// Post message to Slack - https://api.slack.com/incoming-webhooks
const send = message => {
	return new Promise((resolve, reject) => {
		if (!process.env.SLACK_WEBHOOK) {
			return reject('Cound not send message to slack recipient. SLACK_WEBHOOK not found.');
		}
		else {
			const body = JSON.stringify(Object.assign({}, message, { username: getTwistBotUsername()}));
			return fetch(process.env.SLACK_WEBHOOK, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: body,
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

const getSlackMessage = data => {
	const getScore = id => Math.floor(data.lighthouse.reportCategories.find(row => row.id === id).score);
	const getColor = score => score > 94 ? 'good' : score > 74 ? 'warning' : 'danger';

	const replacements = [
		['TEST_URL', data.lighthouse.url],
		['REPORT_DATE', moment(data.lighthouse.generatedTime).format('MMMM Do YYYY, h:mm:ss a')],
		['REPORT_URL', `https://www.webpagetest.org/lighthouse.php?run=1&test=${data.id}`],
		['SCORE_PROGRESSIVE_WEB_APP', getScore('pwa')],
		['COLOR_PROGRESSIVE_WEB_APP', getColor(getScore('pwa'))],
		['SCORE_PERFORMANCE', getScore('performance')],
		['COLOR_PERFORMANCE', getColor(getScore('performance'))],
		['SCORE_ACCESSIBILITY', getScore('accessibility')],
		['COLOR_ACCESSIBILITY', getColor(getScore('accessibility'))],
		['SCORE_BEST_PRACTICES', getScore('best-practices')],
		['COLOR_BEST_PRACTICES', getColor(getScore('best-practices'))]
	];
	const message = replacements.reduce((accumulator, [find, replacement]) => {
		return accumulator.replace(new RegExp(find, 'g'), replacement);
	}, JSON.stringify(slackMessageTemplate));

	return JSON.parse(message);
};

module.exports = {
	getSlackMessage:getSlackMessage,
	send:send
};
