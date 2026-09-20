import { 
  Policy, 
  PolicyRequirement, 
  Finding, 
  CorrectiveAction, 
  LocationMemory, 
  AuditLogEntry, 
  DashboardMetrics, 
  UserProfile 
} from './types.js';

export const SEED_USERS: UserProfile[] = [
  {
    id: 'usr-kailash-01',
    email: 'kailash@groundtruth.internal',
    name: 'Pochiraju Kailash',
    role: 'ADMIN',
    department: 'Operations & Safety Engineering'
  },
  {
    id: 'usr-sarah-02',
    email: 'sarah.chen@groundtruth.internal',
    name: 'Sarah Chen',
    role: 'INSPECTOR',
    department: 'Site Compliance'
  },
  {
    id: 'usr-marcus-03',
    email: 'marcus.vance@groundtruth.internal',
    name: 'Marcus Vance',
    role: 'VERIFIER',
    department: 'Quality Assurance'
  },
  {
    id: 'usr-elena-04',
    email: 'elena.rostova@groundtruth.internal',
    name: 'Elena Rostova',
    role: 'MANAGER',
    department: 'Facilities Leadership'
  }
];

export const SEED_POLICIES: Policy[] = [
  {
    id: 'pol-emergency-01',
    title: 'Emergency Safety & Egress Standard',
    description: 'Mandatory standard governing unobstructed emergency exit routes, fire doors, egress lighting, and evacuation corridors across all facilities.',
    category: 'Safety',
    version: 'v3.4 (2026)',
    uploadedDate: '2026-08-15T09:30:00Z',
    uploadedBy: 'Pochiraju Kailash',
    fileKey: 'policies/emergency-safety-standard-v3.4.pdf',
    fileName: 'emergency-safety-standard-v3.4.pdf',
    fileFormat: 'PDF',
    status: 'READY',
    requirementsCount: 8,
    activeFindingsCount: 4
  },
  {
    id: 'pol-access-02',
    title: 'Universal Accessibility Guidelines',
    description: 'ADA / Universal design compliance specifications for handicap ramps, doorway clearances, tactile paths, and elevator call stations.',
    category: 'Accessibility',
    version: 'v2.1',
    uploadedDate: '2026-08-20T14:15:00Z',
    uploadedBy: 'Elena Rostova',
    fileKey: 'policies/universal-accessibility-v2.1.pdf',
    fileName: 'universal-accessibility-v2.1.pdf',
    fileFormat: 'PDF',
    status: 'READY',
    requirementsCount: 6,
    activeFindingsCount: 3
  },
  {
    id: 'pol-maint-03',
    title: 'Campus Facilities Maintenance SOP',
    description: 'Standard operating procedure for HVAC filter integrity, electrical panel clearances, spill kit readiness, and overhead structural inspections.',
    category: 'Maintenance',
    version: 'v4.0',
    uploadedDate: '2026-09-01T11:00:00Z',
    uploadedBy: 'Marcus Vance',
    fileKey: 'policies/campus-maintenance-sop-v4.docx',
    fileName: 'campus-maintenance-sop-v4.docx',
    fileFormat: 'DOCX',
    status: 'READY',
    requirementsCount: 7,
    activeFindingsCount: 4
  },
  {
    id: 'pol-warehouse-04',
    title: 'Warehouse Logistics & Racking Checklist',
    description: 'Logistics safety rules covering aisle clearances, pallet stacking height limits, forklift pedestrian crossings, and PPE compliance zones.',
    category: 'Operations',
    version: 'v1.8',
    uploadedDate: '2026-09-10T16:45:00Z',
    uploadedBy: 'Sarah Chen',
    fileKey: 'policies/warehouse-safety-checklist.txt',
    fileName: 'warehouse-safety-checklist.txt',
    fileFormat: 'TXT',
    status: 'READY',
    requirementsCount: 5,
    activeFindingsCount: 3
  }
];

