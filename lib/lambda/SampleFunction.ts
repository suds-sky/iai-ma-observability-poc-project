import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import path from "path";

type SampleFunctionProps = {
    apiEndpoint: string;
    apiKey: string;
}

export class SampleFunction extends lambdaNodejs.NodejsFunction {
    constructor(scope: Construct, id: string, props: SampleFunctionProps) {
        super(scope, id, {
            entry: path.join(__dirname, "src", "function", "index.ts"),
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_16_X,
            memorySize: 512,
            bundling: {
                minify: true,
                sourceMap: true,
                sourcesContent: false,
                target: "node16",
            },
            environment: {
                NODE_OPTIONS: "--enable-source-maps",
                API_ENDPOINT: props.apiEndpoint,
                API_KEY: props.apiKey,
            },
        });
    }
}
