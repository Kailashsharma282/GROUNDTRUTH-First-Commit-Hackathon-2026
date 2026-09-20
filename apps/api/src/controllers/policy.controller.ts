import { Request, Response } from 'express';
import { PolicyService } from '../services/policy.service.js';
import { S3StorageService } from '../services/s3.service.js';

export class PolicyController {
  public static async getPolicies(req: Request, res: Response) {
    const policies = PolicyService.getAllPolicies();
    return res.json({ success: true, count: policies.length, data: policies });
  }

  public static async getPolicyById(req: Request, res: Response) {
    const policy = PolicyService.getPolicyById(req.params.id);
    if (!policy) {
      return res.status(404).json({ success: false, error: 'Policy not found' });
    }
    return res.json({ success: true, data: policy });
  }

  public static async getRequirements(req: Request, res: Response) {
    const requirements = PolicyService.getAllRequirements();
    return res.json({ success: true, count: requirements.length, data: requirements });
  }

  public static async getUploadUrl(req: Request, res: Response) {
    try {
      const { fileName, mimeType } = req.body;
      const result = await S3StorageService.generateUploadPresignedUrl(
        fileName || 'policy.pdf',
        mimeType || 'application/pdf',
        'policies'
      );
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async uploadPolicy(req: Request, res: Response) {
    try {
      const { title, description, category, fileKey, fileName, fileFormat, rawContent, actor } = req.body;
      const policy = await PolicyService.uploadAndProcessPolicy({
        title: title || 'New Safety Policy',
        description: description || 'Ingested standard operational document',
        category: category || 'Safety',
        fileKey: fileKey || `policies/${Date.now()}.pdf`,
        fileName: fileName || 'document.pdf',
        fileFormat: fileFormat || 'PDF',
        rawContent,
        actor: actor || 'Pochiraju Kailash'
      });
      return res.status(201).json({ success: true, data: policy });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
