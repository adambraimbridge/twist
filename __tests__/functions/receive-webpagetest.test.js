/* global expect,jest */
/* eslint-disable no-console */

// This block must go first
global.console = {log: jest.fn()};
const lambdaTester = require('lambda-tester');
const handler = require('../../functions/receive-webpagetest').handler;
// const slack = require('../../lib/slack');
// const slack_getSlackUser = jest.spyOn(slack, 'getSlackUser');
// const slack_getSlackMessage = jest.spyOn(slack, 'getSlackMessage');
// const slack_send = jest.spyOn(slack, 'send');

// You can edit after here.
const payload = require('../../__mocks__/fixtures/receive-webpagetest.json');

describe.skip('functions/receive-webpagetest', () => {
	describe('given a notification from webpagetest', () => {
		test('it should send a notification to Slack', () => {
			return lambdaTester(handler)
				.event(payload)
				.expectResult(response => {
					expect(response).toMatchSnapshot();
				});
		});
	});
});
