import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import {AuthorizationType} from "@aws-cdk/aws-appsync-alpha";
import {Construct} from "constructs";
import path, {join} from "path";

type SampleAppsyncProps = {
    ddbTable: dynamodb.ITable;
}

export class SampleAppSync extends appsync.GraphqlApi {
    constructor(scope: Construct, id: string, props: SampleAppsyncProps) {
        super(scope, id, {
            name: "sample-appsync",
            schema: appsync.Schema.fromAsset(
                path.join(__dirname, "schema.graphql"),
            ),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: AuthorizationType.API_KEY,
                }
            }
        });

        const {ddbTable} = props;

        const ddbDataSource = this.addDynamoDbDataSource("ddbDataSource", ddbTable);

        SampleAppSync.addResolver(ddbDataSource, "Query", "getItem");
    }

    private static addResolver(
        source: appsync.BackedDataSource,
        schemaType: "Query",
        fieldName: string
    ) {
        source.createResolver({
            typeName: schemaType,
            fieldName,
            requestMappingTemplate: SampleAppSync.getMappingTemplate(
                `${schemaType}.${fieldName}.request.vtl`
            ),
            responseMappingTemplate:
                SampleAppSync.getMappingTemplate(
                    `${schemaType}.${fieldName}.response.vtl`
                ),
        });
    }

    private static getMappingTemplate(templateFile: string) {
        const resolverDir = join(__dirname, "resolvers");
        return appsync.MappingTemplate.fromFile(
            join(resolverDir, templateFile)
        );
    }
}
