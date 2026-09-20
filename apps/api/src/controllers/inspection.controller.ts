import { Request, Response } from 'express';
import { InspectionService } from '../services/inspection.service.js';
import { S3StorageService } from '../services/s3.service.js';

export class InspectionController {
  public static async getInspections(req: Request, res: Response) {
    const inspections = InspectionService.getAllInspections();
    return res.json({ success: true, count: inspections.length, data: inspections });
  }

  public static async getInspectionById(req: Request, res: Response) {
    const inspection = InspectionService.getInspectionById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ success: false, error: 'Inspection not found' });
    }
    return res.json({ success: true, data: inspection });
  }

  public static async getEvidenceUploadUrl(req: Request, res: Response) {
    try {
      const { fileName, mimeType } = req.body;
      const result = await S3StorageService.generateUploadPresignedUrl(
        fileName || 'evidence.jpg',
        mimeType || 'image/jpeg',
        'evidence'
      );
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async createAndAnalyzeInspection(req: Request, res: Response) {
    try {
      const { policyId, requirementId, location, evidenceUrl, evidenceS3Key, fileName, notes, inspectorId, inspectorName } = req.body;

      if (!requirementId || !evidenceUrl) {
        return res.status(400).json({ success: false, error: 'requirementId and evidenceUrl are required' });
      }

      const result = await InspectionService.executeInspection({
        policyId: policyId || 'pol-emergency-01',
        requirementId,
        location: location || 'Block B — Floor 2',
        evidenceUrl,
        evidenceS3Key: evidenceS3Key || `evidence/${Date.now()}.jpg`,
        fileName: fileName || 'evidence.jpg',
        notes,
        inspectorId: inspectorId || 'usr-sarah-02',
        inspectorName: inspectorName || 'Sarah Chen'
      });

      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
