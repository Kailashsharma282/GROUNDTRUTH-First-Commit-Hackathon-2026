# GroundTruth — SageMaker AI Vision Reasoning Pipeline

## 1. AI Contract & Structured Output

GroundTruth interacts with Amazon SageMaker AI via a strictly typed multimodal reasoning contract.

### Request Payload:
```json
{
  "task": "EVIDENCE_VERIFICATION",
  "requirementText": "Emergency exits and designated egress pathways must remain unobstructed at all times across a minimum width of 1.2 meters.",
  "verificationHints": [
    "Doorway is fully swingable without friction",
    "No pallets, boxes, carts, or temporary items in the egress path"
  ],
  "category": "Safety",
  "severity": "HIGH",
  "evidenceUrl": "https://groundtruth-evidence-bucket.s3.us-east-1.amazonaws.com/evidence/blocked-exit.jpg",
  "location": "Block B — Floor 2",
  "notes": "Cardboard crates stacked near exit door 2B"
}
```

### Response Contract:
```json
{
  "status": "NON_COMPLIANT",
  "confidence": 0.94,
  "severity": "HIGH",
  "summary": "Emergency exit doorway is obstructed by stacked delivery freight and cardboard crates, restricting egress clearance.",
  "expectedCondition": "Emergency exits and designated egress pathways must remain unobstructed at all times across a minimum width of 1.2 meters.",
  "observedCondition": "Stack of 4 shipping crates obstructing ~70% of doorway threshold. Egress width reduced to under 0.4 meters.",
  "realityGapDetected": true,
  "observations": [
    {
      "id": "obs-sg-01",
      "label": "Cardboard Freight Crates in Egress",
      "confidence": 0.96,
      "boundingBox": { "x": 30, "y": 40, "width": 45, "height": 50, "label": "Obstruction in Egress", "confidence": 0.96 },
      "evidenceExplanation": "Stacked shipping containers directly block designated evacuation path.",
      "isViolation": true
    }
  ],
  "evidenceHighlights": [
    "4 corrugated freight boxes directly obstructing threshold",
    "Egress corridor clearance narrowed from 1.2m to 0.38m"
  ],
  "recommendedActions": [
    "Immediately move freight boxes to designated Storage Bay B-12",
    "Apply high-visibility floor tape: Keep Egress Clear at All Times"
  ],
  "requiredFollowUpEvidence": [
    "Post-remediation photo confirming 100% clear doorway swing and 1.2m clear path"
  ]
}
```

---

## 2. AI Trust Boundary Architecture

A critical principle of GroundTruth is: **AI MUST NEVER INVENT EVIDENCE.**

- **Optical Clarity Verification**: If a photo is blurry, dark, or lacks resolution, the model returns `INSUFFICIENT_EVIDENCE` with a confidence score under 0.40, rather than guessing.
- **Actionable Guidance**: When insufficient evidence is returned, the engine provides specific instructions to the inspector (e.g. *"Capture photo from 2 meters distance with auxiliary flash"*).
- **Human-In-The-Loop Boundary**: High-severity safety violations cannot be automatically closed by AI. A qualified human supervisor must sign off before formal audit trail closure.
