/* global expect,jest */

// This block must go first
const lambdaTester = require('lambda-tester');
const handler = require('../../functions/receive-webpagetest').handler;
const slack = require('../../lib/slack');
const slack_getSlackMessage = jest.spyOn(slack, 'getSlackMessage');
const slack_send = jest.spyOn(slack, 'send');

// You can edit after here.
const receiveWebpagetestPayload = require('../../__mocks__/fixtures/receive-webpagetest.json');
const webpagetestJsonResult = require('../../__mocks__/fixtures/json-result.json');
const slackMessage = require('../../__mocks__/fixtures/slack-message.json');

describe('functions/receive-webpagetest', () => {
	describe('given a notification from webpagetest', () => {
		test('it should generate an appropriate slack message', () => {
			return lambdaTester(handler)
				.event(receiveWebpagetestPayload)
				.expectResult(() => {
					expect(slack_getSlackMessage).toHaveBeenCalledWith(webpagetestJsonResult.data);
				});
		});

		test('it should send the message to slack', () => {
			return lambdaTester(handler)
				.event(receiveWebpagetestPayload)
				.expectResult(() => {
					expect(slack_send).toHaveBeenCalledWith(slackMessage);
				});
		});

		test('it should fetch the lighthouse performance score and log results', () => {
			return lambdaTester(handler)
				.event(receiveWebpagetestPayload)
				.expectResult(response => {
					expect(response).toMatchSnapshot();
				});
		});
	});
});
