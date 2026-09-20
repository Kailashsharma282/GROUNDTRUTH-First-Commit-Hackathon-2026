import { 
  IAIProvider, 
  InspectionInferenceInput, 
  VerificationInferenceInput 
} from './ai-provider.interface.js';
import { 
  AIAnalysisResult, 
  VerificationResult, 
  AIProviderType,
  ComplianceStatus
} from '@groundtruth/shared';
import { v4 as uuidv4 } from 'uuid';

export class DeterministicDemoProvider implements IAIProvider {
  readonly providerType: AIProviderType = 'demo';

  async analyzeInspectionEvidence(input: InspectionInferenceInput): Promise<AIAnalysisResult> {
    const startTime = Date.now();
    const reqText = (input.requirement.requirementText || '').toLowerCase();
    const notes = (input.notes || '').toLowerCase();
    const url = (input.evidenceUrl || '').toLowerCase();

    // Trust Boundary Check 1: Unclear / blurry / insufficient evidence handling
    if (notes.includes('blurry') || notes.includes('unclear') || notes.includes('dark') || url.includes('dark') || notes.includes('poor lighting')) {
      return {
        id: `demo-analysis-${uuidv4()}`,
        inspectionId: input.inspectionId,
        requirementId: input.requirement.id,
        provider: 'demo',
        modelId: 'groundtruth-vision-reasoner-demo-v1',
        status: 'INSUFFICIENT_EVIDENCE',
        confidence: 0.32,
        severity: input.requirement.defaultSeverity,
        summary: 'The submitted evidence does not provide sufficient optical clarity or lighting to evaluate the requirement.',
        expectedCondition: input.requirement.requirementText,
        observedCondition: 'Image exhibits low illumination or motion blur preventing definitive boundary identification.',
        realityGapDetected: false,
        observations: [],
        evidenceHighlights: ['Low contrast and blurry field of view'],
        recommendedActions: ['Re-capture photographic evidence using supplemental flash or increased ambient lighting'],
        requiredFollowUpEvidence: ['High-resolution, well-lit photo showing complete boundary from 3 meters distance'],
        inferenceLatencyMs: 210,
        timestamp: new Date().toISOString()
      };
    }

    // Story 1: Emergency Exit Obstruction (Primary Demo)
    if (reqText.includes('exit') || reqText.includes('egress') || input.requirement.id === 'req-em-01') {
      const latency = Math.floor(Math.random() * 100) + 350;
      return {
        id: `demo-analysis-${uuidv4()}`,
        inspectionId: input.inspectionId,
        requirementId: input.requirement.id,
        provider: 'demo',
        modelId: 'groundtruth-vision-reasoner-demo-v1',
        status: 'NON_COMPLIANT',
        confidence: 0.94,
        severity: 'HIGH',
        summary: 'Emergency exit doorway is obstructed by stacked delivery freight and cardboard crates, restricting egress clearance.',
        expectedCondition: 'Emergency exits and designated egress pathways must remain unobstructed at all times across a minimum width of 1.2 meters.',
        observedCondition: 'Stack of 4 shipping crates obstructing ~70% of doorway threshold. Egress width reduced to under 0.4 meters.',
        realityGapDetected: true,
        observations: [
          {
            id: 'obs-demo-01',
            label: 'Freight Crate Obstruction',
            confidence: 0.96,
            boundingBox: { x: 30, y: 40, width: 45, height: 50, label: 'Obstruction in Egress', confidence: 0.96 },
            evidenceExplanation: 'Stacked commercial packing materials directly block door clearance arc and egress lane.',
            isViolation: true
          },
          {
            id: 'obs-demo-02',
            label: 'Illuminated Exit Signage',
            confidence: 0.92,
            boundingBox: { x: 42, y: 8, width: 18, height: 12, label: 'Emergency Exit Sign', confidence: 0.92 },
            evidenceExplanation: 'Overhead exit sign confirms doorway is an active designated emergency route.',
            isViolation: false
          }
        ],
        evidenceHighlights: [
          '4 corrugated storage boxes directly obstructing threshold',
          'Corridor clearance narrowed from required 1.2m to 0.38m',
          'Exit sign illuminated overhead confirming required exit pathway'
        ],
        recommendedActions: [
          'Immediately move freight boxes to designated Storage Bay B-12',
          'Install high-visibility floor tape indicating "Keep Egress Clear at All Times"'
        ],
        requiredFollowUpEvidence: [
          'Post-remediation photo confirming 100% clear doorway swing and 1.2m clear path'
        ],
        inferenceLatencyMs: latency,
        timestamp: new Date().toISOString()
      };
    }

    // Story 2: Electrical Panel Clearance
    if (reqText.includes('panel') || reqText.includes('electrical') || input.requirement.id === 'req-mt-01') {
      return {
        id: `demo-analysis-${uuidv4()}`,
        inspectionId: input.inspectionId,
        requirementId: input.requirement.id,
        provider: 'demo',
        modelId: 'groundtruth-vision-reasoner-demo-v1',
        status: 'NON_COMPLIANT',
        confidence: 0.97,
        severity: 'CRITICAL',
        summary: '480V distribution switchgear exclusion zone violated by conductive metal equipment.',
        expectedCondition: 'All primary and sub-distribution electrical panels must maintain a dedicated 36-inch (91 cm) perimeter clearance and closed safety covers.',
        observedCondition: 'Aluminum stepladder stored touching front deadfront door within the 36-inch perimeter.',
        realityGapDetected: true,
        observations: [
          {
            id: 'obs-demo-03',
            label: 'Conductive Metal Ladder Incursion',
            confidence: 0.98,
            boundingBox: { x: 25, y: 25, width: 35, height: 65, label: 'Metal Ladder in Exclusion Arc', confidence: 0.98 },
            evidenceExplanation: 'Leaning aluminum ladder poses immediate arc-flash and access obstruction hazard.',
            isViolation: true
          }
        ],
        evidenceHighlights: [
          'Conductive ladder resting inside 36-inch safety perimeter',
          'High voltage hazard placard obscured'
        ],
        recommendedActions: [
          'Remove ladder immediately to maintenance closet C-302',
          'Repaint perimeter yellow hatched boundary lines'
        ],
        requiredFollowUpEvidence: [
          'Photograph showing clear 36-inch arc in front of panel door'
        ],
        inferenceLatencyMs: 410,
        timestamp: new Date().toISOString()
      };
    }

    // Story 3: Accessibility Ramp Handrail
    if (reqText.includes('ramp') || reqText.includes('handrail') || input.requirement.id === 'req-ac-01') {
      return {
        id: `demo-analysis-${uuidv4()}`,
        inspectionId: input.inspectionId,
        requirementId: input.requirement.id,
        provider: 'demo',
        modelId: 'groundtruth-vision-reasoner-demo-v1',
        status: 'NON_COMPLIANT',
        confidence: 0.91,
        severity: 'HIGH',
        summary: 'Wheelchair ramp is missing lower continuous handrail section, violating ADA safety standard.',
        expectedCondition: 'Wheelchair access ramps must have a maximum slope ratio of 1:12 with dual handrails and slip-resistant surface texture.',
        observedCondition: '2-meter section of left handrail unbolted and absent.',
        realityGapDetected: true,
        observations: [
          {
            id: 'obs-demo-04',
            label: 'Missing Handrail Segment',
            confidence: 0.93,
            boundingBox: { x: 10, y: 55, width: 40, height: 30, label: 'Missing Handrail Segment', confidence: 0.93 },
            evidenceExplanation: 'Lack of graspable surface creates fall risk for mobility-impaired users.',
            isViolation: true
          }
        ],
        evidenceHighlights: [
          'Missing continuous handrail section along lower ramp segment',
          'Exposed floor mounting bracket flanges'
        ],
        recommendedActions: [
          'Fasten replacement stainless steel rail section and torque anchors to 45 ft-lbs'
        ],
        requiredFollowUpEvidence: [
          'Photo of fully installed, continuous handrail along entire ramp length'
        ],
        inferenceLatencyMs: 385,
        timestamp: new Date().toISOString()
      };
    }

    // Default Compliant or Neutral Fallback
    const status: ComplianceStatus = 'COMPLIANT';
    return {
      id: `demo-analysis-${uuidv4()}`,
      inspectionId: input.inspectionId,
      requirementId: input.requirement.id,
      provider: 'demo',
      modelId: 'groundtruth-vision-reasoner-demo-v1',
      status,
      confidence: 0.92,
      severity: input.requirement.defaultSeverity,
      summary: `Evidence visually verified compliant with "${input.requirement.title}".`,
      expectedCondition: input.requirement.requirementText,
      observedCondition: 'Visual conditions adhere to documented specifications without observed deviations.',
      realityGapDetected: false,
      observations: [
        {
          id: 'obs-demo-comp',
          label: 'Compliant Area Condition',
          confidence: 0.92,
          evidenceExplanation: 'No physical hazards or policy violations identified within inspected perimeter.',
          isViolation: false
        }
      ],
      evidenceHighlights: ['Inspected zone meets specified physical tolerances'],
      recommendedActions: ['Maintain routine inspection schedule'],
      requiredFollowUpEvidence: [],
      inferenceLatencyMs: 320,
      timestamp: new Date().toISOString()
    };
  }

