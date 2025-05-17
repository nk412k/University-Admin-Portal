import React from "react";
import { Student } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Mail,
  BookOpen,
  Award,
  Percent,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  UserRound,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

type SortableField = "attendance" | "cgpa";

interface StudentTableProps {
  students: Student[];
  sortField: SortableField | null;
  sortDirection: "asc" | "desc";
  onSortChange: (field: SortableField) => void;
}

interface SortableColumnProps {
  field: SortableField;
  currentSortField: SortableField | null;
  sortDirection: "asc" | "desc";
  onSortChange: (field: SortableField) => void;
  icon: React.ReactNode;
  label: string;
}

const formatAttendance = (attendance?: number) => {
  if (attendance === undefined || attendance === null) return "N/A";
  return `${attendance.toFixed(1)}%`;
};

const getAttendanceColor = (rate?: number) => {
  if (!rate) return "";
  if (rate < 75) return "text-red-600 dark:text-red-400";
  if (rate < 90) return "text-yellow-600 dark:text-yellow-400";
  return "text-green-600 dark:text-green-400";
};

const getCGPAColor = (cgpa?: number | null) => {
  if (!cgpa && cgpa !== 0) return "";
  if (cgpa < 5) return "text-red-600 dark:text-red-400 font-medium";
  if (cgpa < 7) return "text-yellow-600 dark:text-yellow-400 font-medium";
  if (cgpa < 9) return "text-green-600 dark:text-green-400 font-medium";
  return "text-purple-600 dark:text-purple-400 font-medium";
};

const getAttendanceBadge = (rate?: number) => {
  if (!rate) return null;

  if (rate < 75) {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/30"
      >
        Poor
      </Badge>
    );
  }

  if (rate < 90) {
    return (
      <Badge
        variant="outline"
        className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-800/30"
      >
        Average
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-green-50 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30"
    >
      Good
    </Badge>
  );
};

const SortableColumn = ({
  field,
  currentSortField,
  sortDirection,
  onSortChange,
  icon,
  label,
}: SortableColumnProps) => {
  const renderSortIcon = () => {
    if (currentSortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <TableHead
      onClick={() => onSortChange(field)}
      className="cursor-pointer hover:bg-muted/60 transition-colors"
    >
      <div className="flex items-center">
        {icon}
        <span>{label}</span>
        {renderSortIcon()}
      </div>
    </TableHead>
  );
};

const RegularColumn = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <TableHead>
    <div className="flex items-center">
      {icon} {label}
    </div>
  </TableHead>
);

const EmptyTableRow = ({ colSpan = 6 }: { colSpan?: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-24 text-center">
      <div className="flex flex-col items-center justify-center">
        <UserRound className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
        <p className="text-sm text-muted-foreground">
          No students found matching your criteria.
        </p>
      </div>
    </TableCell>
  </TableRow>
);

const StudentRow = ({ student }: { student: Student }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TableRow
      key={student.id || student.student_id}
      className="hover:bg-muted/60 transition-colors"
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-primary/10 border border-primary/20">
            <AvatarFallback className="text-xs text-primary">
              {getInitials(student.full_name || student.name || "Student")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {student.full_name || student.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {student.student_id}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{student.email || "N/A"}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-start gap-2">
          <BookOpen className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <div className="text-sm">{student.section_name || "Unknown"}</div>
            {student.joining_year && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {student.joining_year}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className={`font-semibold ${getCGPAColor(student.cgpa)}`}>
            {student.cgpa !== null && student.cgpa !== undefined
              ? student.cgpa.toFixed(2)
              : "N/A"}
          </div>
          {student.cgpa !== null && student.cgpa !== undefined && (
            <Progress
              value={(student.cgpa / 10) * 100}
              className="h-1 bg-muted w-16"
            />
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span
              className={`font-semibold ${getAttendanceColor(
                student.attendance_percentage
              )}`}
            >
              {formatAttendance(student.attendance_percentage)}
            </span>
            {getAttendanceBadge(student.attendance_percentage)}
          </div>
          {student.attendance_percentage !== null &&
            student.attendance_percentage !== undefined && (
              <Progress
                value={student.attendance_percentage}
                className="h-1 bg-muted"
              />
            )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Student Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
};

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  sortField,
  sortDirection,
  onSortChange,
}) => {
  return (
    <div className="rounded-md border overflow-hidden glass">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <RegularColumn
              icon={<User className="mr-2 h-4 w-4" />}
              label="Name"
            />
            <RegularColumn
              icon={<Mail className="mr-2 h-4 w-4" />}
              label="Email"
            />
            <RegularColumn
              icon={<BookOpen className="mr-2 h-4 w-4" />}
              label="Section"
            />

            <SortableColumn
              field="cgpa"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSortChange={onSortChange}
              icon={<Award className="mr-2 h-4 w-4" />}
              label="CGPA"
            />

            <SortableColumn
              field="attendance"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSortChange={onSortChange}
              icon={<Percent className="mr-2 h-4 w-4" />}
              label="Attendance"
            />

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student) => (
              <StudentRow
                key={student.id || student.student_id}
                student={student}
              />
            ))
          ) : (
            <EmptyTableRow />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentTable;
