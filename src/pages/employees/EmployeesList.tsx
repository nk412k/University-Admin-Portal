import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import EmployeeStatisticsCards from "@/components/employees/EmployeeStatisticsCards";
import EmployeesTable from "@/components/employees/EmployeesTable";
import { useEmployees } from "@/hooks/useEmployees";
import { useUniversities } from "@/hooks/useUniversities";

const EmployeesList: React.FC = () => {
  const { employees, isLoading } = useEmployees();
  const { universities, isLoading: isLoadingUniversities } = useUniversities();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const isPageLoading = isLoading || isLoadingUniversities;

  if (isPageLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-10 w-[300px] mt-2 md:mt-0" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const uniqueRoles = Array.from(
    new Set(employees.map((employee) => employee.role || "Unknown"))
  );

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.position &&
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.email &&
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.department &&
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "all" || employee.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <EmployeeFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          uniqueRoles={uniqueRoles}
        />
      </div>

      <EmployeeStatisticsCards employees={employees} />

      <EmployeesTable
        employees={filteredEmployees}
        universities={universities}
      />
    </div>
  );
};

export default EmployeesList;
