#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GroundTruthStack } from '../lib/groundtruth-stack';

const app = new cdk.App();

new GroundTruthStack(app, 'GroundTruthStack', {
  appName: 'groundtruth',
  stage: 'prod',
  description: 'GroundTruth — AI-Powered Reality Verification Platform (AWS First Commit 2026)',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || '123456789012',
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
  }
});
