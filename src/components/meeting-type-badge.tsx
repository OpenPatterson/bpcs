import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MEETING_TYPE_BADGE_STYLES } from "@/lib/constants";

interface MeetingTypeBadgeProps {
  type: string;
}

export function MeetingTypeBadge({ type }: MeetingTypeBadgeProps) {
  const style = MEETING_TYPE_BADGE_STYLES[type] ?? "bg-gray-200 text-gray-800";

  return (
    <Badge className={cn("border-transparent", style)}>
      {type}
    </Badge>
  );
}
