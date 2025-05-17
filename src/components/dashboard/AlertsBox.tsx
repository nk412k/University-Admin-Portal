import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle, Info, Bell } from "lucide-react";
import { SystemAlert } from "@/hooks/useAlertSystem";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AlertsBoxProps {
  alerts: SystemAlert[];
  loading?: boolean;
  dismissAlert?: (id: string) => void;
  showTitle?: boolean;
  maxAlerts?: number;
  className?: string;
}

const alertStyles = {
  getCategoryColor: (category: string): string => {
    const categoryStyles = {
      attendance: "bg-orange-100 text-orange-800",
      curriculum: "bg-indigo-100 text-indigo-800",
      performance: "bg-purple-100 text-purple-800",
      issues: "bg-red-100 text-red-800",
      payment: "bg-blue-100 text-blue-800",
      feedback: "bg-amber-100 text-amber-800",
    };

    return (
      categoryStyles[category as keyof typeof categoryStyles] ||
      "bg-gray-100 text-gray-800"
    );
  },

  getSeverityClass: (severity: string): string => {
    const severityStyles = {
      critical: "bg-red-50 border-red-200",
      warning: "bg-amber-50 border-amber-200",
      info: "bg-blue-50 border-blue-200",
    };

    return (
      severityStyles[severity as keyof typeof severityStyles] ||
      "bg-blue-50 border-blue-200"
    );
  },
};

const AlertIcon = ({ severity }: { severity: string }) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const AlertsSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-start space-x-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

const NoAlertsState = () => (
  <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
    <Bell className="h-10 w-10 mb-2 opacity-20" />
    <p>No critical alerts at this time</p>
  </div>
);

const AlertItem = ({
  alert,
  dismissAlert,
}: {
  alert: SystemAlert;
  dismissAlert?: (id: string) => void;
}) => (
  <div
    className={cn(
      "relative flex items-start rounded-md border p-3 pr-8",
      alertStyles.getSeverityClass(alert.severity)
    )}
  >
    {dismissAlert && (
      <button
        onClick={() => dismissAlert(alert.id)}
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss alert"
      >
        <X className="h-3 w-3" />
      </button>
    )}
    <div className="mr-2 mt-0.5">
      <AlertIcon severity={alert.severity} />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-medium text-sm">{alert.title}</h4>
        <Badge
          variant="outline"
          className={cn(
            "text-xs font-normal ml-2",
            alertStyles.getCategoryColor(alert.category)
          )}
        >
          {alert.category}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{alert.message}</p>
    </div>
  </div>
);

export function AlertsBox({
  alerts,
  loading = false,
  dismissAlert,
  showTitle = true,
  maxAlerts = 5,
  className,
}: AlertsBoxProps) {
  const displayAlerts = alerts.slice(0, maxAlerts);

  const renderAlertContent = () => {
    if (loading) {
      return <AlertsSkeleton />;
    }

    if (displayAlerts.length === 0) {
      return <NoAlertsState />;
    }

    return (
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
        {displayAlerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} dismissAlert={dismissAlert} />
        ))}
      </div>
    );
  };

  return (
    <Card className={cn("shadow-md", className)}>
      {showTitle && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center">
            <Bell className="mr-2 h-5 w-5 text-red-500" />
            Critical Alerts
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-2">{renderAlertContent()}</CardContent>
    </Card>
  );
}
