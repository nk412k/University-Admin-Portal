
import React, { useState } from "react";
import { useCurriculumOverview } from "@/hooks/useCurriculumOverview";
import CurriculumFilters from "@/components/curriculum/CurriculumFilters";
import CurriculumProgressSummary from "@/components/curriculum/CurriculumProgressSummary";
import CurriculumProgressAnalytics from "@/components/curriculum/CurriculumProgressAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CurriculumOverview: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const { progressData, isLoading } = useCurriculumOverview({
    sectionId: selectedSection !== "all" ? selectedSection : undefined,
    subjectId: selectedSubject !== "all" ? selectedSubject : undefined,
  });

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Curriculum Overview</h1>
        <p className="text-muted-foreground">
          Track progress and completion status across all sections and subjects
        </p>
      </div>

      <CurriculumFilters
        selectedSection={selectedSection}
        selectedSubject={selectedSubject}
        setSelectedSection={setSelectedSection}
        setSelectedSubject={setSelectedSubject}
      />

      <CurriculumProgressSummary progressData={progressData} isLoading={isLoading} />

      <CurriculumProgressAnalytics 
        progressData={progressData} 
        isLoading={isLoading} 
        selectedSection={selectedSection}
      />

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Section-wise Progress Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Section
                    </th>
                    <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total Topics
                    </th>
                    <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Average Days Variance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {isLoading ? (
                    Array(5)
                      .fill(0)
                      .map((_, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-muted rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-muted rounded w-10"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-muted rounded w-10"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-muted rounded w-16"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-muted rounded w-14"></div>
                          </td>
                        </tr>
                      ))
                  ) : progressData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 whitespace-nowrap text-center"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    progressData.map((progress) => (
                      <tr key={progress.sectionId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {progress.sectionName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {progress.totalTopics}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {progress.completedTopics} (
                          {progress.totalTopics > 0
                            ? Math.round(
                                (progress.completedTopics / progress.totalTopics) * 100
                              )
                            : 0}
                          %)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              progress.overallStatus === "on_track"
                                ? "bg-green-100 text-green-800"
                                : progress.overallStatus === "ahead"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {progress.overallStatus === "on_track"
                              ? "On Track"
                              : progress.overallStatus === "ahead"
                              ? "Ahead"
                              : "Behind"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={
                              progress.averageLagDays === 0
                                ? "text-gray-500"
                                : progress.averageLagDays < 0
                                ? "text-blue-600"
                                : "text-red-600"
                            }
                          >
                            {progress.averageLagDays === 0
                              ? "On Schedule"
                              : progress.averageLagDays < 0
                              ? `${Math.abs(progress.averageLagDays).toFixed(1)} days ahead`
                              : `${progress.averageLagDays.toFixed(1)} days behind`}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurriculumOverview;
