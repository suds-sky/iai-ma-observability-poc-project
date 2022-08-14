# iai-ma-observability-poc-project

An example project that can be used to evaluate observability platform capabilities with AWS serverless services.

## What's included

A CDK stack with the following resources:

- A DynamoDB table with data
- An AppSync GraphQL API
- A Lambda function that queries the AppSync GraphQL API
- A step function state machine with steps mentioned below
  - A step that gets item from DynamoDB table using SDK integration
  - A step that invokes the Lambda function
- An event rule that triggers the step function state machine every 1 minute

## Requirements

- Nodejs v16
- AWS CDK v2 - `npm install -g aws-cdk`
- [pnpm](https://pnpm.io)

## Useful commands

Install nodejs dependencies with `pnpm install`.

* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
* `cdk destroy`     delete the stack