export const SEED_REQUIREMENTS: PolicyRequirement[] = [
  // Emergency Policy Requirements
  {
    id: 'req-em-01',
    policyId: 'pol-emergency-01',
    policyTitle: 'Emergency Safety & Egress Standard',
    title: 'Emergency Exit Clearance',
    requirementText: 'Emergency exits and designated egress pathways must remain unobstructed at all times across a minimum width of 1.2 meters.',
    category: 'Safety',
    defaultSeverity: 'HIGH',
    requirementType: 'Visual',
    verificationHints: [
      'Doorway is fully swingable without friction',
      'No pallets, boxes, carts, or temporary items in the egress path',
      'Exit sign is illuminated and clearly visible from 10 meters'
    ],
    sourceSection: 'Section 4.2 — Egress Pathway Maintenance',
    tags: ['Egress', 'Doors', 'LifeSafety'],
    createdAt: '2026-08-15T09:35:00Z'
  },
  {
    id: 'req-em-02',
    policyId: 'pol-emergency-01',
    policyTitle: 'Emergency Safety & Egress Standard',
    title: 'Fire Extinguisher Station Accessibility',
    requirementText: 'Portable fire extinguishers must be mounted at designated heights (1.0m - 1.5m) with unbroken safety seals and unobstructed approach zones.',
    category: 'Safety',
    defaultSeverity: 'HIGH',
    requirementType: 'Visual',
    verificationHints: [
      'Extinguisher pressure gauge needle rests firmly in green zone',
      'Inspection tag bears signature within current calendar quarter',
      'Access radius of 1.0m completely clear of furniture or clutter'
    ],
    sourceSection: 'Section 5.1 — Fire Suppression Equipment',
    tags: ['Fire', 'Extinguisher', 'Quarterly'],
    createdAt: '2026-08-15T09:36:00Z'
  },
  {
    id: 'req-em-03',
    policyId: 'pol-emergency-01',
    policyTitle: 'Emergency Safety & Egress Standard',
    title: 'Illuminated Exit Signage Operation',
    requirementText: 'All emergency egress markers and emergency lighting battery units must remain actively illuminated and test-operational.',
    category: 'Safety',
    defaultSeverity: 'CRITICAL',
    requirementType: 'Visual',
    verificationHints: [
      'LED green/red exit glyph is continuously illuminated without flicker',
      'Backup battery test lamp indicator displays steady green status'
    ],
    sourceSection: 'Section 6.3 — Emergency Lighting Systems',
    tags: ['Signage', 'Electrical', 'Illumination'],
    createdAt: '2026-08-15T09:37:00Z'
  },
  {
    id: 'req-em-04',
    policyId: 'pol-emergency-01',
    policyTitle: 'Emergency Safety & Egress Standard',
    title: 'Fire Door Self-Closing Mechanism',
    requirementText: 'Fire-rated containment doors must automatically latch closed when released and must never be propped open by wedges or doorstops.',
    category: 'Safety',
    defaultSeverity: 'HIGH',
    requirementType: 'Visual',
    verificationHints: [
      'No physical wedges, kickstands, or cords holding the door open',
      'Magnetic hold-open ties into the central fire alarm system'
    ],
    sourceSection: 'Section 4.7 — Containment Barriers',
    tags: ['Doors', 'Containment'],
    createdAt: '2026-08-15T09:38:00Z'
  },
  {
    id: 'req-em-05',
    policyId: 'pol-emergency-01',
    policyTitle: 'Emergency Safety & Egress Standard',
    title: 'Eye Wash Station Cleanliness & Flow',
    requirementText: 'Emergency eyewash and safety shower stations must remain clean, free of chemical buildup, with protective dust caps in place.',
    category: 'Safety',
    defaultSeverity: 'MEDIUM',
    requirementType: 'Visual',
    verificationHints: [
      'Protective plastic caps attached to nozzles',
      'Plumbing basin free of standing sediment or grime'
    ],
    sourceSection: 'Section 7.4 — Chemical Decontamination',
    tags: ['Eyewash', 'PPE', 'Plumbing'],
    createdAt: '2026-08-15T09:39:00Z'
  },

  // Accessibility Guidelines Requirements
  {
    id: 'req-ac-01',
    policyId: 'pol-access-02',
    policyTitle: 'Universal Accessibility Guidelines',
    title: 'Handicap Access Ramp Slope & Clearance',
    requirementText: 'Wheelchair access ramps must have a maximum slope ratio of 1:12 with dual handrails and slip-resistant surface texture.',
    category: 'Accessibility',
    defaultSeverity: 'HIGH',
    requirementType: 'Visual',
    verificationHints: [
      'Both left and right handrails securely anchored at 86-96cm height',
      'Zero puddling, moss, or surface degradation along ramp run'
    ],
    sourceSection: 'Section 2.3 — Exterior & Interior Incline Structures',
    tags: ['ADA', 'Ramps', 'Mobility'],
    createdAt: '2026-08-20T14:20:00Z'
  },
  {
    id: 'req-ac-02',
    policyId: 'pol-access-02',
    policyTitle: 'Universal Accessibility Guidelines',
    title: 'Accessible Restroom Push-Plate Actuator',
    requirementText: 'Automated door push-plate switches must be mounted 900mm from floor and operate with less than 22 Newtons of pressure.',
    category: 'Accessibility',
    defaultSeverity: 'MEDIUM',
    requirementType: 'Visual',
    verificationHints: [
      'Push button plate is physically unbroken and accessible at wheelchair height',
      'Door opens smoothly without pinching or stutter'
    ],
    sourceSection: 'Section 3.4 — Restroom Facility Automation',
    tags: ['Restroom', 'Automation'],
    createdAt: '2026-08-20T14:22:00Z'
  },
  {
    id: 'req-ac-03',
    policyId: 'pol-access-02',
    policyTitle: 'Universal Accessibility Guidelines',
    title: 'Tactile Ground Surface Indicators (TGSI)',
    requirementText: 'Warning tactile paving studs must be positioned 300mm prior to staircase top landings and elevator thresholds.',
    category: 'Accessibility',
    defaultSeverity: 'MEDIUM',
    requirementType: 'Visual',
    verificationHints: [
      'High-contrast yellow or stainless steel raised studs unbroken',
      'Adhesion to floor substrate intact without lifting edges'
    ],
    sourceSection: 'Section 4.1 — Visual Impairment Navigation',
    tags: ['Tactile', 'Stairways'],
    createdAt: '2026-08-20T14:25:00Z'
  },

  // Campus Maintenance SOP Requirements
  {
    id: 'req-mt-01',
    policyId: 'pol-maint-03',
    policyTitle: 'Campus Facilities Maintenance SOP',
    title: 'Electrical Distribution Panel Clearance',
    requirementText: 'All primary and sub-distribution electrical panels must maintain a dedicated 36-inch (91 cm) perimeter clearance and closed safety covers.',
    category: 'Maintenance',
    defaultSeverity: 'CRITICAL',
    requirementType: 'Visual',
    verificationHints: [
      'Safety yellow perimeter floor marking clearly demarcated',
      'No inventory, ladders, or cleaning buckets stored within zone',
      'Cabinet deadfront doors closed and latched'
    ],
    sourceSection: 'Section 8.2 — High Voltage Substation & Panels',
    tags: ['Electrical', 'HighVoltage', 'Clearance'],
    createdAt: '2026-09-01T11:05:00Z'
  },
  {
    id: 'req-mt-02',
    policyId: 'pol-maint-03',
    policyTitle: 'Campus Facilities Maintenance SOP',
    title: 'HVAC Condensate Drain Tray Inspection',
    requirementText: 'AHU condensate drip pans must remain treated with biocide tablets and drained with zero standing overflow liquid.',
    category: 'Maintenance',
    defaultSeverity: 'LOW',
    requirementType: 'Visual',
    verificationHints: [
      'No rust staining or mold lines visible around drain port',
      'Drain line flows directly to discharge riser'
    ],
    sourceSection: 'Section 9.1 — Air Handling Units',
    tags: ['HVAC', 'Plumbing'],
    createdAt: '2026-09-01T11:08:00Z'
  },
  {
    id: 'req-mt-03',
    policyId: 'pol-maint-03',
    policyTitle: 'Campus Facilities Maintenance SOP',
    title: 'Chemical Spill Kit Inventory & Seal',
    requirementText: 'Stationary spill kits must have their tamper-evident security tag intact and contain neutralizer pads and hazardous waste bags.',
    category: 'Maintenance',
    defaultSeverity: 'HIGH',
    requirementType: 'Visual',
    verificationHints: [
      'Yellow drum lid security seal intact with serial number matching log',
      'Spill response placard mounted above drum at eye level'
    ],
    sourceSection: 'Section 11.3 — Hazardous Materials Management',
    tags: ['Hazmat', 'SpillKit'],
    createdAt: '2026-09-01T11:10:00Z'
  },

  // Warehouse Checklist Requirements
  {
    id: 'req-wh-01',
    policyId: 'pol-warehouse-04',
    policyTitle: 'Warehouse Logistics & Racking Checklist',
    title: 'Pallet Racking Upright Column Protection',
    requirementText: 'Heavy-duty steel floor column guards must be installed at all forklift aisle ends and show zero structural buckling or sheared anchor bolts.',
    category: 'Operations',
    defaultSeverity: 'HIGH',
    requirementType: 'Visual',
    verificationHints: [
      'Guard post anchor bolts tight into concrete slab',
      'No deep indentations greater than 5mm in upright frame'
    ],
    sourceSection: 'Section 3.1 — Structural Racking Integrity',
    tags: ['Forklift', 'Racking', 'Warehouse'],
    createdAt: '2026-09-10T16:50:00Z'
  },
  {
    id: 'req-wh-02',
    policyId: 'pol-warehouse-04',
    policyTitle: 'Warehouse Logistics & Racking Checklist',
    title: 'Forklift Pedestrian Intersection Mirrors & Markings',
    requirementText: 'Blind aisle intersections must feature a convex ceiling safety mirror and illuminated floor pedestrian crossing stripes.',
    category: 'Operations',
    defaultSeverity: 'MEDIUM',
    requirementType: 'Visual',
    verificationHints: [
      'Convex mirror surface clean, angled down at 45 degrees',
      'Floor striping reflective and free of tire skid obscuration'
    ],
    sourceSection: 'Section 5.4 — Internal Traffic Management',
    tags: ['Pedestrian', 'Traffic', 'Mirrors'],
    createdAt: '2026-09-10T16:55:00Z'
  }
];

