import { 
  Inspection, 
  PolicyRequirement, 
  Finding, 
  CorrectiveAction, 
  AIAnalysisResult,
  DuplicateMatch 
} from '@groundtruth/shared';
import { dataStore } from './data-store.js';
import { AIFactory } from './ai/ai-factory.js';
import { DuplicateDetector } from './duplicate-detector.js';
import { IncidentMemoryService } from './incident-memory.js';
import { v4 as uuidv4 } from 'uuid';

export class InspectionService {
  public static getAllInspections(): Inspection[] {
    return dataStore.inspections;
  }

  public static getInspectionById(id: string): Inspection | undefined {
    return dataStore.inspections.find(i => i.id === id);
  }

  public static async executeInspection(input: {
    policyId: string;
    requirementId: string;
    location: string;
    evidenceUrl: string;
    evidenceS3Key: string;
    fileName: string;
    notes?: string;
    inspectorId: string;
    inspectorName: string;
  }): Promise<{ inspection: Inspection; finding?: Finding; correctiveAction?: CorrectiveAction }> {
    const policy = dataStore.policies.find(p => p.id === input.policyId);
    const requirement = dataStore.requirements.find(r => r.id === input.requirementId);

    if (!requirement) {
      throw new Error(`Requirement ${input.requirementId} not found`);
    }

    const inspectionId = `INSP-2026-${Math.floor(Math.random() * 899 + 100)}`;

    // 1. Create Initial Inspection Entity
    const inspection: Inspection = {
      id: inspectionId,
      title: `${requirement.title} Reality Verification`,
      policyId: input.policyId,
      policyTitle: policy ? policy.title : requirement.policyTitle,
      requirementId: requirement.id,
      requirementText: requirement.requirementText,
      location: input.location,
      category: requirement.category,
      inspectorId: input.inspectorId,
      inspectorName: input.inspectorName,
      evidence: [
        {
          id: `ev-${uuidv4().slice(0, 8)}`,
          url: input.evidenceUrl,
          s3Key: input.evidenceS3Key,
          fileName: input.fileName,
          mimeType: 'image/jpeg',
          sizeBytes: 2450000,
          uploadedAt: new Date().toISOString(),
          description: input.notes
        }
      ],
      notes: input.notes,
      status: 'ANALYZING',
      createdAt: new Date().toISOString()
    };

    dataStore.inspections.unshift(inspection);

    dataStore.addAuditLog(
      'INSPECTION_CREATED',
      input.inspectorName,
      'INSPECTOR',
      inspectionId,
      'INSPECTION',
      `Initiated inspection for "${requirement.title}" at ${input.location}`
    );

    dataStore.addAuditLog(
      'EVIDENCE_UPLOADED',
      input.inspectorName,
      'INSPECTOR',
      inspectionId,
      'INSPECTION',
      `Uploaded evidence photo ${input.fileName} to S3`
    );

    // 2. Invoke AI Engine (SageMaker or Demo Fallback based on configuration)
    const aiProvider = AIFactory.getProvider();
    const analysisResult = await aiProvider.analyzeInspectionEvidence({
      inspectionId,
      requirement,
      evidenceUrl: input.evidenceUrl,
      evidenceS3Key: input.evidenceS3Key,
      location: input.location,
      notes: input.notes
    });

    inspection.analysisResult = analysisResult;
    inspection.completedAt = new Date().toISOString();

    const auditEvent = analysisResult.provider === 'sagemaker' 
      ? 'SAGEMAKER_ANALYSIS_COMPLETED' 
      : 'DEMO_ANALYSIS_COMPLETED';

    dataStore.addAuditLog(
      auditEvent,
      analysisResult.provider === 'sagemaker' ? 'Amazon SageMaker AI' : 'Deterministic Demo Provider',
      'ADMIN',
      inspectionId,
      'INSPECTION',
      `AI evaluation completed (${analysisResult.inferenceLatencyMs}ms): ${analysisResult.status} (${Math.round(analysisResult.confidence * 100)}% confidence)`
    );

    let createdFinding: Finding | undefined;
    let createdAction: CorrectiveAction | undefined;

    // 3. If Reality Gap Detected, Create Finding & Corrective Action
    if (analysisResult.realityGapDetected || analysisResult.status === 'NON_COMPLIANT' || analysisResult.status === 'PARTIALLY_COMPLIANT') {
      inspection.status = 'GAP_DETECTED';
      const findingId = `FND-2026-${Math.floor(Math.random() * 899 + 100)}`;
      const actionId = `ACT-2026-${Math.floor(Math.random() * 899 + 100)}`;

      // Evaluate duplicates
      const potentialFinding: Partial<Finding> = {
        id: findingId,
        title: `${requirement.title} Violation - ${input.location}`,
        location: input.location,
        category: requirement.category,
        requirementId: requirement.id
      };
      const duplicates = DuplicateDetector.findDuplicates(potentialFinding, dataStore.findings);

      // Evaluate recurring issues
      const recurringCheck = IncidentMemoryService.evaluateRecurringIssue(input.location, requirement.category, dataStore.findings);

      createdFinding = {
        id: findingId,
        inspectionId,
        policyId: requirement.policyId,
        policyTitle: requirement.policyTitle,
        requirementId: requirement.id,
        requirementText: requirement.requirementText,
        location: input.location,
        category: requirement.category,
        severity: analysisResult.severity,
        confidence: analysisResult.confidence,
        status: 'OPEN',
        title: `${requirement.title} Reality Gap - ${input.location}`,
        description: analysisResult.summary,
        expectedCondition: analysisResult.expectedCondition,
        observedCondition: analysisResult.observedCondition,
        evidenceUrl: input.evidenceUrl,
        evidenceS3Key: input.evidenceS3Key,
        observations: analysisResult.observations,
        recommendedAction: analysisResult.recommendedActions[0] || 'Remediate identified deviation immediately',
        correctiveActionId: actionId,
        possibleDuplicates: duplicates.slice(0, 3),
        isRecurringIssue: recurringCheck.isRecurring,
        recurringIncidentCount: recurringCheck.count,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dataStore.findings.unshift(createdFinding);
      inspection.findingId = findingId;

      dataStore.addAuditLog(
        'FINDING_CREATED',
        'System Engine',
        'ADMIN',
        findingId,
        'FINDING',
        `Generated finding ${findingId}: "${createdFinding.title}" (${createdFinding.severity} severity)`
      );

      if (duplicates.length > 0) {
        dataStore.addAuditLog(
          'DUPLICATE_FLAGGED',
          'System Engine',
          'ADMIN',
          findingId,
          'FINDING',
          `Detected ${Math.round(duplicates[0].similarityScore * 100)}% match with ${duplicates[0].findingId} at same location`
        );
      }

      // Create Corrective Action
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (analysisResult.severity === 'CRITICAL' ? 1 : 3));

      createdAction = {
        id: actionId,
        findingId,
        title: `Remediate: ${createdFinding.title}`,
        description: analysisResult.recommendedActions.join('. '),
        priority: analysisResult.severity,
        ownerId: 'usr-marcus-03',
        ownerName: 'Marcus Vance',
        dueDate: dueDate.toISOString(),
        status: 'OPEN',
        location: input.location,
        category: requirement.category,
        beforeEvidenceUrl: input.evidenceUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dataStore.actions.unshift(createdAction);

      dataStore.addAuditLog(
        'ACTION_ASSIGNED',
        'Elena Rostova',
        'MANAGER',
        actionId,
        'ACTION',
        `Assigned corrective action ${actionId} to Marcus Vance`
      );
    } else if (analysisResult.status === 'COMPLIANT') {
      inspection.status = 'COMPLIANT';
    } else {
      inspection.status = 'NEEDS_REVISION';
    }

    dataStore.recalculateMetrics();
    return { inspection, finding: createdFinding, correctiveAction: createdAction };
  }
}
