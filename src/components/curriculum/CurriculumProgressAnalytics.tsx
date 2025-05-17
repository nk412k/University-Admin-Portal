import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurriculumProgress } from "@/types/curriculum";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface CurriculumProgressAnalyticsProps {
  progressData: CurriculumProgress[];
  isLoading: boolean;
  selectedSection: string;
}

const CurriculumProgressAnalytics: React.FC<
  CurriculumProgressAnalyticsProps
> = ({ progressData, isLoading, selectedSection }) => {
  const barChartData = progressData.map((data) => ({
    name: selectedSection !== "all" ? data.subjectName : data.sectionName,
    total: data.totalTopics,
    completed: data.completedTopics,
    behind: data.behindScheduleTopics,
    ahead: data.aheadOfScheduleTopics,
    onTrack: data.onScheduleTopics,
  }));

  const aggregatedData = progressData.reduce(
    (acc, curr) => {
      return {
        behindScheduleTopics:
          acc.behindScheduleTopics + curr.behindScheduleTopics,
        onScheduleTopics: acc.onScheduleTopics + curr.onScheduleTopics,
        aheadOfScheduleTopics:
          acc.aheadOfScheduleTopics + curr.aheadOfScheduleTopics,
      };
    },
    {
      behindScheduleTopics: 0,
      onScheduleTopics: 0,
      aheadOfScheduleTopics: 0,
    }
  );

  const pieChartData = [
    {
      name: "Behind Schedule",
      value: aggregatedData.behindScheduleTopics,
      color: "#ef4444",
    },
    {
      name: "On Schedule",
      value: aggregatedData.onScheduleTopics,
      color: "#22c55e",
    },
    {
      name: "Ahead of Schedule",
      value: aggregatedData.aheadOfScheduleTopics,
      color: "#3b82f6",
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>
            Progress by {selectedSection !== "all" ? "Subject" : "Section"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : barChartData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="behind"
                    name="Behind Schedule"
                    fill="#ef4444"
                    stackId="a"
                  />
                  <Bar
                    dataKey="onTrack"
                    name="On Schedule"
                    fill="#22c55e"
                    stackId="a"
                  />
                  <Bar
                    dataKey="ahead"
                    name="Ahead of Schedule"
                    fill="#3b82f6"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Overall Progress Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : pieChartData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurriculumProgressAnalytics;
