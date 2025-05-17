import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee } from "@/types";

interface EmployeeStatisticsCardsProps {
  employees: Employee[];
}

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  children?: React.ReactNode;
}

interface DepartmentEntry {
  name: string;
  count: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  children,
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children || (
        <>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

const DepartmentList: React.FC<{ departments: DepartmentEntry[] }> = ({
  departments,
}) => (
  <>
    {departments.length > 0 ? (
      departments.map((dept, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm">{dept.name}</span>
          <span className="text-sm font-medium">{dept.count}</span>
        </div>
      ))
    ) : (
      <div className="text-sm text-muted-foreground">
        No department data available
      </div>
    )}
  </>
);

const EmployeeStatisticsCards: React.FC<EmployeeStatisticsCardsProps> = ({
  employees,
}) => {
  const calculateStatistics = () => {
    const totalEmployees = employees.length;
    const totalInstructors = employees.filter((e) => e.is_instructor).length;
    const instructorPercentage =
      Math.round((totalInstructors / totalEmployees) * 100) || 0;

    return { totalEmployees, totalInstructors, instructorPercentage };
  };

  const getTopDepartments = (limit = 3): DepartmentEntry[] => {
    const departmentCounts = employees.reduce((acc, employee) => {
      if (employee.department) {
        acc[employee.department] = (acc[employee.department] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(departmentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  const { totalEmployees, totalInstructors, instructorPercentage } =
    calculateStatistics();
  const topDepartments = getTopDepartments();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Employees"
        value={totalEmployees}
        description="Across all universities"
      />

      <StatCard
        title="Instructors"
        value={totalInstructors}
        description={`${instructorPercentage}% of total employees`}
      />

      <StatCard title="Top Departments" value="">
        <div className="space-y-1">
          <DepartmentList departments={topDepartments} />
        </div>
      </StatCard>
    </div>
  );
};

export default EmployeeStatisticsCards;