export const SEED_LOCATIONS: LocationMemory[] = [
  {
    id: 'loc-b2',
    name: 'Block B — Floor 2',
    building: 'Building B (Engineering & Labs)',
    floor: 'Level 2',
    zone: 'East Wing Corridor & Emergency Stairwell 2B',
    totalInspections: 17,
    activeFindings: 5,
    resolvedFindings: 12,
    recurringViolations: ['Emergency Exit Obstruction', 'Unlabeled Solvent Storage'],
    lastIncidentDaysAgo: 3,
    riskScore: 84
  },
  {
    id: 'loc-wh-aisle4',
    name: 'Warehouse North — Aisle 4',
    building: 'Logistics Center North',
    floor: 'Ground Level',
    zone: 'High-Bay Stacking Rack Zone 4A-4D',
    totalInspections: 22,
    activeFindings: 3,
    resolvedFindings: 19,
    recurringViolations: ['Forklift Guard Deflection', 'Overhanging Pallet Wrap'],
    lastIncidentDaysAgo: 7,
    riskScore: 68
  },
  {
    id: 'loc-hq-lobby',
    name: 'HQ Main Atrium & Entrance',
    building: 'Headquarters Tower',
    floor: 'Ground Lobby',
    zone: 'Visitor Entrance Ramp & Turnstiles',
    totalInspections: 14,
    activeFindings: 1,
    resolvedFindings: 13,
    recurringViolations: ['Access Ramp Friction Degradation'],
    lastIncidentDaysAgo: 14,
    riskScore: 32
  },
  {
    id: 'loc-c3-elec',
    name: 'Block C — Floor 3 Electrical Room',
    building: 'Building C (Data & Infrastructure)',
    floor: 'Level 3',
    zone: 'Electrical Switchgear Room C3-E',
    totalInspections: 19,
    activeFindings: 2,
    resolvedFindings: 17,
    recurringViolations: ['Panel Clearance Incursion', 'Fire Seal Breaches'],
    lastIncidentDaysAgo: 5,
    riskScore: 78
  },
  {
    id: 'loc-a1-loading',
    name: 'Block A — Ground Loading Dock',
    building: 'Building A (Operations)',
    floor: 'Dock Level',
    zone: 'Loading Bay 3 & Chemical Waste Staging',
    totalInspections: 26,
    activeFindings: 2,
    resolvedFindings: 24,
    recurringViolations: ['Spill Kit Tamper Seal Broken', 'Eye Wash Debris'],
    lastIncidentDaysAgo: 9,
    riskScore: 62
  },
  {
    id: 'loc-b1-cafeteria',
    name: 'Block B — Ground Dining & Kitchen',
    building: 'Building B',
    floor: 'Level 1',
    zone: 'Commercial Kitchen Service Corridor',
    totalInspections: 15,
    activeFindings: 1,
    resolvedFindings: 14,
    recurringViolations: ['Fire Blanket Station Blocked'],
    lastIncidentDaysAgo: 18,
    riskScore: 40
  },
  {
    id: 'loc-d2-labs',
    name: 'Block D — Floor 2 Bio-Cleanroom',
    building: 'Building D (Clean Labs)',
    floor: 'Level 2',
    zone: 'Airlock 2 and PPE Gowning Antechamber',
    totalInspections: 31,
    activeFindings: 0,
    resolvedFindings: 31,
    recurringViolations: [],
    lastIncidentDaysAgo: 45,
    riskScore: 12
  },
  {
    id: 'loc-wh-dock1',
    name: 'Warehouse South — Inbound Receiving',
    building: 'Logistics Center South',
    floor: 'Ground',
    zone: 'Pallet Staging & Forklift Charging Bays',
    totalInspections: 18,
    activeFindings: 0,
    resolvedFindings: 18,
    recurringViolations: ['Battery Wash Station Cap Loose'],
    lastIncidentDaysAgo: 29,
    riskScore: 24
  }
];

