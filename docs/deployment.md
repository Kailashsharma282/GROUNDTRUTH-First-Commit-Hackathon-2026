# GroundTruth — Deployment & Infrastructure Guide

This guide details the complete deployment workflow for GroundTruth on AWS, utilizing AWS CDK (Cloud Development Kit) in TypeScript for Infrastructure as Code (IaC) and Amazon Amplify Hosting for the frontend web application.

---

## Prerequisites

1. **Node.js**: v20.x or higher
2. **AWS CLI**: Configured with AWS credentials (`aws configure`)
3. **AWS CDK CLI**: Installed globally (`npm install -g aws-cdk`)
4. **Python**: 3.10+ (for SageMaker model deployment)

---

## 1. Environment Setup

Copy `.env.example` to `.env` and provide your AWS environment details:

```bash
cp .env.example .env
```

Ensure the following variables are configured:
```env
AWS_REGION=us-east-1
S3_BUCKET=groundtruth-evidence-bucket-prod
DYNAMODB_PREFIX=groundtruth_
COGNITO_USER_POOL_ID=us-east-1_GROUNDTRUTH_POOL
COGNITO_CLIENT_ID=groundtruth-web-client-id
SAGEMAKER_ENDPOINT_NAME=groundtruth-vision-reasoner-v1
API_GATEWAY_URL=https://api.groundtruth.aws.internal/v1
AMPLIFY_APP_ID=d2groundtruthapp
APP_ENV=production
AI_PROVIDER=sagemaker
```

---

## 2. Install Dependencies & Build Workspace

From the root project directory:

```bash
npm install
npm run build
```

---

## 3. Deploy AWS CDK Infrastructure

The CDK stack provisions S3, DynamoDB, Cognito, SQS, EventBridge, SNS, Step Functions, Lambda, API Gateway, and CloudWatch.

```bash
# Synthesize CloudFormation template
cd infrastructure
npm run synth

# Deploy stack to AWS account
cdk deploy GroundTruthStack --require-approval never
```

CDK outputs will provide the deployed API Gateway URL, S3 Bucket name, and Cognito Pool ID.

---

## 4. Deploy Amazon SageMaker AI Endpoint

Deploy the cost-optimized PyTorch vision-language inference endpoint:

```bash
cd services/sagemaker
pip install -r requirements.txt
python deploy_endpoint.py
```

---

## 5. Deploy Web Frontend to Amazon Amplify

Connect your GitHub repository to Amazon Amplify Hosting:

1. Open **AWS Amplify Console**.
2. Select **Host web app** → Link your repository (`groundtruth`).
3. Set base directory to `apps/web`.
4. Build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build --workspace=apps/web
     artifacts:
       baseDirectory: apps/web/dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Deploy and access your public HTTPS Amplify URL.

---

## 6. Seed Operational Demo Dataset

Populate the database with policies, requirements, and findings:

```bash
npm run seed
```

---

## 7. Execute Deployment Smoke Tests

Verify that all deployed AWS endpoints respond correctly:

```bash
npm run smoke-test
```
