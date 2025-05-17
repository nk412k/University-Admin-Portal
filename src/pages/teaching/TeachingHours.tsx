import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PAGE_SIZE = 10;

const TeachingHours: React.FC = () => {
  const { employees, isLoading } = useData();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  const instructors = employees.filter((e) => e.is_instructor);

  const teachingHoursData = instructors.map((instructor) => {
    const hoursThisMonth = Math.floor(Math.random() * 41) + 20;
    const hoursPreviousMonth = Math.floor(Math.random() * 41) + 20;

    const percentChange =
      hoursPreviousMonth > 0
        ? ((hoursThisMonth - hoursPreviousMonth) / hoursPreviousMonth) * 100
        : 0;

    return {
      ...instructor,
      hoursThisMonth,
      hoursPreviousMonth,
      percentChange: Number(percentChange.toFixed(1)),
      sessionsCount: Math.floor(Math.random() * 16) + 5,
    };
  });

  const sortedData = [...teachingHoursData].sort(
    (a, b) => b.hoursThisMonth - a.hoursThisMonth
  );

  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalHours = teachingHoursData.reduce(
    (sum, item) => sum + item.hoursThisMonth,
    0
  );
  const avgHoursPerInstructor = Math.round(totalHours / instructors.length);
  const maxHours = Math.max(
    ...teachingHoursData.map((item) => item.hoursThisMonth)
  );
  const minHours = Math.min(
    ...teachingHoursData.map((item) => item.hoursThisMonth)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teaching Hours</h1>
        <p className="text-muted-foreground">
          Monitor instructor teaching hours and workload
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teaching Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Hours per Instructor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHoursPerInstructor}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maximum Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maxHours}</div>
            <p className="text-xs text-muted-foreground">Highest workload</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Minimum Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minHours}</div>
            <p className="text-xs text-muted-foreground">Lowest workload</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Instructors sorted by teaching hours (highest first)
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Hours this Month (in hrs)</TableHead>
              <TableHead>Previous Month (in hrs)</TableHead>
              <TableHead>Change %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.employee_id}
                </TableCell>
                <TableCell>{item.full_name}</TableCell>
                <TableCell>{item.sessionsCount}</TableCell>
                <TableCell>{item.hoursThisMonth}</TableCell>
                <TableCell>{item.hoursPreviousMonth}</TableCell>
                <TableCell
                  className={
                    item.percentChange > 0
                      ? "text-green-600"
                      : item.percentChange < 0
                      ? "text-red-600"
                      : ""
                  }
                >
                  {item.percentChange > 0 ? "+" : ""}
                  {item.percentChange}%
                </TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No teaching hours data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
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
          })}
          {totalPages > 5 && (
            <>
              <PaginationItem>
                <span className="flex h-9 w-9 items-center justify-center">
                  ...
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
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
    </div>
  );
};

export default TeachingHours;