export const PRIMARY_DEMO_FINDING: Finding = {
  id: 'FND-2026-089',
  inspectionId: 'INSP-2026-104',
  policyId: 'pol-emergency-01',
  policyTitle: 'Emergency Safety & Egress Standard',
  requirementId: 'req-em-01',
  requirementText: 'Emergency exits and designated egress pathways must remain unobstructed at all times across a minimum width of 1.2 meters.',
  location: 'Block B — Floor 2',
  category: 'Safety',
  severity: 'HIGH',
  confidence: 0.94,
  status: 'OPEN',
  title: 'Emergency Exit Door Blocked by Stored Packing Crates',
  description: 'Visual evidence confirms cardboard boxes and wooden shipping crates stacked directly across the exit door path, reducing corridor width to < 0.4m.',
  expectedCondition: 'Emergency exit doorway and 1.2m egress pathway clear of all physical obstructions.',
  observedCondition: 'Stack of 4 heavy delivery crates and pallet wrap obstructing 70% of the emergency exit threshold.',
  evidenceUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  evidenceS3Key: 'evidence/insp-104/blocked-exit-b2.jpg',
  observations: [
    {
      id: 'obs-01',
      label: 'Cardboard & Wood Crate Obstruction',
      confidence: 0.96,
      boundingBox: { x: 30, y: 40, width: 45, height: 50, label: 'Obstruction in Egress', confidence: 0.96 },
      evidenceExplanation: 'Stacked commercial freight material directly impedes emergency door swing and evacuation flow.',
      isViolation: true
    },
    {
      id: 'obs-02',
      label: 'Emergency Exit Sign Visible',
      confidence: 0.92,
      boundingBox: { x: 42, y: 8, width: 18, height: 12, label: 'Emergency Exit Sign', confidence: 0.92 },
      evidenceExplanation: 'Overhead illuminated exit signage is active, establishing this doorway as a critical egress corridor.',
      isViolation: false
    }
  ],
  recommendedAction: 'Immediately remove all freight boxes to storage bay B-12 and post safety barrier.',
  correctiveActionId: 'ACT-2026-089',
  possibleDuplicates: [
    {
      findingId: 'FND-2026-042',
      similarityScore: 0.93,
      location: 'Block B — Floor 2',
      category: 'Safety',
      title: 'Temporary Storage in Corridor 2B',
      createdAt: '2026-08-04T10:15:00Z',
      status: 'VERIFIED'
    }
  ],
  isRecurringIssue: true,
  recurringIncidentCount: 5,
  createdAt: '2026-09-20T10:13:00Z',
  updatedAt: '2026-09-20T10:15:00Z',
  assignedTo: 'Marcus Vance'
};

