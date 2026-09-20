import { Policy, PolicyRequirement, Category, Severity } from '@groundtruth/shared';
import { dataStore } from './data-store.js';
import { v4 as uuidv4 } from 'uuid';

export class PolicyService {
  public static getAllPolicies(): Policy[] {
    return dataStore.policies;
  }

  public static getPolicyById(id: string): Policy | undefined {
    const policy = dataStore.policies.find(p => p.id === id);
    if (!policy) return undefined;
    policy.requirements = dataStore.requirements.filter(r => r.policyId === id);
    return policy;
  }

  public static getAllRequirements(): PolicyRequirement[] {
    return dataStore.requirements;
  }

  public static getRequirementById(id: string): PolicyRequirement | undefined {
    return dataStore.requirements.find(r => r.id === id);
  }

  public static async uploadAndProcessPolicy(input: {
    title: string;
    description: string;
    category: Category;
    fileKey: string;
    fileName: string;
    fileFormat: 'PDF' | 'DOCX' | 'TXT';
    rawContent?: string;
    actor: string;
  }): Promise<Policy> {
    const policyId = `pol-${uuidv4().slice(0, 8)}`;
    
    // 1. Create Policy entity
    const newPolicy: Policy = {
      id: policyId,
      title: input.title,
      description: input.description,
      category: input.category,
      version: 'v1.0',
      uploadedDate: new Date().toISOString(),
      uploadedBy: input.actor,
      fileKey: input.fileKey,
      fileName: input.fileName,
      fileFormat: input.fileFormat,
      status: 'PROCESSING',
      requirementsCount: 0,
      activeFindingsCount: 0,
      requirements: []
    };

    dataStore.policies.unshift(newPolicy);
    dataStore.addAuditLog(
      'POLICY_UPLOADED',
      input.actor,
      'ADMIN',
      policyId,
      'POLICY',
      `Uploaded policy "${input.title}" (${input.fileFormat})`
    );

    // 2. Perform Requirement Extraction
    const extractedRequirements = this.extractRequirementsFromDocument(newPolicy, input.rawContent);
    newPolicy.requirementsCount = extractedRequirements.length;
    newPolicy.status = 'READY';
    newPolicy.requirements = extractedRequirements;

    extractedRequirements.forEach(req => dataStore.requirements.push(req));

    dataStore.addAuditLog(
      'REQUIREMENT_EXTRACTED',
      'System AI Engine',
      'ADMIN',
      policyId,
      'POLICY',
      `Extracted ${extractedRequirements.length} structured requirements from "${input.title}"`
    );

    dataStore.recalculateMetrics();
    return newPolicy;
  }

  private static extractRequirementsFromDocument(policy: Policy, content?: string): PolicyRequirement[] {
    // Standard structured extraction based on category
    const baseCategory = policy.category;
    const requirements: PolicyRequirement[] = [
      {
        id: `req-${uuidv4().slice(0, 8)}`,
        policyId: policy.id,
        policyTitle: policy.title,
        title: `${policy.title} - Operational Clearance`,
        requirementText: `Primary operational perimeter must remain unobstructed by loose items or secondary storage exceeding 10kg.`,
        category: baseCategory,
        defaultSeverity: 'HIGH',
        requirementType: 'Visual',
        verificationHints: [
          'No items outside marked boundary zones',
          'Access pathway width must measure >= 1.0m',
          'Signage must be visible from 5 meters'
        ],
        sourceSection: 'Section 1.1 — General Workspace Clearances',
        tags: [baseCategory, 'Clearance'],
        createdAt: new Date().toISOString()
      },
      {
        id: `req-${uuidv4().slice(0, 8)}`,
        policyId: policy.id,
        policyTitle: policy.title,
        title: `${policy.title} - Safety Hardware Integrity`,
        requirementText: `All protective fixtures and enclosures must be securely anchored with verified fastener torque and zero structural warping.`,
        category: baseCategory,
        defaultSeverity: 'MEDIUM',
        requirementType: 'Visual',
        verificationHints: [
          'Anchoring bolts firmly seated in base substrate',
          'Protective guards free of physical impact deflection'
        ],
        sourceSection: 'Section 2.4 — Hardware Integrity Standards',
        tags: [baseCategory, 'Hardware'],
        createdAt: new Date().toISOString()
      },
      {
        id: `req-${uuidv4().slice(0, 8)}`,
        policyId: policy.id,
        policyTitle: policy.title,
        title: `${policy.title} - Placard and Hazard Signage`,
        requirementText: `High-visibility safety placards with universal pictograms must be mounted at eye level (1.5m) and remain legible.`,
        category: baseCategory,
        defaultSeverity: 'LOW',
        requirementType: 'Visual',
        verificationHints: [
          'Placard free of grease, dust, or sticker peeling',
          'Pictogram matches current ISO/ANSI safety standards'
        ],
        sourceSection: 'Section 3.2 — Mandatory Signage',
        tags: [baseCategory, 'Signage'],
        createdAt: new Date().toISOString()
      }
    ];

    return requirements;
  }
}
