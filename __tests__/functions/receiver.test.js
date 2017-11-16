/* global expect,jest */
/* eslint-disable no-console */

// This block must go first
global.console = {log: jest.fn()};
const lambdaTester = require('lambda-tester');
const receiver = require('../../functions/receiver');

// You can edit after here.
const payloadFromCircleCI = require('../../__mocks__/fixtures/payload-from-circleci.json');

describe('functions/receiver', () => {
	describe('given an event notification', () => {
		test('it should trigger a Web Page Test', () => {
			return lambdaTester(receiver.handler)
				.event(payloadFromCircleCI)
				.expectResult(response => {
					expect(response).toMatchSnapshot();
				});
		});
		test('it should log to console', () => {
			return lambdaTester(receiver.handler)
				.event(payloadFromS3)
				.expectResult(() => {
					expect(console.log).toBeCalledWith('');
				});
		});
	});
});