export const SEED_FINDINGS: Finding[] = [
  PRIMARY_DEMO_FINDING,
  {
    id: 'FND-2026-088',
    inspectionId: 'INSP-2026-103',
    policyId: 'pol-maint-03',
    policyTitle: 'Campus Facilities Maintenance SOP',
    requirementId: 'req-mt-01',
    requirementText: 'All primary and sub-distribution electrical panels must maintain a dedicated 36-inch (91 cm) perimeter clearance and closed safety covers.',
    location: 'Block C — Floor 3 Electrical Room',
    category: 'Maintenance',
    severity: 'CRITICAL',
    confidence: 0.97,
    status: 'IN_PROGRESS',
    title: 'Aluminum Stepladder Stored Touching 480V Switchgear Panel',
    description: 'High voltage distribution board front face obstructed by metal maintenance ladder and mop bucket within the 36-inch exclusion perimeter.',
    expectedCondition: '36-inch clear arc around panel with unobstructed operator reach.',
    observedCondition: 'Conductive metal ladder leaning directly against panel access door.',
    evidenceUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    evidenceS3Key: 'evidence/insp-103/panel-block-c3.jpg',
    observations: [
      {
        id: 'obs-03',
        label: 'Conductive Metal Ladder in Exclusion Zone',
        confidence: 0.98,
        boundingBox: { x: 25, y: 25, width: 35, height: 65, label: 'Metal Ladder Incursion', confidence: 0.98 },
        evidenceExplanation: 'Severe flashover and trip hazard preventing instantaneous breaker access.',
        isViolation: true
      }
    ],
    recommendedAction: 'Relocate maintenance equipment to janitorial closet C-302 immediately.',
    correctiveActionId: 'ACT-2026-088',
    isRecurringIssue: true,
    recurringIncidentCount: 3,
    createdAt: '2026-09-19T14:20:00Z',
    updatedAt: '2026-09-19T14:45:00Z',
    assignedTo: 'Marcus Vance'
  },
  {
    id: 'FND-2026-087',
    inspectionId: 'INSP-2026-102',
    policyId: 'pol-access-02',
    policyTitle: 'Universal Accessibility Guidelines',
    requirementText: 'Wheelchair access ramps must have a maximum slope ratio of 1:12 with dual handrails and slip-resistant surface texture.',
    requirementId: 'req-ac-01',
    location: 'HQ Main Atrium & Entrance',
    category: 'Accessibility',
    severity: 'HIGH',
    confidence: 0.91,
    status: 'READY_FOR_VERIFICATION',
    title: 'Atrium Incline Ramp Missing Left Handrail Section',
    description: 'Ramp descent towards visitor lobby has 2-meter gap where lower handrail section was unbolted during glass partition repair.',
    expectedCondition: 'Continuous dual handrails extending full length of ramp with return to wall.',
    observedCondition: 'Lower 2 meters of left handrail missing, leaving exposed post flange.',
    evidenceUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    evidenceS3Key: 'evidence/insp-102/atrium-ramp-handrail.jpg',
    observations: [
      {
        id: 'obs-04',
        label: 'Missing Handrail Bracket',
        confidence: 0.93,
        boundingBox: { x: 10, y: 55, width: 40, height: 30, label: 'Missing Handrail Segment', confidence: 0.93 },
        evidenceExplanation: 'Violates ADA continuous graspable surface requirements for wheelchair/cane users.',
        isViolation: true
      }
    ],
    recommendedAction: 'Install replacement stainless steel rail section and torque anchors to 45 ft-lbs.',
    correctiveActionId: 'ACT-2026-087',
    createdAt: '2026-09-18T16:10:00Z',
    updatedAt: '2026-09-20T08:30:00Z',
    assignedTo: 'Sarah Chen'
  },
  {
    id: 'FND-2026-086',
    inspectionId: 'INSP-2026-101',
    policyId: 'pol-warehouse-04',
    policyTitle: 'Warehouse Logistics & Racking Checklist',
    requirementId: 'req-wh-01',
    requirementText: 'Heavy-duty steel floor column guards must be installed at all forklift aisle ends and show zero structural buckling or sheared anchor bolts.',
    location: 'Warehouse North — Aisle 4',
    category: 'Operations',
    severity: 'HIGH',
    confidence: 0.95,
    status: 'ASSIGNED',
    title: 'Racking Column Guard Severely Deflected by Forklift Impact',
    description: 'Aisle 4 end-cap upright yellow crash guard deflected 42mm into vertical rack column with sheared rear anchor.',
    expectedCondition: 'Column guard intact with minimum 25mm clearance from rack upright.',
    observedCondition: 'Guard deformed inward and contacting structural upright column.',
    evidenceUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
    evidenceS3Key: 'evidence/insp-101/rack-guard-impact.jpg',
    observations: [
      {
        id: 'obs-05',
        label: 'Deformed Steel Protector',
        confidence: 0.96,
        boundingBox: { x: 35, y: 50, width: 30, height: 40, label: 'Structural Impact Deflection', confidence: 0.96 },
        evidenceExplanation: 'Secondary impact risks transferring shear loads to main warehouse frame.',
        isViolation: true
      }
    ],
    recommendedAction: 'Tag out Aisle 4 rack bays and replace damaged guard assembly.',
    correctiveActionId: 'ACT-2026-086',
    isRecurringIssue: true,
    recurringIncidentCount: 4,
    createdAt: '2026-09-18T09:12:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
    assignedTo: 'Marcus Vance'
  },
  {
    id: 'FND-2026-085',
    inspectionId: 'INSP-2026-100',
    policyId: 'pol-maint-03',
    policyTitle: 'Campus Facilities Maintenance SOP',
    requirementId: 'req-mt-03',
    requirementText: 'Stationary spill kits must have their tamper-evident security tag intact and contain neutralizer pads and hazardous waste bags.',
    location: 'Block A — Ground Loading Dock',
    category: 'Maintenance',
    severity: 'MEDIUM',
    confidence: 0.89,
    status: 'OPEN',
    title: 'Loading Dock Spill Kit Seal Broken & Absorber Pads Depleted',
    description: '55-gallon mobile chemical spill station seal severed; inventory check reveals oil absorbent boom missing.',
    expectedCondition: 'Numbered security cable lock intact with full consumable loadout.',
    observedCondition: 'Drum lid unsealed with missing absorbent roll.',
    evidenceUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    evidenceS3Key: 'evidence/insp-100/spill-kit-broken-seal.jpg',
    observations: [
      {
        id: 'obs-06',
        label: 'Broken Security Seal Tag',
        confidence: 0.91,
        boundingBox: { x: 45, y: 30, width: 20, height: 25, label: 'Severed Cable Seal', confidence: 0.91 },
        evidenceExplanation: 'Tampering leaves facility non-compliant with EPA spill containment SLA.',
        isViolation: true
      }
    ],
    recommendedAction: 'Restock universal absorbent pads and re-seal with tag #SK-8821.',
    correctiveActionId: 'ACT-2026-085',
    createdAt: '2026-09-17T11:45:00Z',
    updatedAt: '2026-09-17T12:00:00Z',
    assignedTo: 'Sarah Chen'
  },
  {
    id: 'FND-2026-084',
    inspectionId: 'INSP-2026-099',
    policyId: 'pol-emergency-01',
    policyTitle: 'Emergency Safety & Egress Standard',
    requirementId: 'req-em-04',
    requirementText: 'Fire-rated containment doors must automatically latch closed when released and must never be propped open by wedges or doorstops.',
    location: 'Block B — Ground Dining & Kitchen',
    category: 'Safety',
    severity: 'HIGH',
    confidence: 0.98,
    status: 'OPEN',
    title: 'Kitchen 90-Minute Fire Door Propped with Wooden Wedge',
    description: 'Heavy solid-core containment door leading to customer dining room held wide open with wooden doorstop.',
    expectedCondition: 'Fire barrier door closed and positively latched into frame keeper.',
    observedCondition: 'Door wedged open 90 degrees allowing smoke flow into public dining area.',
    evidenceUrl: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=1200&q=80',
    evidenceS3Key: 'evidence/insp-099/fire-door-wedge.jpg',
    observations: [
      {
        id: 'obs-07',
        label: 'Wooden Floor Wedge',
        confidence: 0.99,
        boundingBox: { x: 50, y: 75, width: 15, height: 18, label: 'Propping Wedge', confidence: 0.99 },
        evidenceExplanation: 'Direct breach of NFPA 80 fire compartmentation standard.',
        isViolation: true
      }
    ],
    recommendedAction: 'Remove wedge immediately and brief kitchen staff on thermal containment policy.',
    correctiveActionId: 'ACT-2026-084',
    createdAt: '2026-09-17T08:15:00Z',
    updatedAt: '2026-09-17T08:20:00Z',
    assignedTo: 'Elena Rostova'
  },
  // Sample of already VERIFIED findings
  {
    id: 'FND-2026-071',
    inspectionId: 'INSP-2026-085',
    policyId: 'pol-emergency-01',
    policyTitle: 'Emergency Safety & Egress Standard',
    requirementId: 'req-em-02',
    requirementText: 'Portable fire extinguishers must be mounted at designated heights (1.0m - 1.5m) with unbroken safety seals and unobstructed approach zones.',
    location: 'Block B — Floor 2',
    category: 'Safety',
    severity: 'HIGH',
    confidence: 0.95,
    status: 'VERIFIED',
    title: 'Extinguisher Station FE-204 Unblocked & Pressure Gauge Verified',
    description: 'Extinguisher approach was previously blocked by recycling carts. Remediation photo confirms cart relocation and verified inspection tag.',
    expectedCondition: '1.0m clear approach and green pressure gauge.',
    observedCondition: 'Clean wall station with clear perimeter.',
    evidenceUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
    evidenceS3Key: 'evidence/insp-085/extinguisher-verified.jpg',
    observations: [],
    recommendedAction: 'Relocate recycling receptacles.',
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-09-10T14:30:00Z',
    closedAt: '2026-09-10T14:35:00Z',
    assignedTo: 'Marcus Vance'
  }
];

