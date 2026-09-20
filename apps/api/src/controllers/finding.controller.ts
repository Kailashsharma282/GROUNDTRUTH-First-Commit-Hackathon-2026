import { Request, Response } from 'express';
import { dataStore } from '../services/data-store.js';

export class FindingController {
  public static async getFindings(req: Request, res: Response) {
    let findings = dataStore.findings;
    const { category, severity, status, location } = req.query;

    if (category) {
      findings = findings.filter(f => f.category.toLowerCase() === String(category).toLowerCase());
    }
    if (severity) {
      findings = findings.filter(f => f.severity === String(severity));
    }
    if (status) {
      findings = findings.filter(f => f.status === String(status));
    }
    if (location) {
      findings = findings.filter(f => f.location.toLowerCase().includes(String(location).toLowerCase()));
    }

    return res.json({ success: true, count: findings.length, data: findings });
  }

  public static async getFindingById(req: Request, res: Response) {
    const finding = dataStore.findings.find(f => f.id === req.params.id);
    if (!finding) {
      return res.status(404).json({ success: false, error: 'Finding not found' });
    }
    return res.json({ success: true, data: finding });
  }

  public static async updateFindingStatus(req: Request, res: Response) {
    const finding = dataStore.findings.find(f => f.id === req.params.id);
    if (!finding) {
      return res.status(404).json({ success: false, error: 'Finding not found' });
    }

    const { status, assignedTo } = req.body;
    if (status) finding.status = status;
    if (assignedTo) finding.assignedTo = assignedTo;
    finding.updatedAt = new Date().toISOString();

    dataStore.recalculateMetrics();
    return res.json({ success: true, data: finding });
  }
}
