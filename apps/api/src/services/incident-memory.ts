import { Finding, LocationMemory } from '@groundtruth/shared';

export class IncidentMemoryService {
  public static evaluateRecurringIssue(
    locationName: string, 
    category: string, 
    allFindings: Finding[]
  ): { isRecurring: boolean; count: number; rootCauseHypothesis?: string; recommendation?: string } {
    const matching = allFindings.filter(f => 
      f.location.toLowerCase().includes(locationName.toLowerCase()) || 
      locationName.toLowerCase().includes(f.location.toLowerCase())
    );

    const count = matching.length;
    const isRecurring = count >= 3;

    let rootCauseHypothesis: string | undefined;
    let recommendation: string | undefined;

    if (isRecurring) {
      if (category === 'Safety') {
        rootCauseHypothesis = 'Repeated temporary freight unloading staging without dedicated buffer zone.';
        recommendation = 'Demarcate permanent floor staging boundaries and install physical bollard protection.';
      } else if (category === 'Maintenance') {
        rootCauseHypothesis = 'Sub-panel corridor used as unauthorized contractor equipment storage.';
        recommendation = 'Install electronic badge lock on equipment room C-302 and review site access permits.';
      } else {
        rootCauseHypothesis = 'High traffic density causing recurring structural wear and tear.';
        recommendation = 'Implement weekly automated visual check cadence and heavy-duty protective guard rails.';
      }
    }

    return {
      isRecurring,
      count,
      rootCauseHypothesis,
      recommendation
    };
  }

  public static updateLocationRisk(location: LocationMemory, findings: Finding[]): LocationMemory {
    const locFindings = findings.filter(f => 
      f.location.toLowerCase().includes(location.name.toLowerCase()) ||
      location.name.toLowerCase().includes(f.location.toLowerCase())
    );

    const activeCount = locFindings.filter(f => f.status !== 'VERIFIED').length;
    const resolvedCount = locFindings.filter(f => f.status === 'VERIFIED').length;
    const criticalCount = locFindings.filter(f => f.severity === 'CRITICAL' && f.status !== 'VERIFIED').length;

    const riskScore = Math.min(Math.round((activeCount * 12) + (criticalCount * 25) + 10), 100);

    return {
      ...location,
      totalInspections: locFindings.length,
      activeFindings: activeCount,
      resolvedFindings: resolvedCount,
      riskScore
    };
  }
}
