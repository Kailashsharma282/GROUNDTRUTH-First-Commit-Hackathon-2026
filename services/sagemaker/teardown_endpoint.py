#!/usr/bin/env python3
"""
GroundTruth SageMaker Cost Control: Immediate Teardown Script
Deletes active endpoint and endpoint config to eliminate ongoing hourly charges.
"""

import os
import boto3

ENDPOINT_NAME = os.getenv("SAGEMAKER_ENDPOINT_NAME", "groundtruth-vision-reasoner-v1")
REGION = os.getenv("AWS_REGION", "us-east-1")

def teardown():
    client = boto3.client("sagemaker", region_name=REGION)
    print(f"[Cost Control] Initiating teardown for endpoint: {ENDPOINT_NAME} in {REGION}...")

    try:
        client.delete_endpoint(EndpointName=ENDPOINT_NAME)
        print(f"[SUCCESS] Deleted SageMaker Endpoint: {ENDPOINT_NAME}")
    except Exception as e:
        print(f"[Notice] Endpoint deletion: {e}")

    try:
        client.delete_endpoint_config(EndpointConfigName=f"{ENDPOINT_NAME}-config")
        print(f"[SUCCESS] Deleted Endpoint Config: {ENDPOINT_NAME}-config")
    except Exception as e:
        print(f"[Notice] Config deletion: {e}")

if __name__ == "__main__":
    teardown()
