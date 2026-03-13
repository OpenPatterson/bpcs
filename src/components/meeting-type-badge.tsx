import { Badge } from "@/components/ui/badge";
import {
  MEETING_TYPE_BADGE_COLORS,
  DEFAULT_BADGE_COLOR,
} from "@/lib/constants";

interface MeetingTypeBadgeProps {
  type: string;
}

export function MeetingTypeBadge({ type }: MeetingTypeBadgeProps) {
  const colors = MEETING_TYPE_BADGE_COLORS[type] ?? DEFAULT_BADGE_COLOR;

  return (
    <Badge
      className="border-transparent"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {type}
    </Badge>
  );
}
