/* global expect,jest */
/* eslint-disable no-console */

// This block must go first
global.console = {log: jest.fn()};
const lambdaTester = require('lambda-tester');
const handler = require('../../functions/receive-webpagetest').handler;
const slack = require('../../lib/slack');
const slack_getSlackMessage = jest.spyOn(slack, 'getSlackMessage');
const slack_send = jest.spyOn(slack, 'send');

// You can edit after here.
const payload = require('../../__mocks__/fixtures/receive-webpagetest.json');
const message = require('../../__mocks__/fixtures/slack-message.json');

describe('functions/receive-webpagetest', () => {
	describe('given a notification from webpagetest', () => {
		test.skip('it should fetch the lighthouse performance score and log results', () => {
			return lambdaTester(handler)
				.event(payload)
				.expectResult(response => {
					expect(response).toMatchSnapshot();
				});
		});

		test.skip('it should generate appropriate slack message', () => {
			return lambdaTester(handler)
				.event(payload)
				.expectResult(() => {
					expect(slack_getSlackMessage).toHaveBeenCalledWith(payload);
				});
		});

		test('it should send the message to slack', () => {
			return lambdaTester(handler)
				.event(payload)
				.expectResult(() => {
					expect(slack_send).toHaveBeenCalledWith(message);
				});
		});
	});
});
