import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AISummaryCardProps {
  summary: string;
  keyTopics: string[];
  meetingId: string;
}

export function AISummaryCard({
  summary,
  keyTopics,
  meetingId,
}: AISummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-amber-500" />
          AI Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary text */}
        <p className="text-sm leading-relaxed text-foreground">{summary}</p>

        {/* Key topics */}
        {keyTopics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keyTopics.map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="text-xs font-normal"
              >
                {topic}
              </Badge>
            ))}
          </div>
        )}

        {/* Language toggle placeholder */}
        {/* TODO: wire up language toggle */}
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">
          This is an AI-generated summary for accessibility. Always refer to
          official documents.
        </p>
      </CardFooter>
    </Card>
  );
}
