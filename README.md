# GROUNDTRUTH

> **"Does reality actually match the rules?"**  
> *Turn policies into evidence. Turn gaps into action.*

---

## First Commit 2026 — Bharat Builds Tour (Track: SHIP IT)

- **Participant**: Pochiraju Kailash Ram Markandeya Sharma ([@kailashsharma](https://github.com/kailashsharma))
- **Participation**: SOLO PARTICIPANT
- **Team Name**: `KGP_unknown_Coder_404`
- **Team Code**: `BFZXQT`

---

## 1. What is GroundTruth?

Organizations create policies, SOPs, safety standards, accessibility checklists, and maintenance procedures. But documentation only describes what **SHOULD** happen. In the physical world, reality is often completely different.

**GroundTruth** is an AI-powered reality verification platform that compares documented requirements with real-world photographic evidence using Amazon SageMaker AI.

```
POLICY (Expected)  +  EVIDENCE (Observed)  →  SAGEMAKER AI  →  REALITY GAP  →  ACTION  →  AI VERIFICATION  →  HUMAN SIGN-OFF  →  AUDIT TRAIL
```

---

## 2. Production AWS Architecture (Ship It Stack)

Every AWS service in GroundTruth serves a genuine, intentional architectural purpose:

| AWS Service | Architecture Layer | Purpose & Justification |
| :--- | :--- | :--- |
| **Amazon Amplify Hosting** | Frontend Hosting | Global CDN distribution of React 18 single-page application with automatic HTTPS. |
| **Amazon API Gateway** | Public API Entrypoint | Serverless HTTP API endpoint with CORS handling, rate-limiting, and Lambda proxy routing. |
| **AWS Lambda** | Compute & Microservices | Zero-idle Node.js 20 serverless handlers executing business logic, validation, and orchestrations. |
| **AWS Step Functions** | Workflow Orchestration | Multi-step state machine managing inspection lifecycle, error retries, and AI result persistence. |
| **Amazon SageMaker AI** | AI/ML Inference | Real-time hosted endpoint running multimodal vision-language reasoning on physical evidence. |
| **Amazon S3** | Object Storage | Highly durable storage for source policy PDFs, high-res evidence photos, and remediation proof. |
| **Amazon DynamoDB** | Operational Database | Serverless NoSQL table storing policies, requirements, inspections, findings, and audit trails. |
| **Amazon Cognito** | Identity & Security | Secure JWT authentication with role-based access control (Inspector, Manager, Verifier, Admin). |
| **Amazon EventBridge** | Eventing Fabric | Decoupled domain event bus broadcasting lifecycle state changes across the organization. |
| **Amazon SQS** | Async Task Buffer | FIFO message queue with Dead-Letter Queue (DLQ) for asynchronous inspection batching. |
| **Amazon SNS** | Push Notifications | Real-time notification dispatch for critical safety gaps and manager sign-off requests. |
| **Amazon CloudWatch** | Observability | Centralized telemetry, structured error logging, latency monitoring, and alarm dashboards. |

---

## 3. Quick Start & Local Execution

### Install Dependencies:
```bash
npm install
```

### Run Full-Stack Development Server:
```bash
# Starts the React + Vite Web App on http://localhost:3000
npm run dev

# Starts the API Gateway / Express Backend on http://localhost:3001
npm run dev:api
```

### Run End-to-End Primary Demo Story Test:
```bash
npm run test:e2e
```

### Synthesize AWS CDK Infrastructure:
```bash
npm run synth
```

---

## 4. Key Platform Features

1. **Policy Ingestion & Structured Extraction**: Upload PDF/DOCX/TXT documents; Step Functions extracts normalized requirements with verification hints.
2. **Signature Reality Gap Visualizer**: Visually contrasts **Expected Policy** vs **Observed Reality** with confidence scoring and spatial bounding boxes.
3. **Strict AI Trust Boundary**: Never hallucinates evidence. Dark/blurry photos trigger `INSUFFICIENT_EVIDENCE` with guidance for better image capture.
4. **Duplicate & Recurring Issue Detection**: Flags similar findings (e.g. GT-991, 93% match) and alerts facilities if a location has repeated violations.
5. **Before / After Remediation Verification**: Multi-image slider comparing original violation photo with remediation photo before supervisor sign-off.
6. **Immutable Audit Trail**: Chronological event timeline stored in DynamoDB for compliance inspections.

---

## 5. Documentation Suite

- [docs/architecture.md](docs/architecture.md) — Comprehensive architecture diagrams & workflows.
- [docs/deployment.md](docs/deployment.md) — AWS CDK and Amplify hosting deployment guide.
- [docs/aws-services.md](docs/aws-services.md) — AWS services justification matrix.
- [docs/ai-pipeline.md](docs/ai-pipeline.md) — SageMaker AI reasoning, confidence scoring & trust boundary.
- [docs/database.md](docs/database.md) — DynamoDB table design & access patterns.
- [docs/demo-script.md](docs/demo-script.md) — 3-minute hackathon judge walkthrough script.
- [docs/cost-controls.md](docs/cost-controls.md) — Cloud cost management & SageMaker teardown guide.