export const PRIMARY_DEMO_ACTION: CorrectiveAction = {
  id: 'ACT-2026-089',
  findingId: 'FND-2026-089',
  title: 'Clear Stored Freight Materials from Emergency Exit 2B',
  description: 'Relocate 4 shipping crates to Storage Bay B-12 and install "Keep Egress Clear" floor floor stencil marking.',
  priority: 'HIGH',
  ownerId: 'usr-marcus-03',
  ownerName: 'Marcus Vance',
  dueDate: '2026-09-21T18:00:00Z',
  status: 'OPEN',
  location: 'Block B — Floor 2',
  category: 'Safety',
  beforeEvidenceUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  createdAt: '2026-09-20T10:15:00Z',
  updatedAt: '2026-09-20T10:15:00Z'
};

export const SEED_ACTIONS: CorrectiveAction[] = [
  PRIMARY_DEMO_ACTION,
  {
    id: 'ACT-2026-088',
    findingId: 'FND-2026-088',
    title: 'Relocate Aluminum Stepladder from Switchgear Room C3-E',
    description: 'Remove all conductive items outside 36-inch exclusion safety zone and verify safety latch.',
    priority: 'CRITICAL',
    ownerId: 'usr-marcus-03',
    ownerName: 'Marcus Vance',
    dueDate: '2026-09-20T12:00:00Z',
    status: 'IN_PROGRESS',
    location: 'Block C — Floor 3 Electrical Room',
    category: 'Maintenance',
    beforeEvidenceUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-19T14:45:00Z',
    updatedAt: '2026-09-19T15:00:00Z'
  },
  {
    id: 'ACT-2026-087',
    findingId: 'FND-2026-087',
    title: 'Fabricate and Mount Replacement Atrium Ramp Handrail',
    description: 'Fasten brushed stainless 2-inch tubular handrail with dual concrete anchor bolts.',
    priority: 'HIGH',
    ownerId: 'usr-sarah-02',
    ownerName: 'Sarah Chen',
    dueDate: '2026-09-22T17:00:00Z',
    status: 'READY_FOR_VERIFICATION',
    location: 'HQ Main Atrium & Entrance',
    category: 'Accessibility',
    beforeEvidenceUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    remediationEvidence: {
      id: 'rem-087',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      s3Key: 'remediation/act-087/handrail-installed.jpg',
      uploadedAt: '2026-09-20T08:25:00Z',
      notes: 'Stainless section anchored with epoxy stud kit. Load tested to 250 lbs lateral force.',
      uploadedBy: 'Sarah Chen'
    },
    verificationResult: {
      id: 'vrf-087',
      actionId: 'ACT-2026-087',
      findingId: 'FND-2026-087',
      provider: 'sagemaker',
      beforeEvidenceUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      afterEvidenceUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      beforeStatus: 'NON_COMPLIANT',
      afterStatus: 'COMPLIANT',
      verificationConfidence: 0.96,
      isRemediationSatisfied: true,
      summary: 'Handrail gap fully eliminated with continuous barrier meeting 900mm height standard.',
      notes: 'Visual inspection confirms continuous weld and rigid floor flange mounting.',
      humanConfirmed: false,
      timestamp: '2026-09-20T08:30:00Z'
    },
    createdAt: '2026-09-18T16:15:00Z',
    updatedAt: '2026-09-20T08:30:00Z'
  },
  {
    id: 'ACT-2026-086',
    findingId: 'FND-2026-086',
    title: 'Replace Deflected Aisle 4 Column Guard Post',
    description: 'Unbolt deformed steel protector and install heavy-duty polymer impact post with concrete m20 anchors.',
    priority: 'HIGH',
    ownerId: 'usr-marcus-03',
    ownerName: 'Marcus Vance',
    dueDate: '2026-09-23T16:00:00Z',
    status: 'ASSIGNED',
    location: 'Warehouse North — Aisle 4',
    category: 'Operations',
    beforeEvidenceUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-18T10:05:00Z',
    updatedAt: '2026-09-18T10:05:00Z'
  }
];

