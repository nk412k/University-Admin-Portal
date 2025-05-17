import React from "react";
import { Badge } from "@/components/ui/badge";
import { SessionStatus } from "@/types/curriculum";

interface CurriculumStatusBadgeProps {
  status: SessionStatus;
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface StatusConfig {
  variant: BadgeVariant;
  label: string;
}

const STATUS_CONFIG: Record<SessionStatus, StatusConfig> = {
  completed: {
    variant: "default",
    label: "Completed",
  },
  in_progress: {
    variant: "secondary",
    label: "In Progress",
  },
  overdue: {
    variant: "destructive",
    label: "Overdue",
  },
  rescheduled: {
    variant: "outline",
    label: "Rescheduled",
  },
  pending: {
    variant: "outline",
    label: "Pending",
  },
};

const CurriculumStatusBadge: React.FC<CurriculumStatusBadgeProps> = ({
  status,
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default CurriculumStatusBadge;
