import { Finding, DuplicateMatch } from '@groundtruth/shared';

export class DuplicateDetector {
  public static findDuplicates(newFinding: Partial<Finding>, existingFindings: Finding[]): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];

    for (const existing of existingFindings) {
      if (existing.id === newFinding.id) continue;

      let score = 0;

      // 1. Same Location match
      if (newFinding.location && existing.location) {
        if (newFinding.location.toLowerCase().trim() === existing.location.toLowerCase().trim()) {
          score += 0.45;
        } else if (
          newFinding.location.toLowerCase().includes(existing.location.toLowerCase()) ||
          existing.location.toLowerCase().includes(newFinding.location.toLowerCase())
        ) {
          score += 0.25;
        }
      }

      // 2. Same Category match
      if (newFinding.category === existing.category) {
        score += 0.20;
      }

      // 3. Same Policy/Requirement match
      if (newFinding.requirementId === existing.requirementId) {
        score += 0.20;
      }

      // 4. Title / Text token overlap
      const newTokens = (newFinding.title || '').toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const existingTokens = (existing.title || '').toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const intersection = newTokens.filter(t => existingTokens.includes(t));
      if (newTokens.length > 0) {
        const tokenScore = (intersection.length / Math.max(newTokens.length, 1)) * 0.15;
        score += tokenScore;
      }

      const normalizedScore = Math.min(Number(score.toFixed(2)), 0.99);

      if (normalizedScore >= 0.70) {
        matches.push({
          findingId: existing.id,
          similarityScore: normalizedScore,
          location: existing.location,
          category: existing.category,
          title: existing.title,
          createdAt: existing.createdAt,
          status: existing.status
        });
      }
    }

    return matches.sort((a, b) => b.similarityScore - a.similarityScore);
  }
}
