import { Request, Response } from 'express';
import { ActionService } from '../services/action.service.js';
import { S3StorageService } from '../services/s3.service.js';

export class ActionController {
  public static async getActions(req: Request, res: Response) {
    const actions = ActionService.getAllActions();
    return res.json({ success: true, count: actions.length, data: actions });
  }

  public static async getActionById(req: Request, res: Response) {
    const action = ActionService.getActionById(req.params.id);
    if (!action) {
      return res.status(404).json({ success: false, error: 'Action not found' });
    }
    return res.json({ success: true, data: action });
  }

  public static async getRemediationUploadUrl(req: Request, res: Response) {
    try {
      const { fileName, mimeType } = req.body;
      const result = await S3StorageService.generateUploadPresignedUrl(
        fileName || 'remediation.jpg',
        mimeType || 'image/jpeg',
        'remediation'
      );
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async uploadRemediation(req: Request, res: Response) {
    try {
      const { actionId, remediationImageUrl, remediationS3Key, notes, actor } = req.body;
      if (!actionId || !remediationImageUrl) {
        return res.status(400).json({ success: false, error: 'actionId and remediationImageUrl are required' });
      }

      const result = await ActionService.uploadRemediationAndVerify({
        actionId,
        remediationImageUrl,
        remediationS3Key: remediationS3Key || `remediation/${Date.now()}.jpg`,
        notes: notes || 'Remediation completed',
        actor: actor || 'Marcus Vance'
      });

      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async humanConfirm(req: Request, res: Response) {
    try {
      const { actionId, approved, actor, actorRole, notes } = req.body;
      if (!actionId || approved === undefined) {
        return res.status(400).json({ success: false, error: 'actionId and approved boolean are required' });
      }

      const result = ActionService.humanConfirmClosure({
        actionId,
        approved,
        actor: actor || 'Elena Rostova',
        actorRole: actorRole || 'MANAGER',
        notes
      });

      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
