import React, { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { useUniversity } from "@/contexts/UniversityContext";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Student } from "@/types";
import {
  Search,
  SortAsc,
  SortDesc,
  School,
  BookOpen,
  BarChart2,
  CheckCircle2,
  ArrowDownToLine,
  ListFilter,
  UserPlus,
} from "lucide-react";
import StudentTable from "@/components/students/StudentTable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useStudents } from "@/hooks/useStudents";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAGE_SIZE = 10;

const greenProgress = "bg-green-500";
const yellowProgress = "bg-yellow-500";
const redProgress = "bg-red-500";
const violetProgress = "bg-violet-500";
const blueProgress = "bg-blue-500";
const amberProgress = "bg-amber-500";

const StudentList: React.FC = () => {
  const { sections } = useData();
  const { activeUniversity } = useUniversity();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"attendance" | "cgpa" | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"list" | "stats">("list");

  const selectedSection = selectedSectionId
    ? sections.find((section) => section.section_id === selectedSectionId) ||
      null
    : null;

  const { students, isLoading } = useStudents(
    activeUniversity?.id || activeUniversity?.university_id,
    selectedSection
  );

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email &&
        student.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortField) return 0;

    if (sortField === "attendance") {
      const aAttendance = a.attendance_percentage || 0;
      const bAttendance = b.attendance_percentage || 0;
      return sortDirection === "asc"
        ? aAttendance - bAttendance
        : bAttendance - aAttendance;
    }

    if (sortField === "cgpa") {
      const aCgpa = a.cgpa || 0;
      const bCgpa = b.cgpa || 0;
      return sortDirection === "asc" ? aCgpa - bCgpa : bCgpa - aCgpa;
    }

    return 0;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSectionId]);

  const totalPages = Math.ceil(sortedStudents.length / PAGE_SIZE);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const calculateAttendanceStats = (students: Student[]) => {
    const total = students.length;
    if (total === 0)
      return {
        total: 0,
        poor: 0,
        average: 0,
        good: 0,
        poorPercentage: 0,
        averagePercentage: 0,
        goodPercentage: 0,
      };

    const studentsWithAttendance = students.map((student) => {
      const attendanceRate = student.attendance_percentage || 0;
      const attendanceStatus =
        attendanceRate < 75 ? "poor" : attendanceRate < 90 ? "average" : "good";
      return { ...student, attendanceRate, attendanceStatus };
    });

    const poor = studentsWithAttendance.filter(
      (s) => s.attendanceStatus === "poor"
    ).length;
    const average = studentsWithAttendance.filter(
      (s) => s.attendanceStatus === "average"
    ).length;
    const good = studentsWithAttendance.filter(
      (s) => s.attendanceStatus === "good"
    ).length;

    return {
      total,
      poor,
      average,
      good,
      poorPercentage: total > 0 ? Math.round((poor / total) * 100) : 0,
      averagePercentage: total > 0 ? Math.round((average / total) * 100) : 0,
      goodPercentage: total > 0 ? Math.round((good / total) * 100) : 0,
    };
  };

  const calculateCGPAStats = (students: Student[]) => {
    const total = students.length;
    if (total === 0)
      return {
        excellent: 0,
        good: 0,
        average: 0,
        poor: 0,
        excellentPercentage: 0,
        goodPercentage: 0,
        averagePercentage: 0,
        poorPercentage: 0,
      };

    const studentsWithCGPA = students.map((student) => {
      const cgpa = student.cgpa || 0;
      let cgpaStatus = "";

      if (cgpa >= 8.5) cgpaStatus = "excellent";
      else if (cgpa >= 7.5) cgpaStatus = "good";
      else if (cgpa >= 6) cgpaStatus = "average";
      else cgpaStatus = "poor";

      return { ...student, cgpa, cgpaStatus };
    });

    const excellent = studentsWithCGPA.filter(
      (s) => s.cgpaStatus === "excellent"
    ).length;
    const good = studentsWithCGPA.filter((s) => s.cgpaStatus === "good").length;
    const average = studentsWithCGPA.filter(
      (s) => s.cgpaStatus === "average"
    ).length;
    const poor = studentsWithCGPA.filter((s) => s.cgpaStatus === "poor").length;

    return {
      excellent,
      good,
      average,
      poor,
      excellentPercentage:
        total > 0 ? Math.round((excellent / total) * 100) : 0,
      goodPercentage: total > 0 ? Math.round((good / total) * 100) : 0,
      averagePercentage: total > 0 ? Math.round((average / total) * 100) : 0,
      poorPercentage: total > 0 ? Math.round((poor / total) * 100) : 0,
    };
  };

  const stats = calculateAttendanceStats(filteredStudents);
  const cgpaStats = calculateCGPAStats(filteredStudents);

  const handleSortChange = (field: "attendance" | "cgpa") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  const availableSections = sections.filter(
    (section) =>
      activeUniversity &&
      (section.university_id === activeUniversity.id ||
        section.university_id === activeUniversity.university_id)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor student profiles and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "list" | "stats")}
            className="w-[180px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <ArrowDownToLine className="h-4 w-4" />
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {!activeUniversity ? (
        <Card className="glass text-center">
          <CardContent className="pt-12 pb-12">
            <School className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No university selected</p>
            <p className="text-sm text-muted-foreground">
              Please select a university from the dropdown in the header to view
              students.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <ListFilter className="h-5 w-5 mr-2" />
                Filter Students
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, email or ID..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedSectionId || "all"}
                  onValueChange={(value) => {
                    setSelectedSectionId(value === "all" ? null : value);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Filter by section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Sections</SelectItem>
                      {availableSections.map((section) => (
                        <SelectItem
                          key={section.section_id}
                          value={section.section_id}
                        >
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {filteredStudents.length > 0 && (
                  <div className="hidden sm:flex items-center gap-2 ml-auto">
                    <span className="text-sm text-muted-foreground">
                      Sort by:
                    </span>
                    <ToggleGroup type="single" value={sortField || ""}>
                      <ToggleGroupItem
                        value="cgpa"
                        onClick={() => handleSortChange("cgpa")}
                        className="flex items-center gap-1"
                      >
                        CGPA
                        {sortField === "cgpa" &&
                          (sortDirection === "asc" ? (
                            <SortAsc className="h-3 w-3" />
                          ) : (
                            <SortDesc className="h-3 w-3" />
                          ))}
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="attendance"
                        onClick={() => handleSortChange("attendance")}
                        className="flex items-center gap-1"
                      >
                        Attendance
                        {sortField === "attendance" &&
                          (sortDirection === "asc" ? (
                            <SortAsc className="h-3 w-3" />
                          ) : (
                            <SortDesc className="h-3 w-3" />
                          ))}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                )}
              </div>

              {selectedSectionId && (
                <div className="flex items-center">
                  <Badge variant="outline" className="bg-primary/5">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Section:{" "}
                    {
                      sections.find((s) => s.section_id === selectedSectionId)
                        ?.name
                    }
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {viewMode === "stats" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                    Attendance Statistics
                  </CardTitle>
                  <CardDescription>
                    Overview of student attendance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/20">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.good}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Good (≥90%)
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/20">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {stats.average}
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400">
                        Average (75-89%)
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {stats.poor}
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400">
                        Poor (&lt;75%)
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        Good
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stats.goodPercentage}%
                      </span>
                    </div>
                    <Progress
                      value={stats.goodPercentage}
                      className={`h-2 ${greenProgress}`}
                    />

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium flex items-center">
                        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                        Average
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stats.averagePercentage}%
                      </span>
                    </div>
                    <Progress
                      value={stats.averagePercentage}
                      className={`h-2 ${yellowProgress}`}
                    />

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        Poor
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stats.poorPercentage}%
                      </span>
                    </div>
                    <Progress
                      value={stats.poorPercentage}
                      className={`h-2 ${redProgress}`}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                    CGPA Distribution
                  </CardTitle>
                  <CardDescription>
                    Overview of student academic performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/20">
                      <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                        {cgpaStats.excellent}
                      </div>
                      <div className="text-xs text-violet-600 dark:text-violet-400">
                        Excellent (≥8.5)
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {cgpaStats.good}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Good (7.5-8.4)
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {cgpaStats.average}
                      </div>
                      <div className="text-xs text-amber-600 dark:text-amber-400">
                        Average (6-7.4)
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {cgpaStats.poor}
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400">
                        Poor (&lt;6)
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium flex items-center">
                        <div className="h-3 w-3 rounded-full bg-violet-500 mr-2"></div>
                        Excellent
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {cgpaStats.excellentPercentage}%
                      </span>
                    </div>
                    <Progress
                      value={cgpaStats.excellentPercentage}
                      className={`h-2 ${violetProgress}`}
                    />

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                        Good
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {cgpaStats.goodPercentage}%
                      </span>
                    </div>
                    <Progress
                      value={cgpaStats.goodPercentage}
                      className={`h-2 ${blueProgress}`}
                    />

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium flex items-center">
                        <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                        Average
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {cgpaStats.averagePercentage}%
                      </span>
                    </div>
                    <Progress
                      value={cgpaStats.averagePercentage}
                      className={`h-2 ${amberProgress}`}
                    />

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        Poor
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {cgpaStats.poorPercentage}%
                      </span>
                    </div>
                    <Progress
                      value={cgpaStats.poorPercentage}
                      className={`h-2 ${redProgress}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {viewMode === "list" && (
            <>
              <StudentTable
                students={paginatedStudents}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
              />

              {filteredStudents.length > 0 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, i) => {
                        const pageNumber = i + 1;
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
                      }
                    )}
                    {totalPages > 5 && (
                      <>
                        <PaginationItem>
                          <span className="flex h-9 w-9 items-center justify-center">
                            ...
                          </span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
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
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StudentList;
