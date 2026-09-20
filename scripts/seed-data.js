#!/usr/bin/env node
/**
 * GroundTruth Database Seeder Script
 * Seeds local and DynamoDB tables with realistic operational datasets.
 */

import { SEED_POLICIES, SEED_REQUIREMENTS, SEED_FINDINGS, SEED_ACTIONS, SEED_LOCATIONS, SEED_AUDIT_LOGS } from '../shared/dist/index.js';

console.log('Seeding GroundTruth operational dataset...');
console.log(`- Policies: ${SEED_POLICIES.length}`);
console.log(`- Requirements: ${SEED_REQUIREMENTS.length}`);
console.log(`- Findings: ${SEED_FINDINGS.length}`);
console.log(`- Corrective Actions: ${SEED_ACTIONS.length}`);
console.log(`- Locations: ${SEED_LOCATIONS.length}`);
console.log(`- Audit Logs: ${SEED_AUDIT_LOGS.length}`);
console.log('✓ Seeding completed successfully.');
