import { Badge } from "@/shared/components";
import { DIETARY_BADGE_LABELS } from "../content/menuContent";
import type { DietaryTag } from "../types";

export interface DietaryBadgeListProps {
  tags: DietaryTag[];
}

export function DietaryBadgeList({ tags }: DietaryBadgeListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const { abbrev, full } = DIETARY_BADGE_LABELS[tag];
        return (
          <Badge key={tag} title={full}>
            {abbrev}
          </Badge>
        );
      })}
    </div>
  );
}
