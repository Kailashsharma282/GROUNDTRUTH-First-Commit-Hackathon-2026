export type Category = 
  | 'Safety' 
  | 'Accessibility' 
  | 'Maintenance' 
  | 'Operations' 
  | 'Security' 
  | 'Hygiene';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ComplianceStatus = 
  | 'COMPLIANT' 
  | 'PARTIALLY_COMPLIANT' 
  | 'NON_COMPLIANT' 
  | 'INSUFFICIENT_EVIDENCE' 
  | 'UNCERTAIN';

export type FindingStatus = 
  | 'OPEN' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'READY_FOR_VERIFICATION' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'REOPENED';

export type ActionStatus = 
  | 'OPEN' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'READY_FOR_VERIFICATION' 
  | 'VERIFIED' 
  | 'REJECTED';

export type UserRole = 'INSPECTOR' | 'MANAGER' | 'VERIFIER' | 'ADMIN';

export type AIProviderType = 'sagemaker' | 'demo';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
}

export interface VerificationHint {
  id: string;
  text: string;
}

export interface PolicyRequirement {
  id: string;
  policyId: string;
  policyTitle: string;
  title: string;
  requirementText: string;
  category: Category;
  defaultSeverity: Severity;
  requirementType: 'Visual' | 'Procedural' | 'Sensor' | 'Documentary';
  verificationHints: string[];
  sourceSection: string;
  tags?: string[];
  createdAt: string;
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  category: Category;
  version: string;
  uploadedDate: string;
  uploadedBy: string;
  fileKey: string;
  fileName: string;
  fileFormat: 'PDF' | 'DOCX' | 'TXT';
  status: 'PROCESSING' | 'READY' | 'ARCHIVED' | 'FAILED';
  requirementsCount: number;
  activeFindingsCount: number;
  requirements?: PolicyRequirement[];
}

export interface BoundingBox {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export interface VisualObservation {
  id: string;
  label: string;
  confidence: number;
  boundingBox?: BoundingBox;
  evidenceExplanation: string;
  isViolation: boolean;
}

export interface AIAnalysisResult {
  id: string;
  inspectionId: string;
  requirementId: string;
  provider: AIProviderType;
  modelId: string;
  status: ComplianceStatus;
  confidence: number;
  severity: Severity;
  summary: string;
  expectedCondition: string;
  observedCondition: string;
  realityGapDetected: boolean;
  observations: VisualObservation[];
  evidenceHighlights: string[];
  recommendedActions: string[];
  requiredFollowUpEvidence: string[];
  inferenceLatencyMs: number;
  timestamp: string;
}

export interface InspectionEvidence {
  id: string;
  url: string;
  s3Key: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface Inspection {
  id: string;
  title: string;
  policyId: string;
  policyTitle: string;
  requirementId: string;
  requirementText: string;
  location: string;
  category: Category;
  inspectorId: string;
  inspectorName: string;
  evidence: InspectionEvidence[];
  notes?: string;
  status: 'ANALYZING' | 'GAP_DETECTED' | 'COMPLIANT' | 'NEEDS_REVISION';
  analysisResult?: AIAnalysisResult;
  findingId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DuplicateMatch {
  findingId: string;
  similarityScore: number;
  location: string;
  category: Category;
  title: string;
  createdAt: string;
  status: FindingStatus;
}

export interface Finding {
  id: string;
  inspectionId: string;
  policyId: string;
  policyTitle: string;
  requirementId: string;
  requirementText: string;
  location: string;
  category: Category;
  severity: Severity;
  confidence: number;
  status: FindingStatus;
  title: string;
  description: string;
  expectedCondition: string;
  observedCondition: string;
  evidenceUrl: string;
  evidenceS3Key: string;
  observations: VisualObservation[];
  recommendedAction: string;
  correctiveActionId?: string;
  possibleDuplicates?: DuplicateMatch[];
  isRecurringIssue?: boolean;
  recurringIncidentCount?: number;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  closedAt?: string;
}

export interface RemediationEvidence {
  id: string;
  url: string;
  s3Key: string;
  uploadedAt: string;
  notes: string;
  uploadedBy: string;
}

export interface VerificationResult {
  id: string;
  actionId: string;
  findingId: string;
  provider: AIProviderType;
  beforeEvidenceUrl: string;
  afterEvidenceUrl: string;
  beforeStatus: ComplianceStatus;
  afterStatus: ComplianceStatus;
  verificationConfidence: number;
  isRemediationSatisfied: boolean;
  summary: string;
  notes: string;
  humanConfirmed: boolean;
  confirmedBy?: string;
  confirmedAt?: string;
  timestamp: string;
}

export interface CorrectiveAction {
  id: string;
  findingId: string;
  title: string;
  description: string;
  priority: Severity;
  ownerId: string;
  ownerName: string;
  dueDate: string;
  status: ActionStatus;
  location: string;
  category: Category;
  beforeEvidenceUrl: string;
  remediationEvidence?: RemediationEvidence;
  verificationResult?: VerificationResult;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface LocationMemory {
  id: string;
  name: string;
  building: string;
  floor: string;
  zone: string;
  totalInspections: number;
  activeFindings: number;
  resolvedFindings: number;
  recurringViolations: string[];
  lastIncidentDaysAgo: number;
  riskScore: number;
}

export interface AuditLogEntry {
  id: string;
  eventType: 
    | 'POLICY_UPLOADED'
    | 'REQUIREMENT_EXTRACTED'
    | 'INSPECTION_CREATED'
    | 'EVIDENCE_UPLOADED'
    | 'SAGEMAKER_ANALYSIS_COMPLETED'
    | 'DEMO_ANALYSIS_COMPLETED'
    | 'FINDING_CREATED'
    | 'DUPLICATE_FLAGGED'
    | 'ACTION_ASSIGNED'
    | 'REMEDIATION_UPLOADED'
    | 'AI_VERIFICATION_COMPLETED'
    | 'HUMAN_CONFIRMATION_COMPLETED'
    | 'FINDING_CLOSED'
    | 'FINDING_REOPENED';
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  resourceId: string;
  resourceType: 'POLICY' | 'INSPECTION' | 'FINDING' | 'ACTION' | 'SYSTEM';
  description: string;
  metadata?: Record<string, any>;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  read: boolean;
  timestamp: string;
  linkUrl?: string;
}

export interface DashboardMetrics {
  realityComplianceRate: number; // e.g., 87
  openFindingsCount: number;      // e.g., 14
  criticalFindingsCount: number;  // e.g., 3
  verifiedFixesCount: number;     // e.g., 41
  averageResolutionHours: number; // e.g., 4.2
  recurringViolationCount: number;// e.g., 5
  verificationRate: number;       // e.g., 96.5
  realityGapScore: number;        // e.g., 13%
  complianceTrend: { date: string; complianceRate: number; targetRate: number }[];
  findingsByCategory: { category: Category; count: number; critical: number }[];
  severityDistribution: { severity: Severity; count: number; color: string }[];
  topLocations: { location: string; openGaps: number; totalInspections: number; risk: 'High' | 'Medium' | 'Low' }[];
  resolutionTimeByCategory: { category: Category; hours: number }[];
}