  async verifyRemediation(input: VerificationInferenceInput): Promise<VerificationResult> {
    const notes = (input.remediationNotes || '').toLowerCase();
    
    // Check if remediation is rejected
    if (notes.includes('incomplete') || notes.includes('partial') || notes.includes('fail')) {
      return {
        id: `demo-vrf-${uuidv4()}`,
        actionId: input.actionId,
        findingId: input.findingId,
        provider: 'demo',
        beforeEvidenceUrl: input.beforeEvidenceUrl,
        afterEvidenceUrl: input.remediationEvidenceUrl,
        beforeStatus: 'NON_COMPLIANT',
        afterStatus: 'PARTIALLY_COMPLIANT',
        verificationConfidence: 0.88,
        isRemediationSatisfied: false,
        summary: 'Remediation is incomplete. Partial obstruction remains in the peripheral pathway.',
        notes: 'Follow-up rework required to clear remaining materials.',
        humanConfirmed: false,
        timestamp: new Date().toISOString()
      };
    }

    // Successful Verification
    return {
      id: `demo-vrf-${uuidv4()}`,
      actionId: input.actionId,
      findingId: input.findingId,
      provider: 'demo',
      beforeEvidenceUrl: input.beforeEvidenceUrl,
      afterEvidenceUrl: input.remediationEvidenceUrl,
      beforeStatus: 'NON_COMPLIANT',
      afterStatus: 'COMPLIANT',
      verificationConfidence: 0.97,
      isRemediationSatisfied: true,
      summary: 'Before vs After comparison confirms full resolution. Doorway and 1.2m egress corridor are 100% unobstructed.',
      notes: 'Remediation satisfies the Emergency Safety & Egress Standard. Ready for Human-In-The-Loop Signoff.',
      humanConfirmed: false,
      timestamp: new Date().toISOString()
    };
  }

  async checkHealth(): Promise<{ healthy: boolean; latencyMs: number; details?: string }> {
    return {
      healthy: true,
      latencyMs: 12,
      details: 'DeterministicDemoProvider active (Local/Demo Mode)'
    };
  }
}
