import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as sfnTasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {Construct} from "constructs";
import {DynamoAttributeValue} from "aws-cdk-lib/aws-stepfunctions-tasks";

type SampleStepFunctionProps = {
    lambdaFunction: lambda.IFunction,
    ddbTable: dynamodb.ITable,
}

export class SampleStepFunction extends Construct {
    readonly stateMachine: sfn.IStateMachine;

    constructor(scope: Construct, id: string, props: SampleStepFunctionProps) {
        super(scope, id);

        const {lambdaFunction, ddbTable} = props;

        const lambdaTask = new sfnTasks.LambdaInvoke(this, "LambdaInvoke", {
            lambdaFunction,
        })

        const dynamoGetItemTask = new sfnTasks.DynamoGetItem(this, "DynamoGetItem", {
            table: ddbTable,
            key: {
                id: DynamoAttributeValue.fromString("1"),
            },
        });

        const definition = dynamoGetItemTask.next(lambdaTask);

        this.stateMachine = new sfn.StateMachine(this, "StateMachine", {
            definition,
        })
    }
}
