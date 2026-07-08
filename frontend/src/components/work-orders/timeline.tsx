import {
  ClipboardCheck,
  MessageSquare,
  Stethoscope,
  Wrench,
} from "lucide-react";

import { formatDateTime } from "@/lib/format";
import type { WorkOrderTimeline } from "@/types/work-order";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineProps {
  timeline: WorkOrderTimeline;
}

export function Timeline({ timeline }: TimelineProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Timeline de reparación</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {timeline.statusHistory.map((item) => (
          <TimelineItem
            key={item.id}
            icon={ClipboardCheck}
            title={`Estado: ${item.newStatus}`}
            description={item.notes ?? "Cambio de estado"}
            date={item.createdAt}
            badge={
              item.oldStatus
                ? `${item.oldStatus} → ${item.newStatus}`
                : item.newStatus
            }
          />
        ))}

        {timeline.diagnostics.map((item) => (
          <TimelineItem
            key={item.id}
            icon={Stethoscope}
            title={item.title}
            description={item.description}
            date={item.createdAt}
            badge={item.type}
          />
        ))}

        {timeline.checklists.map((item) => (
          <TimelineItem
            key={item.id}
            icon={Wrench}
            title={item.item}
            description={item.notes ?? "Checklist registrado"}
            date={item.createdAt}
            badge={item.status}
          />
        ))}

        {timeline.comments.map((item) => (
          <TimelineItem
            key={item.id}
            icon={MessageSquare}
            title="Comentario"
            description={item.content}
            date={item.createdAt}
            badge={item.isInternal ? "Interno" : "Público"}
          />
        ))}

        {timeline.statusHistory.length === 0 &&
        timeline.diagnostics.length === 0 &&
        timeline.checklists.length === 0 &&
        timeline.comments.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Todavía no hay eventos para esta orden.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

interface TimelineItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  date: string;
  badge: string;
}

function TimelineItem({
  icon: Icon,
  title,
  description,
  date,
  badge,
}: TimelineItemProps) {
  return (
    <div className="flex gap-3 rounded-xl border p-4">
      <div className="h-fit rounded-xl bg-primary/10 p-2 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="font-medium">{title}</p>
          <Badge variant="outline">{badge}</Badge>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {formatDateTime(date)}
        </p>
      </div>
    </div>
  );
}
