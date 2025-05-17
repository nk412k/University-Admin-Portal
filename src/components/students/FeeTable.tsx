import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IndianRupee } from "lucide-react";
import { StudentFeeData } from "@/hooks/useStudentFees";
import { cn } from "@/lib/utils";

interface FeeTableProps {
  students: Array<StudentFeeData>;
  getSectionName: (sectionId: string) => string;
  getUniversityName: (universityId: string) => string;
}

interface StatusBadgeProps {
  status: string;
}

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
}

interface StudentRowProps {
  student: StudentFeeData;
  getSectionName: (sectionId: string) => string;
}

const getStatusColor = (status: string): string => {
  const statusColors = {
    overdue: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
  };

  return (
    statusColors[status as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800"
  );
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex rounded-full px-2 py-1 text-xs font-medium",
      getStatusColor(status)
    )}
  >
    {status}
  </span>
);

const CurrencyDisplay = ({ amount, className }: CurrencyDisplayProps) => (
  <div className={cn("flex items-center", className)}>
    <IndianRupee className="h-4 w-4 mr-1" />
    {amount.toLocaleString("en-IN")}
  </div>
);

const StudentRow = ({ student, getSectionName }: StudentRowProps) => (
  <TableRow key={student.id}>
    <TableCell className="font-medium">{student.full_name}</TableCell>
    <TableCell>{student.roll_number}</TableCell>
    <TableCell>{getSectionName(student.section_id)}</TableCell>
    <TableCell>
      <CurrencyDisplay amount={student.totalFees} />
    </TableCell>
    <TableCell>
      <CurrencyDisplay
        amount={student.pendingFees}
        className="text-muted-foreground"
      />
    </TableCell>
    <TableCell>{student.dueDate.toLocaleDateString()}</TableCell>
    <TableCell>
      <StatusBadge status={student.status} />
    </TableCell>
  </TableRow>
);

const FeeTable: React.FC<FeeTableProps> = ({
  students,
  getSectionName,
  getUniversityName,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Students sorted by payment status</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Pending Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <StudentRow
              key={student.id}
              student={student}
              getSectionName={getSectionName}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeeTable;
