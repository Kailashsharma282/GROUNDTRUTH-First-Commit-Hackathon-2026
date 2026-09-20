# GroundTruth — Cost Controls & Optimization Strategy

Built specifically for the AWS Ship It track, GroundTruth includes aggressive cost-control features to ensure zero unexpected cloud spend during and after hackathon evaluations.

## 1. Compute & Storage Cost Optimizations
- **Serverless Architecture**: AWS Lambda and Amazon API Gateway incur $0 idle costs.
- **Pay-Per-Request DynamoDB**: DynamoDB tables use On-Demand capacity mode.
- **S3 Lifecycle Rules**: Temporary upload previews and intermediate test artifacts transition to Glacier or auto-expire after 30 days.
- **CloudWatch Retention**: CloudWatch Log Groups are configured with 7-day retention.

## 2. SageMaker AI Cost Management
- **Right-Sized Instances**: SageMaker endpoints are configured with `ml.m5.large` CPU instances rather than multi-GPU clusters for cost-effective inference.
- **Auto-Teardown Script**: Includes `services/sagemaker/teardown_endpoint.py` for one-command endpoint deletion.
- **Deterministic Demo Fallback**: When real-time endpoint testing is completed, switching to `DeterministicDemoProvider` allows zero-cost local demonstrations with 100% fidelity.
