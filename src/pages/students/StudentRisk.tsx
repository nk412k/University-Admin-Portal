import React, { useState, useMemo, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  BookOpen,
  Mail,
  School,
  Calendar,
  Percent,
  Award,
  BarChart2,
  TrendingUp,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Student } from "@/types";
import { mockRiskData } from "@/constants";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 8;

const StudentRisk: React.FC = () => {
  const { students, sections, isLoading } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>("all");
  const [enhancedStudents, setEnhancedStudents] = useState<Student[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const existingStudentIds = new Set(students.map((s) => s.student_id));

    const filteredMockData = mockRiskData.filter(
      (mock) => !existingStudentIds.has(mock.student_id)
    );

    const combined = [
      ...students.map((student) => ({
        ...student,
        full_name: student.full_name || student.name,
        id: student.id || student.student_id,
      })),
      ...filteredMockData,
    ];

    setEnhancedStudents(combined);
  }, [students]);

  const uniqueYears = useMemo(() => {
    const years = [
      ...new Set(enhancedStudents.map((student) => student.joining_year)),
    ];
    return years.sort();
  }, [enhancedStudents]);

  const filteredStudents = useMemo(() => {
    return enhancedStudents.filter((student) => {
      if (selectedSection !== "all" && student.section_id !== selectedSection) {
        return false;
      }

      if (
        selectedYear !== "all" &&
        student.joining_year !== parseInt(selectedYear)
      ) {
        return false;
      }

      if (
        selectedRiskLevel !== "all" &&
        student.risk_level !== selectedRiskLevel
      ) {
        return false;
      }

      return true;
    });
  }, [enhancedStudents, selectedSection, selectedYear, selectedRiskLevel]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort(
      (a, b) => (b.risk_score || 0) - (a.risk_score || 0)
    );
  }, [filteredStudents]);

  const totalPages = Math.ceil(sortedStudents.length / PAGE_SIZE);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const highRiskCount = filteredStudents.filter(
    (s) => s.risk_level === "high"
  ).length;
  const mediumRiskCount = filteredStudents.filter(
    (s) => s.risk_level === "medium"
  ).length;
  const lowRiskCount = filteredStudents.filter(
    (s) => s.risk_level === "low"
  ).length;

  const getSectionName = (sectionId: string) => {
    const section = sections.find(
      (s) => s.id === sectionId || s.section_id === sectionId
    );
    return section
      ? section.name
      : enhancedStudents.find((s) => s.section_id === sectionId)
          ?.section_name || "Unknown";
  };

  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance < 75) return "text-red-500";
    if (attendance >= 90) return "text-green-500";
    return "text-yellow-500";
  };

  const getCgpaColor = (cgpa: number) => {
    if (cgpa < 6) return "text-red-500";
    if (cgpa >= 8) return "text-green-500";
    return "text-yellow-500";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Student Risk Analytics
          </h1>
          <p className="text-muted-foreground">
            Monitor and intervene with at-risk students
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Student Risk Analytics
          </h1>
          <p className="text-muted-foreground">
            Monitor and intervene with at-risk students
          </p>
        </div>
        <Tabs
          defaultValue="grid"
          className="w-[200px]"
          onValueChange={(v) => setViewMode(v as "grid" | "list")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="mr-2 h-4 w-4 text-red-500" />
              High Risk Students
            </CardTitle>
            <span className={`text-2xl font-bold text-red-500`}>
              {highRiskCount}
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {((highRiskCount / filteredStudents.length) * 100).toFixed(1)}% of
              total students
            </div>
            <Progress
              value={(highRiskCount / filteredStudents.length) * 100}
              className="h-2 mt-2"
              indicatorClassName="bg-red-500"
            />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="mr-2 h-4 w-4 text-yellow-500" />
              Medium Risk Students
            </CardTitle>
            <span className={`text-2xl font-bold text-yellow-500`}>
              {mediumRiskCount}
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {((mediumRiskCount / filteredStudents.length) * 100).toFixed(1)}%
              of total students
            </div>
            <Progress
              value={(mediumRiskCount / filteredStudents.length) * 100}
              className="h-2 mt-2"
              indicatorClassName="bg-yellow-500"
            />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="mr-2 h-4 w-4 text-green-500" />
              Low Risk Students
            </CardTitle>
            <span className={`text-2xl font-bold text-green-500`}>
              {lowRiskCount}
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {((lowRiskCount / filteredStudents.length) * 100).toFixed(1)}% of
              total students
            </div>
            <Progress
              value={(lowRiskCount / filteredStudents.length) * 100}
              className="h-2 mt-2"
              indicatorClassName="bg-green-500"
            />
          </CardContent>
        </Card>
      </div>

      <div className="glass rounded-xl p-4 space-y-4">
        <h2 className="text-lg font-semibold">Filter Students</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="section-filter">Section</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger id="section-filter" className="mt-1.5">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map((section) => (
                  <SelectItem
                    key={section.id || section.section_id}
                    value={section.id || section.section_id}
                  >
                    {section.name} - {section.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="year-filter">Joining Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year-filter" className="mt-1.5">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="risk-filter">Risk Level</Label>
            <Select
              value={selectedRiskLevel}
              onValueChange={setSelectedRiskLevel}
            >
              <SelectTrigger id="risk-filter" className="mt-1.5">
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <>
          <div>
            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {paginatedStudents.map((student) => (
                  <Card
                    key={student.id || student.student_id}
                    className={`overflow-hidden transition-all hover:shadow-lg ${
                      student.risk_level === "high"
                        ? "border-red-300 dark:border-red-800"
                        : student.risk_level === "medium"
                        ? "border-yellow-300 dark:border-yellow-800"
                        : "border-green-300 dark:border-green-800"
                    }`}
                  >
                    <div
                      className={`h-2 w-full ${
                        student.risk_level === "high"
                          ? "bg-red-500"
                          : student.risk_level === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {student.full_name || student.name}
                        </CardTitle>
                        <Badge
                          className={getRiskBadgeClass(
                            student.risk_level || "medium"
                          )}
                        >
                          {student.risk_score || 0} Points
                        </Badge>
                      </div>
                      <CardDescription>{student.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center text-sm">
                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {student.section_name ||
                                getSectionName(student.section_id)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <School className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{student.roll_number}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                              CGPA
                            </span>
                            <span
                              className={`text-lg font-medium ${getCgpaColor(
                                student.cgpa || 0
                              )}`}
                            >
                              {student.cgpa ? student.cgpa.toFixed(1) : "N/A"}
                            </span>
                            <Progress
                              value={
                                student.cgpa ? (student.cgpa / 10) * 100 : 0
                              }
                              className="h-1 mt-1"
                              indicatorClassName={`${getCgpaColor(
                                student.cgpa || 0
                              )} bg-current`}
                            />
                          </div>

                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                              Attendance
                            </span>
                            <span
                              className={`text-lg font-medium ${getAttendanceColor(
                                student.attendance_percentage || 0
                              )}`}
                            >
                              {student.attendance_percentage
                                ? `${student.attendance_percentage.toFixed(0)}%`
                                : "N/A"}
                            </span>
                            <Progress
                              value={student.attendance_percentage || 0}
                              className="h-1 mt-1"
                              indicatorClassName={`${getAttendanceColor(
                                student.attendance_percentage || 0
                              )} bg-current`}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full flex items-center justify-center"
                      >
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedStudents.map((student) => (
                  <Card
                    key={student.id || student.student_id}
                    className={`overflow-hidden transition-all hover:shadow-lg ${
                      student.risk_level === "high"
                        ? "border-l-4 border-l-red-500"
                        : student.risk_level === "medium"
                        ? "border-l-4 border-l-yellow-500"
                        : "border-l-4 border-l-green-500"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                              {student.full_name || student.name}
                            </h3>
                            <Badge
                              className={getRiskBadgeClass(
                                student.risk_level || "medium"
                              )}
                            >
                              {student.risk_level?.toUpperCase()} RISK
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>

                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">
                                {student.section_name ||
                                  getSectionName(student.section_id)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <School className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">
                                {student.roll_number}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">
                                Joined: {student.joining_year}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">
                                Risk Score: {student.risk_score || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col justify-between gap-4 min-w-[180px]">
                          <div>
                            <span className="text-xs text-muted-foreground block">
                              CGPA
                            </span>
                            <span
                              className={`text-xl font-medium ${getCgpaColor(
                                student.cgpa || 0
                              )}`}
                            >
                              {student.cgpa ? student.cgpa.toFixed(1) : "N/A"}
                            </span>
                            <Progress
                              value={
                                student.cgpa ? (student.cgpa / 10) * 100 : 0
                              }
                              className="h-1 mt-1 w-full max-w-[120px]"
                              indicatorClassName={`${getCgpaColor(
                                student.cgpa || 0
                              )} bg-current`}
                            />
                          </div>

                          <div>
                            <span className="text-xs text-muted-foreground block">
                              Attendance
                            </span>
                            <span
                              className={`text-xl font-medium ${getAttendanceColor(
                                student.attendance_percentage || 0
                              )}`}
                            >
                              {student.attendance_percentage
                                ? `${student.attendance_percentage.toFixed(0)}%`
                                : "N/A"}
                            </span>
                            <Progress
                              value={student.attendance_percentage || 0}
                              className="h-1 mt-1 w-full max-w-[120px]"
                              indicatorClassName={`${getAttendanceColor(
                                student.attendance_percentage || 0
                              )} bg-current`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pageNumber === currentPage}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <Card className="p-8 text-center">
          <CardContent className="pt-8">
            <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No students match the selected filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentRisk;
