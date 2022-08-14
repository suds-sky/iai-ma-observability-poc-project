import * as cdk from "aws-cdk-lib"
import * as events from "aws-cdk-lib/aws-events";
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {SampleStepFunction} from "./SampleStepFunction";
import {DynamoTable} from "./dynamo/DynamoTable";
import {SampleFunction} from "./lambda/SampleFunction";
import {SampleAppSync} from "./appsync/SampleAppSync";
import {DynamoTableInsertRecord} from "./dynamo/DynamoTableInsertRecord";

export class IaiMaObservabilityPocProjectStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const dynamoTable = new DynamoTable(this, 'DynamoTable');

        const dynamoTableInsertRecord = new DynamoTableInsertRecord(this, 'DynamoTableInsertRecord', {
            dynamoTable: dynamoTable.table
        });

        dynamoTableInsertRecord.node.addDependency(dynamoTable);

        const sampleAppSync = new SampleAppSync(this, 'AppSync', {
            ddbTable: dynamoTable.table
        });

        const sampleFunction = new SampleFunction(this, 'SampleFunction', {
            apiEndpoint: sampleAppSync.graphqlUrl,
            apiKey: sampleAppSync.apiKey as string
        });

        const sampleStepFunction = new SampleStepFunction(this, 'StepFunction', {
            lambdaFunction: sampleFunction,
            ddbTable: dynamoTable.table
        });

        sampleAppSync.grantQuery(sampleFunction, 'getItem');

        const eventRule = new events.Rule(this, 'EventRule', {
            schedule: events.Schedule.rate(cdk.Duration.minutes(1))
        });

        const eventBridgeAssumeRole = new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
        });

        eventRule.addTarget(new eventsTargets.SfnStateMachine(sampleStepFunction.stateMachine, {
            input: events.RuleTargetInput.fromObject({}),
            role: eventBridgeAssumeRole,
        }))
    }
}
