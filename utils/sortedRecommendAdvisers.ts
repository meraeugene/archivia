import { ReferredAdviser } from "@/types/referredAdvisers";

export function sortAdvisersByRecommendation(
  advisers: ReferredAdviser[] = [],
  recommendedIds: string[] = []
): ReferredAdviser[] {
  return [...advisers].sort((a, b) => {
    const aRecommended = recommendedIds.includes(a.id);
    const bRecommended = recommendedIds.includes(b.id);

    if (aRecommended && !bRecommended) return -1;
    if (!aRecommended && bRecommended) return 1;

    return a.full_name.localeCompare(b.full_name);
  });
}
