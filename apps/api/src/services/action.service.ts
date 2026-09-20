import { 
  CorrectiveAction, 
  Finding, 
  VerificationResult, 
  RemediationEvidence, 
  UserRole 
} from '@groundtruth/shared';
import { dataStore } from './data-store.js';
import { AIFactory } from './ai/ai-factory.js';
import { v4 as uuidv4 } from 'uuid';

export class ActionService {
  public static getAllActions(): CorrectiveAction[] {
    return dataStore.actions;
  }

  public static getActionById(id: string): CorrectiveAction | undefined {
    return dataStore.actions.find(a => a.id === id);
  }

  public static async uploadRemediationAndVerify(input: {
    actionId: string;
    remediationImageUrl: string;
    remediationS3Key: string;
    notes: string;
    actor: string;
  }): Promise<{ action: CorrectiveAction; verificationResult: VerificationResult }> {
    const action = dataStore.actions.find(a => a.id === input.actionId);
    if (!action) {
      throw new Error(`Action ${input.actionId} not found`);
    }

    const finding = dataStore.findings.find(f => f.id === action.findingId);
    if (!finding) {
      throw new Error(`Finding ${action.findingId} not found`);
    }

    const requirement = dataStore.requirements.find(r => r.id === finding.requirementId);
    if (!requirement) {
      throw new Error(`Requirement ${finding.requirementId} not found`);
    }

    // 1. Attach Remediation Evidence
    const remediationEvidence: RemediationEvidence = {
      id: `rem-${uuidv4().slice(0, 8)}`,
      url: input.remediationImageUrl,
      s3Key: input.remediationS3Key,
      uploadedAt: new Date().toISOString(),
      notes: input.notes,
      uploadedBy: input.actor
    };

    action.remediationEvidence = remediationEvidence;
    action.status = 'READY_FOR_VERIFICATION';
    action.updatedAt = new Date().toISOString();

    dataStore.addAuditLog(
      'REMEDIATION_UPLOADED',
      input.actor,
      'INSPECTOR',
      action.id,
      'ACTION',
      `Uploaded remediation evidence photo for action ${action.id}`
    );

    // 2. Invoke AI Verification Engine
    const aiProvider = AIFactory.getProvider();
    const verificationResult = await aiProvider.verifyRemediation({
      actionId: action.id,
      findingId: finding.id,
      requirement,
      beforeEvidenceUrl: action.beforeEvidenceUrl,
      remediationEvidenceUrl: input.remediationImageUrl,
      remediationNotes: input.notes
    });

    action.verificationResult = verificationResult;

    dataStore.addAuditLog(
      'AI_VERIFICATION_COMPLETED',
      verificationResult.provider === 'sagemaker' ? 'Amazon SageMaker AI' : 'Deterministic Demo Provider',
      'ADMIN',
      action.id,
      'ACTION',
      `AI verification completed: ${verificationResult.afterStatus} (${Math.round(verificationResult.verificationConfidence * 100)}% confidence). Remediation satisfied: ${verificationResult.isRemediationSatisfied}`
    );

    dataStore.recalculateMetrics();
    return { action, verificationResult };
  }

  public static humanConfirmClosure(input: {
    actionId: string;
    approved: boolean;
    actor: string;
    actorRole: UserRole;
    notes?: string;
  }): { action: CorrectiveAction; finding: Finding } {
    const action = dataStore.actions.find(a => a.id === input.actionId);
    if (!action) {
      throw new Error(`Action ${input.actionId} not found`);
    }

    const finding = dataStore.findings.find(f => f.id === action.findingId);
    if (!finding) {
      throw new Error(`Finding ${action.findingId} not found`);
    }

    if (input.approved) {
      action.status = 'VERIFIED';
      action.completedAt = new Date().toISOString();
      if (action.verificationResult) {
        action.verificationResult.humanConfirmed = true;
        action.verificationResult.confirmedBy = input.actor;
        action.verificationResult.confirmedAt = new Date().toISOString();
      }

      finding.status = 'VERIFIED';
      finding.closedAt = new Date().toISOString();
      finding.updatedAt = new Date().toISOString();

      dataStore.addAuditLog(
        'HUMAN_CONFIRMATION_COMPLETED',
        input.actor,
        input.actorRole,
        action.id,
        'ACTION',
        `Human verification sign-off approved by ${input.actor} (${input.actorRole})`
      );

      dataStore.addAuditLog(
        'FINDING_CLOSED',
        input.actor,
        input.actorRole,
        finding.id,
        'FINDING',
        `Closed finding ${finding.id} following verified remediation`
      );
    } else {
      action.status = 'REJECTED';
      finding.status = 'REOPENED';
      finding.updatedAt = new Date().toISOString();

      dataStore.addAuditLog(
        'FINDING_REOPENED',
        input.actor,
        input.actorRole,
        finding.id,
        'FINDING',
        `Remediation rejected by ${input.actor}. Rework requested: ${input.notes || 'Incomplete resolution'}`
      );
    }

    dataStore.recalculateMetrics();
    return { action, finding };
  }
}
