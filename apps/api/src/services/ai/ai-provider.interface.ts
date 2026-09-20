import { 
  PolicyRequirement, 
  AIAnalysisResult, 
  VerificationResult, 
  AIProviderType 
} from '@groundtruth/shared';

export interface InspectionInferenceInput {
  inspectionId: string;
  requirement: PolicyRequirement;
  evidenceUrl: string;
  evidenceS3Key: string;
  location: string;
  notes?: string;
}

export interface VerificationInferenceInput {
  actionId: string;
  findingId: string;
  requirement: PolicyRequirement;
  beforeEvidenceUrl: string;
  remediationEvidenceUrl: string;
  remediationNotes?: string;
}

export interface IAIProvider {
  readonly providerType: AIProviderType;
  
  analyzeInspectionEvidence(input: InspectionInferenceInput): Promise<AIAnalysisResult>;
  
  verifyRemediation(input: VerificationInferenceInput): Promise<VerificationResult>;
  
  checkHealth(): Promise<{ healthy: boolean; latencyMs: number; details?: string }>;
}
