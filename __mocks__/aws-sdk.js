/* global jest */

const AWS = jest.genMockFromModule('aws-sdk');

AWS.S3 = class {
	constructor () {
		this.getObjectAcl = () => {
			return {
				promise: () => Promise.resolve({
					Grants: [{
						Grantee: {
							URI: 'http://acs.amazonaws.com/groups/global/AllUsers'
						},
						Permission: 'READ'
					}]
				})
			};
		};
		this.getObject = () => {
			return {
				promise: () => Promise.resolve({
					Body: new Buffer('hello world')
				})
			};
		};
		this.putObject = () => {
			return {
				promise: () => Promise.resolve({
					ETag: '"254ba42e224398afab3ecfce8db18085"'
				})
			};
		};
	}
};

module.exports = AWS;
