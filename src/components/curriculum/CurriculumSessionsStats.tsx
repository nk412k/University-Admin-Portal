import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionProgressStats } from "@/types/curriculum";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CurriculumSessionsStatsProps {
  stats: SessionProgressStats;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  loading: boolean;
  textColor?: string;
  suffix?: React.ReactNode;
}

interface StatCardConfig {
  title: string;
  value: number;
  textColor: string;
  suffix?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  loading,
  textColor,
  suffix,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className={cn("text-2xl font-bold", textColor)}>
            {value}
            {suffix}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CurriculumSessionsStats: React.FC<CurriculumSessionsStatsProps> = ({
  stats,
  isLoading,
}) => {
  const statCards: StatCardConfig[] = [
    {
      title: "Total Sessions",
      value: stats.totalSessions,
      textColor: "",
    },
    {
      title: "Completed",
      value: stats.completedSessions,
      textColor: "text-green-600",
      suffix: (
        <span className="text-sm text-muted-foreground ml-2">
          ({stats.completionPercentage}%)
        </span>
      ),
    },
    {
      title: "Pending",
      value: stats.pendingSessions,
      textColor: "text-blue-600",
    },
    {
      title: "Overdue",
      value: stats.overdueSessions,
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          loading={isLoading}
          textColor={card.textColor}
          suffix={card.suffix}
        />
      ))}
    </div>
  );
};

export default CurriculumSessionsStats;
