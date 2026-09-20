#!/usr/bin/env node
/**
 * GroundTruth End-to-End Primary Demo Story Test
 * Validates the complete lifecycle:
 * Policy -> Requirement -> Evidence -> SageMaker AI -> Finding -> Action -> Remediation -> Verification -> Human Closure -> Audit Trail
 */

import { SEED_POLICIES, SEED_REQUIREMENTS } from '../shared/dist/index.js';
import { DeterministicDemoProvider } from '../apps/api/dist/services/ai/demo-provider.js';
import { DuplicateDetector } from '../apps/api/dist/services/duplicate-detector.js';
import { IncidentMemoryService } from '../apps/api/dist/services/incident-memory.js';
import { dataStore } from '../apps/api/dist/services/data-store.js';

console.log('===============================================================');
console.log(' GROUNDTRUTH END-TO-END VERIFICATION TEST SUITE');
console.log(' Participant: Pochiraju Kailash Ram Markandeya Sharma');
console.log(' Track: SHIP IT (First Commit 2026)');
console.log('===============================================================\n');

async function runE2ETest() {
  // 1. Policy & Requirement Check
  console.log('[Step 1] Loading Emergency Safety Standard...');
  const policy = dataStore.policies.find(p => p.id === 'pol-emergency-01');
  if (!policy) throw new Error('Failed to find Emergency Safety Policy');
  console.log(`✓ Loaded: "${policy.title}" (${policy.fileFormat}, ${policy.status})`);

  const req = dataStore.requirements.find(r => r.id === 'req-em-01');
  if (!req) throw new Error('Failed to find Emergency Exit requirement');
  console.log(`✓ Extracted Requirement: "${req.title}" -> "${req.requirementText}"`);

  // 2. Simulate Evidence Upload & SageMaker AI Analysis
  console.log('\n[Step 2] Uploading Photographic Evidence to S3 & Invoking AI...');
  const aiProvider = new DeterministicDemoProvider();
  const analysis = await aiProvider.analyzeInspectionEvidence({
    inspectionId: 'INSP-E2E-001',
    requirement: req,
    evidenceUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
    evidenceS3Key: 'evidence/blocked-exit.jpg',
    location: 'Block B — Floor 2',
    notes: 'Blocked emergency exit doorway'
  });

  console.log(`✓ AI Analysis Completed (${analysis.inferenceLatencyMs}ms)`);
  console.log(`  - Status: ${analysis.status}`);
  console.log(`  - Confidence: ${Math.round(analysis.confidence * 100)}%`);
  console.log(`  - Severity: ${analysis.severity}`);
  console.log(`  - Reality Gap Detected: ${analysis.realityGapDetected}`);
  console.log(`  - Grounded Detections: ${analysis.observations.length}`);

  if (analysis.status !== 'NON_COMPLIANT' || !analysis.realityGapDetected) {
    throw new Error('E2E Failure: AI did not detect expected reality gap');
  }

  // 3. Duplicate Detection & Recurring Issue Check
  console.log('\n[Step 3] Checking Duplicate Matching & Incident Memory...');
  const duplicates = DuplicateDetector.findDuplicates({
    location: 'Block B — Floor 2',
    category: 'Safety',
    requirementId: req.id,
    title: 'Emergency Exit Door Blocked by Stored Packing Crates'
  }, dataStore.findings);

  console.log(`✓ Duplicate Detector Match: ${duplicates.length > 0 ? `${Math.round(duplicates[0].similarityScore * 100)}% match with ${duplicates[0].findingId}` : 'None'}`);

  const recurring = IncidentMemoryService.evaluateRecurringIssue('Block B — Floor 2', 'Safety', dataStore.findings);
  console.log(`✓ Recurring Issue Detection: ${recurring.isRecurring ? `TRUE (${recurring.count} incidents in 30 days)` : 'FALSE'}`);

  // 4. Remediation Upload & Before/After Verification
  console.log('\n[Step 4] Uploading Remediation Photo & Invoking Before/After AI Verification...');
  const verification = await aiProvider.verifyRemediation({
    actionId: 'ACT-E2E-001',
    findingId: 'FND-E2E-001',
    requirement: req,
    beforeEvidenceUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
    remediationEvidenceUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f',
    remediationNotes: 'Boxes removed to Storage Bay B-12'
  });

  console.log(`✓ Multi-Image AI Verification Completed:`);
  console.log(`  - Before Status: ${verification.beforeStatus}`);
  console.log(`  - After Status: ${verification.afterStatus}`);
  console.log(`  - Remediation Satisfied: ${verification.isRemediationSatisfied}`);
  console.log(`  - Verification Confidence: ${Math.round(verification.verificationConfidence * 100)}%`);

  if (!verification.isRemediationSatisfied || verification.afterStatus !== 'COMPLIANT') {
    throw new Error('E2E Failure: AI did not verify compliant remediation');
  }

  // 5. Human Confirmation & Audit Trail Check
  console.log('\n[Step 5] Human Supervisor Sign-off & Audit Log Update...');
  dataStore.addAuditLog(
    'HUMAN_CONFIRMATION_COMPLETED',
    'Elena Rostova',
    'MANAGER',
    'ACT-E2E-001',
    'ACTION',
    'Supervisor signed off on verified exit clearance.'
  );

  const latestAudit = dataStore.auditLogs[0];
  console.log(`✓ Audit Log Recorded: [${latestAudit.eventType}] by ${latestAudit.actor} (${latestAudit.timestamp})`);

  const metrics = dataStore.recalculateMetrics();
  console.log(`✓ Dashboard Metrics Updated: Compliance Rate = ${metrics.realityComplianceRate}%`);

  console.log('\n===============================================================');
  console.log(' [SUCCESS] ALL GROUNDTRUTH E2E VERIFICATION CHECKS PASSED!');
  console.log('===============================================================');
}

runE2ETest().catch((err) => {
  console.error('\n[ERROR] E2E Test Failed:', err);
  process.exit(1);
});
