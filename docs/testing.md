# GroundTruth — Verification & Testing Report

## 1. Automated Test Suites

### Unit Tests
- `tests/unit/ai-provider.test.ts`: Validates AI contract adherence, bounding box parsing, and AI trust boundary enforcement (`INSUFFICIENT_EVIDENCE` triggers on dark/blurry images).
- `tests/unit/duplicate-detector.test.ts`: Tests semantic, category, and location overlap scoring against existing findings.
- `tests/unit/incident-memory.test.ts`: Verifies location risk score calculations and recurring violation triggers.

### Integration Tests
- `tests/integration/api-routes.test.ts`: Verifies all REST endpoints (`/policies`, `/inspections`, `/findings`, `/actions`, `/analytics`, `/audit-logs`, `/health`).

### End-to-End Primary Demo Story Test
- `scripts/run-e2e-demo.js`: Executes the complete Blocked Emergency Exit lifecycle:
  1. Load Emergency Safety Standard v3.4.
  2. Extract requirement: "Emergency exits must remain unobstructed".
  3. Upload evidence photograph.
  4. Invoke AI reasoning pipeline.
  5. Verify reality gap detection (High severity, 94% confidence).
  6. Create corrective action for Marcus Vance.
  7. Upload post-remediation evidence.
  8. Perform Before vs After AI multi-image comparison.
  9. Perform human supervisor confirmation.
  10. Assert finding closure and audit trail entry.

---

## 2. Real AWS Deployment Smoke Test
- `scripts/smoke-test.js`: Validates deployed AWS API Gateway health, S3 presigned URL generation, DynamoDB connectivity, and Step Functions execution.
