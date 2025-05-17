import React, { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  BarChart,
  BarChart3,
  CalendarDays,
  AlertTriangle,
  MessageSquare,
  BookOpen,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import {
  SectionReport,
  generateDemoSectionReports,
  fetchSectionReports,
} from "@/utils/reportUtils";
import ExamScoresReport from "@/components/reports/ExamScoresReport";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ReportsList: React.FC = () => {
  const { universities, sections, isLoading } = useData();
  const [reportsTab, setReportsTab] = useState("section");
  const [reports, setReports] = useState<SectionReport[]>([]);
  const [isReportsLoading, setIsReportsLoading] = useState(true);
  const [expandedReportIds, setExpandedReportIds] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const loadReports = async () => {
      setIsReportsLoading(true);
      try {
        const fetchedReports = await fetchSectionReports();

        if (
          fetchedReports.length === 0 &&
          sections.length > 0 &&
          universities.length > 0
        ) {
          setReports(generateDemoSectionReports(sections, universities));
        } else {
          setReports(fetchedReports);
        }
      } catch (error) {
        console.error("Error loading reports:", error);
        if (sections.length > 0 && universities.length > 0) {
          setReports(generateDemoSectionReports(sections, universities));
        }
        toast({
          title: "Error loading reports",
          description: "Using demo data instead.",
          variant: "destructive",
        });
      } finally {
        setIsReportsLoading(false);
      }
    };

    if (!isLoading && sections.length > 0) {
      loadReports();
    }
  }, [isLoading, sections, universities]);

  const toggleReportExpand = (reportId: string) => {
    setExpandedReportIds((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  if (isLoading || isReportsLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports Dashboard
          </h1>
          <p className="text-muted-foreground">
            View academic and administrative reports across all units
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="section"
        value={reportsTab}
        onValueChange={setReportsTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="section">Section Reports</TabsTrigger>
          <TabsTrigger value="exam_scores">
            <BarChart2 className="h-4 w-4 mr-2" />
            Exam Scores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="section" className="mt-0 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  Curriculum Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    reports.reduce(
                      (sum, r) => sum + r.curriculum_completion_percentage,
                      0
                    ) / Math.max(reports.length, 1)
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Average completion across all sections
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                  Attendance Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    reports.reduce((sum, r) => sum + r.attendance_average, 0) /
                      Math.max(reports.length, 1)
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Average attendance across all sections
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  Total Flagged Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reports.reduce((sum, r) => sum + r.flagged_deviations, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Flagged deviations requiring attention
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Section Reports</CardTitle>
              <CardDescription>
                Click on a row to view detailed information and issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Curriculum Progress</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Issues</TableHead>
                      <TableHead>Report Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <React.Fragment key={report.id}>
                        <TableRow
                          className="cursor-pointer hover:bg-muted/60"
                          onClick={() => toggleReportExpand(report.id)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {report.section_name}
                              {expandedReportIds[report.id] ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{report.university_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={report.curriculum_completion_percentage}
                                className="h-2 w-16"
                              />
                              <span>
                                {report.curriculum_completion_percentage}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={report.attendance_average}
                                className="h-2 w-16"
                              />
                              <span>{report.attendance_average}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                report.flagged_deviations > 0
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {report.flagged_deviations}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.report_date}</TableCell>
                        </TableRow>
                        {expandedReportIds[report.id] && (
                          <TableRow className="bg-muted/20">
                            <TableCell colSpan={6} className="p-0">
                              <div className="p-4 space-y-4">
                                <div className="text-sm space-y-3">
                                  <h4 className="font-semibold text-base">
                                    Issues & Flagged Deviations:
                                  </h4>
                                  {report.flagged_deviations > 0 ? (
                                    <ul className="space-y-2 list-disc pl-5">
                                      {report.flagged_deviations >= 1 && (
                                        <li className="text-red-600">
                                          Low attendance trend detected in
                                          recent sessions
                                        </li>
                                      )}
                                      {report.flagged_deviations >= 2 && (
                                        <li className="text-amber-600">
                                          Curriculum completion behind schedule
                                          by approximately{" "}
                                          {Math.round(
                                            100 -
                                              report.curriculum_completion_percentage
                                          )}
                                          %
                                        </li>
                                      )}
                                      {report.flagged_deviations >= 3 && (
                                        <li className="text-red-600">
                                          {report.escalations_raised -
                                            report.escalations_resolved}{" "}
                                          unresolved escalations require
                                          attention
                                        </li>
                                      )}
                                      {report.flagged_deviations >= 4 && (
                                        <li className="text-amber-600">
                                          Student feedback satisfaction score
                                          below target (Current:{" "}
                                          {report.feedback_satisfaction_score}
                                          /5)
                                        </li>
                                      )}
                                      {report.flagged_deviations >= 5 && (
                                        <li className="text-red-600">
                                          Critical: Multiple missed sessions
                                          detected this month
                                        </li>
                                      )}
                                    </ul>
                                  ) : (
                                    <p className="text-green-600">
                                      No issues detected for this section
                                    </p>
                                  )}

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4 pt-2 border-t">
                                    <div className="bg-slate-50 p-3 rounded-md">
                                      <div className="text-xs text-muted-foreground">
                                        Upcoming Events
                                      </div>
                                      <div className="font-semibold">
                                        {report.upcoming_events_count}
                                      </div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-md">
                                      <div className="text-xs text-muted-foreground">
                                        Escalations
                                      </div>
                                      <div className="font-semibold">
                                        {report.escalations_resolved}/
                                        {report.escalations_raised} resolved
                                      </div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-md">
                                      <div className="text-xs text-muted-foreground">
                                        Feedback Score
                                      </div>
                                      <div className="font-semibold">
                                        {report.feedback_satisfaction_score}/5
                                      </div>
                                    </div>
                                    <div className="col-span-3 mt-2 text-sm text-muted-foreground">
                                      Report Period: {report.report_period}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-md border">
                  <p className="text-muted-foreground">No reports found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exam_scores" className="mt-0">
          <ExamScoresReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsList;
