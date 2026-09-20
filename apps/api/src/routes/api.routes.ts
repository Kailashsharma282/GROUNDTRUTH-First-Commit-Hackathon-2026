import { Router } from 'express';
import { PolicyController } from '../controllers/policy.controller.js';
import { InspectionController } from '../controllers/inspection.controller.js';
import { FindingController } from '../controllers/finding.controller.js';
import { ActionController } from '../controllers/action.controller.js';
import { AnalyticsController, AuditController } from '../controllers/analytics.controller.js';
import { HealthController, SettingsController } from '../controllers/health.controller.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', HealthController.checkHealth);

// Policies & Requirements
apiRouter.get('/policies', PolicyController.getPolicies);
apiRouter.get('/policies/:id', PolicyController.getPolicyById);
apiRouter.post('/policies/upload-url', PolicyController.getUploadUrl);
apiRouter.post('/policies/upload', PolicyController.uploadPolicy);
apiRouter.get('/requirements', PolicyController.getRequirements);

// Inspections
apiRouter.get('/inspections', InspectionController.getInspections);
apiRouter.get('/inspections/:id', InspectionController.getInspectionById);
apiRouter.post('/inspections/evidence-url', InspectionController.getEvidenceUploadUrl);
apiRouter.post('/inspections/analyze', InspectionController.createAndAnalyzeInspection);

// Findings
apiRouter.get('/findings', FindingController.getFindings);
apiRouter.get('/findings/:id', FindingController.getFindingById);
apiRouter.patch('/findings/:id', FindingController.updateFindingStatus);

// Actions & Remediation Verification
apiRouter.get('/actions', ActionController.getActions);
apiRouter.get('/actions/:id', ActionController.getActionById);
apiRouter.post('/actions/remediation-url', ActionController.getRemediationUploadUrl);
apiRouter.post('/actions/remediate', ActionController.uploadRemediation);
apiRouter.post('/actions/confirm', ActionController.humanConfirm);

// Analytics & Locations
apiRouter.get('/analytics/dashboard', AnalyticsController.getDashboardMetrics);
apiRouter.get('/analytics/locations', AnalyticsController.getLocationMemory);
apiRouter.get('/analytics/locations/:id', AnalyticsController.getLocationMemoryById);

// Audit Log
apiRouter.get('/audit-logs', AuditController.getAuditLogs);

// Settings
apiRouter.get('/settings', SettingsController.getSettings);
apiRouter.post('/settings/ai-provider', SettingsController.updateAIProvider);
