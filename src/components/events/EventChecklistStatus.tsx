import React from "react";
import { CheckCircle, Circle, AlertCircle, LucideIcon } from "lucide-react";
import { ChecklistStatus } from "@/types";
import { cn } from "@/lib/utils";

type StatusSize = "sm" | "md" | "lg";

interface StatusConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  label: string;
}

interface SizeConfig {
  [key: string]: string;
}

interface EventChecklistStatusProps {
  status: ChecklistStatus;
  className?: string;
  showLabel?: boolean;
  size?: StatusSize;
}

const STATUS_CONFIGS: Record<ChecklistStatus, StatusConfig> = {
  completed: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
    label: "Completed",
  },
  in_progress: {
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    label: "In Progress",
  },
  pending: {
    icon: Circle,
    color: "text-slate-500",
    bgColor: "bg-slate-50",
    label: "Pending",
  },
};

const SIZE_CLASSES: SizeConfig = {
  sm: "text-xs py-0.5 px-1.5",
  md: "text-sm py-1 px-2",
  lg: "text-base py-1.5 px-3",
};

export const EventChecklistStatus: React.FC<EventChecklistStatusProps> = ({
  status,
  className,
  showLabel = true,
  size = "md",
}) => {
  const {
    icon: Icon,
    color,
    bgColor,
    label,
  } = STATUS_CONFIGS[status] || STATUS_CONFIGS.pending;
  const sizeClass = SIZE_CLASSES[size];
  const iconSizeClass = size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full w-fit",
        bgColor,
        sizeClass,
        className
      )}
    >
      <Icon className={cn(iconSizeClass, color)} />
      {showLabel && <span className={cn("font-medium", color)}>{label}</span>}
    </div>
  );
};
