import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurriculumProgress } from "@/types/curriculum";
import { Skeleton } from "@/components/ui/skeleton";

interface CurriculumProgressSummaryProps {
  progressData: CurriculumProgress[];
  isLoading: boolean;
}

const CurriculumProgressSummary: React.FC<CurriculumProgressSummaryProps> = ({
  progressData,
  isLoading,
}) => {
  const aggregatedData = progressData.reduce(
    (acc, curr) => {
      return {
        totalTopics: acc.totalTopics + curr.totalTopics,
        completedTopics: acc.completedTopics + curr.completedTopics,
        behindScheduleTopics:
          acc.behindScheduleTopics + curr.behindScheduleTopics,
        aheadOfScheduleTopics:
          acc.aheadOfScheduleTopics + curr.aheadOfScheduleTopics,
      };
    },
    {
      totalTopics: 0,
      completedTopics: 0,
      behindScheduleTopics: 0,
      aheadOfScheduleTopics: 0,
    }
  );

  const onScheduleTopics =
    aggregatedData.completedTopics -
    aggregatedData.behindScheduleTopics -
    aggregatedData.aheadOfScheduleTopics;

  const completionPercentage =
    aggregatedData.totalTopics > 0
      ? Math.round(
          (aggregatedData.completedTopics / aggregatedData.totalTopics) * 100
        )
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Topics Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">
              {aggregatedData.completedTopics}
              <span className="text-sm text-muted-foreground ml-2">
                ({completionPercentage}%)
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">On Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold text-green-600">
              {onScheduleTopics}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ahead of Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold text-blue-600">
              {aggregatedData.aheadOfScheduleTopics}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Behind Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold text-red-600">
              {aggregatedData.behindScheduleTopics}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurriculumProgressSummary;
