node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

@export IGNORE_A11Y = true
IS_USER_FACING := ""

TEST_APP := "ft-twist-pr-${CIRCLE_BUILD_NUM}"

test: verify unit-test

unit-test:
	jest --verbose
	@$(DONE)

run:
	serverless offline start --host local.ft.com --port 3002
	@$(DONE)

provision:
	serverless deploy --region eu-west-2 --stage ci${CIRCLE_BUILD_NUM}
	@$(DONE)

tidy:
	serverless remove --region eu-west-2 --stage ci${CIRCLE_BUILD_NUM}
	@$(DONE)

deploy:
	serverless deploy --region eu-west-1 --stage prod
	@$(DONE)

remove:
	serverless remove --region eu-west-1 --stage prod
	@$(DONE)
