"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroundTruthStack = void 0;
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const cognito = require("aws-cdk-lib/aws-cognito");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigatewayv2 = require("aws-cdk-lib/aws-apigatewayv2");
const apigwIntegrations = require("aws-cdk-lib/aws-apigatewayv2-integrations");
const sqs = require("aws-cdk-lib/aws-sqs");
const eventbridge = require("aws-cdk-lib/aws-events");
const sns = require("aws-cdk-lib/aws-sns");
const cloudwatch = require("aws-cdk-lib/aws-cloudwatch");
const iam = require("aws-cdk-lib/aws-iam");
const sagemaker_construct_1 = require("./sagemaker-construct");
const stepfunctions_construct_1 = require("./stepfunctions-construct");
class GroundTruthStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const appName = props?.appName || 'groundtruth';
        const stage = props?.stage || 'prod';
        // 1. S3 Storage Bucket for Policies, Evidence, and Remediation Images
        const storageBucket = new s3.Bucket(this, 'StorageBucket', {
            bucketName: `${appName}-evidence-vault-${stage}-${this.account}`,
            cors: [
                {
                    allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.HEAD],
                    allowedOrigins: ['*'],
                    allowedHeaders: ['*'],
                    maxAge: 3600
                }
            ],
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            enforceSSL: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });
        // 2. Amazon Cognito User Pool & Client
        const userPool = new cognito.UserPool(this, 'UserPool', {
            userPoolName: `${appName}-user-pool-${stage}`,
            selfSignUpEnabled: true,
            signInAliases: { email: true },
            autoVerify: { email: true },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: false
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY
        });
        const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
            userPool,
            userPoolClientName: `${appName}-web-client`,
            authFlows: {
                userPassword: true,
                userSrp: true
            },
            generateSecret: false
        });
        // Cognito Role Groups
        ['INSPECTOR', 'MANAGER', 'VERIFIER', 'ADMIN'].forEach(role => {
            new cognito.CfnUserPoolGroup(this, `CognitoGroup_${role}`, {
                userPoolId: userPool.userPoolId,
                groupName: role,
                description: `GroundTruth ${role} role group`
            });
        });
        // 3. Amazon DynamoDB Tables
        const findingsTable = new dynamodb.Table(this, 'FindingsTable', {
            tableName: `${appName}_findings_${stage}`,
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        findingsTable.addGlobalSecondaryIndex({
            indexName: 'byLocation',
            partitionKey: { name: 'location', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING }
        });
        findingsTable.addGlobalSecondaryIndex({
            indexName: 'byStatus',
            partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING }
        });
        const auditTable = new dynamodb.Table(this, 'AuditTable', {
            tableName: `${appName}_audit_log_${stage}`,
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        // 4. Amazon SQS Queues (Async Processing & DLQ)
        const deadLetterQueue = new sqs.Queue(this, 'InspectionDLQ', {
            queueName: `${appName}-inspection-dlq-${stage}.fifo`,
            fifo: true,
            retentionPeriod: cdk.Duration.days(14)
        });
        const inspectionQueue = new sqs.Queue(this, 'InspectionQueue', {
            queueName: `${appName}-inspection-jobs-${stage}.fifo`,
            fifo: true,
            contentBasedDeduplication: true,
            visibilityTimeout: cdk.Duration.minutes(6),
            deadLetterQueue: {
                queue: deadLetterQueue,
                maxReceiveCount: 3
            }
        });
        // 5. Amazon EventBridge Custom Bus
        const eventBus = new eventbridge.EventBus(this, 'DomainEventBus', {
            eventBusName: `${appName}-domain-events-${stage}`
        });
        // 6. Amazon SNS Notification Topic
        const criticalAlertTopic = new sns.Topic(this, 'CriticalAlertTopic', {
            topicName: `${appName}-critical-reality-gaps-${stage}`,
            displayName: 'GroundTruth Reality Gap Critical Notifications'
        });
        // 7. SageMaker Inference Construct
        const sagemakerConstruct = new sagemaker_construct_1.SageMakerConstruct(this, 'SageMakerInferenceEngine', {
            evidenceBucket: storageBucket,
            endpointName: `${appName}-vision-reasoner-${stage}`
        });
        // 8. AWS Lambda Serverless API Handler
        const apiLambda = new lambda.Function(this, 'ApiLambdaHandler', {
            functionName: `${appName}-api-handler-${stage}`,
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'server.handler',
            code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'GroundTruth Serverless Lambda API Running', eventPath: event.rawPath })
          };
        };
      `),
            timeout: cdk.Duration.seconds(30),
            memorySize: 1024,
            environment: {
                S3_BUCKET: storageBucket.bucketName,
                DYNAMODB_FINDINGS_TABLE: findingsTable.tableName,
                DYNAMODB_AUDIT_TABLE: auditTable.tableName,
                COGNITO_USER_POOL_ID: userPool.userPoolId,
                COGNITO_CLIENT_ID: userPoolClient.userPoolClientId,
                SAGEMAKER_ENDPOINT_NAME: sagemakerConstruct.endpointName,
                EVENT_BUS_NAME: eventBus.eventBusName,
                SNS_TOPIC_ARN: criticalAlertTopic.topicArn,
                AI_PROVIDER: 'sagemaker'
            }
        });
        storageBucket.grantReadWrite(apiLambda);
        findingsTable.grantReadWriteData(apiLambda);
        auditTable.grantReadWriteData(apiLambda);
        inspectionQueue.grantSendMessages(apiLambda);
        eventBus.grantPutEventsTo(apiLambda);
        criticalAlertTopic.grantPublish(apiLambda);
        apiLambda.addToRolePolicy(new iam.PolicyStatement({
            actions: ['sagemaker:InvokeEndpoint'],
            resources: [`arn:aws:sagemaker:${this.region}:${this.account}:endpoint/${sagemakerConstruct.endpointName}`]
        }));
        // Grant Step Functions execution permission to Lambda via ARN wildcard to avoid circular role dependencies
        apiLambda.addToRolePolicy(new iam.PolicyStatement({
            actions: ['states:StartExecution', 'states:DescribeExecution', 'states:GetExecutionHistory'],
            resources: [`arn:aws:states:${this.region}:${this.account}:stateMachine:*`]
        }));
        // 9. AWS Step Functions Inspection Pipeline Construct
        const stepFunctionsConstruct = new stepfunctions_construct_1.StepFunctionsConstruct(this, 'InspectionStateMachineConstruct', {
            inspectionHandler: apiLambda,
            findingsTable,
            criticalAlertTopic
        });
        // 10. Amazon API Gateway HTTP API
        const httpApi = new apigatewayv2.HttpApi(this, 'HttpApiGateway', {
            apiName: `${appName}-gateway-${stage}`,
            corsPreflight: {
                allowHeaders: ['*'],
                allowMethods: [
                    apigatewayv2.CorsHttpMethod.GET,
                    apigatewayv2.CorsHttpMethod.POST,
                    apigatewayv2.CorsHttpMethod.PATCH,
                    apigatewayv2.CorsHttpMethod.PUT,
                    apigatewayv2.CorsHttpMethod.DELETE,
                    apigatewayv2.CorsHttpMethod.OPTIONS
                ],
                allowOrigins: ['*'],
                maxAge: cdk.Duration.days(1)
            }
        });
        const lambdaIntegration = new apigwIntegrations.HttpLambdaIntegration('LambdaIntegration', apiLambda);
        httpApi.addRoutes({
            path: '/{proxy+}',
            methods: [apigatewayv2.HttpMethod.ANY],
            integration: lambdaIntegration
        });
        // 11. Amazon CloudWatch Observability Dashboard
        const dashboard = new cloudwatch.Dashboard(this, 'CloudWatchDashboard', {
            dashboardName: `GroundTruth-Observability-${stage}`
        });
        dashboard.addWidgets(new cloudwatch.GraphWidget({
            title: 'API Gateway Invocations & Latency',
            left: [
                new cloudwatch.Metric({
                    namespace: 'AWS/ApiGateway',
                    metricName: 'Latency',
                    dimensionsMap: { ApiId: httpApi.apiId },
                    statistic: 'Average'
                })
            ],
            right: [
                new cloudwatch.Metric({
                    namespace: 'AWS/ApiGateway',
                    metricName: 'Count',
                    dimensionsMap: { ApiId: httpApi.apiId },
                    statistic: 'SampleCount'
                })
            ]
        }), new cloudwatch.GraphWidget({
            title: 'Lambda Executions & Errors',
            left: [
                new cloudwatch.Metric({
                    namespace: 'AWS/Lambda',
                    metricName: 'Invocations',
                    dimensionsMap: { FunctionName: apiLambda.functionName },
                    statistic: 'Sum'
                })
            ],
            right: [
                new cloudwatch.Metric({
                    namespace: 'AWS/Lambda',
                    metricName: 'Errors',
                    dimensionsMap: { FunctionName: apiLambda.functionName },
                    statistic: 'Sum'
                })
            ]
        }));
        // Stack Outputs
        new cdk.CfnOutput(this, 'ApiGatewayUrl', {
            value: httpApi.url || 'https://api.groundtruth.aws',
            description: 'API Gateway Endpoint URL'
        });
        new cdk.CfnOutput(this, 'EvidenceBucketName', {
            value: storageBucket.bucketName,
            description: 'S3 Evidence Bucket Name'
        });
        new cdk.CfnOutput(this, 'CognitoUserPoolId', {
            value: userPool.userPoolId,
            description: 'Cognito User Pool ID'
        });
        new cdk.CfnOutput(this, 'CognitoClientId', {
            value: userPoolClient.userPoolClientId,
            description: 'Cognito Client ID'
        });
        new cdk.CfnOutput(this, 'SageMakerEndpointName', {
            value: sagemakerConstruct.endpointName,
            description: 'SageMaker AI Inference Endpoint'
        });
        new cdk.CfnOutput(this, 'StepFunctionsArn', {
            value: stepFunctionsConstruct.stateMachine.stateMachineArn,
            description: 'Step Functions State Machine ARN'
        });
    }
}
exports.GroundTruthStack = GroundTruthStack;
