import {Construct} from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cr from "aws-cdk-lib/custom-resources";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";

type DynamoTableInsertRecordProps = {
    dynamoTable: dynamodb.ITable
}

export class DynamoTableInsertRecord extends Construct {
    constructor(scope: Construct, id: string, props: DynamoTableInsertRecordProps) {
        super(scope, id);
        this.insertRecord(props.dynamoTable);
    }

    private insertRecord(dynamoTable: dynamodb.ITable) {
        const tableName = dynamoTable.tableName;

        const item = {
            "id": {
                "S": "1"
            },
            "value": {
                "S": "observability"
            }
        }
        const awsSdkCall: cr.AwsSdkCall = {
            service: 'DynamoDB',
            action: 'putItem',
            physicalResourceId: cr.PhysicalResourceId.of(tableName + '_insert'),
            parameters: {
                TableName: tableName,
                Item: item
            }
        }

        new cr.AwsCustomResource(this, "SampleTable_custom_resource", {
                onCreate: awsSdkCall,
                onUpdate: awsSdkCall,
                logRetention: logs.RetentionDays.ONE_WEEK,
                policy: cr.AwsCustomResourcePolicy.fromStatements([
                    new iam.PolicyStatement({
                        sid: 'DynamoWriteAccess',
                        effect: iam.Effect.ALLOW,
                        actions: ['dynamodb:PutItem'],
                        resources: [dynamoTable.tableArn],
                    })
                ]),
                timeout: cdk.Duration.minutes(5)
            }
        );
    }
}
