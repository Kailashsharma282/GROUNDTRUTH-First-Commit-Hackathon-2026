import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SageMakerRuntimeClient } from '@aws-sdk/client-sagemaker-runtime';
import { SFNClient } from '@aws-sdk/client-sfn';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SNSClient } from '@aws-sdk/client-sns';
import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import dotenv from 'dotenv';

dotenv.config();

export const AWS_CONFIG = {
  region: process.env.AWS_REGION || 'us-east-1',
  s3Bucket: process.env.S3_BUCKET || 'groundtruth-evidence-bucket-prod',
  dynamoPrefix: process.env.DYNAMODB_PREFIX || 'groundtruth_',
  sagemakerEndpoint: process.env.SAGEMAKER_ENDPOINT_NAME || 'groundtruth-vision-reasoner-v1',
  userPoolId: process.env.COGNITO_USER_POOL_ID || 'us-east-1_GROUNDTRUTH_POOL',
  clientId: process.env.COGNITO_CLIENT_ID || 'groundtruth-web-client-id',
  aiProvider: (process.env.AI_PROVIDER || 'sagemaker') as 'sagemaker' | 'demo',
  appEnv: process.env.APP_ENV || 'production'
};

const clientConfig = { region: AWS_CONFIG.region };

export const s3Client = new S3Client(clientConfig);

const rawDynamoClient = new DynamoDBClient(clientConfig);
export const dynamoDocClient = DynamoDBDocumentClient.from(rawDynamoClient, {
  marshallOptions: { removeUndefinedValues: true }
});

export const sagemakerRuntimeClient = new SageMakerRuntimeClient(clientConfig);
export const sfnClient = new SFNClient(clientConfig);
export const eventBridgeClient = new EventBridgeClient(clientConfig);
export const sqsClient = new SQSClient(clientConfig);
export const snsClient = new SNSClient(clientConfig);
export const cloudWatchClient = new CloudWatchClient(clientConfig);
export const cognitoClient = new CognitoIdentityProviderClient(clientConfig);
