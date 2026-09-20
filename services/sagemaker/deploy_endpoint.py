#!/usr/bin/env python3
"""
GroundTruth SageMaker Endpoint Deployment Script
Provisions a cost-aware real-time SageMaker AI endpoint on AWS.
"""

import os
import sys
import boto3
import sagemaker
from sagemaker.pytorch import PyTorchModel

ENDPOINT_NAME = os.getenv("SAGEMAKER_ENDPOINT_NAME", "groundtruth-vision-reasoner-v1")
REGION = os.getenv("AWS_REGION", "us-east-1")
ROLE_ARN = os.getenv("SAGEMAKER_ROLE_ARN")
INSTANCE_TYPE = os.getenv("SAGEMAKER_INSTANCE_TYPE", "ml.m5.large")

def main():
    print(f"===============================================================")
    print(f" Deploying GroundTruth SageMaker Endpoint: {ENDPOINT_NAME}")
    print(f" AWS Region: {REGION}")
    print(f" Instance Type: {INSTANCE_TYPE} (Cost-Optimized)")
    print(f"===============================================================")

    session = sagemaker.Session(boto_session=boto3.Session(region_name=REGION))
    
    try:
        role = ROLE_ARN or sagemaker.get_execution_role()
    except Exception:
        print("[Notice] Using IAM default or mock execution role ARN for setup.")
        role = f"arn:aws:iam::123456789012:role/GroundTruthSageMakerRole"

    pytorch_model = PyTorchModel(
        entry_point="inference.py",
        source_dir=os.path.dirname(os.path.abspath(__file__)),
        role=role,
        framework_version="2.1.0",
        py_version="py310",
        name=f"{ENDPOINT_NAME}-model",
        sagemaker_session=session
    )

    print(f"Creating real-time SageMaker endpoint variant...")
    predictor = pytorch_model.deploy(
        initial_instance_count=1,
        instance_type=INSTANCE_TYPE,
        endpoint_name=ENDPOINT_NAME
    )

    print(f"[SUCCESS] SageMaker Endpoint active: {predictor.endpoint_name}")

if __name__ == "__main__":
    main()