export const SEED_DASHBOARD_METRICS: DashboardMetrics = {
  realityComplianceRate: 87,
  openFindingsCount: 14,
  criticalFindingsCount: 3,
  verifiedFixesCount: 41,
  averageResolutionHours: 4.2,
  recurringViolationCount: 5,
  verificationRate: 96.5,
  realityGapScore: 13,
  complianceTrend: [
    { date: 'Sep 14', complianceRate: 79, targetRate: 90 },
    { date: 'Sep 15', complianceRate: 82, targetRate: 90 },
    { date: 'Sep 16', complianceRate: 81, targetRate: 90 },
    { date: 'Sep 17', complianceRate: 85, targetRate: 90 },
    { date: 'Sep 18', complianceRate: 84, targetRate: 90 },
    { date: 'Sep 19', complianceRate: 86, targetRate: 90 },
    { date: 'Sep 20', complianceRate: 87, targetRate: 90 }
  ],
  findingsByCategory: [
    { category: 'Safety', count: 12, critical: 2 },
    { category: 'Maintenance', count: 8, critical: 1 },
    { category: 'Operations', count: 6, critical: 0 },
    { category: 'Accessibility', count: 4, critical: 0 },
    { category: 'Security', count: 3, critical: 0 },
    { category: 'Hygiene', count: 2, critical: 0 }
  ],
  severityDistribution: [
    { severity: 'CRITICAL', count: 3, color: '#ef4444' },
    { severity: 'HIGH', count: 9, color: '#f97316' },
    { severity: 'MEDIUM', count: 15, color: '#eab308' },
    { severity: 'LOW', count: 8, color: '#3b82f6' }
  ],
  topLocations: [
    { location: 'Block B — Floor 2', openGaps: 5, totalInspections: 17, risk: 'High' },
    { location: 'Block C — Floor 3 Electrical Room', openGaps: 2, totalInspections: 19, risk: 'High' },
    { location: 'Warehouse North — Aisle 4', openGaps: 3, totalInspections: 22, risk: 'Medium' },
    { location: 'Block A — Ground Loading Dock', openGaps: 2, totalInspections: 26, risk: 'Medium' },
    { location: 'HQ Main Atrium & Entrance', openGaps: 1, totalInspections: 14, risk: 'Low' },
    { location: 'Block B — Ground Dining & Kitchen', openGaps: 1, totalInspections: 15, risk: 'Low' }
  ],
  resolutionTimeByCategory: [
    { category: 'Safety', hours: 3.1 },
    { category: 'Maintenance', hours: 5.4 },
    { category: 'Operations', hours: 6.2 },
    { category: 'Accessibility', hours: 8.0 },
    { category: 'Security', hours: 2.4 },
    { category: 'Hygiene', hours: 1.8 }
  ]
};

