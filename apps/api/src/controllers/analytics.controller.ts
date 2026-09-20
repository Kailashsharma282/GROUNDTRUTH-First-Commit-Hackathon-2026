import { Request, Response } from 'express';
import { dataStore } from '../services/data-store.js';

export class AnalyticsController {
  public static async getDashboardMetrics(req: Request, res: Response) {
    const metrics = dataStore.recalculateMetrics();
    return res.json({ success: true, data: metrics });
  }

  public static async getLocationMemory(req: Request, res: Response) {
    const locations = dataStore.locations;
    return res.json({ success: true, count: locations.length, data: locations });
  }

  public static async getLocationMemoryById(req: Request, res: Response) {
    const location = dataStore.locations.find(l => l.id === req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }
    const locFindings = dataStore.findings.filter(f => 
      f.location.toLowerCase().includes(location.name.toLowerCase()) ||
      location.name.toLowerCase().includes(f.location.toLowerCase())
    );
    return res.json({ success: true, data: { location, findings: locFindings } });
  }
}

export class AuditController {
  public static async getAuditLogs(req: Request, res: Response) {
    let logs = dataStore.auditLogs;
    const { resourceType, actor } = req.query;

    if (resourceType) {
      logs = logs.filter(l => l.resourceType === String(resourceType));
    }
    if (actor) {
      logs = logs.filter(l => l.actor.toLowerCase().includes(String(actor).toLowerCase()));
    }

    return res.json({ success: true, count: logs.length, data: logs });
  }
}
