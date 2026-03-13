import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_BADGE_STYLES } from "@/lib/constants";

interface MeetingStatusBadgeProps {
  status: string;
}

export function MeetingStatusBadge({ status }: MeetingStatusBadgeProps) {
  const style = STATUS_BADGE_STYLES[status] ?? "bg-gray-100 text-gray-800 border-gray-200";
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge variant="outline" className={cn(style)}>
      {label}
    </Badge>
  );
}