export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    eventType: 'POLICY_UPLOADED',
    timestamp: '2026-08-15T09:30:00Z',
    actor: 'Pochiraju Kailash',
    actorRole: 'ADMIN',
    resourceId: 'pol-emergency-01',
    resourceType: 'POLICY',
    description: 'Uploaded "Emergency Safety & Egress Standard" (v3.4 PDF, 4.2 MB) to S3 evidence bucket.'
  },
  {
    id: 'aud-002',
    eventType: 'REQUIREMENT_EXTRACTED',
    timestamp: '2026-08-15T09:35:00Z',
    actor: 'System AI Engine',
    actorRole: 'ADMIN',
    resourceId: 'pol-emergency-01',
    resourceType: 'POLICY',
    description: 'Extracted 8 visual & procedural safety requirements and indexed verification hints into DynamoDB.'
  },
  {
    id: 'aud-003',
    eventType: 'INSPECTION_CREATED',
    timestamp: '2026-09-20T10:11:00Z',
    actor: 'Sarah Chen',
    actorRole: 'INSPECTOR',
    resourceId: 'INSP-2026-104',
    resourceType: 'INSPECTION',
    description: 'Created routine corridor safety inspection for Block B — Floor 2.'
  },
  {
    id: 'aud-004',
    eventType: 'EVIDENCE_UPLOADED',
    timestamp: '2026-09-20T10:12:00Z',
    actor: 'Sarah Chen',
    actorRole: 'INSPECTOR',
    resourceId: 'INSP-2026-104',
    resourceType: 'INSPECTION',
    description: 'Uploaded high-resolution evidence photo "blocked-exit-b2.jpg" via pre-signed S3 URL.'
  },
  {
    id: 'aud-005',
    eventType: 'SAGEMAKER_ANALYSIS_COMPLETED',
    timestamp: '2026-09-20T10:13:00Z',
    actor: 'Amazon SageMaker AI',
    actorRole: 'ADMIN',
    resourceId: 'INSP-2026-104',
    resourceType: 'INSPECTION',
    description: 'Inference completed in 412ms: NON_COMPLIANT (94% confidence, HIGH severity) with 2 bounding regions.'
  },
  {
    id: 'aud-006',
    eventType: 'FINDING_CREATED',
    timestamp: '2026-09-20T10:13:30Z',
    actor: 'System Engine',
    actorRole: 'ADMIN',
    resourceId: 'FND-2026-089',
    resourceType: 'FINDING',
    description: 'Generated reality gap finding FND-2026-089: Emergency exit doorway blocked by 4 shipping crates.'
  },
  {
    id: 'aud-007',
    eventType: 'DUPLICATE_FLAGGED',
    timestamp: '2026-09-20T10:13:45Z',
    actor: 'System Engine',
    actorRole: 'ADMIN',
    resourceId: 'FND-2026-089',
    resourceType: 'FINDING',
    description: 'Identified 93% match with historical finding FND-2026-042 at same location; flagged as recurring issue.'
  },
  {
    id: 'aud-008',
    eventType: 'ACTION_ASSIGNED',
    timestamp: '2026-09-20T10:15:00Z',
    actor: 'Elena Rostova',
    actorRole: 'MANAGER',
    resourceId: 'ACT-2026-089',
    resourceType: 'ACTION',
    description: 'Assigned corrective action ACT-2026-089 to Marcus Vance with SLA deadline Sep 21 18:00.'
  }
];
