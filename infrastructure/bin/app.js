#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const groundtruth_stack_1 = require("../lib/groundtruth-stack");
const app = new cdk.App();
new groundtruth_stack_1.GroundTruthStack(app, 'GroundTruthStack', {
    appName: 'groundtruth',
    stage: 'prod',
    description: 'GroundTruth — AI-Powered Reality Verification Platform (AWS First Commit 2026)',
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT || '123456789012',
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
    }
});
