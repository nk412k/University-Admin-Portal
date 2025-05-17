import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Employee, University } from "@/types";
import EmployeeFeedback from "@/components/employees/EmployeeFeedback";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmployeesTableProps {
  employees: Employee[];
  universities: University[];
}

interface FeedbackData {
  id: string;
  rating: number;
  feedback_text: string;
  submitted_at: string;
}

const PAGE_SIZE = 10;

const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  universities,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [feedbackData, setFeedbackData] = useState<
    Record<string, FeedbackData[]>
  >({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from("feedback")
          .select("id, rating, feedback_text, submitted_at, target_id")
          .eq("target_type", "employee");

        if (error) {
          throw error;
        }

        const feedbackByEmployee: Record<string, FeedbackData[]> = {};

        data?.forEach((item) => {
          if (!feedbackByEmployee[item.target_id]) {
            feedbackByEmployee[item.target_id] = [];
          }

          feedbackByEmployee[item.target_id].push({
            id: item.id,
            rating: item.rating,
            feedback_text: item.feedback_text,
            submitted_at: item.submitted_at,
          });
        });

        setFeedbackData(feedbackByEmployee);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast({
          title: "Error",
          description: "Failed to load feedback data",
          variant: "destructive",
        });
      }
    };

    fetchFeedback();
  }, []);

  const totalPages = Math.ceil(employees.length / PAGE_SIZE);
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const formatRole = (role: string) => {
    return role ? role.replace("_", " ") : "N/A";
  };

  const showFeedback = (id: string, name: string) => {
    setSelectedEmployee({ id, name });
  };

  const getAverageRating = (employeeId: string): string => {
    const employeeFeedback = feedbackData[employeeId];
    if (!employeeFeedback || employeeFeedback.length === 0) {
      return "No ratings";
    }

    const totalRating = employeeFeedback.reduce(
      (sum, item) => sum + item.rating,
      0
    );
    return (totalRating / employeeFeedback.length).toFixed(1) + " / 5";
  };

  const getFeedbackCount = (employeeId: string): number => {
    return feedbackData[employeeId]?.length || 0;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            A list of all employees ({employees.length})
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Average Rating</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  {employee.employee_id}
                </TableCell>
                <TableCell>{employee.full_name}</TableCell>
                <TableCell>{employee.email || "N/A"}</TableCell>
                <TableCell>
                  {employee.position || formatRole(employee.role) || "N/A"}
                </TableCell>
                <TableCell>
                  {employee.is_instructor ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                      No
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="capitalize">
                    {formatRole(employee.role) || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      feedbackData[employee.id]?.length
                        ? "font-medium"
                        : "text-gray-500"
                    }
                  >
                    {getAverageRating(employee.id)}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      showFeedback(employee.id, employee.full_name)
                    }
                    className="flex items-center gap-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{getFeedbackCount(employee.id) || ""}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No employees found.
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

      {selectedEmployee && (
        <EmployeeFeedback
          employeeId={selectedEmployee.id}
          employeeName={selectedEmployee.name}
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          existingFeedback={feedbackData[selectedEmployee.id] || []}
        />
      )}
    </>
  );
};

export default EmployeesTable;
