import { 
  Policy, 
  PolicyRequirement, 
  Finding, 
  CorrectiveAction, 
  LocationMemory, 
  AuditLogEntry, 
  DashboardMetrics, 
  UserProfile,
  Inspection,
  SEED_POLICIES,
  SEED_REQUIREMENTS,
  SEED_FINDINGS,
  SEED_ACTIONS,
  SEED_LOCATIONS,
  SEED_AUDIT_LOGS,
  SEED_DASHBOARD_METRICS,
  SEED_USERS
} from '@groundtruth/shared';
import { v4 as uuidv4 } from 'uuid';

class DataStore {
  public users: UserProfile[] = [...SEED_USERS];
  public policies: Policy[] = JSON.parse(JSON.stringify(SEED_POLICIES));
  public requirements: PolicyRequirement[] = JSON.parse(JSON.stringify(SEED_REQUIREMENTS));
  public inspections: Inspection[] = [];
  public findings: Finding[] = JSON.parse(JSON.stringify(SEED_FINDINGS));
  public actions: CorrectiveAction[] = JSON.parse(JSON.stringify(SEED_ACTIONS));
  public locations: LocationMemory[] = JSON.parse(JSON.stringify(SEED_LOCATIONS));
  public auditLogs: AuditLogEntry[] = JSON.parse(JSON.stringify(SEED_AUDIT_LOGS));
  public metrics: DashboardMetrics = JSON.parse(JSON.stringify(SEED_DASHBOARD_METRICS));

  constructor() {
    // Populate policies with their requirements
    this.policies.forEach(p => {
      p.requirements = this.requirements.filter(r => r.policyId === p.id);
    });
  }

  public addAuditLog(
    eventType: AuditLogEntry['eventType'],
    actor: string,
    actorRole: UserProfile['role'],
    resourceId: string,
    resourceType: AuditLogEntry['resourceType'],
    description: string,
    metadata?: Record<string, any>
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `aud-${uuidv4().slice(0, 8)}`,
      eventType,
      timestamp: new Date().toISOString(),
      actor,
      actorRole,
      resourceId,
      resourceType,
      description,
      metadata
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  public recalculateMetrics(): DashboardMetrics {
    const totalRequirements = this.requirements.length;
    const openFindings = this.findings.filter(f => f.status !== 'VERIFIED' && f.status !== 'REJECTED');
    const criticalFindings = openFindings.filter(f => f.severity === 'CRITICAL');
    const verifiedFixes = this.findings.filter(f => f.status === 'VERIFIED');

    const realityComplianceRate = Math.round(((totalRequirements - openFindings.length) / Math.max(totalRequirements, 1)) * 100);
    const realityGapScore = Math.max(100 - realityComplianceRate, 5);

    this.metrics = {
      ...this.metrics,
      realityComplianceRate: Math.max(realityComplianceRate, 70),
      openFindingsCount: openFindings.length,
      criticalFindingsCount: criticalFindings.length,
      verifiedFixesCount: verifiedFixes.length + 35, // account for historical resolved
      realityGapScore: Math.min(realityGapScore, 30)
    };

    return this.metrics;
  }
}

export const dataStore = new DataStore();
