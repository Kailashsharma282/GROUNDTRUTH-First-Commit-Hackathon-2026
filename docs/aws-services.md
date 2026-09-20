# GroundTruth — AWS Services Justification Matrix

Every AWS service utilized in GroundTruth was selected with explicit architectural purpose to solve the problem of physical reality verification at enterprise scale.

---

## Service-by-Service Justification

| AWS Service | Production Purpose | Why AWS is Appropriate |
| :--- | :--- | :--- |
| **Amazon Amplify Hosting** | Frontend deployment & CI/CD | Seamless deployment of React SPA with built-in HTTPS, branch previews, and edge CDN acceleration. |
| **Amazon API Gateway** | Public API Gateway | Serverless API management with low-latency HTTP integrations, CORS support, and native Cognito JWT authorizers. |
| **AWS Lambda** | Serverless Business Logic | Auto-scaling Node.js 20 execution with zero idle compute costs, isolating microservices cleanly. |
| **AWS Step Functions** | Inspection Pipeline Orchestration | Genuinely manages multi-step asynchronous analysis: validates requirements, calls SageMaker, evaluates outputs, and updates DynamoDB. |
| **Amazon SageMaker AI** | Multimodal Visual Reasoning | Dedicated, secure inference hosting for vision-language models capable of grounded physical evidence evaluation. |
| **Amazon S3** | Evidence & Document Vault | Secure, encrypted object store with pre-signed URLs ensuring frontend clients never hold AWS root credentials. |
| **Amazon DynamoDB** | Operational Data Store | Single-digit millisecond latency with Global Secondary Indexes for fast querying by location, status, and category. |
| **Amazon Cognito** | Identity & Access Management | Enterprise user directory with fine-grained group permissions (Inspector, Manager, Verifier, Admin). |
| **Amazon EventBridge** | Domain Event Bus | Decouples event generation (Finding Created, Remediation Uploaded) from notification and analytics pipelines. |
| **Amazon SQS** | Asynchronous Work Queue | FIFO buffering with Dead-Letter Queues (DLQ) ensuring zero inspection job loss during peak traffic bursts. |
| **Amazon SNS** | Urgent Push Notifications | Real-time broadcast of critical safety breaches to facility managers via SMS, Email, and webhook triggers. |
| **Amazon CloudWatch** | Observability & Telemetry | Live latency tracking, Step Functions execution metrics, structured error logs, and alarm thresholds. |
