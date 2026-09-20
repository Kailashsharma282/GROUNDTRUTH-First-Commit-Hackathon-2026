# GroundTruth — Database Schema & Access Patterns

GroundTruth utilizes Amazon DynamoDB for all operational entities with zero-scan access patterns.

## DynamoDB Tables & Key Schema

### 1. `groundtruth_findings_prod`
- **Partition Key (PK)**: `id` (e.g. `FND-2026-089`)
- **Global Secondary Index (GSI 1)**: `byLocation`
  - Partition Key: `location`
  - Sort Key: `createdAt`
- **Global Secondary Index (GSI 2)**: `byStatus`
  - Partition Key: `status`
  - Sort Key: `createdAt`

### 2. `groundtruth_audit_log_prod`
- **Partition Key (PK)**: `id` (e.g. `aud-1726839000`)
- **Sort Key (SK)**: `timestamp` (ISO-8601 String)

---

## Key Operational Access Patterns

1. **Get Finding by ID**: `GetItem(PK = findingId)`
2. **List Open Findings by Facility Location**: `Query(GSI = byLocation, PK = locationName)`
3. **List Findings by Status (e.g. READY_FOR_VERIFICATION)**: `Query(GSI = byStatus, PK = 'READY_FOR_VERIFICATION')`
4. **Fetch Chronological Audit Trail**: `Query(Table = audit_log, ScanIndexForward = false, Limit = 50)`
5. **Evaluate Duplicate Finding Overlap**: Query by `location` and compute token similarity against existing findings without full table scans.
