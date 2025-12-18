import { ReferredAdviser } from "@/types/referredAdvisers";

export function sortAdvisersByRecommendation(
  advisers: ReferredAdviser[] = [],
  recommendedIds: string[] = [],
  wildcardIds: string[] = []
): ReferredAdviser[] {
  return [...advisers].sort((a, b) => {
    const aRecommended = recommendedIds.includes(a.id);
    const bRecommended = recommendedIds.includes(b.id);

    const aWildcard = wildcardIds.includes(a.id);
    const bWildcard = wildcardIds.includes(b.id);

    // Recommended first
    if (aRecommended && !bRecommended) return -1;
    if (!aRecommended && bRecommended) return 1;

    // Then wildcard
    if (aWildcard && !bWildcard) return -1;
    if (!aWildcard && bWildcard) return 1;

    // Alphabetical by full_name
    return a.full_name.localeCompare(b.full_name);
  });
}
