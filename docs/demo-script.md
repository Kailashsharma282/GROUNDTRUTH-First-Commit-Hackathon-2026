# GroundTruth — 3-Minute Hackathon Demo Script

**Hackathon**: First Commit 2026 — Bharat Builds Tour  
**Track**: SHIP IT  
**Participant**: Pochiraju Kailash Ram Markandeya Sharma (@kailashsharma)  
**Team**: KGP_unknown_Coder_404 (Team Code: BFZXQT)  
**Target Duration**: 2 minutes 45 seconds  

---

### Scene 1 — Problem (0:00 - 0:20)
**Presenter**:
> *"Organizations write detailed safety policies, SOPs, and checklists. But documentation only describes what SHOULD happen. Checking whether rules are actually followed in the real world still relies on scattered WhatsApp photos, paper audits, and unverified spreadsheets. GroundTruth closes that gap by comparing documented rules with physical photographic evidence."*

---

### Scene 2 — Policy Ingestion (0:20 - 0:40)
**Action**: Open `/policies` and show the **Emergency Safety & Egress Standard**.
**Presenter**:
> *"We start with a standard policy PDF. GroundTruth normalizes it into structured visual requirements with verification hints — specifically: 'Emergency exits must remain unobstructed at all times across a minimum width of 1.2 meters.'"*

---

### Scene 3 — Reality Evidence (0:40 - 1:00)
**Action**: Navigate to `/demo` or `/inspections/new`, upload the photo of the blocked exit door at **Block B — Floor 2**.
**Presenter**:
> *"During a routine walk, an inspector captures this photograph of Exit Door 2B. The photo is uploaded directly to Amazon S3 via secure pre-signed URLs."*

---

### Scene 4 & 5 — Amazon SageMaker AI & Reality Gap (1:00 - 1:30)
**Action**: Click **RUN SAGE MAKER AI ANALYSIS**. Show live workflow progress, followed by the **Reality Gap Visualizer** and **Evidence Viewer** with bounding boxes.
**Presenter**:
> *"Our AWS Step Functions pipeline triggers Amazon SageMaker AI. The multimodal vision reasoner detects a HIGH severity reality gap with 94% confidence: 4 shipping crates are obstructing 70% of the doorway threshold, narrowing egress clearance to 0.38 meters. The system highlights the obstruction spatially and warns that this is a recurring problem — 5 similar incidents have occurred at Block B Floor 2 in the last 30 days."*

---

### Scene 6 & 7 — Corrective Action & Remediation Fix (1:30 - 2:00)
**Action**: Click **Generate Corrective Action**, view the assigned task for Marcus Vance, and click **Submit Remediation Evidence** (showing the cleared corridor photo).
**Presenter**:
> *"The reality gap automatically becomes a corrective action work order. The field team relocates the crates to Storage Bay B-12 and submits a post-remediation photograph."*

---

### Scene 8 — AI Before/After Verification & Human Sign-off (2:00 - 2:30)
**Action**: Click **Verify Remediation with SageMaker**. Drag the **Before vs After Interactive Slider**, then click **[ VERIFY & CLOSE FINDING ]**.
**Presenter**:
> *"SageMaker AI runs a multi-image comparison: BEFORE is Non-Compliant, AFTER is 100% Compliant with 97% confidence. Following our strict AI trust boundary, a certified facilities supervisor confirms human sign-off, closing the finding and recording an immutable entry into DynamoDB."*

---

### Scene 9 — 30-Second AWS Moment & Dashboard (2:30 - 2:45)
**Action**: Open **AWS Architecture Modal** and `/dashboard`.
**Presenter**:
> *"GroundTruth runs as a serverless AWS workflow: S3 for evidence, Lambda and API Gateway for the application layer, Step Functions for orchestration, SageMaker for AI inference, DynamoDB for state, and EventBridge, SQS, and SNS for async jobs and alerts.  
> GroundTruth doesn't just tell organizations what their rules are. It shows where reality diverges, turns that gap into action, and verifies whether the fix actually worked."*
