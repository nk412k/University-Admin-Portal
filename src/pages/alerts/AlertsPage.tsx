import React, { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { useAlertSystem } from "@/hooks/useAlertSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, BookOpen, UserX, Bell } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AlertsBox } from "@/components/dashboard/AlertsBox";
import { Section, Student } from "@/types";

const AlertsPage: React.FC = () => {
  const { sections, students } = useData();
  const { alerts, loading, filterAlertsByCategory, selectedCategory } =
    useAlertSystem();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("all");

  const filteredAlerts = alerts.filter(
    (alert) =>
      (searchTerm === "" ||
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSection === "all" ||
        alert.message.toLowerCase().includes(selectedSection.toLowerCase()))
  );

  const alertsByCategory = {
    attendance: filteredAlerts.filter((a) => a.category === "attendance"),
    curriculum: filteredAlerts.filter((a) => a.category === "curriculum"),
    performance: filteredAlerts.filter((a) => a.category === "performance"),
    payment: filteredAlerts.filter((a) => a.category === "payment"),
    issues: filteredAlerts.filter((a) => a.category === "issues"),
  };

  const attendanceRiskStudents = students
    .filter(
      (s) =>
        s.attendance_percentage !== undefined && s.attendance_percentage < 75
    )
    .sort(
      (a, b) => (a.attendance_percentage || 0) - (b.attendance_percentage || 0)
    )
    .slice(0, 10);

  const academicRiskStudents = students
    .filter((s) => s.cgpa !== undefined && s.cgpa < 6)
    .sort((a, b) => (a.cgpa || 0) - (b.cgpa || 0))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Alert Center</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search alerts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="all">All Sections</option>
            {sections.map((section) => (
              <option key={section.section_id} value={section.name}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Attendance Alerts</span>
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800"
                >
                  {alertsByCategory.attendance.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Curriculum Progress</span>
                <Badge
                  variant="outline"
                  className="bg-indigo-100 text-indigo-800"
                >
                  {alertsByCategory.curriculum.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Academic Performance</span>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  {alertsByCategory.performance.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Issues</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {alertsByCategory.payment.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Other Issues</span>
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  {alertsByCategory.issues.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bell className="mr-2 h-5 w-5 text-red-500" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertsBox
              alerts={filteredAlerts.filter((a) => a.severity === "critical")}
              loading={loading}
              showTitle={false}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="section-analysis">Section Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 pt-4">
          <AlertsBox
            alerts={filteredAlerts}
            loading={loading}
            showTitle={false}
            maxAlerts={100}
          />
        </TabsContent>

        <TabsContent value="attendance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserX className="mr-2 h-5 w-5 text-amber-500" />
                Students with Low Attendance
              </CardTitle>
              <CardDescription>
                Students with attendance below 75% who may need intervention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="h-10 px-4 text-left font-medium">
                        Student
                      </th>
                      <th className="h-10 px-4 text-left font-medium">
                        Roll #
                      </th>
                      <th className="h-10 px-4 text-right font-medium">
                        Attendance %
                      </th>
                      <th className="h-10 px-4 text-right font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRiskStudents.length > 0 ? (
                      attendanceRiskStudents.map((student) => (
                        <tr
                          key={student.student_id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-4">{student.name}</td>
                          <td className="p-4">{student.roll_number}</td>
                          <td className="p-4 text-right">
                            {student.attendance_percentage?.toFixed(1)}%
                          </td>
                          <td className="p-4 text-right">
                            {student.attendance_percentage &&
                            student.attendance_percentage < 60 ? (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800"
                              >
                                Critical
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-amber-100 text-amber-800"
                              >
                                At Risk
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No students with attendance issues found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                Students with Low Academic Performance
              </CardTitle>
              <CardDescription>
                Students with CGPA below 6.0 who may need academic support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="h-10 px-4 text-left font-medium">
                        Student
                      </th>
                      <th className="h-10 px-4 text-left font-medium">
                        Roll #
                      </th>
                      <th className="h-10 px-4 text-right font-medium">CGPA</th>
                      <th className="h-10 px-4 text-right font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicRiskStudents.length > 0 ? (
                      academicRiskStudents.map((student) => (
                        <tr
                          key={student.student_id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-4">{student.name}</td>
                          <td className="p-4">{student.roll_number}</td>
                          <td className="p-4 text-right">
                            {student.cgpa?.toFixed(2)}
                          </td>
                          <td className="p-4 text-right">
                            {student.cgpa && student.cgpa < 4 ? (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800"
                              >
                                Critical
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-amber-100 text-amber-800"
                              >
                                At Risk
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No students with academic issues found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
                Curriculum Progress Issues
              </CardTitle>
              <CardDescription>
                Sections falling behind on curriculum schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="h-10 px-4 text-left font-medium">
                        Section
                      </th>
                      <th className="h-10 px-4 text-left font-medium">
                        Subject
                      </th>
                      <th className="h-10 px-4 text-right font-medium">
                        Pending Topics
                      </th>
                      <th className="h-10 px-4 text-right font-medium">
                        Behind Schedule
                      </th>
                      <th className="h-10 px-4 text-right font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertsByCategory.curriculum.length > 0 ? (
                      alertsByCategory.curriculum.map((alert) => {
                        const match =
                          alert.message.match(/(\d+) overdue topics/);
                        const behindTopics = match ? parseInt(match[1]) : 0;

                        return (
                          <tr
                            key={alert.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-4">
                              {alert.message
                                .split(" in ")[1]
                                ?.split(" has ")[0] || "Unknown"}
                            </td>
                            <td className="p-4">
                              {alert.message
                                .split(" in ")[0]
                                ?.replace("Curriculum Lag Detected", "") ||
                                alert.title}
                            </td>
                            <td className="p-4 text-right">{behindTopics}</td>
                            <td className="p-4 text-right">
                              {Math.round(behindTopics / 2)} sessions
                            </td>
                            <td className="p-4 text-right">
                              {behindTopics >= 10 ? (
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800"
                                >
                                  Critical
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-100 text-amber-800"
                                >
                                  Delayed
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No curriculum issues found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="section-analysis" className="pt-4">
          <div className="grid grid-cols-1 gap-6">
            {sections.map((section) => (
              <SectionAlertSummary
                key={section.section_id}
                section={section}
                alerts={alerts}
                students={students.filter(
                  (s) => s.section_name === section.name
                )}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SectionAlertSummaryProps {
  section: Section;
  alerts: any[];
  students: Student[];
}

const SectionAlertSummary: React.FC<SectionAlertSummaryProps> = ({
  section,
  alerts,
  students,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sectionAlerts = alerts.filter((alert) =>
    alert.message.toLowerCase().includes(section.name.toLowerCase())
  );

  const totalStudents = students.length;
  const attendanceRiskCount = students.filter(
    (s) => s.attendance_percentage !== undefined && s.attendance_percentage < 75
  ).length;
  const academicRiskCount = students.filter(
    (s) => s.cgpa !== undefined && s.cgpa < 6
  ).length;

  const criticalAlerts = sectionAlerts.filter(
    (a) => a.severity === "critical"
  ).length;

  const attendanceScore = totalStudents
    ? 100 - (attendanceRiskCount / totalStudents) * 100
    : 100;
  const academicScore = totalStudents
    ? 100 - (academicRiskCount / totalStudents) * 100
    : 100;
  const alertScore = Math.max(0, 100 - criticalAlerts * 10);

  const overallHealth = Math.round(
    (attendanceScore + academicScore + alertScore) / 3
  );

  const getHealthColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card
        className="border-l-4"
        style={{ borderLeftColor: getHealthColor(overallHealth) }}
      >
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{section.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={`bg-opacity-20 ${
                      criticalAlerts > 0
                        ? "bg-red-500 text-red-700"
                        : "bg-green-500 text-green-700"
                    }`}
                  >
                    {criticalAlerts} critical alerts
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {isOpen ? "−" : "+"}
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-muted-foreground">
                  {totalStudents} students • Department: {section.department}
                </div>
                <div className="text-sm font-medium">
                  Health Score: {overallHealth}%
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getHealthColor(overallHealth)}`}
                  style={{ width: `${overallHealth}%` }}
                ></div>
              </div>
            </CardHeader>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Student Risk Factors
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Attendance Risk</span>
                    <Badge
                      variant="outline"
                      className={
                        attendanceRiskCount > 0
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {attendanceRiskCount} students
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Academic Risk</span>
                    <Badge
                      variant="outline"
                      className={
                        academicRiskCount > 0
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {academicRiskCount} students
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Alerts Summary</h4>
                <div className="space-y-2">
                  {["attendance", "curriculum", "performance", "issues"].map(
                    (category) => {
                      const count = sectionAlerts.filter(
                        (a) => a.category === category
                      ).length;
                      return (
                        <div
                          key={category}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm capitalize">{category}</span>
                          <Badge
                            variant="outline"
                            className={
                              count > 0
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {count} alerts
                          </Badge>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {sectionAlerts.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Section Alerts</h4>
                <AlertsBox
                  alerts={sectionAlerts}
                  showTitle={false}
                  maxAlerts={5}
                />
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default AlertsPage;
