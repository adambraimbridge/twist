/* global expect,jest */
/* eslint-disable no-console */

// This block must go first
global.console = {log: jest.fn()};
const lambdaTester = require('lambda-tester');
const handler = require('../../functions/trigger-webpagetest').handler;
const fetch = require('node-fetch');

// You can edit after here.
const payload = require('../../__mocks__/fixtures/trigger-webpagetest.json');

describe('functions/trigger-webpagetest', () => {
	describe('given a URL', () => {
		test('it should trigger a Web Page Test for that URL', () => {
			return lambdaTester(handler)
				.event(payload)
				.expectResult(response => {
					expect(fetch).toHaveBeenCalled();
					expect(response).toMatchSnapshot();
				});
		});
	});
});
